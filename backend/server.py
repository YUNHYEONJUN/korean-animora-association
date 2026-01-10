#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
아니모라 백엔드 API 서버
OpenAI API 연동 및 프리미엄 기능 제공
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import json
from datetime import datetime

app = Flask(__name__)

# CORS 설정 - 프론트엔드에서 접근 가능하도록
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:8000",
            "http://localhost:8001",
            "https://*.sandbox.novita.ai",
            "https://yunhyeonjun.github.io"
        ]
    }
})

# OpenAI API 설정 (젠스파크 프록시)
openai.api_key = os.getenv('OPENAI_API_KEY')
openai.api_base = os.getenv('OPENAI_BASE_URL', 'https://www.genspark.ai/api/llm_proxy/v1')

# 기본 모델 설정
DEFAULT_MODEL = "gpt-4"

# 아니모라 시스템 프롬프트
ANIMORA_SYSTEM_PROMPT = """당신은 한국아니모라협회의 전문 상담사입니다.

아니모라(ANIMORA)는 음력 생일의 월(나라)과 일(동물)을 조합하여 360가지 인생 유형을 분석하는 시스템입니다.

- 월주(30%): 자라난 환경, 부모의 영향, 습성 → 12개 나라
- 일주(40%): 본성, 자신의 성격, 핵심 특성 → 30개 동물

당신의 역할:
1. 음력 생일 정보를 바탕으로 깊이 있는 성격 분석 제공
2. 실생활에 적용 가능한 구체적인 조언
3. 한국 문화와 명리학에 기반한 해석
4. 따뜻하고 공감적인 상담 톤

답변 형식:
- 존댓말 사용
- 구체적이고 실용적인 조언
- 긍정적이면서도 현실적인 관점
- 1000자 이내로 간결하게
"""


@app.route('/')
def index():
    """서버 상태 확인"""
    return jsonify({
        "status": "running",
        "service": "아니모라 백엔드 API",
        "version": "1.0.0",
        "endpoints": [
            "/api/health",
            "/api/ai-analysis",
            "/api/custom-question"
        ]
    })


@app.route('/api/health')
def health():
    """헬스 체크"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "openai_configured": bool(openai.api_key)
    })


@app.route('/api/ai-analysis', methods=['POST'])
def ai_analysis():
    """AI 성격 분석 생성"""
    try:
        data = request.json
        analysis_data = data.get('analysisData', {})
        question_type = data.get('questionType', 'basic')
        
        # 분석 데이터 검증
        if not analysis_data:
            return jsonify({"error": "분석 데이터가 필요합니다"}), 400
        
        # 프롬프트 생성
        prompt = generate_analysis_prompt(analysis_data, question_type)
        
        # OpenAI API 호출
        response = openai.ChatCompletion.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": ANIMORA_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        analysis_text = response.choices[0].message.content
        
        return jsonify({
            "success": True,
            "analysis": analysis_text,
            "model": DEFAULT_MODEL,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"오류 발생: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/custom-question', methods=['POST'])
def custom_question():
    """맞춤형 질문 처리"""
    try:
        data = request.json
        prompt = data.get('prompt')
        template_id = data.get('templateId')
        question_data = data.get('data', {})
        
        if not prompt:
            return jsonify({"error": "프롬프트가 필요합니다"}), 400
        
        # OpenAI API 호출
        response = openai.ChatCompletion.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": ANIMORA_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        answer_text = response.choices[0].message.content
        
        return jsonify({
            "success": True,
            "answer": answer_text,
            "templateId": template_id,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"오류 발생: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


def generate_analysis_prompt(analysis_data, question_type):
    """분석 프롬프트 생성"""
    
    analysis_type = analysis_data.get('type', 'personal')
    
    if analysis_type == 'personal':
        return generate_personal_prompt(analysis_data, question_type)
    elif analysis_type == 'couple':
        return generate_couple_prompt(analysis_data, question_type)
    elif analysis_type == 'family':
        return generate_family_prompt(analysis_data, question_type)
    
    return "알 수 없는 분석 유형입니다."


def generate_personal_prompt(data, question_type):
    """개인 분석 프롬프트"""
    name = data.get('name', '고객')
    month = data.get('month')
    day = data.get('day')
    country = data.get('country', '')
    animal = data.get('animal', '')
    
    prompt = f"""
[개인 성격 분석 요청]

이름: {name}
음력 생일: {month}월 {day}일
나라(환경): {country}
동물(본성): {animal}

위 정보를 바탕으로 다음을 분석해주세요:

1. **자라난 환경 분석** ({country}의 영향)
   - 어떤 환경에서 자랐으며, 이것이 성격 형성에 어떤 영향을 주었나요?
   - 부모나 가정환경의 특성은 무엇인가요?

2. **내면의 본성** ({animal}의 특성)
   - 타고난 성격과 기질은 어떤가요?
   - 강점과 약점은 무엇인가요?

3. **종합 해석**
   - 환경과 본성이 어떻게 조화를 이루나요?
   - 인생에서 주의해야 할 점은 무엇인가요?

4. **실생활 조언**
   - 이 유형에 맞는 구체적인 생활 방식은?
   - 관계, 직장, 자기계발에서의 팁

따뜻하고 공감적인 톤으로, 실용적인 조언을 해주세요.
"""
    
    if question_type == 'detailed':
        prompt += "\n\n특히 더 깊이 있고 상세한 분석을 제공해주세요. 심리학적 관점과 구체적인 사례를 포함해주세요."
    
    return prompt


def generate_couple_prompt(data, question_type):
    """커플 궁합 프롬프트"""
    person1 = data.get('person1', {})
    person2 = data.get('person2', {})
    score = data.get('compatibilityScore', 0)
    
    prompt = f"""
[커플 궁합 분석 요청]

**첫 번째 사람: {person1.get('name')}**
- 음력: {person1.get('month')}월 {person1.get('day')}일
- 나라: {person1.get('country')}
- 동물: {person1.get('animal')}

**두 번째 사람: {person2.get('name')}**
- 음력: {person2.get('month')}월 {person2.get('day')}일
- 나라: {person2.get('country')}
- 동물: {person2.get('animal')}

궁합 점수: {score}점

두 사람의 관계를 분석해주세요:

1. **관계의 강점**
   - 두 사람이 서로 보완하는 부분
   - 함께할 때의 시너지

2. **주의할 점**
   - 갈등이 생길 수 있는 영역
   - 각자 주의해야 할 태도

3. **관계 개선 조언**
   - 더 나은 관계를 위한 구체적 방법
   - 소통의 팁

4. **장기적 전망**
   - 이 조합의 미래 가능성
   - 함께 성장하는 방법
"""
    
    return prompt


def generate_family_prompt(data, question_type):
    """가족 관계 프롬프트"""
    members = data.get('members', [])
    
    prompt = f"""
[가족 관계 분석 요청]

가족 구성원:
"""
    
    for i, member in enumerate(members, 1):
        prompt += f"""
{i}. {member.get('name')}
   - 음력: {member.get('month')}월 {member.get('day')}일
   - 나라: {member.get('country')}
   - 동물: {member.get('animal')}
"""
    
    prompt += """
가족 관계를 종합적으로 분석해주세요:

1. **가족 역학**
   - 각 구성원의 역할과 특성
   - 가족 내 상호작용 패턴

2. **조화 포인트**
   - 가족이 잘 어울리는 부분
   - 서로를 이해하는 방법

3. **갈등 포인트**
   - 마찰이 생길 수 있는 영역
   - 각 구성원이 주의할 점

4. **가족 화합 조언**
   - 더 나은 가족 관계를 위한 방법
   - 구체적인 소통 전략
"""
    
    return prompt


if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"""
╔═══════════════════════════════════════════╗
║   🌟 아니모라 백엔드 API 서버 시작 🌟   ║
╠═══════════════════════════════════════════╣
║  포트: {port}                              ║
║  디버그: {debug}                           ║
║  OpenAI 설정: {'✅ 완료' if openai.api_key else '❌ 미설정'}              ║
╚═══════════════════════════════════════════╝
    """)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
