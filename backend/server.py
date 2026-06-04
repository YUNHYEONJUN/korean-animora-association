#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
아니모라 백엔드 API 서버 (로컬 개발 전용 — 운영은 Cloudflare Worker 사용)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import re
import json
import time
import threading
from datetime import datetime
from pathlib import Path

app = Flask(__name__)

# ── 요청 크기 제한 ───────────────────────────────────────────────
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024  # 50KB

# ── CORS: 환경변수 화이트리스트만 허용 ──────────────────────────
_raw_origins = os.getenv('ALLOWED_ORIGINS', 'https://yunhyeonjun.github.io')
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(',') if o.strip()]

# 개발 시 localhost 허용: ALLOW_LOCALHOST=true
if os.getenv('ALLOW_LOCALHOST', 'false').lower() == 'true':
    ALLOWED_ORIGINS += ['http://localhost:5500', 'http://127.0.0.1:5500',
                        'http://localhost:3000', 'http://127.0.0.1:3000']

CORS(app,
     resources={r"/api/*": {"origins": ALLOWED_ORIGINS}},
     allow_headers=["Content-Type"],
     methods=["GET", "POST", "OPTIONS"])

# ── OpenAI 클라이언트 ────────────────────────────────────────────
client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY'),
    base_url=os.getenv('OPENAI_BASE_URL', 'https://www.genspark.ai/api/llm_proxy/v1')
)

DEFAULT_MODEL = os.getenv('OPENAI_MODEL', 'gpt-5')

# ── 입력 sanitization ───────────────────────────────────────────

_INJECTION_PATTERN = re.compile(
    r'\b(ignore|disregard|forget)\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)'
    r'|\b(you\s+are\s+now|act\s+as|pretend\s+to\s+be|new\s+instructions?)\b',
    re.IGNORECASE
)
_CODE_BLOCK_PATTERN = re.compile(r'```[\s\S]*?```')

def sanitize_str(value: object, max_len: int = 200) -> str:
    if not isinstance(value, str):
        return ''
    value = _INJECTION_PATTERN.sub('[필터됨]', value)
    value = _CODE_BLOCK_PATTERN.sub('', value)
    return value[:max_len]

def sanitize_int(value: object, lo: int, hi: int, default: int) -> int:
    try:
        n = int(value)
        return max(lo, min(hi, n))
    except (TypeError, ValueError):
        return default

VALID_GENDERS = {'male', 'female'}
VALID_RELATIONS = {'family', 'friend', 'colleague', 'partner', 'business', 'team', 'other'}
VALID_ANALYSIS_TYPES = {'personal', 'couple', 'family'}
VALID_QUESTION_TYPES = {'basic', 'detailed'}

# ── Rate Limiting ────────────────────────────────────────────────

_RATE_WINDOW = 60        # 초
_RATE_MAX    = 20        # 창당 최대 요청
_rl_store: dict = {}
_rl_lock = threading.Lock()

def _check_rate_limit(ip: str) -> bool:
    now = time.monotonic()
    with _rl_lock:
        entry = _rl_store.get(ip)
        if not entry or now - entry['ts'] > _RATE_WINDOW:
            _rl_store[ip] = {'ts': now, 'n': 1}
            # 오래된 항목 정리 (1000개 초과 시)
            if len(_rl_store) > 1000:
                cutoff = now - _RATE_WINDOW * 2
                stale = [k for k, v in _rl_store.items() if v['ts'] < cutoff]
                for k in stale:
                    del _rl_store[k]
            return True
        entry['n'] += 1
        return entry['n'] <= _RATE_MAX

@app.before_request
def _enforce_rate_limit():
    if request.method == 'POST':
        # 신뢰할 수 있는 IP: 로컬 운영이므로 remote_addr 사용
        ip = request.remote_addr or 'unknown'
        if not _check_rate_limit(ip):
            return jsonify({'error': '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'}), 429

# ── 지식 베이스 ──────────────────────────────────────────────────

KNOWLEDGE_BASE_PATH = Path(__file__).parent / "animora_knowledge.json"
ANIMORA_KNOWLEDGE: dict = {}

def load_knowledge_base():
    global ANIMORA_KNOWLEDGE
    try:
        if KNOWLEDGE_BASE_PATH.exists():
            with open(KNOWLEDGE_BASE_PATH, 'r', encoding='utf-8') as f:
                ANIMORA_KNOWLEDGE = json.load(f)
            print(f"✅ 지식 베이스 로드: 월별 {len(ANIMORA_KNOWLEDGE.get('months', {}))}개 / "
                  f"조합 {len(ANIMORA_KNOWLEDGE.get('combinations', {}))}개")
        else:
            print(f"⚠️ 지식 베이스 없음: {KNOWLEDGE_BASE_PATH}")
    except Exception as exc:
        print(f"❌ 지식 베이스 로드 실패: {exc}")

load_knowledge_base()

def get_month_knowledge(month) -> str:
    return ANIMORA_KNOWLEDGE.get('months', {}).get(str(month), {}).get('content', '')

def get_combination_knowledge(month, day) -> str:
    key = f"{month}월{day}일"
    return ANIMORA_KNOWLEDGE.get('combinations', {}).get(key, {}).get('content', '')

# ── 시스템 프롬프트 ──────────────────────────────────────────────
# 단일 소스: cloudflare-worker/src/index.js 의 ANIMORA_SYSTEM_PROMPT 와 동기화 유지

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

## 30개 동물(일주) 본성

### 호랑이과 (1, 11, 21일)
- 1일: 호랑이 (중) - 강인한 생존력과 독립심
- 11일: 호랑이 (상) - 강력한 카리스마와 리더십
- 21일: 고양이 (하) - 독립적이고 예민한 감각

### 토끼과 (2, 12, 22일)
- 2일: 야생토끼 (중) - 민첩하고 경계심 강함
- 12일: 오소리 (상) - 강한 끈기와 투지
- 22일: 집토끼 (하) - 온순하고 안정 추구

### 용과 (3, 13, 23일)
- 3일: 이무기 (중) - 큰 잠재력, 인내와 성취욕
- 13일: 용 (상) - 강한 카리스마와 높은 이상
- 23일: 도롱뇽 (하) - 유연하고 적응력 있음

### 뱀과 (4, 14, 24일)
- 4일: 아나콘다 (중) - 강력한 직감과 현실 감각
- 14일: 구렁이 (상) - 신중하고 전략적
- 24일: 꽃뱀 (하) - 매력적이고 감각적

### 말과 (5, 15, 25일)
- 5일: 야생마 (중) - 자유로운 영혼, 열정
- 15일: 경주마 (상) - 목표를 향해 질주하는 승부사
- 25일: 명품마 (하) - 품격 있고 우아함

### 양과 (6, 16, 26일)
- 6일: 양 (중) - 평화주의, 공감 능력
- 16일: 산양 (상) - 고집 있고 독립적
- 26일: 염소 (하) - 소박하고 실용적

### 원숭이과 (7, 17, 27일)
- 7일: 오랑우탄 (중) - 사려 깊고 지적
- 17일: 고릴라 (상) - 강력한 힘과 온화한 리더십
- 27일: 침팬지 (하) - 적응력과 친화력

### 닭과 (8, 18, 28일)
- 8일: 장미계 (중) - 화려하고 자신감 넘침
- 18일: 수탉 (상) - 책임감 있고 성실
- 28일: 암탉 (하) - 따뜻하고 헌신적

### 개과 (9, 19, 29일)
- 9일: 들개 (중) - 생존 감각과 현실 전략
- 19일: 늑대 (상) - 강한 리더십과 충성심
- 29일: 강아지 (하) - 순수하고 충성스러움

### 돼지과 (10, 20, 30일)
- 10일: 멧돼지 (중) - 거침없는 추진력
- 20일: 수돼지 (상) - 풍요와 관대함
- 30일: 암돼지 (하) - 모성애와 포용력

당신의 역할:
1. 정확한 아니모라 이론 적용
2. 나라-동물 조합 분석
3. 실생활 적용 조언
4. 한국 문화 반영
5. 따뜻한 상담 톤 유지

답변 톤:
- 존댓말, 친근하고 따뜻함
- 직설적이지만 비판적이지 않음
- 2000-3000자 분량"""


# ── API 라우트 ──────────────────────────────────────────────────

@app.route('/')
def index():
    return jsonify({
        "status": "running",
        "service": "아니모라 백엔드 API (개발용)",
        "version": "2.0.0",
        "endpoints": ["/api/health", "/api/ai-analysis", "/api/custom-question"]
    })


@app.route('/api/health')
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + 'Z',
        "openai_configured": bool(os.getenv('OPENAI_API_KEY'))
    })


@app.route('/api/ai-analysis', methods=['POST'])
def ai_analysis():
    try:
        body = request.get_json(silent=True)
        if not body:
            return jsonify({"error": "잘못된 JSON 형식입니다."}), 400

        analysis_data = body.get('analysisData', {})
        question_type = body.get('questionType', 'basic')

        if not analysis_data:
            return jsonify({"error": "분석 데이터가 필요합니다."}), 400

        # 타입 검증
        a_type = analysis_data.get('type', 'personal')
        if a_type not in VALID_ANALYSIS_TYPES:
            return jsonify({"error": "지원하지 않는 분석 유형입니다."}), 400

        if question_type not in VALID_QUESTION_TYPES:
            question_type = 'basic'

        # family 구성원 수 제한
        if a_type == 'family':
            members = analysis_data.get('members', [])
            if not isinstance(members, list) or len(members) > 10:
                return jsonify({"error": "구성원은 최대 10명까지 지원합니다."}), 400

        prompt = _generate_prompt(analysis_data, question_type)

        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": ANIMORA_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=4000
        )

        return jsonify({
            "success": True,
            "analysis": response.choices[0].message.content,
            "model": DEFAULT_MODEL,
            "timestamp": datetime.utcnow().isoformat() + 'Z'
        })

    except Exception:
        app.logger.exception("ai-analysis 처리 오류")
        return jsonify({"success": False, "error": "분석 처리 중 오류가 발생했습니다."}), 500


@app.route('/api/custom-question', methods=['POST'])
def custom_question():
    try:
        body = request.get_json(silent=True)
        if not body:
            return jsonify({"error": "잘못된 JSON 형식입니다."}), 400

        prompt = body.get('prompt')
        template_id = body.get('templateId')

        if not prompt:
            return jsonify({"error": "프롬프트가 필요합니다."}), 400

        if not isinstance(prompt, str) or len(prompt) > 5000:
            return jsonify({"error": "프롬프트가 너무 깁니다."}), 400

        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": ANIMORA_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=4000
        )

        return jsonify({
            "success": True,
            "answer": response.choices[0].message.content,
            "templateId": template_id,
            "timestamp": datetime.utcnow().isoformat() + 'Z'
        })

    except Exception:
        app.logger.exception("custom-question 처리 오류")
        return jsonify({"success": False, "error": "질문 처리 중 오류가 발생했습니다."}), 500


# ── 프롬프트 생성 ────────────────────────────────────────────────

def _generate_prompt(data: dict, question_type: str) -> str:
    a_type = data.get('type', 'personal')
    if a_type == 'personal':
        return _personal_prompt(data, question_type)
    if a_type == 'couple':
        return _couple_prompt(data)
    if a_type == 'family':
        return _family_prompt(data)
    return "알 수 없는 분석 유형입니다."


def _personal_prompt(data: dict, question_type: str) -> str:
    name    = sanitize_str(data.get('name', '고객'))
    gender  = '남성' if data.get('gender') in VALID_GENDERS and data.get('gender') == 'male' else '여성'
    month   = sanitize_int(data.get('month'), 1, 12, 1)
    day     = sanitize_int(data.get('day'), 1, 30, 1)
    country = sanitize_str(data.get('country', ''))
    animal  = sanitize_str(data.get('animal', ''))

    month_kb = get_month_knowledge(month)
    combo_kb = get_combination_knowledge(month, day)

    prompt = f"[개인 성격 분석 요청]\n\n이름: {name} ({gender})\n음력 생일: {month}월 {day}일\n나라(환경): {country}\n동물(본성): {animal}\n"

    if month_kb:
        prompt += f"\n## 📚 {country} 상세 특성 (PDF 원문)\n{month_kb[:1500]}\n"
    if combo_kb:
        prompt += f"\n## 🎯 {month}월 {day}일 조합 분석 (PDF 원문)\n{combo_kb[:1500]}\n"

    prompt += """
위 내용을 참고하여 다음을 분석해주세요:
1. 자라난 환경 분석 (나라의 영향)
2. 내면의 본성 (동물의 특성)
3. 종합 해석
4. 실생활 조언
"""
    if question_type == 'detailed':
        prompt += "\n심리학적 관점과 구체적인 사례를 포함한 상세 분석을 제공해주세요."
    return prompt


def _couple_prompt(data: dict) -> str:
    p1 = data.get('person1', {})
    p2 = data.get('person2', {})
    score = sanitize_int(data.get('compatibilityScore', 0), 0, 100, 0)

    p1_name    = sanitize_str(p1.get('name', '사람1'))
    p2_name    = sanitize_str(p2.get('name', '사람2'))
    p1_gender  = '남성' if p1.get('gender') == 'male' else '여성'
    p2_gender  = '남성' if p2.get('gender') == 'male' else '여성'
    p1_month   = sanitize_int(p1.get('month'), 1, 12, 1)
    p1_day     = sanitize_int(p1.get('day'), 1, 30, 1)
    p2_month   = sanitize_int(p2.get('month'), 1, 12, 1)
    p2_day     = sanitize_int(p2.get('day'), 1, 30, 1)
    p1_country = sanitize_str(p1.get('country', ''))
    p2_country = sanitize_str(p2.get('country', ''))
    p1_animal  = sanitize_str(p1.get('animal', ''))
    p2_animal  = sanitize_str(p2.get('animal', ''))

    p1_mk = get_month_knowledge(p1_month)
    p2_mk = get_month_knowledge(p2_month)
    p1_ck = get_combination_knowledge(p1_month, p1_day)
    p2_ck = get_combination_knowledge(p2_month, p2_day)

    prompt = (
        f"[커플 궁합 분석 요청]\n\n"
        f"👤 {p1_name} ({p1_gender}): 음력 {p1_month}월 {p1_day}일 / {p1_country} / {p1_animal}\n"
        f"👤 {p2_name} ({p2_gender}): 음력 {p2_month}월 {p2_day}일 / {p2_country} / {p2_animal}\n"
        f"💯 궁합 점수: {score}점\n"
    )
    if p1_mk: prompt += f"\n## {p1_name}의 나라 특성\n{p1_mk[:800]}\n"
    if p2_mk: prompt += f"\n## {p2_name}의 나라 특성\n{p2_mk[:800]}\n"
    if p1_ck: prompt += f"\n## {p1_name}의 조합 분석\n{p1_ck[:800]}\n"
    if p2_ck: prompt += f"\n## {p2_name}의 조합 분석\n{p2_ck[:800]}\n"

    prompt += "\n두 사람의 개별 특성, 관계 역학, 실천 조언, 한 문장 요약을 이모지와 구조화된 형식으로 분석해주세요."
    return prompt


def _family_prompt(data: dict) -> str:
    members = data.get('members', [])
    relation_labels = {
        'family': '가족', 'friend': '친구', 'colleague': '동료',
        'partner': '연인', 'business': '비즈니스 파트너', 'team': '팀원', 'other': '기타'
    }
    prompt = "[다중 관계 분석 요청]\n\n구성원 정보:\n"
    for i, m in enumerate(members[:10], 1):
        rel    = relation_labels.get(m.get('relation', 'other'), '기타')
        gender = '남성' if m.get('gender') == 'male' else '여성'
        name   = sanitize_str(m.get('name', f'구성원{i}'))
        month  = sanitize_int(m.get('month'), 1, 12, 1)
        day    = sanitize_int(m.get('day'), 1, 30, 1)
        country = sanitize_str(m.get('country', ''))
        animal  = sanitize_str(m.get('animal', ''))
        prompt += f"\n{i}. {name} ({rel}, {gender}): 음력 {month}월 {day}일 / {country} / {animal}"
    prompt += "\n\n구성원 역학, 조화 포인트, 갈등 포인트, 관계 개선 조언을 분석해주세요."
    return prompt


# ── 서버 시작 ────────────────────────────────────────────────────

if __name__ == '__main__':
    port  = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    # 운영 환경에서는 FLASK_HOST를 설정하지 않으면 로컬호스트만 바인딩
    host  = os.getenv('FLASK_HOST', '127.0.0.1')

    api_ok = '✅' if os.getenv('OPENAI_API_KEY') else '❌ 미설정'
    print(f"\n🌟 아니모라 백엔드 (개발용) | 포트:{port} | 디버그:{debug} | OpenAI:{api_ok}\n")
    app.run(host=host, port=port, debug=debug)
