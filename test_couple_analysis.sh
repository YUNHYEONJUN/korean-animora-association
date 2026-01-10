#!/bin/bash

# 커플 분석 테스트 (남자: 3월 28일, 여자: 10월 8일)
curl -s -X POST https://5000-ixqb0zibgw9tuywj5fxfb-2e1b9533.sandbox.novita.ai/api/ai-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "analysisData": {
      "type": "couple",
      "person1": {
        "name": "남편",
        "gender": "male",
        "month": 3,
        "day": 28,
        "country": "용 나라",
        "animal": "동계"
      },
      "person2": {
        "name": "아내",
        "gender": "female",
        "month": 10,
        "day": 8,
        "country": "돼지 나라",
        "animal": "호랑이"
      },
      "compatibilityScore": 85
    },
    "questionType": "detailed"
  }' | python3 -m json.tool

