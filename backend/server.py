#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
아니모라 백엔드 API 서버
OpenAI API 연동 및 프리미엄 기능 제공
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import json
from datetime import datetime

app = Flask(__name__)

# CORS 설정 - 모든 출처 허용 (개발/테스트용)
CORS(app, 
     resources={r"/api/*": {"origins": "*"}},
     allow_headers=["Content-Type"],
     methods=["GET", "POST", "OPTIONS"])

# OpenAI 클라이언트 설정 (젠스파크 프록시)
client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY'),
    base_url=os.getenv('OPENAI_BASE_URL', 'https://www.genspark.ai/api/llm_proxy/v1')
)

# 기본 모델 설정 (젠스파크 프록시 지원 모델)
DEFAULT_MODEL = "gpt-5"

# 아니모라 시스템 프롬프트
ANIMORA_SYSTEM_PROMPT = """당신은 한국아니모라협회의 전문 상담사입니다.

아니모라(ANIMORA)는 음력 생일의 월(나라)과 일(동물)을 조합하여 360가지 인생 유형을 분석하는 시스템입니다.

- 월주(30%): 자라난 환경, 부모의 영향, 습성 → 12개 나라
- 일주(40%): 본성, 자신의 성격, 핵심 특성 → 30개 동물

## 12개 나라(월주) 특성

1월 - 호랑이 나라 (🐯 용맹과 리더십)
- 환경: 강인하고 리더십 있는 환경에서 성장
- 특성: 강한 의지력, 리더십과 주도성, 용맹함과 결단력, 정의감
- 약점: 강한 자존심이 관계에서 갈등 유발

2월 - 토끼 나라 (🐰 온화와 섬세함)
- 환경: 온화하고 섬세한 환경에서 성장
- 특성: 친절하고 배려심 많음, 예민한 감수성, 평화 추구, 대인관계 원만
- 약점: 지나친 눈치로 인한 자기희생

3월 - 용 나라 (🐉 카리스마와 야망)
- 환경: 카리스마 넘치고 야망이 큰 환경에서 성장
- 특성: 강한 카리스마, 큰 꿈과 비전, 자신감, 영향력
- 약점: 높은 이상으로 인한 현실과의 괴리

4월 - 뱀 나라 (🐍 지혜와 신중함)
- 환경: 지혜롭고 신중한 환경에서 성장
- 특성: 깊은 통찰력, 신중한 판단, 전략적 사고, 집중력
- 약점: 지나친 신중함으로 기회 상실

5월 - 말 나라 (🐴 열정과 자유)
- 환경: 열정적이고 자유로운 환경에서 성장
- 특성: 자유로운 영혼, 열정과 활력, 모험심, 낙관적
- 약점: 변덕스러움과 책임감 부족

6월 - 양 나라 (🐑 평화와 조화)
- 환경: 평화롭고 조화로운 환경에서 성장
- 특성: 평화주의, 예술적 감각, 공감 능력, 온순함
- 약점: 우유부단함과 의존성

7월 - 원숭이 나라 (🐵 영리함과 재치)
- 환경: 영리하고 재치 있는 환경에서 성장
- 특성: 높은 지능, 유머 감각, 적응력, 창의성
- 약점: 장난기와 불안정함으로 신뢰 손상

8월 - 닭 나라 (🐓 성실과 정확성)
- 환경: 성실하고 정확한 환경에서 성장
- 특성: 근면성실, 완벽주의, 정확성, 책임감
- 약점: 지나친 완벽주의로 인한 스트레스

9월 - 개 나라 (🐕 충성과 의리)
- 환경: 충성스럽고 의리 있는 환경에서 성장
- 특성: 충성심, 의리, 보호본능, 정직함
- 약점: 의심과 경계심으로 새로운 관계 형성 어려움

10월 - 돼지 나라 (🐷 관대함과 풍요)
- 환경: 관대하고 풍요로운 환경에서 성장
- 특성: 관대함, 낙천적, 풍부한 감정, 사교성
- 약점: 지나친 낙관주의로 현실 인식 저하

11월 - 쥐 나라 (🐭 민첩함과 적응력)
- 환경: 민첩하고 적응력 있는 환경에서 성장
- 특성: 빠른 적응력, 기회 포착, 영리함, 생존력
- 약점: 이기심과 계산적 태도

12월 - 소 나라 (🐂 인내와 성실)
- 환경: 인내심 있고 성실한 환경에서 성장
- 특성: 인내심, 끈기, 안정성, 신뢰성
- 약점: 고집과 변화 저항

## 30개 동물(일주) 본성 - 10대 분류

독수리 계열 (1-3일): 비전, 자유, 독립성
표범 계열 (4-6일): 우아함, 집중력, 강인함
사자 계열 (7-9일): 리더십, 카리스마, 자신감
코끼리 계열 (10-12일): 지혜, 온화함, 힘
뱀 계열 (13-15일): 전략, 신중함, 집중력
늑대 계열 (16-18일): 충성, 리더십, 협력
곰 계열 (19-21일): 보호본능, 강인함, 온정
사슴 계열 (22-24일): 우아함, 평화, 민첩성
원숭이 계열 (25-27일): 지능, 재치, 적응력
닭 계열 (28-30일): 화려함, 자신감, 표현력

당신의 역할:
1. **정확한 아니모라 이론 적용**: 위 12개 나라와 30개 동물의 특성을 정확히 반영
2. **나라-동물 조합 분석**: 환경(나라)과 본성(동물)의 상호작용 해석
3. **실생활 적용**: 구체적이고 실용적인 조언 제공
4. **한국 문화 반영**: 명리학과 한국 문화에 기반한 해석
5. **따뜻한 상담**: 공감적이고 긍정적인 톤 유지

답변 스타일 및 구조:

1. **이모지 활용**: 🔎 🐯 🐉 💞 ✔ ⚠ 👉 ✨ 🖋 등 적절한 이모지로 가독성 향상
2. **섹션 구분**: 명확한 제목(1️⃣, 2️⃣, 3️⃣)과 소제목으로 구조화
3. **구체적 해석**: "밖으로는 화려한 계획가와, 안으로는 생활을 지키는 현실 감각의 만남" 같은 통찰력 있는 한 문장 요약
4. **깊이 있는 분석**:
   - 각 사람의 나라와 동물 특성을 별도로 상세히 해석
   - 연애/관계에서의 구체적 행동 패턴 제시
   - "다만", "하지만"으로 약점도 솔직하게 언급
5. **관계 역학**: 
   - 서로 어떻게 끌리는지
   - 잘 맞을 때 vs 어긋날 때의 구체적 시나리오
   - 포식·보완 관계 분석
6. **실천 조언**: 
   - 성별/역할별로 분리된 구체적 조언
   - "이 여자는...", "이 남자는..." 형태의 직접적 표현
7. **마무리 시그니처**:
   - 궁합 한 문장 요약
   - 철학적이고 기억에 남는 마무리 문장

답변 톤:
- 존댓말 사용하되 친근하고 따뜻함
- 직설적이지만 비판적이지 않음
- 깊이 있으면서도 쉬운 표현
- 2000-3000자 분량의 상세한 답변
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
        "openai_configured": bool(os.getenv('OPENAI_API_KEY'))
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
        
        # OpenAI API 호출 (새 버전)
        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": ANIMORA_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=4000
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
        
        # OpenAI API 호출 (새 버전)
        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": ANIMORA_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=4000
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
    gender = '남성' if data.get('gender') == 'male' else '여성'
    month = data.get('month')
    day = data.get('day')
    country = data.get('country', '')
    animal = data.get('animal', '')
    
    prompt = f"""
[개인 성격 분석 요청]

이름: {name} ({gender})
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
    
    gender1 = '남성' if person1.get('gender') == 'male' else '여성'
    gender2 = '남성' if person2.get('gender') == 'male' else '여성'
    
    prompt = f"""
[커플 궁합 분석 요청]

**첫 번째 사람: {person1.get('name')} ({gender1})**
- 음력: {person1.get('month')}월 {person1.get('day')}일
- 나라: {person1.get('country')}
- 동물: {person1.get('animal')}

**두 번째 사람: {person2.get('name')} ({gender2})**
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
    """다중 관계 프롬프트"""
    members = data.get('members', [])
    
    # 관계 유형 확인
    relation_labels = {
        'family': '가족',
        'friend': '친구',
        'colleague': '동료',
        'partner': '연인',
        'business': '비즈니스 파트너',
        'team': '팀원',
        'other': '기타'
    }
    
    prompt = f"""
[다중 관계 분석 요청]

구성원 정보:
"""
    
    for i, member in enumerate(members, 1):
        relation = relation_labels.get(member.get('relation', 'other'), member.get('relation', '기타'))
        gender = '남성' if member.get('gender') == 'male' else '여성'
        prompt += f"""
{i}. {member.get('name')} ({relation}, {gender})
   - 음력: {member.get('month')}월 {member.get('day')}일
   - 나라: {member.get('country')}
   - 동물: {member.get('animal')}
"""
    
    prompt += """
이 그룹의 관계를 종합적으로 분석해주세요:

1. **구성원 역학**
   - 각 구성원의 역할과 특성
   - 관계 유형을 고려한 상호작용 패턴
   - 성별에 따른 특성 차이

2. **조화 포인트**
   - 그룹이 잘 어울리는 부분
   - 서로를 이해하는 방법
   - 각 관계 유형별 강점

3. **갈등 포인트**
   - 마찰이 생길 수 있는 영역
   - 각 구성원이 주의할 점
   - 관계 유형별 주의사항

4. **관계 개선 조언**
   - 더 나은 관계를 위한 방법
   - 구체적인 소통 전략
   - 관계 유형별 맞춤 조언
"""
    
    return prompt


if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    api_key_status = '✅ 완료' if os.getenv('OPENAI_API_KEY') else '❌ 미설정'
    print(f"""
╔═══════════════════════════════════════════╗
║   🌟 아니모라 백엔드 API 서버 시작 🌟   ║
╠═══════════════════════════════════════════╣
║  포트: {port}                              ║
║  디버그: {debug}                           ║
║  OpenAI 설정: {api_key_status}              ║
╚═══════════════════════════════════════════╝
    """)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
