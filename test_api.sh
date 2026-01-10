#!/bin/bash
# AI 분석 API 테스트

echo "🧪 AI 분석 API 테스트"
echo "====================="
echo ""

# 테스트 데이터
TEST_DATA='{
  "analysisData": {
    "type": "personal",
    "name": "테스트유저",
    "month": 1,
    "day": 8,
    "country": "호랑이 나라",
    "animal": "호랑이"
  },
  "questionType": "basic"
}'

echo "📤 요청 데이터:"
echo "$TEST_DATA" | jq .
echo ""

echo "⏳ AI 분석 요청 중... (10-15초 소요)"
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA" \
  https://5000-ixqb0zibgw9tuywj5fxfb-2e1b9533.sandbox.novita.ai/api/ai-analysis)

echo ""
echo "📥 응답:"
echo "$RESPONSE" | jq .

