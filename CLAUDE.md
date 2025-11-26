- {
    "name": "체크리스트 6개 분기로직",
    "nodes": [
      {
        "parameters": {
          "content": "## 파일 불러오기\n",
          "height": 224,
          "width": 720
        },
        "type": "n8n-nodes-base.stickyNote",
        "position": [
          1648,
          -1008
        ],
        "typeVersion": 1,
        "id": "3738163a-55a1-4af3-b5e4-d56364af17e3",
        "name": "Sticky Note1"
      },
      {
        "parameters": {
          "content": "## 파일 저장\n",
          "height": 224,
          "width": 720
        },
        "type": "n8n-nodes-base.stickyNote",
        "position": [
          1648,
          -1312
        ],
        "typeVersion": 1,
        "id": "17deb615-8450-436f-b339-55607b1e80ff",
        "name": "Sticky Note2"
      },
      {
        "parameters": {
          "content": "## 체크리스트 내보내기\n### Request Body:\n```json\n{\n  \"actionType\": \"exportPDF\",\n  \"userId\": \"61a8fc1d-67b0-45db-b913-602654b45c3c\"\n}\n```",
          "height": 224,
          "width": 464,
          "color": 4
        },
        "type": "n8n-nodes-base.stickyNote",
        "position": [
          -336,
          -16
        ],
        "typeVersion": 1,
        "id": "98d8179d-4067-4265-b942-611f58fbe139",
        "name": "Sticky Note3"
      },
      {
        "parameters": {
          "httpMethod": "POST",
          "path": "checklist",
          "responseMode": "responseNode",
          "options": {}
        },
        "type": "n8n-nodes-base.webhook",
        "typeVersion": 2.1,
        "position": [
          -880,
          288
        ],
        "id": "43d3740e-b3a6-4558-b499-926720d64b88",
        "name": "CHECKLIST Webhook1",
        "webhookId": "3561f554-8786-4b71-8ac3-a3a3d16cb9ae"
      },
      {
        "parameters": {
          "rules": {
            "values": [
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "leftValue": "={{ $json.body.actionType }}",
                      "rightValue": "analyzeRisk",
                      "operator": {
                        "type": "string",
                        "operation": "equals"
                      },
                      "id": "8ed71312-2b1c-4b87-aa5d-cb8966489704"
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "깡통전세 위험도 분석"
              },
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "id": "f02841e0-66df-47e2-b9a9-ffc816a93704",
                      "leftValue": "={{ $json.body.actionType }}",
                      "rightValue": "exportPDF",
                      "operator": {
                        "type": "string",
                        "operation": "equals",
                        "name": "filter.operator.equals"
                      }
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "PDF 다운로드"
              },
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "id": "ffb5fb57-c47a-4456-90d9-19ce7a7f3dcf",
                      "leftValue": "={{ $json.body.actionType }}",
                      "rightValue": "sendEmail",
                      "operator": {
                        "type": "string",
                        "operation": "equals",
                        "name": "filter.operator.equals"
                      }
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "체크리스트 이메일 발송"
              },
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "id": "18a219c5-5e96-4f43-857e-f6e22e9c653f",
                      "leftValue": "={{ $json.body.actionType }}",
                      "rightValue": "checkInsurance",
                      "operator": {
                        "type": "string",
                        "operation": "equals",
                        "name": "filter.operator.equals"
                      }
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "보증보험 확인"
              },
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "id": "6fb098d5-6ddf-44da-80ee-c9b7f7c8021f",
                      "leftValue": "={{ $json.body.actionType }}",
                      "rightValue": "exportAnalysisPDF",
                      "operator": {
                        "type": "string",
                        "operation": "equals",
                        "name": "filter.operator.equals"
                      }
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "분석 PDF 다운로드"
              },
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "id": "faebcc3b-261e-49c4-b530-9fe6ce1a2046",
                      "leftValue": "={{ $json.body.actionType }}",
                      "rightValue": "sendAnalysisEmail",
                      "operator": {
                        "type": "string",
                        "operation": "equals",
                        "name": "filter.operator.equals"
                      }
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "분석 이메일 발송"
              }
            ]
          },
          "options": {}
        },
        "type": "n8n-nodes-base.switch",
        "typeVersion": 3.2,
        "position": [
          -656,
          224
        ],
        "id": "8e96a14b-550a-4a33-aa32-8ae6ae1af721",
        "name": "Switch2"
      },
      {
        "parameters": {
          "rules": {
            "values": [
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "id": "04830187-22a5-446e-a434-456472d4aad8",
                      "leftValue": "={{ $('CHECKLIST Webhook1').first().json.body.actionType }}",
                      "rightValue": "exportPDF",
                      "operator": {
                        "type": "string",
                        "operation": "equals"
                      }
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "PDF 다운로드"
              },
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "id": "cda1b57b-688a-4acc-ac36-67687be18c40",
                      "leftValue": "={{ $('CHECKLIST Webhook1').first().json.body.actionType }}",
                      "rightValue": "sendEmail",
                      "operator": {
                        "type": "string",
                        "operation": "equals",
                        "name": "filter.operator.equals"
                      }
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "이메일 전송"
              }
            ]
          },
          "options": {}
        },
        "type": "n8n-nodes-base.switch",
        "typeVersion": 3.2,
        "position": [
          1264,
          112
        ],
        "id": "f5c98530-d145-4f62-8bd5-9a52f0f81b28",
        "name": "Switch3"
      },
      {
        "parameters": {
          "httpMethod": "POST",
          "path": "5b96d4da-0ab4-4c6f-a21c-9cdd27a964aa",
          "options": {
            "binaryPropertyName": "files"
          }
        },
        "type": "n8n-nodes-base.webhook",
        "typeVersion": 2.1,
        "position": [
          1728,
          -1248
        ],
        "id": "5f2ccac2-3e11-46ff-bb96-9356ecf47a66",
        "name": "Webhook",
        "webhookId": "5b96d4da-0ab4-4c6f-a21c-9cdd27a964aa"
      },
      {
        "parameters": {
          "tableId": "documentfile",
          "fieldsUi": {
            "fieldValues": [
              {
                "fieldId": "file_key",
                "fieldValue": "={{ $json.Key }}"
              }
            ]
          }
        },
        "type": "n8n-nodes-base.supabase",
        "typeVersion": 1,
        "position": [
          2112,
          -1248
        ],
        "id": "1def235d-210a-4e67-bff7-54cafa290335",
        "name": "Create a row1",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "method": "POST",
          "url": "=https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/doongzi/{{ $now.valueOf() }}",
          "authentication": "genericCredentialType",
          "genericAuthType": "httpHeaderAuth",
          "sendHeaders": true,
          "headerParameters": {
            "parameters": [
              {
                "name": "Content-Type",
                "value": "={{ $binary.files0.mimeType }}"
              }
            ]
          },
          "sendBody": true,
          "contentType": "binaryData",
          "inputDataFieldName": "files0",
          "options": {}
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          1920,
          -1248
        ],
        "id": "0b882258-3e54-4304-8de2-33ae8b6588f1",
        "name": "Supabase S3",
        "credentials": {
          "httpHeaderAuth": {
            "id": "jgVEmtuCly3b28dg",
            "name": "Supabase S3"
          }
        }
      },
      {
        "parameters": {
          "path": "4df6118a-9741-4aba-8793-1bd8b127e3d3",
          "options": {}
        },
        "type": "n8n-nodes-base.webhook",
        "typeVersion": 2.1,
        "position": [
          1728,
          -928
        ],
        "id": "0ca52f2b-8e04-4258-8960-fde766c54658",
        "name": "Webhook1",
        "webhookId": "4df6118a-9741-4aba-8793-1bd8b127e3d3"
      },
      {
        "parameters": {
          "operation": "getAll",
          "tableId": "documentfile",
          "limit": 1,
          "filters": {
            "conditions": [
              {
                "keyName": "file_key",
                "condition": "eq",
                "keyValue": "={{ $json.body.file_key }}"
              }
            ]
          }
        },
        "type": "n8n-nodes-base.supabase",
        "typeVersion": 1,
        "position": [
          1920,
          -928
        ],
        "id": "3446a0f9-832a-4a7b-9618-cfa139d80400",
        "name": "Get File Key from DB",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "url": "=https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/{{ $json.file_key }}",
          "authentication": "genericCredentialType",
          "genericAuthType": "httpHeaderAuth",
          "options": {}
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          2112,
          -928
        ],
        "id": "b00cf68c-d17e-49ba-ab54-945650e3914a",
        "name": "Download from Storage",
        "credentials": {
          "httpHeaderAuth": {
            "id": "jgVEmtuCly3b28dg",
            "name": "Supabase S3"
          }
        }
      },
      {
        "parameters": {
          "method": "POST",
          "url": "=https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/doongzi/{{ $now.valueOf() }}",
          "authentication": "predefinedCredentialType",
          "nodeCredentialType": "supabaseApi",
          "sendHeaders": true,
          "headerParameters": {
            "parameters": [
              {
                "name": "Content-Type",
                "value": "={{ $binary.files.mimeType }}"
              }
            ]
          },
          "sendBody": true,
          "contentType": "binaryData",
          "inputDataFieldName": "files",
          "options": {}
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          1504,
          32
        ],
        "id": "5990622f-d817-497a-9f6f-49aef456c63e",
        "name": "file upload",
        "credentials": {
          "httpHeaderAuth": {
            "id": "jgVEmtuCly3b28dg",
            "name": "Supabase S3"
          },
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "jsCode": "// n8n Code Node (Pre-processing)\n// Supabase RPC 실행 결과 -> 리포트용 JSON 구조로 변환\n\nconst dbItems = $input.all(); \n\n// 1. 사용자 정보 추출\nconst userInfo = dbItems.length > 0 ? dbItems[0].json : { \n    username: '방문자', \n    user_id: 0, \n    email: '' \n};\n\n// 2. 체크리스트 항목 매핑\nconst checklistVerification = dbItems.map(item => {\n  const data = item.json;\n  \n  // B. 단계(Stage) 한글 변환\n  let stageName = \"기타\";\n  const rawStage = (data.stage || \"\").toLowerCase();\n  \n  if (rawStage.includes('before') || rawStage.includes('계약 전')) stageName = \"계약 전\";\n  else if (rawStage.includes('during') || rawStage.includes('계약 중')) stageName = \"계약 중\";\n  else if (rawStage.includes('after') || rawStage.includes('계약 후')) stageName = \"계약 후\";\n  else stageName = rawStage; // 그 외의 경우 원본 유지\n\n  // C. 체크 상태 확인\n  const isCompleted = data.is_checked === true;\n  \n  return {\n    checklist_item: data.title,              \n    stage: stageName,                        // [수정됨] 한글 단계명\n    raw_stage: rawStage,                     // 필터링용 원본 단계명\n    status: isCompleted ? 'Completed' : 'Pending'\n  };\n});\n\n// 3. 완료율 계산\nconst total = checklistVerification.length;\nconst done = checklistVerification.filter(i => i.status === 'Completed').length;\nconst percent = total > 0 ? Math.round((done / total) * 100) : 0;\n\n// 4. 리턴\nreturn {\n  json: {\n    userId: userInfo.user_id,\n    fileName: `${userInfo.username}_체크리스트_리포트`,\n    output: {\n      classification: {\n        doc_type: \"전세 계약 체크리스트\",\n        confidence_score: 1.0\n      },\n      diagnosis_report: {\n        summary: `${userInfo.username}님의 둥지 짓기 진행률은 ${percent}%입니다. (총 ${total}개 중 ${done}개 완료)`\n      },\n      checklist_verification: checklistVerification\n    }\n  }\n};"
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [
          448,
          112
        ],
        "id": "a58745de-35cd-4af6-939c-2a11ed5deebc",
        "name": "데이터 전처리"
      },
      {
        "parameters": {
          "method": "POST",
          "url": "https://api.pdf.co/v1/pdf/convert/from/html",
          "sendHeaders": true,
          "headerParameters": {
            "parameters": [
              {
                "name": "x-api-key",
                "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
              }
            ]
          },
          "sendBody": true,
          "bodyParameters": {
            "parameters": [
              {
                "name": "name",
                "value": "={{ $json.file_name }}"
              },
              {
                "name": "margins",
                "value": "5px 5px 5px 5px"
              },
              {
                "name": "html",
                "value": "={{ $json.html_content }}"
              }
            ]
          },
          "options": {}
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          864,
          112
        ],
        "id": "79c2493a-01f5-4a33-8702-86199b662003",
        "name": "HTML to PDF"
      },
      {
        "parameters": {
          "jsCode": "// 1. 사용자 입력 보증금\nconst userBody = $('CHECKLIST Webhook1').first().json.body;\nconst userDeposit = Number(String(userBody['deposit']).replace(/,/g, '')) || 0;\n\n// 2. 매매 실거래 데이터\nconst saleRows = items\n  .map(item => Number(String(item.json['거래금액_만원']).replace(/,/g, '')) || 0)\n  .filter(v => v > 0);\n\n// 실거래 데이터가 없으면 판단불가 형태로 응답\nif (saleRows.length === 0) {\n  return [{\n    json: {\n      success: true,\n      result: {\n        riskLevel: null,\n        ratio: null,\n        message: '매매 실거래 데이터가 없어 깡통전세 위험도 계산이 불가능합니다.',\n        graphData: {\n          safeLine: 70,\n          current: null,\n        },\n        // 추가 필드들도 null로 내려줌\n        extraToWarning_만원: null,\n        extraToDanger_만원: null,\n        mortgageMessage: null,\n      }\n    }\n  }];\n}\n\n// 3. 평균 매매가 계산 (단위: 만원)\nconst sum = saleRows.reduce((a, b) => a + b, 0);\nconst avgPrice = sum / saleRows.length;\n\n// 4. 전세가율 계산 (백분율)\nconst ratio = userDeposit / avgPrice;\nconst ratioPercent = Math.round(ratio * 1000) / 10; // 예: 85.7\n\n// 임계값(%) — 여기 기준으로 safe / warning / danger 나뉨\nconst WARNING_THRESHOLD = 70; // 70% 초과부터 warning\nconst DANGER_THRESHOLD  = 80; // 80% 초과부터 danger\n\n// 각 단계 경계에서의 \"보증금 한도\"(만원)\nconst warningDeposit = (WARNING_THRESHOLD / 100) * avgPrice;\nconst dangerDeposit  = (DANGER_THRESHOLD  / 100) * avgPrice;\n\n// 현재 보증금에서 얼마가 더 얹히면 경계를 넘는지 계산 (만원, 소수점 올림)\nlet extraToWarning = 0;  // safe → warning 경계까지 남은 금액\nlet extraToDanger  = 0;  // warning → danger 경계까지 남은 금액\n\n// 5. 위험도 구분 + 메시지\nlet riskLevel;   // 'safe' | 'warning' | 'danger'\nlet message;\nlet mortgageMessage; // 근저당 관련 멘트\n\nif (ratioPercent <= WARNING_THRESHOLD) {\n  // SAFE 구간\n  riskLevel = 'safe';\n  message = '매매가 대비 전세가율이 70% 이하로 비교적 안전한 편입니다.';\n\n  // safe → warning 으로 넘어가려면?\n  const diff = warningDeposit - userDeposit;\n  extraToWarning = diff > 0 ? Math.ceil(diff) : 0;\n\n  mortgageMessage =\n    `현재 보증금 기준으로 약 ${extraToWarning.toLocaleString()}만 원 이상 ` +\n    `추가되는 근저당·선순위 채권이 잡히면 전세가율이 70%를 넘어 '주의' 단계로 올라갈 수 있어요. ` +\n    `등기부등본에서 근저당 설정 금액이 이 금액을 넘지 않는지 꼭 확인해보세요.`;\n\n} else if (ratioPercent <= DANGER_THRESHOLD) {\n  // WARNING 구간\n  riskLevel = 'warning';\n  message = '매매가 대비 전세가율이 70~80% 사이로 다소 위험할 수 있어 주의가 필요합니다.';\n\n  // warning → danger 으로 넘어가려면?\n  const diff = dangerDeposit - userDeposit;\n  extraToDanger = diff > 0 ? Math.ceil(diff) : 0;\n\n  mortgageMessage =\n    `현재 보증금에서 약 ${extraToDanger.toLocaleString()}만 원 이상 ` +\n    `추가되는 근저당·선순위 채권이 잡히면 전세가율이 80%를 넘어 '위험' 단계가 됩니다. ` +\n    `등기부등본에서 근저당·기타 채권 합계가 이 금액을 넘지 않는지 확인해보세요.`;\n\n} else {\n  // DANGER 구간\n  riskLevel = 'danger';\n  message = '매매가 대비 전세가율이 80%를 넘어 깡통전세 위험이 높습니다.';\n\n  mortgageMessage =\n    '이미 전세가율이 80%를 넘어선 상태라, 현재 보증금 외에 근저당·선순위 보증금 등이 더해지면 ' +\n    '집값 대비 채권 총액이 매매가를 초과할 위험이 큽니다. 등기부등본에서 근저당·질권·임차권 등 선순위 권리의 ' +\n    '총액을 꼭 확인하고, 전세보증보험 가입 가능 여부도 함께 체크해보세요.';\n}\n\n// 6. 최종 리턴 (요청한 output 구조)\nreturn [{\n  json: {\n    success: true,\n    result: {\n      riskLevel,               // 'safe' | 'warning' | 'danger'\n      ratio: ratioPercent,     // 전세가율 (예: 85.7)\n      message,                 // 전세가율 설명\n      graphData: {\n        safeLine: 70,\n        current: ratioPercent,\n      },\n      // 추가 정보: 단계 경계까지 남은 금액(만원 단위)\n      extraToWarning_만원: extraToWarning, // safe 구간일 때 의미 있음\n      extraToDanger_만원: extraToDanger,   // warning 구간일 때 의미 있음\n      mortgageMessage,                     // 근저당 관련 가이드 멘트\n    }\n  }\n}];\n"
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [
          880,
          -336
        ],
        "id": "3d2c4bbd-fd77-469e-8e8a-ee5e9be396db",
        "name": "깡통주택 계산 함수"
      },
      {
        "parameters": {
          "useCustomSchema": true,
          "operation": "getAll",
          "tableId": "Apart",
          "matchType": "allFilters",
          "filters": {
            "conditions": [
              {
                "keyName": "시군구",
                "condition": "=like",
                "keyValue": "={{ $json.body['주소'].split(' ').slice(0, 2).join(' ') + '%' }}"
              },
              {
                "keyName": "전용면적_m2",
                "condition": "gte",
                "keyValue": "={{ Number($json.body['전용면적_m2']) - 3 }}"
              },
              {
                "keyName": "전용면적_m2",
                "condition": "lte",
                "keyValue": "={{ Number($json.body['전용면적_m2']) + 3 }}"
              },
              {
                "keyName": "도로명",
                "condition": "eq",
                "keyValue": "={{ $json.body['주소'].split(\" \").slice(2).join(\" \") }}"
              }
            ]
          }
        },
        "type": "n8n-nodes-base.supabase",
        "typeVersion": 1,
        "position": [
          544,
          -560
        ],
        "id": "6a74941c-1e8f-4a8f-8e68-ed1c2af9b3b8",
        "name": "아파트매매DB",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "operation": "getAll",
          "tableId": "MultiplexHousing",
          "filters": {
            "conditions": [
              {
                "keyName": "시군구",
                "condition": "=like",
                "keyValue": "={{ $json.body['주소'].split(\" \").slice(0, 2).join(\" \") + '%' }}"
              },
              {
                "keyName": "도로명",
                "condition": "eq",
                "keyValue": "={{ $json.body['주소'].split(\" \").slice(2).join(\" \") }}"
              }
            ]
          }
        },
        "type": "n8n-nodes-base.supabase",
        "typeVersion": 1,
        "position": [
          544,
          -416
        ],
        "id": "555c8771-85b4-4139-a165-07fe20d5d0c4",
        "name": "단독다가구매매DB",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "operation": "getAll",
          "tableId": "RowHouse",
          "matchType": "allFilters",
          "filters": {
            "conditions": [
              {
                "keyName": "시군구",
                "condition": "=like",
                "keyValue": "={{ $json.body['주소'].split(' ').slice(0, 2).join(' ') + '%' }}"
              },
              {
                "keyName": "도로명",
                "condition": "eq",
                "keyValue": "={{ $json.body['주소'].split(' ').slice(2).join(' ') }}"
              },
              {
                "keyName": "전용면적_m2",
                "condition": "gte",
                "keyValue": "={{ Number($json.body['전용면적_m2']) - 3 }}"
              },
              {
                "keyName": "전용면적_m2",
                "condition": "lte",
                "keyValue": "={{ Number($json.body['전용면적_m2']) + 3 }}"
              }
            ]
          }
        },
        "type": "n8n-nodes-base.supabase",
        "typeVersion": 1,
        "position": [
          544,
          -272
        ],
        "id": "23376cef-b8c6-4408-87e2-237cc0ef9649",
        "name": "연립다세대매매DB",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "operation": "getAll",
          "tableId": "Officetel",
          "matchType": "allFilters",
          "filters": {
            "conditions": [
              {
                "keyName": "시군구",
                "condition": "=like",
                "keyValue": "={{ $json.body['address'].split(\" \").slice(0, 2).join(\" \") + '%' }}"
              },
              {
                "keyName": "도로명",
                "condition": "eq",
                "keyValue": "={{ $json.body['address'].split(\" \").slice(2).join(\" \") }}"
              },
              {
                "keyName": "전용면적_m2",
                "condition": "gte",
                "keyValue": "={{ Number($json.body['exclusiveArea']) - 3 }}"
              },
              {
                "keyName": "전용면적_m2",
                "condition": "lte",
                "keyValue": "={{ Number($json.body['exclusiveArea']) + 3 }}"
              }
            ]
          }
        },
        "type": "n8n-nodes-base.supabase",
        "typeVersion": 1,
        "position": [
          544,
          -128
        ],
        "id": "74512dab-d464-4f88-9d4a-5206ead2a5c7",
        "name": "오피스텔매매DB",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "rules": {
            "values": [
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "leftValue": "={{ $json.body['type'] }}",
                      "rightValue": "아파트",
                      "operator": {
                        "type": "string",
                        "operation": "equals"
                      },
                      "id": "c1bd0046-79f8-475c-a2e7-98ed5c08ef8a"
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "아파트"
              },
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "id": "d9d787ab-5fd1-409e-a7a7-28c1a222ddfe",
                      "leftValue": "={{ $json.body['type'] }}",
                      "rightValue": "단독다가구",
                      "operator": {
                        "type": "string",
                        "operation": "equals",
                        "name": "filter.operator.equals"
                      }
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "단독다가구"
              },
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "id": "2041fe39-8c02-4f7a-b3dc-db87610f3713",
                      "leftValue": "={{ $json.body['type'] }}",
                      "rightValue": "연립다세대",
                      "operator": {
                        "type": "string",
                        "operation": "equals",
                        "name": "filter.operator.equals"
                      }
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "연립다세대"
              },
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "id": "28dbb699-8bba-4a84-8465-14931c343eec",
                      "leftValue": "={{ $json.body['type'] }}",
                      "rightValue": "오피스텔",
                      "operator": {
                        "type": "string",
                        "operation": "equals",
                        "name": "filter.operator.equals"
                      }
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "오피스텔"
              }
            ]
          },
          "options": {}
        },
        "type": "n8n-nodes-base.switch",
        "typeVersion": 3.2,
        "position": [
          224,
          -368
        ],
        "id": "0e651e20-1d73-450c-982e-049ac38c2fca",
        "name": "Switch"
      },
      {
        "parameters": {
          "content": "## 깡통전세 위험도 분석\n### Request Body:\n```json\n{\n  \"address\": \"서울특별시 관악구 쑥고개로 123\",\n  \"exclusiveArea\": 20.74,\n  \"type\": \"오피스텔\",\n  \"deposit\": 12000,\n  \"actionType\": \"analyzeRisk\"\n}\n```",
          "height": 272,
          "width": 464,
          "color": 4
        },
        "type": "n8n-nodes-base.stickyNote",
        "position": [
          -336,
          -464
        ],
        "typeVersion": 1,
        "id": "036a895e-d91b-4d32-9c6a-50ec2d29094c",
        "name": "Sticky Note"
      },
      {
        "parameters": {
          "jsCode": "// n8n Code Node (HTML Generation - Shadowed Sections)\n// -------------------------------------------------------\n// [1] 데이터 수신\n// -------------------------------------------------------\nconst rootData = $input.item.json;\nconst data = rootData.output;\n\n// 기본 정보\nconst docType = data.classification?.doc_type || \"체크리스트\";\nconst summary = data.diagnosis_report?.summary || \"요약 정보 없음\";\n\n// -------------------------------------------------------\n// [2] 데이터 그룹화\n// -------------------------------------------------------\nconst allItems = data.checklist_verification || [];\n\nconst itemsStep1 = allItems.filter(i => i.stage === \"계약 전\");\nconst itemsStep2 = allItems.filter(i => i.stage === \"계약 중\");\nconst itemsStep3 = allItems.filter(i => i.stage === \"계약 후\");\nconst itemsEtc = allItems.filter(i => ![\"계약 전\", \"계약 중\", \"계약 후\"].includes(i.stage));\n\n// -------------------------------------------------------\n// [3] 체크리스트 진행률 계산\n// -------------------------------------------------------\nconst totalItems = allItems.length;\nconst completedItems = allItems.filter(item => item.status === 'Completed').length;\nconst progressPercent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);\n\n// -------------------------------------------------------\n// [4] 이미지 자산 (Supabase Public URL)\n// -------------------------------------------------------\nconst BIRD_IMG = \"https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/public/logo-imgs/baby.png\"; \nconst NEST_IMG = \"https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/public/logo-imgs/nest.png\";\n\n// -------------------------------------------------------\n// [5] 파일명 및 날짜 생성\n// -------------------------------------------------------\nconst now = new Date();\nconst kstOffset = 9 * 60 * 60 * 1000;\nconst kstDate = new Date(now.getTime() + kstOffset);\n\nconst yyyy = kstDate.getFullYear();\nconst mm = String(kstDate.getMonth() + 1).padStart(2, '0');\nconst dd = String(kstDate.getDate()).padStart(2, '0');\nconst reportDateStr = `${yyyy}년 ${mm}월 ${dd}일`;\nconst timeString = `${yyyy}${mm}${dd}_${String(kstDate.getUTCHours()).padStart(2,'0')}${String(kstDate.getUTCMinutes()).padStart(2,'0')}`;\n\nconst baseName = rootData.fileName || \"checklist_report\";\nconst finalFileName = `${baseName}_${timeString}.pdf`.replace(/\\s+/g, '_');\n\n// -------------------------------------------------------\n// [6] 리스트 렌더링 함수 (Pretty Style)\n// -------------------------------------------------------\nfunction renderPrettyList(items) {\n    if (!items || items.length === 0) {\n        return '<div style=\"color:#ccc; font-size:13px; padding:15px; text-align:center;\">해당 단계 항목 없음</div>';\n    }\n    return items.map(item => {\n        const isDone = item.status === 'Completed';\n        const checkbox = isDone ? '✅' : '<span style=\"color:#8CB800; font-weight:bold;\">⬜</span>';\n        \n        return `\n        <div class=\"list-item ${isDone ? 'done' : 'pending'}\">\n            <div class=\"item-icon\">${checkbox}</div>\n            <div class=\"item-content\">\n                <div class=\"item-title\">${item.checklist_item}</div>\n            </div>\n        </div>\n        `;\n    }).join('');\n}\n\n// -------------------------------------------------------\n// [7] HTML 템플릿 작성\n// -------------------------------------------------------\nconst htmlContent = `\n<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n<meta charset=\"UTF-8\">\n<style>\n  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');\n  body { font-family: 'Pretendard', sans-serif; background-color: #f9f9f9; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }\n  \n  .header { text-align: center; margin-bottom: 20px; }\n  .brand-logo { font-size: 24px; font-weight: bold; color: #2c3e50; }\n  .brand-highlight { color: #8CB800; }\n  \n  /* Progress Card */\n  .card { \n    background: white; \n    border-radius: 20px; \n    box-shadow: 0 4px 20px rgba(0,0,0,0.06); \n    padding: 30px; \n    margin-bottom: 40px; \n    border: 1px solid #fff;\n    position: relative; \n    overflow: visible; \n  }\n  \n  .title-section { text-align: center; border-bottom: 2px solid #f5f5f5; padding-bottom: 20px; margin-bottom: 20px; }\n  .report-badge { background-color: #8CB800; color: white; padding: 6px 14px; border-radius: 50px; font-size: 13px; font-weight: bold; display: inline-block; margin-bottom: 10px; }\n  h1 { font-size: 26px; margin: 10px 0; color: #222; letter-spacing: -0.5px; }\n  .report-date { font-size: 13px; color: #999; margin-top: 5px; }\n  \n  /* Progress Bar */\n  .progress-section { margin: 20px 0 10px 0; padding: 0 10px; }\n  .progress-label { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 15px; display: block; text-align: center; }\n  .progress-track { position: relative; width: 100%; height: 14px; background-color: #EEE; border-radius: 10px; margin-top: 30px; }\n  .progress-fill { height: 100%; background: linear-gradient(90deg, #AED581, #8CB800); border-radius: 10px; width: ${progressPercent}%; position: relative; transition: width 1s ease-in-out; box-shadow: 0 2px 5px rgba(140, 184, 0, 0.3); }\n  .bird-icon { position: absolute; right: -25px; top: -38px; width: 50px; height: auto; z-index: 10; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.15)); }\n  .nest-icon { position: absolute; right: -20px; top: -28px; width: 65px; height: auto; z-index: 5; }\n\n  /* Section Container (Shadow Added Here!) */\n  .section-container { \n    background: white;           /* 배경색 추가 */\n    border-radius: 16px;         /* 둥근 모서리 */\n    padding: 25px;               /* 내부 여백 */\n    margin-bottom: 30px;         /* 섹션 간 간격 */\n    border: 1px solid #f0f0f0;   /* 연한 테두리 */\n    box-shadow: 0 4px 15px rgba(0,0,0,0.05); /* 그림자 적용 */\n  }\n  .section-header { \n    font-size: 19px; \n    font-weight: 800; \n    color: #2c3e50; \n    padding-left: 12px; \n    border-left: 5px solid #2c3e50;\n    margin-bottom: 20px;\n    line-height: 1.2;\n  }\n\n  /* List Items */\n  .list-item { \n    display: flex; \n    align-items: center; \n    padding: 18px; \n    margin-bottom: 12px; \n    border-radius: 12px; \n    background-color: #fff;\n    transition: all 0.2s;\n  }\n  \n  /* [미완료] 강조 스타일 */\n  .list-item.pending { \n    border-left: 5px solid #8CB800; \n    border-right: 1px solid #eee;\n    border-top: 1px solid #eee;\n    border-bottom: 1px solid #eee;\n    /* 아이템 자체 그림자는 줄여서 컨테이너와 조화롭게 */\n    box-shadow: 0 2px 5px rgba(0,0,0,0.02);\n  }\n  \n  /* [완료] 차분한 스타일 */\n  .list-item.done { \n    background-color: #F9F9F9; \n    border-left: 5px solid #CCCCCC;\n    border-right: 1px solid #F5F5F5;\n    border-top: 1px solid #F5F5F5;\n    border-bottom: 1px solid #F5F5F5;\n  }\n  \n  .item-icon { \n    font-size: 22px; \n    margin-right: 16px; \n    min-width: 24px;\n    text-align: center;\n  }\n  .item-content { flex: 1; }\n  \n  .item-title { \n    font-size: 16px; \n    color: #333; \n    font-weight: 600;\n    margin-bottom: 2px;\n  }\n  .item-desc { \n    font-size: 13px; \n    color: #777; \n    margin-top: 4px;\n    line-height: 1.4;\n  }\n\n  .list-item.done .item-title {\n    color: #BBB;\n    text-decoration: line-through;\n    font-weight: 500;\n  }\n\n  .footer { text-align: center; font-size: 12px; color: #aaa; margin-top: 60px; border-top: 1px solid #eee; padding-top: 20px; line-height: 1.6; }\n</style>\n</head>\n<body>\n  <div class=\"header\">\n    <div class=\"brand-logo\">🏠 둥지 <span class=\"brand-highlight\">체크리스트</span></div>\n  </div>\n  \n  <div class=\"card\">\n    <div class=\"title-section\">\n      <span class=\"report-badge\">둥지 짓기 플랜</span>\n      <h1>${docType}</h1>\n      <p style=\"color: #666; font-size: 16px; line-height: 1.6;\">${summary}</p>\n      <div class=\"report-date\">리포트 생성일: ${reportDateStr}</div>\n    </div>\n    \n    <div class=\"progress-section\">\n      <span class=\"progress-label\">둥지 완성도 <span style=\"color:#8CB800; font-size:24px;\">${progressPercent}%</span> <span style=\"color:#BBB; font-size:14px; font-weight:normal; margin-left:5px;\">(${completedItems} / ${totalItems})</span></span>\n      <div class=\"progress-track\">\n        <img src=\"${NEST_IMG}\" class=\"nest-icon\" alt=\"둥지\">\n        <div class=\"progress-fill\">\n          <img src=\"${BIRD_IMG}\" class=\"bird-icon\" alt=\"아기새\">\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"section-container\">\n    <div class=\"section-header\">1. 계약 전 단계</div>\n    ${renderPrettyList(itemsStep1)}\n  </div>\n\n  <div class=\"section-container\">\n    <div class=\"section-header\">2. 계약 중 단계</div>\n    ${renderPrettyList(itemsStep2)}\n  </div>\n\n  <div class=\"section-container\">\n    <div class=\"section-header\">3. 계약 후 단계</div>\n    ${renderPrettyList(itemsStep3)}\n  </div>\n\n  ${itemsEtc.length > 0 ? `\n  <div class=\"section-container\">\n    <div class=\"section-header\">기타 확인사항</div>\n    ${renderPrettyList(itemsEtc)}\n  </div>` : ''}\n\n  <div class=\"footer\">\n    본 리포트는 <strong>${rootData.userId ? '회원' : '방문자'}</strong>님의 체크리스트 데이터를 바탕으로 생성되었습니다.<br>\n    안전한 계약 되세요! © DOONGZI Service\n  </div>\n</body>\n</html>\n`;\n\nreturn {\n  json: {\n    html_content: htmlContent,\n    file_name: finalFileName,\n    user_id: rootData.userId\n  }\n};"
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [
          656,
          112
        ],
        "id": "0ada21d9-465e-4724-aad6-4e2051085dc9",
        "name": "HTML 생성"
      },
      {
        "parameters": {
          "method": "POST",
          "url": "https://jrjqlhnsnwybffkiaknx.supabase.co/rest/v1/rpc/get_my_checklist",
          "authentication": "predefinedCredentialType",
          "nodeCredentialType": "supabaseApi",
          "sendHeaders": true,
          "headerParameters": {
            "parameters": [
              {
                "name": "Content-Type",
                "value": "application/json"
              },
              {
                "name": "Prefer",
                "value": "return=representation"
              }
            ]
          },
          "sendBody": true,
          "specifyBody": "json",
          "jsonBody": "={\n  \"target_user_id\": \"{{ $json.body.userId }}\"\n}",
          "options": {}
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          224,
          112
        ],
        "id": "910515f2-2702-4ecb-8aab-3654592afc2a",
        "name": "사용자 체크 DB 가져오기",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "url": "={{ $json.url }}",
          "options": {
            "response": {
              "response": {
                "responseFormat": "file",
                "outputPropertyName": "files"
              }
            }
          }
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          1072,
          112
        ],
        "id": "c980d574-1c91-4983-b47b-194647a12d0d",
        "name": "PDF 다운로드"
      },
      {
        "parameters": {
          "respondWith": "json",
          "responseBody": "{\n  \"success\": true,\n  \"message\": \"{{ $json.email }} 님에게 메일을 발송했습니다.\"\n}",
          "options": {}
        },
        "type": "n8n-nodes-base.respondToWebhook",
        "typeVersion": 1.4,
        "position": [
          1696,
          192
        ],
        "id": "dedea2f6-e445-40af-a53a-e6bf2d6fbf89",
        "name": "메일 발송 성공 응답"
      },
      {
        "parameters": {
          "sendTo": "={{ $('사용자 체크 DB 가져오기').first().json.email }}",
          "subject": "[둥지] 체크리스트 리포트",
          "message": "첨부파일을 확인해주세요.",
          "options": {
            "attachmentsUi": {
              "attachmentsBinary": [
                {
                  "property": "files"
                }
              ]
            }
          }
        },
        "type": "n8n-nodes-base.gmail",
        "typeVersion": 2.1,
        "position": [
          1504,
          192
        ],
        "id": "2c0fef4c-b444-4f73-8d54-c6c2d6b7f9f3",
        "name": "Email 전송",
        "webhookId": "df75fcf7-ead3-40fd-b20b-4715f5699671",
        "credentials": {
          "gmailOAuth2": {
            "id": "iLTR4qIV3us3K7TY",
            "name": "Gmail account"
          }
        }
      },
      {
        "parameters": {
          "respondWith": "json",
          "responseBody": "={\n  \"success\": true,\n  \"downloadUrl\": \"https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/public/{ $json.file_key }}\"\n}",
          "options": {}
        },
        "type": "n8n-nodes-base.respondToWebhook",
        "typeVersion": 1.4,
        "position": [
          1872,
          32
        ],
        "id": "b8ab3394-6c7d-4aa9-a7c9-d8cded69aab2",
        "name": "PDF 링크 응답"
      },
      {
        "parameters": {
          "tableId": "documentfile",
          "fieldsUi": {
            "fieldValues": [
              {
                "fieldId": "file_key",
                "fieldValue": "={{ $json.Key }}"
              }
            ]
          }
        },
        "type": "n8n-nodes-base.supabase",
        "typeVersion": 1,
        "position": [
          1696,
          32
        ],
        "id": "9c2b6956-8fde-4812-8e3b-2f6783186470",
        "name": "DB에 저장",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "respondWith": "json",
          "responseBody": "={{ $json }}",
          "options": {}
        },
        "type": "n8n-nodes-base.respondToWebhook",
        "typeVersion": 1.4,
        "position": [
          1088,
          -336
        ],
        "id": "84021511-256a-41c6-9548-fcab34775a6a",
        "name": "분석 결과 반환"
      },
      {
        "parameters": {
          "content": "| **Rule Index** | **기존 actionType** | **Output Key (변경 없음)** | **연결될 노드 (Output)** |\n| --- | --- | --- | --- |\n| **Rule 0** | `analyzeRisk` | `깡통전세 위험도 분석` | `Switch` (깡통전세 유형 분기) |\n| **Rule 1** | `exportPDF` | `PDF 다운로드` | `사용자 체크 DB 가져오기` |\n| **Rule 2** | `sendEmail` | `체크리스트 이메일 발송` | `사용자 체크 DB 가져오기` |\n| **Rule 3** | `checkInsurance` | `보증보험 확인` | (새로운 `checkInsurance` 로직) |\n| **Rule 4** | **`exportAnalysisPDF`** | `분석 PDF 다운로드` | (새로운 `dataType` 분기 로직) |\n| **Rule 5** | **`sendAnalysisEmail`** | `분석 이메일 발송` | (새로운 `dataType` 분기 로직) |",
          "height": 240,
          "width": 640
        },
        "type": "n8n-nodes-base.stickyNote",
        "position": [
          -976,
          -1136
        ],
        "typeVersion": 1,
        "id": "8e0ba287-2e12-497f-9660-a11af1b5d469",
        "name": "Sticky Note4"
      },
      {
        "parameters": {
          "sendTo": "jhna01@naver.com",
          "subject": "[둥지] 정밀 분석 리포트",
          "message": "=안녕하세요! AI 법률비서 둥지입니다.  요청하신 문서에 대한 분석이 완료되었습니다. 첨부된 HTML 파일을 다운로드하여 브라우저에서 열어보세요.  [분석 요약] - 문서: 둥지 분석 리포트.pdf - 분석 내용 : \"첨부파일을 확인해주세요.\"",
          "options": {
            "attachmentsUi": {
              "attachmentsBinary": [
                {
                  "property": "=data"
                }
              ]
            }
          }
        },
        "type": "n8n-nodes-base.gmail",
        "typeVersion": 2.1,
        "position": [
          1104,
          1280
        ],
        "id": "e4c1f65d-9e21-4e1b-9895-e77e9c37ee8f",
        "name": "Send a message",
        "webhookId": "1215d75a-601d-4e7c-adbf-a8beab1beb13",
        "credentials": {
          "gmailOAuth2": {
            "id": "iLTR4qIV3us3K7TY",
            "name": "Gmail account"
          }
        }
      },
      {
        "parameters": {
          "method": "POST",
          "url": "https://api.pdf.co/v1/pdf/convert/from/html",
          "sendHeaders": true,
          "headerParameters": {
            "parameters": [
              {
                "name": "x-api-key",
                "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
              }
            ]
          },
          "sendBody": true,
          "bodyParameters": {
            "parameters": [
              {
                "name": "html",
                "value": "={{ $json.output }}"
              },
              {
                "name": "name",
                "value": "=result{{ $json.document_id }}.pdf"
              },
              {
                "name": "margins",
                "value": "5px 5px 5px 5px"
              }
            ]
          },
          "options": {}
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          384,
          1200
        ],
        "id": "f6e554ae-bd0a-4138-9f72-338874f438cf",
        "name": "HTML to PDF1"
      },
      {
        "parameters": {
          "url": "={{ $json.url }}",
          "options": {
            "response": {
              "response": {
                "responseFormat": "file"
              }
            }
          }
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          608,
          1200
        ],
        "id": "0852c33d-413a-4727-ab37-a6d0df2ecd6d",
        "name": "PDF 다운로드1"
      },
      {
        "parameters": {
          "operation": "get",
          "tableId": "analyzefile",
          "filters": {
            "conditions": [
              {
                "keyName": "file_key",
                "keyValue": "={{ $json.body.fileKey }}"
              }
            ]
          }
        },
        "type": "n8n-nodes-base.supabase",
        "typeVersion": 1,
        "position": [
          192,
          1200
        ],
        "id": "c0c4631b-8128-47fa-9621-3ed99a430064",
        "name": "분석 결과 DB 가져오기",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "respondWith": "json",
          "responseBody": "{\n  \"success\": true,\n  \"message\": \"{{ $json.email }} 님에게 메일을 발송했습니다.\"\n}",
          "options": {}
        },
        "type": "n8n-nodes-base.respondToWebhook",
        "typeVersion": 1.4,
        "position": [
          1296,
          1280
        ],
        "id": "a0944dbe-542f-47aa-a718-316f79badb33",
        "name": "메일 발송 성공 응답1"
      },
      {
        "parameters": {
          "respondWith": "json",
          "responseBody": "={\n  \"success\": true,\n  \"downloadUrl\": \"https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/public/{ $json.file_key }}\"\n}",
          "options": {}
        },
        "type": "n8n-nodes-base.respondToWebhook",
        "typeVersion": 1.4,
        "position": [
          1104,
          1120
        ],
        "id": "545eff58-cf45-4ded-b2de-16e28413112e",
        "name": "PDF 링크 응답1"
      },
      {
        "parameters": {
          "rules": {
            "values": [
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "leftValue": "={{ $('CHECKLIST Webhook1').item.json.body.actionType }}",
                      "rightValue": "",
                      "operator": {
                        "type": "string",
                        "operation": "equals"
                      },
                      "id": "3a998fea-a154-4c50-af7a-d1dcdedc14a4"
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "PDF 다운로드"
              },
              {
                "conditions": {
                  "options": {
                    "caseSensitive": true,
                    "leftValue": "",
                    "typeValidation": "strict",
                    "version": 2
                  },
                  "conditions": [
                    {
                      "id": "75dff1b1-98be-4bc6-920f-6243ac94df9c",
                      "leftValue": "={{ $('CHECKLIST Webhook1').item.json.body.actionType }}",
                      "rightValue": "sendAnalysisEmail",
                      "operator": {
                        "type": "string",
                        "operation": "equals",
                        "name": "filter.operator.equals"
                      }
                    }
                  ],
                  "combinator": "and"
                },
                "renameOutput": true,
                "outputKey": "이메일 발송"
              }
            ]
          },
          "options": {}
        },
        "type": "n8n-nodes-base.switch",
        "typeVersion": 3.2,
        "position": [
          816,
          1200
        ],
        "id": "bef5c7df-bfc8-4c58-a90f-f16fed3661a4",
        "name": "Switch1"
      },
      {
        "parameters": {
          "jsCode": "// 1. Merge 노드의 결과 가져오기\nconst items = $input.all();\n// Append 모드이므로 items 배열에 등기부와 건축물대장 텍스트가 분리되어 담겨 있습니다.\n\nlet registryText = '';\nlet ledgerText = '';\n\n// *******************************************************************\n// 1-1. 핵심 로직: 2개의 아이템을 순회하여 등기부와 건축물대장 텍스트를 추출\n// *******************************************************************\n\nfor (const item of items) {\n    // 텍스트는 item.json.data 필드에 들어있다고 가정합니다.\n    const textContent = item.json.data || '';\n\n    if (textContent.includes('등기사항전부증명서') || textContent.includes('【 표 제 부 】')) {\n        // 등기부등본 텍스트로 확인되면 할당\n        registryText = textContent;\n        console.log(\"SUCCESS: 등기부등본 텍스트 추출 완료.\");\n    } else if (textContent.includes('집합 건 축 물 대장') || textContent.includes('건축물대장')) {\n        // 건축물대장 텍스트로 확인되면 할당\n        ledgerText = textContent;\n        console.log(\"SUCCESS: 건축물대장 텍스트 추출 완료.\");\n    }\n}\n\n// 추출 실패 시 대비 (안전장치): 텍스트가 하나만 추출된 경우\nif (!registryText && ledgerText.includes('등기사항전부증명서')) {\n    registryText = ledgerText;\n    ledgerText = '';\n} else if (!ledgerText && registryText.includes('집합 건 축 물 대장')) {\n    ledgerText = registryText;\n    registryText = '';\n}\n\n\n// 1-2. 두 텍스트를 모두 포함하는 통합 텍스트 생성 \nconst allExtractedText = \n  `[등기부등본 OCR 텍스트]\\n${registryText}\\n\\n[건축물대장 OCR 텍스트]\\n${ledgerText}`;\n\n\n// 2. 초기 설정 데이터 가져오기 (Webhook에서)\n// 첫 번째 아이템(items[0])이나 웹훅 노드에서 초기 데이터를 가져옵니다.\nconst firstItemJson = items.length > 0 ? items[0].json : {};\nlet initialData = {};\ntry {\n    const webhookNode = $('등기부등본분석').first() || $('등기부등본분석1').first();\n    initialData = webhookNode.json.body || webhookNode.json;\n} catch (error) {\n    // Webhook 데이터가 없으면 무시\n}\n\n// 3. 결과 반환 (하나의 병합된 아이템으로 반환)\nreturn {\n    json: {\n        // 🔥 첫 번째 아이템의 메타데이터를 먼저 펼침 (기본값)\n        ...firstItemJson,\n        \n        // LLM에 전달되는 통합 텍스트\n        extractedText: allExtractedText, \n        \n        // 🚩 LLM이 참조할 핵심 필드\n        registry_text: registryText,\n        ledger_text: ledgerText,\n\n        // 🔥 중요 데이터는 마지막에 명시적으로 덮어쓰기 (우선순위 보장)\n        fileName: initialData.fileName || firstItemJson.fileName || 'document.txt', \n        userId: initialData.userId || firstItemJson.userId || 1,\n        target_landlord_name: initialData.target_landlord_name || firstItemJson.target_landlord_name || '',\n        target_deposit: initialData.target_deposit || firstItemJson.target_deposit || 0,\n        timestamp: new Date().toISOString()\n    }\n};"
        },
        "id": "edb70a57-4774-4b8f-800d-01411da7a8af",
        "name": "텍스트 정리",
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [
          2112,
          688
        ]
      },
      {
        "parameters": {
          "method": "POST",
          "url": "https://api.pdf.co/v1/pdf/convert/to/text",
          "sendHeaders": true,
          "headerParameters": {
            "parameters": [
              {
                "name": "x-api-key",
                "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
              }
            ]
          },
          "sendBody": true,
          "bodyParameters": {
            "parameters": [
              {
                "name": "url",
                "value": "=https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/public/{{ $('Supabase S').item.json.Key }}"
              },
              {
                "name": "lang",
                "value": "kor"
              },
              {
                "name": "inline",
                "value": "true"
              },
              {
                "name": "async",
                "value": "true"
              }
            ]
          },
          "options": {
            "timeout": 300000
          }
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          1248,
          544
        ],
        "id": "0b4d9fd3-7b94-4844-a597-24aeeb5ab9df",
        "name": "OCR 요청1"
      },
      {
        "parameters": {
          "url": "https://api.pdf.co/v1/job/check",
          "sendQuery": true,
          "queryParameters": {
            "parameters": [
              {
                "name": "jobid",
                "value": "={{ $json.jobId }}"
              },
              {
                "name": "x-api-key",
                "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
              }
            ]
          },
          "sendHeaders": true,
          "headerParameters": {
            "parameters": [
              {}
            ]
          },
          "options": {}
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          1584,
          544
        ],
        "id": "8d78f75f-fa33-406c-954c-fb583d30322e",
        "name": "JOB 상태 확인"
      },
      {
        "parameters": {
          "url": "={{ $json.url }}",
          "sendHeaders": true,
          "headerParameters": {
            "parameters": [
              {
                "name": "x-api-key",
                "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
              }
            ]
          },
          "sendBody": true,
          "bodyParameters": {
            "parameters": [
              {
                "name": "jobId",
                "value": "={{ $json.jobId }}"
              }
            ]
          },
          "options": {}
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          1744,
          544
        ],
        "id": "c24e7c18-8e93-435d-93ca-6672091796dd",
        "name": "결과 확인하기1"
      },
      {
        "parameters": {
          "tableId": "documentfile",
          "fieldsUi": {
            "fieldValues": [
              {
                "fieldId": "file_key",
                "fieldValue": "={{ $json.Key }}"
              }
            ]
          }
        },
        "type": "n8n-nodes-base.supabase",
        "typeVersion": 1,
        "position": [
          1008,
          544
        ],
        "id": "d4fe41fe-808f-48fe-83e5-7fb52fc98afa",
        "name": "Create a row",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "method": "POST",
          "url": "=https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/doongzi/{{ $now.valueOf() }}",
          "authentication": "predefinedCredentialType",
          "nodeCredentialType": "supabaseApi",
          "sendHeaders": true,
          "headerParameters": {
            "parameters": [
              {
                "name": "Content-Type",
                "value": "={{ $binary.file0.mimeType }}"
              }
            ]
          },
          "sendBody": true,
          "contentType": "binaryData",
          "inputDataFieldName": "file",
          "options": {}
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          816,
          544
        ],
        "id": "43133677-7ae6-495e-90e6-3af241f2e788",
        "name": "Supabase S",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "promptType": "define",
          "text": "=- 너는 사람이 아닌 기계 심사 엔진이다.\n- 제공된 [OCR 추출 텍스트]와 입력 변수만 사용해서, [검증 규칙(Validation Rules)]을 적용한다.\n- 인간적인 조언/설명/감상은 절대 하지 않는다.\n- 정보가 부족하면 추측하지 않고 `REVIEW_REQUIRED`로 판정한다.\n- 최종 결과는 반드시 아래 [출력 형식(Output Format)]을 지켜야 하며, 추가적인 설명은 `final_comment` 필드에 JSON 문자열 형태로 담는다.\n- LLM은 OCR 텍스트에서 필요한 정보를 추출하여 `extracted_variables`에 JSON 형태로 저장해야 한다.\n\n---\n\n## 1. 입력 데이터\n\n### 1-1. 메타 정보\n- 파일 이름 (`file_name`): {{ $json.fileName }}\n- 심사 요청일 (`timestamp`): {{ $json.timestamp }}\n\n### 1-2. 수치 입력 변수\n- 임차 보증금 (`rental_deposit`): {{ $json.target_deposit * 10000 }} 원 (입력값: {{ $json.target_deposit }}만원)\n- 임대인 이름 (`target_landlord_name`): {{ $json.target_landlord_name }}\n- 최근 매매가격 (`trade_price_raw`): {{ $('주소로_가격_조회').first().json.거래금액_만원 }} (단위: 만원)\n\n### 1-3. OCR 추출 텍스트\n\n- **통합 텍스트** (`extractedText`):\n    * **용도:** 두 문서에서 필요한 정보를 한 번에 검색해야 할 때 참조합니다.\n{{ $json.extractedText }}\n\n- **등기부등본 텍스트** (`registry_text`):\n    * **용도:** 소유권(갑구), 근저당권 및 기타 채권(을구), 건물 및 토지 표시(표제부) 등 등기 관련 정보 추출 시 참조합니다.\n{{ $json.registry_text }}\n\n- **건축물대장 텍스트** (`ledger_text`):\n    * **용도:** 위반 건축물 여부, 용도(오피스텔/주택), 전유면적 등 건축물 상세 정보 추출 시 참조합니다.\n{{ $json.ledger_text }}\n\n---\n\n## 2. 검증 규칙 (Validation Rules)\n\n적용해야 할 검증 규칙 목록은 다음과 같다.\n```json\n{{ $('보증보험_검증_규칙_정의1').first().json }}\n```\n\n## 3. 출력 형식 (Output Format)\n\n당신은 반드시 아래의 JSON 형식으로만 응답해야 합니다. 다른 텍스트나 설명을 추가하지 마세요.\n\n{\n  \"extracted_variables\": {\n    \"house_price\": <number>,\n    \"rental_deposit\": <number>,\n    \"senior_total_debt\": <number>,\n    \"senior_mortgage_amount\": <number>,\n    \"senior_deposit_amount\": <number>,\n    \"owner_land\": \"<string>\",\n    \"owner_building\": \"<string>\",\n    \"lessor_on_contract\": \"<string>\",\n    \"is_single_or_multi_house\": <boolean>,\n    \"has_jeonsegwon\": <boolean>,\n    \"has_legal_encumbrance\": <boolean>,\n    \"is_violation_building\": <boolean>,\n    \"has_other_resident_except_owner\": <boolean>,\n    \"building_total_area\": <number>,\n    \"rental_area\": <number>\n  },\n  \"validation_results\": [\n    {\n      \"id\": <number>,\n      \"category\": \"<string>\",\n      \"status\": \"PASS\" | \"FAIL\" | \"REVIEW_REQUIRED\",\n      \"reason\": \"<string>\",\n      \"extracted_value\": \"<string>\"\n    }\n  ],\n  \"overall_decision\": \"승인\" | \"거절\" | \"추가검토필요\",\n  \"final_comment\": \"<string>\"\n}\n\n---\n\n## 4. 검증 수행 지침\n\n### 4-1. 변수 추출 단계\n1. OCR 텍스트에서 다음 정보를 추출하여 `extracted_variables`에 저장:\n   - **house_price**: 최근 매매가격 (입력변수 `trade_price_raw` * 10000으로 만원→원 변환)\n   - **rental_deposit**: 임차 보증금 (입력변수 `target_deposit` * 10000으로 만원→원 변환, 이미 계산된 값 사용)\n   - **senior_total_debt**: 선순위 채권 총액 (근저당+전세보증금 합계)\n   - **senior_mortgage_amount**: 선순위 근저당 설정액\n   - **senior_deposit_amount**: 선순위 임대차보증금 합계\n   - **owner_land**: 토지 소유자명 (등기부 갑구에서 추출)\n   - **owner_building**: 건물 소유자명 (등기부 갑구에서 추출)\n   - **lessor_on_contract**: 임대인명 (입력변수 `target_landlord_name` 사용)\n   - **is_single_or_multi_house**: 단독/다가구 주택 여부 (건축물대장 용도 확인)\n   \n   🔥 **부정적 정보 추출 규칙 (중요)**:\n   - **has_jeonsegwon**: 등기부 을구에서 \"전세권\" 키워드가 **발견되면** true, **발견되지 않으면** false\n   - **has_legal_encumbrance**: 등기부 을구에서 \"압류\", \"가압류\", \"채권양도\" 키워드가 **발견되면** true, **발견되지 않으면** false\n   - **is_violation_building**: 건축물대장에서 \"위반\", \"위반건축물\" 키워드가 **발견되면** true, **발견되지 않으면** false\n   - **has_other_resident_except_owner**: 전입내역에서 소유자 외 다른 세대가 **발견되면** true, **발견되지 않으면** false\n   \n   ⚠️ **핵심**: 위 4가지 부정적 정보는 OCR 텍스트에서 해당 키워드를 찾지 못하면 \"정상(false)\"으로 간주합니다. \n   \"정보 부족\"으로 REVIEW_REQUIRED 처리하지 마세요.\n   \n   - **building_total_area**: 건물 연면적 (건축물대장에서 추출, 없으면 0)\n   - **rental_area**: 임차 면적 (건축물대장 전유면적 확인, 없으면 0)\n\n### 4-2. 규칙 검증 단계\n각 규칙(id 1~8)을 순서대로 검증:\n\n#### 규칙 1: 보증한도 (90% 이내)\n조건: (rental_deposit + senior_total_debt) <= (house_price * 0.9)\n\nrental_deposit은 입력받은 보증금 ({{ $json.target_deposit * 10000 }}원)\nsenior_total_debt는 OCR에서 추출한 선순위 채권 총액\nPASS 예시: 보증금 40,000,000원 + 선순위 300,000,000원 = 340,000,000원 ≤ 주택가격 800,000,000원 * 0.9 = 720,000,000원\nFAIL 예시: 합계가 주택가격의 90%를 초과하는 경우\nREVIEW_REQUIRED: house_price 또는 senior_total_debt를 OCR에서 추출할 수 없는 경우\n\n#### 규칙 2: 선순위 근저당 제한 (60% 이하)\n조건: senior_mortgage_amount <= (house_price * 0.9 * 0.6)\nPASS 예시: 근저당 3억 ≤ 8억 * 0.9 * 0.6 = 4.32억\nFAIL 예시: 근저당이 54% 기준을 초과하는 경우\nREVIEW_REQUIRED: senior_mortgage_amount를 OCR에서 추출할 수 없는 경우\n\n#### 규칙 3: 단독/다가구 선순위 채권총액 (80% 이하)\n조건: is_single_or_multi_house AND (senior_mortgage_amount + senior_deposit_amount) <= (house_price * 0.9 * 0.8)\n적용: 단독/다가구 주택인 경우에만 검증\nPASS 예시: 단독주택이 아니거나, 조건 충족\nREVIEW_REQUIRED: is_single_or_multi_house를 판단할 수 없는 경우\n\n#### 규칙 4: 보증 목적물 소유권\n조건: owner_land == owner_building == lessor_on_contract\nPASS 예시: 토지 소유자 \"홍길동\" = 건물 소유자 \"홍길동\" = 임대인 \"홍길동\"\nFAIL 예시: 소유자 불일치 또는 공동소유자 중 일부만 계약\nREVIEW_REQUIRED: owner_land 또는 owner_building을 OCR에서 추출할 수 없는 경우\n\n#### 규칙 5: 위반 건축물 여부\n조건: is_violation_building == false\n🔥 PASS: 건축물대장에서 \"위반\", \"위반건축물\" 키워드를 찾을 수 없음 (정상)\n🔥 FAIL: 건축물대장에서 \"위반\", \"위반건축물\" 키워드 발견\nREVIEW_REQUIRED: 건축물대장 텍스트가 비어있거나 판독 불가능한 경우만 해당\n\n#### 규칙 6: 임대차보증금의 권리\n조건: has_legal_encumbrance == false\n🔥 PASS: 등기부 을구에서 \"압류\", \"가압류\", \"채권양도\" 키워드를 찾을 수 없음 (정상)\n🔥 FAIL: 등기부 을구에서 \"압류\", \"가압류\", \"채권양도\" 키워드 발견\nREVIEW_REQUIRED: 등기부 을구 텍스트가 비어있거나 판독 불가능한 경우만 해당\n\n#### 규칙 7: 타 세대 전입확인\n조건: is_single_or_multi_house OR has_other_resident_except_owner == false\n🔥 PASS: 단독/다가구 주택이거나, 전입내역에서 소유자 외 다른 세대를 찾을 수 없음 (정상)\n🔥 FAIL: 공동주택/오피스텔에 다른 세대 전입내역 발견\nREVIEW_REQUIRED: 주택 유형을 판단할 수 없는 경우\n\n#### 규칙 8: 전세권 설정 여부 (최우선)\n조건: has_jeonsegwon == false\n🔥 PASS: 등기부 을구에서 \"전세권\" 키워드를 찾을 수 없음 (정상)\n🔥 FAIL: 등기부 을구에서 \"전세권\" 키워드 발견\nFAIL시: 전세권 말소 또는 공사 이전 필요\nREVIEW_REQUIRED: 등기부 을구 텍스트가 비어있거나 판독 불가능한 경우만 해당\n\n### 4-3. 최종 판정 로직\n규칙 중 하나라도 FAIL → \"거절\"\nREVIEW_REQUIRED가 1개 이상 → \"추가검토필요\"\n모든 규칙 PASS → \"승인\"\n\n## 5. 중요 지침\n\n**OCR 텍스트 신뢰 우선순위:**\n- registry_text (등기부) → 소유권, 근저당, 전세권 정보\n- ledger_text (건축물대장) → 위반건축물, 용도, 면적 정보\n- extractedText (통합) → 위 두 개에서 못 찾은 경우\n\n**숫자 추출 규칙:**\n- \"금 삼억원정\" → 300,000,000\n- \"300,000,000원\" → 300000000\n- 만원 단위는 10,000 곱하기\n\n**🔥 부정적 정보 처리 원칙 (매우 중요):**\n- **전세권, 압류, 가압류, 위반건축물, 타세대 전입**: 해당 키워드가 OCR 텍스트에서 **발견되지 않으면 정상(PASS)**으로 판단\n- **긍정적 정보 (소유자명, 금액 등)**: 추출할 수 없으면 `REVIEW_REQUIRED`\n\n**불확실성 처리:**\n- OCR 오류로 숫자가 명확하지 않으면 → REVIEW_REQUIRED\n- 소유자명이 여러 개인데 임대인과 매칭 안 되면 → FAIL\n- 전세권/근저당 설정일과 금액이 불명확하면 → REVIEW_REQUIRED (단, 키워드 자체가 없으면 PASS)\n\n**final_comment 작성:**\n- FAIL 사유를 구체적으로 명시\n- 승인 시에도 주의사항이 있다면 기재\n- 추가 확인이 필요한 서류 명시",
          "batching": {}
        },
        "type": "@n8n/n8n-nodes-langchain.chainLlm",
        "typeVersion": 1.7,
        "position": [
          2816,
          544
        ],
        "id": "feb6572a-417d-46e3-bb97-1c4e2928c4dc",
        "name": "Basic LLM Chain"
      },
      {
        "parameters": {
          "jsCode": "const items = $input.all();\nconst inputData = items[0].json; // 이전 노드(주소로_가격_조회)의 데이터 가져오기\n\n// 최종 확정된 8가지 자동 체크 항목 (비즈니스 로직)\nconst checklist = {\n    \"verification_checklist\": [\n        {\n            \"target_document\": \"등기부등본\",\n            \"document_code\": \"real_estate_registry\",\n            \"items\": [\n                {\n                    \"id\": 8, // 1순위 자동 체크: 전세권 설정 여부 (NEW)\n                    \"category\": \"전세권 설정 여부\",\n                    \"description\": \"전세 목적물에 전세권이 설정되지 않았는지 확인. (설정된 경우 말소 또는 공사에 이전 필요)\",\n                    \"logic_check\": \"has_jeonsegwon == false\",\n                    \"fail_condition\": \"전세권이 설정되어 있음\",\n                    \"source_reference\": \"자동 체크 8번 항목\"\n                },\n                {\n                    \"id\": 4, // 2순위 자동 체크: 보증 목적물 소유권\n                    \"category\": \"보증 목적물 소유권\",\n                    \"description\": \"건물과 토지의 소유자가 임대차계약서상 임대인과 동일한지 확인\",\n                    \"logic_check\": \"owner_land == owner_building == lessor_on_contract\",\n                    \"fail_condition\": \"토지/건물 소유자 불일치 또는 임대인과 소유자 불일치 (공동소유 시 전원 계약 필요)\",\n                    \"source_reference\": \"자동 체크 4번 항목\"\n                },\n                {\n                    \"id\": 6, // 3순위 자동 체크: 임대차보증금의 권리\n                    \"category\": \"임대차보증금의 권리\",\n                    \"description\": \"보증금에 대한 압류, 가압류, 채권양도 등 제3자 권리침해 유무 확인\",\n                    \"logic_check\": \"has_legal_encumbrance == false\",\n                    \"fail_condition\": \"임대차보증금에 압류, 가압류 등 제3자 권리침해 존재\",\n                    \"source_reference\": \"자동 체크 6번 항목\"\n                },\n                {\n                    \"id\": 1, // 4순위 자동 체크: 보증 한도 (90% 이내)\n                    \"category\": \"보증한도\",\n                    \"description\": \"임대차 보증금액과 선순위채권총액의 합이 주택가격의 90% 이내인지 확인\",\n                    // house_price, rental_deposit, senior_total_debt 변수 사용\n                    \"formula\": \"(rental_deposit + senior_total_debt) <= (house_price * 0.9)\",\n                    \"fail_condition\": \"전세지킴보증은 주택가격의 90%를 초과할 수 없음\",\n                    \"source_reference\": \"자동 체크 1번 항목\"\n                },\n                {\n                    \"id\": 2, // 5순위 자동 체크: 선순위 근저당 제한 (60% 이하)\n                    \"category\": \"선순위 채권총액 제한(근저당 60%)\",\n                    \"description\": \"선순위 근저당 설정액이 주택가격(90% 적용)의 60% 이하인지 확인\",\n                    // house_price, senior_mortgage_amount 변수 사용\n                    \"formula\": \"senior_mortgage_amount <= (house_price * 0.9 * 0.6)\",\n                    \"fail_condition\": \"선순위 근저당 설정액이 한도를 초과함 (23.9.30 이전 계약 예외 있음)\",\n                    \"source_reference\": \"자동 체크 2번 항목\"\n                },\n                {\n                    \"id\": 3, // 6순위 자동 체크: 선순위 채권총액 제한(단독/다가구 80% 이하)\n                    \"category\": \"선순위 채권총액 제한(단독/다가구 80%)\",\n                    \"description\": \"단독/다가구 주택의 경우 선순위채권총액이 주택가격(90% 적용)의 80% 이하인지 확인\",\n                    // is_single_or_multi_house, house_price, senior_total_debt 변수 사용\n                    \"formula\": \"is_single_or_multi_house AND (senior_mortgage_amount + senior_deposit_amount) <= (house_price * 0.9 * 0.8)\",\n                    \"fail_condition\": \"선순위채권총액이 한도를 초과함. 단독/다가구 주택의 경우 근저당 60%와 채권총액 80% 조건을 동시 충족해야 함.\",\n                    \"source_reference\": \"자동 체크 3번 항목\"\n                }\n            ]\n        },\n        {\n            \"target_document\": \"건축물대장 및 기타\",\n            \"document_code\": \"building_ledger_and_other\",\n            \"items\": [\n                {\n                    \"id\": 5, // 7순위 자동 체크: 위반 건축물 여부\n                    \"category\": \"위반 건축물 여부\",\n                    \"description\": \"건축물대장상 위반 건축물 표기 여부 확인\",\n                    \"logic_check\": \"is_violation_building == false\",\n                    \"fail_condition\": \"위반 건축물로 등재됨 (단, 다세대 구분등기 시 해당 호수 위반 없으면 예외)\",\n                    \"source_reference\": \"자동 체크 5번 항목\"\n                },\n                {\n                    \"id\": 7, // 8순위 자동 체크: 타 세대 전입확인\n                    \"category\": \"타 세대 전입확인\",\n                    \"description\": \"공동주택/오피스텔의 경우 다른 세대의 전입내역이 없는지 확인\",\n                    \"logic_check\": \"is_single_or_multi_house OR has_other_resident_except_owner == false\", \n                    \"fail_condition\": \"공동주택/오피스텔에 다른 세대 전입내역이 존재함 (임대인, 가족, 무상거주인 예외)\",\n                    \"source_reference\": \"자동 체크 7번 항목\"\n                },\n                {\n                    \"id\": 3_1, // 보조 로직: 주택 면적 비율 확인\n                    \"category\": \"주택 면적 비율 확인(보조)\",\n                    \"description\": \"주택가격 12억 초과 단독/다가구의 경우 연면적 대비 임차면적 비율 확인용\",\n                    \"logic_check\": \"calculate_area_ratio_if_expensive\",\n                    \"fail_condition\": \"면적 비율에 따른 환산 금액이 12억원 기준 초과 시\",\n                    \"source_reference\": \"자동 체크 3번 항목 보조\"\n                }\n            ]\n        }\n    ]\n};\n\n// 중요: 이전 노드의 데이터(extractedText, userId 등)와 체크리스트를 병합하여 반환\nreturn {\n    json: {\n        ...inputData,\n        verification_checklist: checklist.verification_checklist\n    }\n};"
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [
          2608,
          688
        ],
        "id": "1160fe62-9285-430f-9e7c-5bdc26df8305",
        "name": "보증보험_검증_규칙_정의1"
      },
      {
        "parameters": {
          "model": {
            "__rl": true,
            "mode": "list",
            "value": "gpt-4.1-mini"
          },
          "options": {}
        },
        "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
        "typeVersion": 1.2,
        "position": [
          2816,
          720
        ],
        "id": "f0869200-52d2-4b67-82d0-f3dd876b3301",
        "name": "OpenAI Chat Model",
        "credentials": {
          "openAiApi": {
            "id": "RXF13ckAcxpV0AQ8",
            "name": "OpenAi account 10"
          }
        }
      },
      {
        "parameters": {
          "jsCode": "const items = $input.all();\n\nreturn items.map(item => {\n    // text 필드에서 JSON 추출 (LLM 출력)\n    let rawText = item.json.text || '';\n    \n    // JSON 파싱\n    let parsedData;\n    try {\n        // LLM 응답에서 JSON 부분만 추출 (앞뒤 공백 제거)\n        const jsonMatch = rawText.match(/\\{[\\s\\S]*\\}/);\n        if (jsonMatch) {\n            // JSON 문자열을 파싱\n            parsedData = JSON.parse(jsonMatch[0]);\n        } else {\n            // JSON을 찾지 못한 경우 예외 처리\n            throw new Error('LLM 출력에서 JSON 구조를 찾을 수 없습니다.');\n        }\n    } catch (error) {\n        // 파싱 실패 시 에러 객체 반환\n        return {\n            json: {\n                error: 'JSON 파싱 실패',\n                raw: rawText\n            }\n        };\n    }\n    \n    // validation_results 추출\n    const results = parsedData.validation_results || [];\n    \n    // 1. 기존 로직: 원하는 형식으로 변환 (formatted_validation)\n    const formatted = results.map(rule => \n        `{'id': ${rule.id}, 'status': '${rule.status}', 'reason': '${rule.reason}'}`\n    );\n    \n    // 2. 기존 로직: 'PASS'인 ID 리스트 추출 (pass_ids)\n    // 참고: 기존 코드가 'PASS'가 아닌 항목을 필터링하도록 잘못되어 있어, 'PASS' 항목을 필터링하도록 수정했습니다.\n    const passIds = results\n        .filter(rule => rule.status === 'PASS') // status가 'PASS'인 항목만 필터링 (수정)\n        .map(rule => rule.id);\n        \n    // 3. 🔥 새로운 로직: 'FAIL'인 항목의 사유(reason) 추출\n    const failReasons = results\n        .filter(rule => rule.status === 'FAIL') // status가 'FAIL'인 항목만 필터링\n        .map(rule => rule.reason); // 해당 항목의 reason만 추출하여 배열 생성\n        \n    // 4. 🔥 새로운 로직: 'FAIL' 항목 존재 여부 확인 플래그\n    const hasFailures = failReasons.length > 0;\n    \n    return {\n        json: {\n            // 기존 결과 필드\n            formatted_validation: formatted,\n            pass_ids: passIds,\n            \n            // 🔥 새로운 필드: 분기 처리에 사용됨\n            fail_reasons: failReasons,         // 'FAIL' 사유 리스트\n            has_failures: hasFailures,          // 'FAIL' 존재 여부 (true/false)\n            \n            // LLM의 최종 판정 결과를 함께 전달 (IF 분기에 유용)\n            overall_decision: parsedData.overall_decision || '추가검토필요'\n        }\n    };\n});"
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [
          3120,
          688
        ],
        "id": "8511b9b0-3688-4985-be54-74c8b69c0990",
        "name": "LLM_Output_Parser_V2"
      },
      {
        "parameters": {
          "operation": "getAll",
          "tableId": "Officetel",
          "limit": 1,
          "filters": {
            "conditions": [
              {
                "keyName": "시군구",
                "condition": "like",
                "keyValue": "={{ $json.address_full }}"
              }
            ]
          }
        },
        "type": "n8n-nodes-base.supabase",
        "typeVersion": 1,
        "position": [
          2432,
          688
        ],
        "id": "f0cc94e9-ad75-4c79-a7fc-da3598ff8d4b",
        "name": "주소로_가격_조회",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "jsCode": "// 입력 데이터 반복\nfor (const item of $input.all()) {\n    // ----------------------------------------------------------------------\n    // 핵심 수정: 등기부등본 텍스트 소스 변경\n    // Merge 노드를 거친 후 등기부등본 OCR 텍스트가 'data' 필드에 들어오고 있습니다.\n    // 'data' 필드를 최우선으로 사용합니다.\n    // ----------------------------------------------------------------------\n    const text = item.json.data || item.json.registry_text || item.json.extractedText || ''; \n    \n    // =========================================================\n    // 1. 공격적인 텍스트 전처리\n    // =========================================================\n    const cleanText = text\n        .replace(/\\n/g, ' ') // 줄바꿈을 공백으로 통일\n        // 한글과 공백을 제외한 모든 문자(숫자, 기호)를 공백으로 대체합니다.\n        // 이를 통해 '1568-1외 1필지'와 같은 주소 방해 요소가 제거됩니다.\n        .replace(/[^\\uAC00-\\uD7A3\\s\\d-]/g, ' ') \n        // 2개 이상의 연속된 공백을 하나의 공백으로 축소\n        .replace(/\\s{2,}/g, ' '); \n\n    // 2. 정규식 정의 (유연한 정규식 구조)\n    // 시/도(그룹1) + (선택적 시/군) + 구(그룹2) + 동/로/길/읍/면/가(그룹3)\n    const revisedAddressRegex = /([가-힣]+(?:시|도))\\s+(?:[가-힣]+(?:시|군)\\s+)?([가-힣]+구)\\s+([가-힣]+(?:동|로|길|읍|면|가))/;\n    \n    const match = cleanText.match(revisedAddressRegex);\n\n    let extractedAddress = '주소 미확인';\n\n    if (match) {\n        // match[1]: 시/도 (예: 서울특별시)\n        // match[2]: 구 (예: 관악구)\n        // match[3]: 동/로/길 (예: 봉천동)\n        extractedAddress = `${match[1]} ${match[2]} ${match[3]}`;\n    } else {\n        // [백업] 시/도 정보가 없는 경우 (예: \"분당구 정자동\")\n        const backupRegex = /([가-힣]+구)\\s+([가-힣]+(?:동|로|길|읍|면|가))/;\n        const backupMatch = cleanText.match(backupRegex);\n        if(backupMatch) {\n            extractedAddress = `${backupMatch[1]} ${backupMatch[2]}`;\n        }\n    }\n\n    // 결과 저장\n    item.json.address_full = extractedAddress;\n}\n\nreturn $input.all();"
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [
          2272,
          688
        ],
        "id": "5229317d-8505-4dfe-bf58-f274fc225b61",
        "name": "ㅇㅇ시_ㅇㅇ구_ㅇㅇ로 로 추출"
      },
      {
        "parameters": {
          "method": "POST",
          "url": "https://api.pdf.co/v1/pdf/convert/to/text",
          "sendHeaders": true,
          "headerParameters": {
            "parameters": [
              {
                "name": "x-api-key",
                "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
              }
            ]
          },
          "sendBody": true,
          "bodyParameters": {
            "parameters": [
              {
                "name": "url",
                "value": "=https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/public/{{ $('Supabase S1').item.json.Key }}"
              },
              {
                "name": "lang",
                "value": "kor"
              },
              {
                "name": "inline",
                "value": "true"
              },
              {
                "name": "async",
                "value": "true"
              }
            ]
          },
          "options": {
            "timeout": 300000
          }
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          1248,
          800
        ],
        "id": "7ffdca74-59e2-4701-8776-63d761a8e2b3",
        "name": "OCR 요청"
      },
      {
        "parameters": {
          "tableId": "documentfile",
          "fieldsUi": {
            "fieldValues": [
              {
                "fieldId": "file_key",
                "fieldValue": "={{ $json.Key }}"
              }
            ]
          }
        },
        "type": "n8n-nodes-base.supabase",
        "typeVersion": 1,
        "position": [
          1008,
          800
        ],
        "id": "7478cd54-eea5-4d96-b639-16498da947d8",
        "name": "Create a row2",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "method": "POST",
          "url": "=https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/doongzi/{{ $now.valueOf() }}",
          "authentication": "predefinedCredentialType",
          "nodeCredentialType": "supabaseApi",
          "sendHeaders": true,
          "headerParameters": {
            "parameters": [
              {
                "name": "Content-Type",
                "value": "={{ $binary.file0.mimeType }}"
              }
            ]
          },
          "sendBody": true,
          "contentType": "binaryData",
          "inputDataFieldName": "file",
          "options": {}
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          816,
          800
        ],
        "id": "61b85ee3-991c-4226-bb4c-f0fd0b74ce2f",
        "name": "Supabase S1",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "url": "https://api.pdf.co/v1/job/check",
          "sendQuery": true,
          "queryParameters": {
            "parameters": [
              {
                "name": "jobid",
                "value": "={{ $json.jobId }}"
              },
              {
                "name": "x-api-key",
                "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
              }
            ]
          },
          "sendHeaders": true,
          "headerParameters": {
            "parameters": [
              {}
            ]
          },
          "options": {}
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          1584,
          800
        ],
        "id": "a758a540-2d50-4995-adbf-773fa55b1453",
        "name": "JOB 상태 확인1"
      },
      {
        "parameters": {
          "url": "={{ $json.url }}",
          "sendHeaders": true,
          "headerParameters": {
            "parameters": [
              {
                "name": "x-api-key",
                "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
              }
            ]
          },
          "sendBody": true,
          "bodyParameters": {
            "parameters": [
              {
                "name": "jobId",
                "value": "={{ $json.jobId }}"
              }
            ]
          },
          "options": {}
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [
          1744,
          800
        ],
        "id": "5938abc7-d2fa-44c5-9a06-4125025b5e79",
        "name": "결과 확인하기"
      },
      {
        "parameters": {
          "jsCode": "const item = $input.first();\nconst binaries = item.binary || {};\nconst body = item.json || {};\nconst outputs = [];\n\n// 🔥 추가: body에서 보증금과 임대인 정보 추출\nconst depositAmount = body.target_deposit || 0; // 만원 단위\nconst landlordName = body.target_landlord_name || '';\n\n// 등기부등본(file0) 분기\nif (binaries.file0) {\noutputs.push({\njson: {\n...body,\ndocType: 'registry',\ntarget_deposit: depositAmount,\ntarget_landlord_name: landlordName,\n},\nbinary: {\nfile: binaries.file0,\n}\n});\n}\n// 건축물대장(file1) 분기\nif (binaries.file1) {\noutputs.push({\njson: {\n...body,\ndocType: 'building',\ntarget_deposit: depositAmount,\ntarget_landlord_name: landlordName,\n},\nbinary: {\nfile: binaries.file1,\n}\n});\n}\n\nreturn outputs;"
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [
          432,
          672
        ],
        "id": "65feb944-cd56-4793-8e51-2c2840385f36",
        "name": "Code"
      },
      {
        "parameters": {},
        "type": "n8n-nodes-base.merge",
        "typeVersion": 3.2,
        "position": [
          1952,
          688
        ],
        "id": "e0e3de2e-1a48-49a8-98de-019450ed754c",
        "name": "Merge"
      },
      {
        "parameters": {
          "amount": 20
        },
        "type": "n8n-nodes-base.wait",
        "typeVersion": 1.1,
        "position": [
          1408,
          544
        ],
        "id": "34887290-7b0e-4583-8668-536d5af230f7",
        "name": "20초 대기",
        "webhookId": "97207f1d-c064-449d-bdeb-1dc25b5a6182"
      },
      {
        "parameters": {
          "amount": 20
        },
        "type": "n8n-nodes-base.wait",
        "typeVersion": 1.1,
        "position": [
          1408,
          800
        ],
        "id": "5a72f43e-fb29-4b95-9e9a-e6b111b8edf1",
        "name": "20초 대기1",
        "webhookId": "97207f1d-c064-449d-bdeb-1dc25b5a6182"
      },
      {
        "parameters": {
          "jsCode": "const items = $input.all();\nconst output = [];\n\n// LLM_Output_Parser_V2에서 받은 첫 번째 아이템을 사용\nconst firstItem = items[0].json;\n\n// 1. 필요한 필드 추출\nconst passIds = firstItem.pass_ids || []; \n// 'userId' 필드가 Code 노드의 입력으로 전달된다고 가정합니다.\nconst userId = firstItem.user_id || '61a8fc1d-67b0-45db-b913-602654b45c3c'; // 기본값 설정 (만약 입력에 없으면 이 값을 사용)\n\nfor (const id of passIds) {\n    output.push({\n        json: {\n            // WHERE 조건에 사용될 ID\n            id: id, \n            \n            // 업데이트할 컬럼과 값\n            verdict: 'PASS',\n            \n            // 🔥 추가된 필드: userId\n            user_id_filter: userId \n        }\n    });\n}\n\nreturn output;"
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [
          3472,
          816
        ],
        "id": "888a4269-01cf-400f-a66d-449f2637b752",
        "name": "pass 체크"
      },
      {
        "parameters": {
          "operation": "update",
          "tableId": "insurance",
          "filters": {
            "conditions": [
              {
                "keyName": "id",
                "condition": "eq",
                "keyValue": "={{ $json.id }}"
              }
            ]
          },
          "fieldsUi": {
            "fieldValues": [
              {
                "fieldId": "verdict",
                "fieldValue": "={{ $json.verdict }}"
              }
            ]
          }
        },
        "type": "n8n-nodes-base.supabase",
        "typeVersion": 1,
        "position": [
          3648,
          816
        ],
        "id": "8ef21aed-931f-4aec-b0b4-e59bc96d0639",
        "name": "Update a row",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "operation": "update",
          "tableId": "insurance",
          "filters": {
            "conditions": [
              {
                "keyName": "user_id",
                "condition": "eq",
                "keyValue": "61a8fc1d-67b0-45db-b913-602654b45c3c"
              }
            ]
          },
          "fieldsUi": {
            "fieldValues": [
              {
                "fieldId": "verdict",
                "fieldValue": "'REVIEW_REQUIRED'"
              }
            ]
          }
        },
        "type": "n8n-nodes-base.supabase",
        "typeVersion": 1,
        "position": [
          224,
          432
        ],
        "id": "c5689b46-71ba-4a3c-820e-3c076c36149c",
        "name": "Update a row1",
        "credentials": {
          "supabaseApi": {
            "id": "X9czmm4mQisWoNB2",
            "name": "Supabase account 3"
          }
        }
      },
      {
        "parameters": {
          "conditions": {
            "options": {
              "caseSensitive": true,
              "leftValue": "",
              "typeValidation": "strict",
              "version": 2
            },
            "conditions": [
              {
                "id": "3e924751-aaa3-449e-a725-0eba4b565797",
                "leftValue": "={{ $json.has_failures }}",
                "rightValue": true,
                "operator": {
                  "type": "boolean",
                  "operation": "equals"
                }
              }
            ],
            "combinator": "and"
          },
          "options": {}
        },
        "type": "n8n-nodes-base.if",
        "typeVersion": 2.2,
        "position": [
          3328,
          688
        ],
        "id": "c348edbe-301c-4472-bf0b-a5accc1625d9",
        "name": "If"
      },
      {
        "parameters": {
          "jsCode": "const failReasons = $json.fail_reasons || [];\nconst overallDecision = $json.overall_decision || '거절'; \n\n// 프론트엔드에 전달할 메시지를 생성합니다.\nconst message = `심사 결과, 다음 항목들이 거절 사유입니다.`;\nconst errorsList = failReasons.join('\\n- '); // 줄 바꿈으로 사유 구분\n\nreturn [{\n    json: {\n        status: overallDecision,\n        message: message,\n        errors: errorsList\n    }\n}];"
        },
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [
          3472,
          544
        ],
        "id": "fe822564-c58b-4a11-979b-b28eae51c185",
        "name": "FAIL"
      },
      {
        "parameters": {
          "mode": "expression",
          "numberOutputs": 2,
          "output": "={{ $json.docType === 'registry' ? 0 : 1 }}"
        },
        "type": "n8n-nodes-base.switch",
        "typeVersion": 3.2,
        "position": [
          608,
          672
        ],
        "id": "12ede2a5-83f5-4fa9-8daa-9d9df947e9f0",
        "name": "Switch4"
      },
      {
        "parameters": {
          "content": "## 보증보험 확인\n### Request Body:\n```json\n{\n  \"actionType\": \"checkInsurance\",\n  \"file\": [등기부등본, 건축물대장],\n  \"target_deposit\": 10000\n}\n```",
          "height": 240,
          "width": 464,
          "color": 4
        },
        "type": "n8n-nodes-base.stickyNote",
        "position": [
          -336,
          432
        ],
        "typeVersion": 1,
        "id": "e1f9e8ac-91b4-45f9-8fee-66afdf7a1d89",
        "name": "Sticky Note5"
      },
      {
        "parameters": {
          "content": "## 분석 리포트 내보내기\n### Request Body:\n```json\n{\n  \"actionType\": \"checkInsurance\",\n  \"fileKey\": \"doongzi/1764138404873\",\n  \"userId\": \"61a8fc1d-67b0-45db-b913-602654b45c3c\"\n}\n```",
          "height": 240,
          "width": 464,
          "color": 4
        },
        "type": "n8n-nodes-base.stickyNote",
        "position": [
          -336,
          960
        ],
        "typeVersion": 1,
        "id": "947a8b81-6849-4e2d-bfe7-dcbd00101592",
        "name": "Sticky Note6"
      },
      {
        "parameters": {
          "respondWith": "json",
          "responseBody": "={\n  \"success\": true\n}",
          "options": {}
        },
        "type": "n8n-nodes-base.respondToWebhook",
        "typeVersion": 1.4,
        "position": [
          3824,
          816
        ],
        "id": "76ecc8a6-3b3a-41b0-b5da-f12f0d5aab33",
        "name": "DB 저장 성공 응답"
      },
      {
        "parameters": {
          "respondWith": "json",
          "responseBody": "={\n  \"success\": false\n}",
          "options": {}
        },
        "type": "n8n-nodes-base.respondToWebhook",
        "typeVersion": 1.4,
        "position": [
          3648,
          544
        ],
        "id": "c8816f1f-0807-4562-badf-9ae3e68afcbd",
        "name": "DB 저장 실패 응답"
      }
    ],
    "pinData": {},
    "connections": {
      "CHECKLIST Webhook1": {
        "main": [
          [
            {
              "node": "Switch2",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Switch2": {
        "main": [
          [
            {
              "node": "Switch",
              "type": "main",
              "index": 0
            }
          ],
          [
            {
              "node": "사용자 체크 DB 가져오기",
              "type": "main",
              "index": 0
            }
          ],
          [
            {
              "node": "사용자 체크 DB 가져오기",
              "type": "main",
              "index": 0
            }
          ],
          [
            {
              "node": "Update a row1",
              "type": "main",
              "index": 0
            },
            {
              "node": "Code",
              "type": "main",
              "index": 0
            }
          ],
          [
            {
              "node": "분석 결과 DB 가져오기",
              "type": "main",
              "index": 0
            }
          ],
          [
            {
              "node": "분석 결과 DB 가져오기",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Switch3": {
        "main": [
          [
            {
              "node": "file upload",
              "type": "main",
              "index": 0
            }
          ],
          [
            {
              "node": "Email 전송",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Webhook": {
        "main": [
          [
            {
              "node": "Supabase S3",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Supabase S3": {
        "main": [
          [
            {
              "node": "Create a row1",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Webhook1": {
        "main": [
          [
            {
              "node": "Get File Key from DB",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Get File Key from DB": {
        "main": [
          [
            {
              "node": "Download from Storage",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "file upload": {
        "main": [
          [
            {
              "node": "DB에 저장",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "데이터 전처리": {
        "main": [
          [
            {
              "node": "HTML 생성",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "HTML to PDF": {
        "main": [
          [
            {
              "node": "PDF 다운로드",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "아파트매매DB": {
        "main": [
          [
            {
              "node": "깡통주택 계산 함수",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "단독다가구매매DB": {
        "main": [
          [
            {
              "node": "깡통주택 계산 함수",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "연립다세대매매DB": {
        "main": [
          [
            {
              "node": "깡통주택 계산 함수",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "오피스텔매매DB": {
        "main": [
          [
            {
              "node": "깡통주택 계산 함수",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Switch": {
        "main": [
          [
            {
              "node": "아파트매매DB",
              "type": "main",
              "index": 0
            }
          ],
          [
            {
              "node": "단독다가구매매DB",
              "type": "main",
              "index": 0
            }
          ],
          [
            {
              "node": "연립다세대매매DB",
              "type": "main",
              "index": 0
            }
          ],
          [
            {
              "node": "오피스텔매매DB",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "HTML 생성": {
        "main": [
          [
            {
              "node": "HTML to PDF",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "사용자 체크 DB 가져오기": {
        "main": [
          [
            {
              "node": "데이터 전처리",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "PDF 다운로드": {
        "main": [
          [
            {
              "node": "Switch3",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Email 전송": {
        "main": [
          [
            {
              "node": "메일 발송 성공 응답",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "DB에 저장": {
        "main": [
          [
            {
              "node": "PDF 링크 응답",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "깡통주택 계산 함수": {
        "main": [
          [
            {
              "node": "분석 결과 반환",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Send a message": {
        "main": [
          [
            {
              "node": "메일 발송 성공 응답1",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "HTML to PDF1": {
        "main": [
          [
            {
              "node": "PDF 다운로드1",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "PDF 다운로드1": {
        "main": [
          [
            {
              "node": "Switch1",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "분석 결과 DB 가져오기": {
        "main": [
          [
            {
              "node": "HTML to PDF1",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Switch1": {
        "main": [
          [
            {
              "node": "PDF 링크 응답1",
              "type": "main",
              "index": 0
            }
          ],
          [
            {
              "node": "Send a message",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "텍스트 정리": {
        "main": [
          [
            {
              "node": "ㅇㅇ시_ㅇㅇ구_ㅇㅇ로 로 추출",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "OCR 요청1": {
        "main": [
          [
            {
              "node": "20초 대기",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "JOB 상태 확인": {
        "main": [
          [
            {
              "node": "결과 확인하기1",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "결과 확인하기1": {
        "main": [
          [
            {
              "node": "Merge",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Create a row": {
        "main": [
          [
            {
              "node": "OCR 요청1",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Supabase S": {
        "main": [
          [
            {
              "node": "Create a row",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Basic LLM Chain": {
        "main": [
          [
            {
              "node": "LLM_Output_Parser_V2",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "보증보험_검증_규칙_정의1": {
        "main": [
          [
            {
              "node": "Basic LLM Chain",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "OpenAI Chat Model": {
        "ai_languageModel": [
          [
            {
              "node": "Basic LLM Chain",
              "type": "ai_languageModel",
              "index": 0
            }
          ]
        ]
      },
      "LLM_Output_Parser_V2": {
        "main": [
          [
            {
              "node": "If",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "주소로_가격_조회": {
        "main": [
          [
            {
              "node": "보증보험_검증_규칙_정의1",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "ㅇㅇ시_ㅇㅇ구_ㅇㅇ로 로 추출": {
        "main": [
          [
            {
              "node": "주소로_가격_조회",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "OCR 요청": {
        "main": [
          [
            {
              "node": "20초 대기1",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Create a row2": {
        "main": [
          [
            {
              "node": "OCR 요청",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Supabase S1": {
        "main": [
          [
            {
              "node": "Create a row2",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "JOB 상태 확인1": {
        "main": [
          [
            {
              "node": "결과 확인하기",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "결과 확인하기": {
        "main": [
          [
            {
              "node": "Merge",
              "type": "main",
              "index": 1
            }
          ]
        ]
      },
      "Code": {
        "main": [
          [
            {
              "node": "Switch4",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Merge": {
        "main": [
          [
            {
              "node": "텍스트 정리",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "20초 대기": {
        "main": [
          [
            {
              "node": "JOB 상태 확인",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "20초 대기1": {
        "main": [
          [
            {
              "node": "JOB 상태 확인1",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "pass 체크": {
        "main": [
          [
            {
              "node": "Update a row",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Update a row1": {
        "main": [
          [
            {
              "node": "Code",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "If": {
        "main": [
          [
            {
              "node": "FAIL",
              "type": "main",
              "index": 0
            }
          ],
          [
            {
              "node": "pass 체크",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Switch4": {
        "main": [
          [
            {
              "node": "Supabase S",
              "type": "main",
              "index": 0
            }
          ],
          [
            {
              "node": "Supabase S1",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Update a row": {
        "main": [
          [
            {
              "node": "DB 저장 성공 응답",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "FAIL": {
        "main": [
          [
            {
              "node": "DB 저장 실패 응답",
              "type": "main",
              "index": 0
            }
          ]
        ]
      }
    },
    "active": true,
    "settings": {
      "executionOrder": "v1"
    },
    "versionId": "8c3529a6-f2f6-4a25-961b-751bb04570d0",
    "meta": {
      "templateCredsSetupCompleted": true,
      "instanceId": "5f88ed242640bcdbf29cbeff7ee373d030f91def272711de4395602c1a416b9a"
    },
    "id": "PgG453Pi1Iq21ltU",
    "tags": []
  }


{
  "nodes": [
    {
      "parameters": {
        "options": {
          "temperature": 0.1
        }
      },
      "id": "0628f714-0ed2-40e6-a1f6-053f7bf105a6",
      "name": "OpenAI Chat Model1",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1,
      "position": [
        880,
        16
      ],
      "credentials": {
        "openAiApi": {
          "id": "rrOnDMTVsJW4E2xc",
          "name": "OpenAi account 2"
        }
      }
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.final_prompt }}\n\n{{ $json.target_schema_json }}\n\ncontract_date와 report_date는 발견하지 못했을 경우 2025-11-27으로 설정해줘."
      },
      "id": "4a6e0b21-fb27-41c5-8acc-65d4c9bcfed6",
      "name": "LLM 계약서 분석1",
      "type": "@n8n/n8n-nodes-langchain.chainLlm",
      "typeVersion": 1.4,
      "position": [
        880,
        -176
      ]
    },
    {
      "parameters": {
        "jsCode": "// 1. 이전 노드(OCR 결과)에서 텍스트 추출\nconst inputItem = $input.first();\n// HTTP Request 결과가 JSON의 특정 필드에 있을 수도, 통째로 텍스트일 수도 있음 대응\nlet rawText = inputItem.json.data || inputItem.json.body || inputItem.json;\n\n// 만약 객체가 들어왔다면 문자열로 변환 (안전장치)\nif (typeof rawText === 'object') {\n    rawText = JSON.stringify(rawText);\n}\n\n// 2. 텍스트 정제 (토큰 절약 및 LLM 인식률 향상)\nconst cleanText = String(rawText || '')\n    .replace(/\\r/g, '')             // 윈도우 스타일 줄바꿈 기호 제거\n    .replace(/\\n{3,}/g, '\\n\\n')     // 3줄 이상의 공백은 2줄로 축소 (문단 구분을 위해 2줄은 유지)\n    .replace(/[ \\t]{2,}/g, ' ')     // 2칸 이상의 스페이스바/탭은 1칸으로 축소\n    .trim()\n    .slice(0, 50000);               // (중요) 약 1.5만 토큰 정도로 길이 제한 (비용 폭탄 방지)\n\n// 3. Webhook에서 원본 메타데이터(doc_type 등) 가져오기\n// 중간 노드(OCR 등)를 거치면서 doc_type이 사라졌을 수 있으므로 Webhook 노드를 직접 참조\nlet docType = '임대차계약서'; // 기본값\ntry {\n    const webhookData = $('Webhook').first().json.body;\n    if (webhookData && webhookData.doc_type) {\n        docType = webhookData.doc_type;\n    }\n} catch (e) {\n    // Webhook 노드를 찾지 못하거나 데이터가 없는 경우 무시\n}\n\nreturn {\n    json: {\n        contract_text: cleanText,  // 정제된 텍스트\n        doc_type: docType,         // 문서 타입 (다음 노드에서 프롬프트 결정용)\n        text_length: cleanText.length\n    }\n};"
      },
      "id": "bf7a7b24-e13f-49f6-8ee9-782fe760e931",
      "name": "텍스트 정리",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        448,
        -176
      ]
    },
    {
      "parameters": {
        "jsCode": "// 1. 입력 데이터 가져오기 (이전 노드 '텍스트 정리'의 출력값)\nconst inputData = $input.first().json;\nconst contractText = inputData.contract_text || \"\";\n// doc_type이 혹시 없으면 기본값으로 '임대차계약서' 설정\nconst docType = inputData.doc_type || \"임대차계약서\"; \n\n// 2. 문서별 템플릿 정의 (Prompt & Schema)\nconst templates = {\n    \"임대차계약서\": {\n        role: \"당신은 20년 경력의 '주택임대차보호법' 전문 부동산 권리 분석가입니다.\",\n        goal: \"임차인의 보증금을 지키기 위해 계약서 내의 독소조항, 불리한 특약, 누락된 필수 조항을 찾아내십시오.\",\n        checkpoints: [\n            \"수선의무의 주체 (임대인 부담 원칙 위반 여부)\",\n            \"계약 해지 조건 및 과도한 위약금 설정 여부\",\n            \"임대차 보증금 반환 지연 시 이자 지급 조항 존재 여부\",\n            \"묵시적 갱신 배제 등 임차인에게 불리한 특약 사항\"\n        ],\n        // Output Parser용 스키마\n        outputSchema: {\n            type: \"object\",\n            properties: {\n                summary: { type: \"string\", description: \"계약서 전체 총평 (300자 이내)\" },\n                risk_level: { type: \"string\", enum: [\"safe\", \"caution\", \"danger\"], description: \"위험도 등급\" },\n                risk_items: {\n                    type: \"array\",\n                    items: {\n                        type: \"object\",\n                        properties: {\n                            clause: { type: \"string\", description: \"문제가 되는 조항 원문\" },\n                            reason: { type: \"string\", description: \"임차인에게 불리한 법적/현실적 이유\" },\n                            solution: { type: \"string\", description: \"수정 제안 또는 특약 추가 문구\" }\n                        }\n                    }\n                },\n                schedule: {\n                    type: \"object\",\n                    properties: {\n                        contract_date: { type: \"string\", description: \"계약일 (YYYY-MM-DD)\" },\n                        move_in_date: { type: \"string\", description: \"잔금/입주 예정일\" },\n                        report_date: { type: \"string\", description: \"확정일자 신고 추천일\" }\n                    }\n                }\n            },\n            required: [\"summary\", \"risk_level\", \"risk_items\"]\n        }\n    },\n    \"건축물대장\": {\n        role: \"당신은 건축물 인허가 및 불법 건축물 단속을 담당했던 공무원 출신 전문가입니다.\",\n        goal: \"건축물대장을 분석하여 전세보증보험 가입 불가 사유나 전입신고 불가능한 요소를 찾아내십시오.\",\n        checkpoints: [\n            \"상단 '위반건축물' 표기 여부 (노란색 딱지)\",\n            \"주용도가 '주택'이 아닌 '근린생활시설', '고시원' 등으로 되어 있는지 확인\",\n            \"불법 쪼개기(가구수 증가) 의심 정황\",\n            \"무단 증축 및 용도 변경 내역\"\n        ],\n        outputSchema: {\n            type: \"object\",\n            properties: {\n                summary: { type: \"string\", description: \"건축물대장 분석 총평\" },\n                is_violation: { type: \"boolean\", description: \"위반건축물 등재 여부\" },\n                primary_usage: { type: \"string\", description: \"건축물의 주 용도 (예: 다세대주택, 근린생활시설)\" },\n                risk_factors: {\n                    type: \"array\",\n                    items: { type: \"string\", description: \"발견된 위험 요소 설명\" }\n                }\n            },\n            required: [\"summary\", \"is_violation\", \"risk_factors\"]\n        }\n    },\n    \"등기부등본\": {\n        role: \"당신은 은행에서 전세자금대출 심사를 담당하는 권리분석 심사역입니다.\",\n        goal: \"등기부등본의 '갑구(소유권)'와 '을구(소유권 이외의 권리)'를 분석하여 경매 발생 시 보증금 전액 회수 가능성을 판단하십시오.\",\n        checkpoints: [\n            \"소유자 정보 일치 여부 및 신탁 등기 여부 (신탁인 경우 위험)\",\n            \"선순위 근저당권 설정 금액 및 채권최고액 확인\",\n            \"가압류, 압류, 가처분, 경매개시결정 등기 존재 여부\",\n            \"임차권등기명령 기재 여부 (기존 세입자가 보증금을 못 받은 흔적)\"\n        ],\n        outputSchema: {\n            type: \"object\",\n            properties: {\n                summary: { type: \"string\", description: \"권리 관계 요약\" },\n                total_debt_amount: { type: \"string\", description: \"선순위 채권최고액 합계 (단위 포함)\" },\n                safe_to_contract: { type: \"string\", enum: [\"yes\", \"consult_needed\", \"no\"], description: \"계약 안전 여부 판단\" },\n                owner_names: { type: \"array\", items: { type: \"string\" }, description: \"소유자 명단\" },\n                risk_factors: {\n                    type: \"array\",\n                    items: { type: \"string\", description: \"권리 분석 상 위험 요소\" }\n                }\n            },\n            required: [\"summary\", \"safe_to_contract\", \"total_debt_amount\"]\n        }\n    }\n};\n\n// 3. 템플릿 선택 (매칭 안되면 기본값 사용)\nconst selectedTemplate = templates[docType] || templates[\"임대차계약서\"];\n\n// 4. 최종 프롬프트 조합 (LLM에게 전달할 문자열)\n// *주의: 텍스트 내에 JSON을 깨뜨릴 수 있는 문자(백틱 등)가 있을 수 있으므로 구분자를 명확히 합니다.\nconst finalPrompt = `\n# ROLE\n${selectedTemplate.role}\n\n# GOAL\n${selectedTemplate.goal}\n\n# CHECKPOINTS (집중 분석 항목)\n${selectedTemplate.checkpoints.map((pt, i) => `${i+1}. ${pt}`).join('\\n')}\n\n# INPUT TEXT (분석 대상 문서)\n\"\"\"\n${contractText}\n\"\"\"\n\n# INSTRUCTION\n1. 위 'INPUT TEXT'를 꼼꼼히 읽고 'CHECKPOINTS'를 중심으로 분석하세요.\n2. 결과는 반드시 연결된 Output Parser가 요구하는 JSON 형식으로만 작성하세요.\n3. 마크다운이나 추가 설명 없이 순수 JSON 데이터만 출력하는 것이 가장 중요합니다.\n`;\n\n// 5. 결과 반환\nreturn {\n    json: {\n        ...inputData, // 이전 데이터 보존\n        final_prompt: finalPrompt,\n        // Output Parser 노드 설정의 'Json Schema' 필드에 이 값을 연결해야 합니다.\n        target_schema_json: JSON.stringify(selectedTemplate.outputSchema)\n    }\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        624,
        -176
      ],
      "id": "38da8283-c589-412b-99b9-2752c0d9c52c",
      "name": "프롬프트 생성기1"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}",
        "options": {}
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.4,
      "position": [
        1712,
        -176
      ],
      "id": "36940a29-34c9-4434-adcb-d19574649711",
      "name": "분석 완료 응답"
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "scan",
        "responseMode": "responseNode",
        "options": {
          "binaryPropertyName": "file"
        }
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [
        -912,
        256
      ],
      "id": "d158bc8b-fa1e-4b06-b0fe-3a646f1b545e",
      "name": "Webhook",
      "webhookId": "1074d703-9f6c-42ab-9fa5-f7fd33bb87e6"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.pdf.co/v1/pdf/convert/to/text",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "url",
              "value": "=https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/public/{{ $('[S3] 사용자 파일 적재').item.json.Key }}"
            },
            {
              "name": "lang",
              "value": "kor"
            },
            {
              "name": "inline",
              "value": "true"
            },
            {
              "name": "async",
              "value": "true"
            }
          ]
        },
        "options": {
          "timeout": 120000
        }
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -224,
        -176
      ],
      "id": "d74f03fe-7e23-47f0-8714-6c23a4e12c78",
      "name": "PDF to Text (OCR)"
    },
    {
      "parameters": {},
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        -64,
        -176
      ],
      "id": "88e5f893-e48b-4c38-b744-4824c61c4a81",
      "name": "Wait",
      "webhookId": "d90c51ed-aec3-4c31-ad08-df4f5dd569bc"
    },
    {
      "parameters": {
        "url": "={{ $json.url }}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "jobId",
              "value": "={{ $json.jobId }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        256,
        -176
      ],
      "id": "cccd3626-e823-4dee-907c-8701f8367977",
      "name": "결과 확인하기"
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.body.actionType }}",
                    "rightValue": "analyzeDocuments",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    },
                    "id": "44f67fe1-fe49-4775-ab12-af54fb978637"
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "계약서 정밀 분석"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict",
                  "version": 2
                },
                "conditions": [
                  {
                    "id": "de31e453-32db-4842-885c-a65b1578119b",
                    "leftValue": "={{ $json.body.actionType }}",
                    "rightValue": "scanDocuments",
                    "operator": {
                      "type": "string",
                      "operation": "equals",
                      "name": "filter.operator.equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "둥지 스캔하기"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3.2,
      "position": [
        -752,
        256
      ],
      "id": "f8e6609a-7a02-4f5f-9fcd-b4ab82304846",
      "name": "Switch"
    },
    {
      "parameters": {
        "jsCode": "// 1. 입력 데이터 수신\nconst inputItem = $input.first().json;\n\n// 2. 데이터 파싱 (핵심: text 문자열을 JSON 객체로 변환)\nlet analysisData = {};\n\n// 문자열인 경우 JSON.parse 실행 (마크다운 코드블럭 ```json 제거 안전장치 포함)\nif (typeof inputItem.text === 'string') {\n    try {\n        const cleanJson = inputItem.text.replace(/```json/gi, '').replace(/```/g, '').trim();\n        analysisData = JSON.parse(cleanJson);\n    } catch (e) {\n        // 파싱 실패 시 에러 내용 표시\n        analysisData = { \n            summary: \"데이터를 분석하는 데 실패했습니다. 원본 형식을 확인해주세요.\", \n            risk_items: [] \n        };\n    }\n} else if (typeof inputItem.text === 'object') {\n    // 이미 객체라면 그대로 사용\n    analysisData = inputItem.text;\n} else {\n    // text 필드가 없는 경우 (Analysis 키 확인 등 Fallback)\n    analysisData = inputItem.analysis || {};\n}\n\n// 3. 변수 매핑 (LLM 분석 결과 -> 리포트 변수)\nconst summary = analysisData.summary || \"요약 정보가 없습니다.\";\nconst riskLevel = analysisData.risk_level || \"safe\"; \nconst riskItems = analysisData.risk_items || [];\nconst schedule = analysisData.schedule || {};\n\n// 문서 종류 (데이터에 없으면 기본값)\nconst docType = inputItem.doc_type || \"임대차계약서\"; \n\n// 4. 스타일링 로직 (위험도에 따른 색상 변경)\nlet badgeColor = \"#4CAF50\"; // Green (Safe)\nlet badgeText = \"안전한 둥지\";\n\nif (riskLevel === 'caution') { \n    badgeColor = \"#FF9800\"; // Orange\n    badgeText = \"주의가 필요해요\"; \n} else if (riskLevel === 'danger') { \n    badgeColor = \"#F44336\"; // Red\n    badgeText = \"위험 요소 발견!\"; \n}\n\n// 5. 현재 시간 및 파일명 생성 (DB 저장용)\nconst now = new Date();\nconst kstOffset = 9 * 60 * 60 * 1000; \nconst kstDate = new Date(now.getTime() + kstOffset);\nconst timeString = kstDate.toISOString().slice(0,19).replace(/[-T:]/g,\"\");\nconst fileIdentifier = inputItem.userId || \"guest\";\nconst finalFileName = `${fileIdentifier}_${docType}_${timeString}_report.pdf`;\n\n// 6. HTML 템플릿 조립 (데이터 동적 바인딩)\nconst htmlContent = `\n<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n<meta charset=\"UTF-8\">\n<style>\n  @import url('[https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css](https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css)');\n  body { font-family: 'Pretendard', sans-serif; background-color: #f9f9f9; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }\n  .header { text-align: center; margin-bottom: 40px; }\n  .brand-logo { font-size: 24px; font-weight: bold; color: #2c3e50; }\n  .brand-highlight { color: #8CB800; }\n  \n  /* 카드 스타일 */\n  .card { background: white; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 30px; margin-bottom: 25px; border: 1px solid #eee; }\n  \n  /* 상단 요약 섹션 */\n  .title-section { text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 20px; }\n  .report-badge { background-color: ${badgeColor}; color: white; padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: bold; display: inline-block; margin-bottom: 10px; }\n  h1 { font-size: 28px; margin: 10px 0; }\n  .summary-text { color: #555; font-size: 16px; line-height: 1.6; word-break: keep-all; }\n  \n  /* 리스크 아이템 스타일 */\n  .risk-card { border-left: 5px solid #FF5252; background-color: #FFFDFD; }\n  .risk-header { display: flex; align-items: center; margin-bottom: 10px; }\n  .risk-icon { font-size: 20px; margin-right: 8px; }\n  .risk-title { color: #D32F2F; font-weight: bold; font-size: 18px; }\n  \n  .risk-content-box { background: #fff; border: 1px solid #ffcdd2; border-radius: 8px; padding: 15px; margin-top: 10px; }\n  .label { display: inline-block; font-size: 12px; font-weight: bold; color: #777; width: 50px; vertical-align: top; }\n  .content-text { display: inline-block; font-size: 14px; color: #333; width: calc(100% - 60px); line-height: 1.5; margin-bottom: 8px; word-break: keep-all; }\n  .solution-box { background-color: #E8F5E9; padding: 10px; border-radius: 6px; margin-top: 5px; color: #2E7D32; font-size: 14px; font-weight: bold; }\n\n  /* 스케줄 박스 */\n  .schedule-box { display: flex; justify-content: space-around; background: #F9FBE7; padding: 15px; border-radius: 12px; margin-top: 20px; text-align: center;}\n  .date-item { width: 30%; }\n  .date-label { display: block; font-size: 12px; color: #777; margin-bottom: 5px; }\n  .date-value { display: block; font-size: 15px; font-weight: bold; color: #33691E; }\n\n  .footer { text-align: center; font-size: 12px; color: #aaa; margin-top: 50px; line-height: 1.6; }\n</style>\n</head>\n<body>\n  <div class=\"header\">\n    <div class=\"brand-logo\">🏠 둥지 <span class=\"brand-highlight\">AI 리포트</span></div>\n  </div>\n  \n  <div class=\"card\">\n    <div class=\"title-section\">\n      <span class=\"report-badge\">${badgeText}</span>\n      <h1>${docType} 분석 결과</h1>\n      <p class=\"summary-text\">${summary}</p>\n    </div>\n    \n    <div class=\"schedule-box\">\n      <div class=\"date-item\">\n        <span class=\"date-label\">계약 체결일</span>\n        <span class=\"date-value\">${schedule.contract_date || '-'}</span>\n      </div>\n      <div class=\"date-item\">\n        <span class=\"date-label\">입주 예정일</span>\n        <span class=\"date-value\">${schedule.move_in_date || '-'}</span>\n      </div>\n      <div class=\"date-item\">\n        <span class=\"date-label\">분석 일자</span>\n        <span class=\"date-value\">${schedule.report_date || '-'}</span>\n      </div>\n    </div>\n  </div>\n\n  ${riskItems.length > 0 ? `\n    <h2 style=\"margin: 30px 0 15px 10px; color: #333;\">⚠️ 발견된 위험 요소 (${riskItems.length}건)</h2>\n    ${riskItems.map((item, index) => `\n      <div class=\"card risk-card\">\n        <div class=\"risk-header\">\n           <span class=\"risk-title\">Issue #${index + 1}</span>\n        </div>\n        \n        <div class=\"risk-content-box\">\n           <div>\n             <span class=\"label\">조항</span>\n             <span class=\"content-text\" style=\"color: #d32f2f;\">\"${item.clause}\"</span>\n           </div>\n           <div style=\"margin-top:8px;\">\n             <span class=\"label\">이유</span>\n             <span class=\"content-text\">${item.reason}</span>\n           </div>\n           <div class=\"solution-box\">\n             💡 해결방안: ${item.solution}\n           </div>\n        </div>\n      </div>\n    `).join('')}\n  ` : `\n    <div class=\"card\" style=\"text-align:center; padding: 40px;\">\n       <h3 style=\"color:#4CAF50;\">✅ 특이사항이 발견되지 않았습니다.</h3>\n       <p style=\"color:#666;\">계약 내용이 안전한 것으로 분석됩니다.</p>\n    </div>\n  `}\n\n  <div class=\"footer\">\n    본 리포트는 AI 자동 분석 결과이며 법적 효력은 없습니다.<br>\n    중요한 계약 전 반드시 공인중개사나 변호사와 상담하시기 바랍니다.<br>\n    © DOONGZI Service\n  </div>\n</body>\n</html>\n`;\n\nreturn {\n  json: {\n    html_content: htmlContent,\n    file_name: finalFileName,\n    user_id: inputItem.userId \n  }\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1344,
        -176
      ],
      "id": "1b211e6c-ad95-4c5b-a0a6-99e3e539ade6",
      "name": "HTML 생성하기"
    },
    {
      "parameters": {
        "jsCode": "// 1. 데이터 가져오기\nconst inputItem = $input.first().json;\n\n// [핵심] LLM 결과가 'text' 필드에 문자열로 들어오는 경우 파싱\nlet rawOutput = inputItem.text || inputItem.output || inputItem.json || inputItem;\nlet llmResult = {};\n\n// 문자열이라면 JSON으로 파싱 (껍질 깨기)\nif (typeof rawOutput === 'string') {\n    try {\n        // 1. 마크다운 코드블럭 제거 (```json ... ```)\n        let cleaned = rawOutput.replace(/```json/gi, '').replace(/```/g, '').trim();\n        \n        // 2. 혹시 앞뒤에 잡다한 텍스트가 붙어있을 경우, 첫 '{'와 마지막 '}' 사이만 추출\n        const firstBrace = cleaned.indexOf('{');\n        const lastBrace = cleaned.lastIndexOf('}');\n        if (firstBrace !== -1 && lastBrace !== -1) {\n            cleaned = cleaned.substring(firstBrace, lastBrace + 1);\n        }\n        \n        llmResult = JSON.parse(cleaned);\n    } catch (e) {\n        // 파싱 실패 시 에러 로그 생성\n        llmResult = { \n            summary: \"데이터 파싱 중 오류가 발생했습니다. (형식 불일치)\", \n            risk_level: \"safe\",\n            doc_type: \"분석 실패\"\n        };\n    }\n} else {\n    // 이미 객체라면 그대로 사용\n    llmResult = rawOutput;\n}\n\n// 2. 문서 타입 식별 (LLM 결과 > 이전 노드 데이터 > 기본값)\nlet docType = llmResult.doc_type || inputItem.doc_type;\nif (!docType) {\n    try {\n         // 이전 노드들 중 '텍스트 정리'라는 이름의 노드에서 doc_type을 찾음\n         docType = $('텍스트 정리').first().json.doc_type;\n    } catch(e) {\n         docType = \"임대차계약서\";\n    }\n}\n\n// 3. 표준 데이터 포맷 초기화 (HTML 생성기가 이 구조를 사용함)\nlet standardData = {\n    doc_type: docType,\n    risk_grade: \"low\", // safe, low, medium, high\n    summary: llmResult.summary || \"요약 정보가 없습니다.\",\n    issues: [], // [{ title, description, solution, severity }]\n    safes: [],  // [{ title, description }]\n    schedule: llmResult.schedule || {} \n};\n\n// =======================================================\n// [A] 임대차계약서 매핑\n// =======================================================\nif (docType.includes(\"계약서\")) {\n    if (llmResult.risk_level === 'caution') standardData.risk_grade = \"medium\";\n    if (llmResult.risk_level === 'danger') standardData.risk_grade = \"high\";\n\n    if (Array.isArray(llmResult.risk_items)) {\n        standardData.issues = llmResult.risk_items.map(r => ({\n            title: \"⚠️ 주의 조항\",\n            description: `[조항] ${r.clause}\\n[이유] ${r.reason}`,\n            solution: r.solution || \"전문가 상담 필요\",\n            severity: standardData.risk_grade === 'high' ? 'danger' : 'warning'\n        }));\n    }\n} \n// =======================================================\n// [B] 건축물대장 매핑\n// =======================================================\nelse if (docType.includes(\"건축물\")) {\n    if (llmResult.is_violation) {\n        standardData.risk_grade = \"high\";\n        standardData.issues.push({\n            title: \"⛔ 위반건축물 등재됨\",\n            description: \"건축물대장에 '위반건축물' 표기가 있습니다.\",\n            solution: \"임대인에게 위반 사항 해소 여부를 확인하세요.\",\n            severity: \"danger\"\n        });\n    }\n\n    if (Array.isArray(llmResult.risk_factors)) {\n        llmResult.risk_factors.forEach(factor => {\n            standardData.issues.push({\n                title: \"체크 필요\",\n                description: factor, \n                solution: \"현장 확인 필요\",\n                severity: \"warning\"\n            });\n            if (standardData.risk_grade === 'low') standardData.risk_grade = \"medium\";\n        });\n    }\n    \n    if (!llmResult.is_violation && standardData.issues.length === 0) {\n        standardData.safes.push({\n            title: \"정상 건축물\",\n            description: \"위반 사항이 발견되지 않았습니다.\"\n        });\n    }\n}\n// =======================================================\n// [C] 등기부등본 매핑\n// =======================================================\nelse if (docType.includes(\"등기부\")) {\n    const safeStatus = llmResult.safe_to_contract || \"yes\";\n    if (safeStatus === \"no\") standardData.risk_grade = \"high\";\n    else if (safeStatus === \"consult_needed\") standardData.risk_grade = \"medium\";\n\n    if (llmResult.total_debt_amount && llmResult.total_debt_amount !== \"0원\") {\n        standardData.issues.push({\n            title: \"💰 선순위 채권\",\n            description: `채권최고액 합계: ${llmResult.total_debt_amount}`,\n            solution: \"시세 대비 부채 비율 확인 필수\",\n            severity: \"warning\"\n        });\n    }\n\n    if (Array.isArray(llmResult.risk_factors)) {\n        llmResult.risk_factors.forEach(factor => {\n            standardData.issues.push({\n                title: \"권리 관계 주의\",\n                description: factor,\n                solution: \"상세 등기 확인 필요\",\n                severity: \"warning\"\n            });\n        });\n    }\n    \n    if (Array.isArray(llmResult.owner_names)) {\n        standardData.safes.push({\n            title: \"소유자\",\n            description: llmResult.owner_names.join(\", \")\n        });\n    }\n}\n\n// 4. 결과 반환 (여기서 만든 'analysis' 객체를 HTML 노드가 사용합니다)\nreturn {\n    json: {\n        ...inputItem, \n        analysis: standardData \n    }\n};"
      },
      "id": "aeb27772-7afa-481f-bee1-d532fe560a5a",
      "name": "후처리1",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1184,
        -176
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/doongzi/{{ $now.valueOf() }}",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "supabaseApi",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "={{ $binary.file0.mimeType }}"
            }
          ]
        },
        "sendBody": true,
        "contentType": "binaryData",
        "inputDataFieldName": "file0",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -592,
        -176
      ],
      "id": "2f3688c8-8f2a-4bf0-9fd1-34de9cd4aa78",
      "name": "[S3] 사용자 파일 적재",
      "credentials": {
        "httpHeaderAuth": {
          "id": "kFiPmSKoN1IFuLKu",
          "name": "Header Auth account"
        },
        "supabaseApi": {
          "id": "qlMJpvjZT1ckjAaE",
          "name": "Supabase account 4"
        }
      }
    },
    {
      "parameters": {
        "tableId": "documentfile",
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "file_key",
              "fieldValue": "={{ $json.Key }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        -400,
        -176
      ],
      "id": "4bd109b8-6a63-430c-8f8d-b18ae1e5bd41",
      "name": "[DB] 파일엔드포인트 적재",
      "credentials": {
        "supabaseApi": {
          "id": "qlMJpvjZT1ckjAaE",
          "name": "Supabase account 4"
        }
      }
    },
    {
      "parameters": {
        "url": "https://api.pdf.co/v1/job/check",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "jobid",
              "value": "={{ $json.jobId }}"
            },
            {
              "name": "x-api-key",
              "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
            }
          ]
        },
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {}
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        96,
        -176
      ],
      "id": "da3b04f5-400e-47e1-8d6a-02062608987c",
      "name": "JOB 상태 확인"
    },
    {
      "parameters": {
        "content": "### 문서별로 다른 프롬프트 주입",
        "height": 192,
        "width": 272,
        "color": 4
      },
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        576,
        -240
      ],
      "id": "0d1c995f-de27-40bd-8189-cecdf8116beb",
      "name": "Sticky Note"
    },
    {
      "parameters": {
        "jsCode": "// 체크리스트 데이터 정의 (PRD 기반)\nconst checklistCategories = [\n  {\n    id: 'before',\n    name: '계약 전',\n    items: [\n      {id: '1', title: '매매가격 확인하기', keywords: ['매매', '시세', '가격', '실거래가', '깡통전세'], required: true},\n      {id: '2', title: '보증보험 가입 가능 여부 확인하기', keywords: ['보증보험', 'HUG', 'SGI', '전세보증', '가입'], required: true},\n      {id: '3', title: '선순위 권리관계 확인하기', keywords: ['선순위', '권리', '가등기', '가압류', '담보권', '근저당', '전세권'], required: true},\n      {id: '4', title: '집과 소유자 관련된 돈문제가 있는지 확인하기', keywords: ['가압류', '압류', '강제경매', '세금', '체납'], required: true},\n      {id: '5', title: '단독/다가구 주택이면 필요한 추가 확인하기', keywords: ['다가구', '세입자', '전입', '선순위', '전입세대'], required: false},\n      {id: '6', title: '무허가·불법 건축물 여부 확인하기', keywords: ['무허가', '불법', '건축물', '용도', '위반', '건축물대장'], required: true}\n    ]\n  },\n  {\n    id: 'during',\n    name: '계약 중',\n    items: [\n      {id: '7', title: '이 집에 소유권은 누구에게 있는지 확인하기', keywords: ['소유권', '소유자', '등기', '공유', '지분'], required: true},\n      {id: '8', title: '신탁등기 상태 확인하기', keywords: ['신탁', '신탁등기', '신탁회사', '위탁자'], required: true},\n      {id: '9', title: '임대인 확인하기', keywords: ['임대인', '신분증', '본인확인'], required: true},\n      {id: '10', title: '대리인 계약한다면? 위임장 확인하기', keywords: ['대리인', '위임장', '인감증명서', '위임'], required: false},\n      {id: '11', title: '공인중개사 확인하기', keywords: ['공인중개사', '중개', '자격증', '등록번호'], required: true},\n      {id: '12', title: '미납국세·임금채권 확인하기(선택)', keywords: ['미납', '국세', '임금', '세금', '체납'], required: true},\n      {id: '13', title: '계약 내용 꼼꼼히 확인하기', keywords: ['계약서', '보증금', '월세', '임대차', '계약기간', '임대인', '임차인'], required: true},\n      {id: '14', title: '특약사항 위험 요소 확인하기', keywords: ['특약', '특약사항', '조건', '면책', '수선'], required: true}\n    ]\n  },\n  {\n    id: 'after',\n    name: '계약 후',\n    items: [\n      {id: '15', title: '잔금 지급 전 : 권리변동, 이중계약, 특약 불이행 점검하기', keywords: ['잔금', '권리변동', '이중계약', '특약', '등기'], required: true},\n      {id: '16', title: '주택 상태 확인 및 이사하기', keywords: ['주택', '하자', '상태', '이사', '공과금'], required: true},\n      {id: '17', title: '전입신고하여 대항력 확보하기', keywords: ['전입신고', '대항력', '주민센터', '전입'], required: true},\n      {id: '18', title: '임대차 신고제 대상인지 확인하기', keywords: ['임대차', '신고제', '대상', '보증금'], required: false},\n      {id: '19', title: '임대차 신고제 대상인 경우 신고하기', keywords: ['신고', '임대차신고', '계약신고'], required: false},\n      {id: '20', title: '확정일자 받기', keywords: ['확정일자', '우선변제권', '계약서'], required: true},\n      {id: '21', title: '(선택) 전세보증금 반환보증 가입', keywords: ['보증금', '반환보증', '보험', 'HUG', 'SGI'], required: false}\n    ]\n  }\n];\n\n// Flatten 및 JSON 문자열 생성\nconst checklistItems = [];\nlet checklistText = \"\";\n\nchecklistCategories.forEach(category => {\n  checklistText += `### [${category.name} 단계]\\n`;\n  \n  category.items.forEach(item => {\n    checklistItems.push({\n      id: item.id,\n      category: category.name,\n      description: item.title,\n      keywords: item.keywords,\n      required: item.required\n    });\n    \n    checklistText += `- (ID: ${item.id}) ${item.title} ${item.required ? '[필수]' : '[선택]'}\\n`;\n  });\n  checklistText += \"\\n\";\n});\n\n// 이전 노드 데이터 병합\nconst inputData = $input.first().json;\n\nreturn {\n  json: {\n    ...inputData,\n    checklistItems: checklistItems,\n    checklistText: checklistText,\n    totalItems: checklistItems.length\n  }\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        752,
        800
      ],
      "id": "aa3acae3-c3ea-4213-802a-9a1e2b4cd495",
      "name": "사전정의된 체크리스트항목"
    },
    {
      "parameters": {
        "jsCode": "// 문서별 분석 항목 정의\nconst documentAnalysisTemplates = {\n  \"임대차계약서\": {\n    name: \"독소조항 정밀 진단\",\n    checkPoints: [\n      \"수선의무 조항 (임대인 vs 임차인 부담)\",\n      \"계약 해지 조건 (위약금, 중도해지 가능성)\",\n      \"특약사항 (불리한 조건 포함 여부)\",\n      \"보증금 반환 시기 및 조건\",\n      \"월세 인상률 및 상한선\",\n      \"관리비 및 공과금 부담 주체\"\n    ],\n    riskCategories: [\n      {level: \"high\", description: \"임차인에게 매우 불리한 조항\"},\n      {level: \"medium\", description: \"협의가 필요한 조항\"},\n      {level: \"low\", description: \"일반적인 조항\"}\n    ]\n  },\n  \"건축물대장\": {\n    name: \"위반 건축물 여부 분석\",\n    checkPoints: [\n      \"건축물 용도 (주택 여부 확인)\",\n      \"위반건축물 표시 여부\",\n      \"건축물 동호수 일치 여부\",\n      \"무허가 건축물 여부\",\n      \"용도변경 이력\",\n      \"전입신고 가능 여부\"\n    ],\n    riskCategories: [\n      {level: \"high\", description: \"전입신고 불가능 위험\"},\n      {level: \"medium\", description: \"추가 확인 필요\"},\n      {level: \"low\", description: \"정상 건축물\"}\n    ]\n  },\n  \"등기부등본\": {\n    name: \"근저당 및 권리 분석\",\n    checkPoints: [\n      \"소유자 정보 (단독/공유 소유)\",\n      \"근저당 설정 내역 (채권최고액)\",\n      \"가압류/압류/가등기 여부\",\n      \"선순위 전세권 존재 여부\",\n      \"신탁등기 여부\",\n      \"경매/공매 진행 여부\"\n    ],\n    riskCategories: [\n      {level: \"high\", description: \"보증금 회수 위험\"},\n      {level: \"medium\", description: \"추가 조사 필요\"},\n      {level: \"low\", description: \"정상 권리 상태\"}\n    ]\n  }\n};\n\n// 이전 노드 데이터 병합\nconst inputData = $input.first().json;\n\nreturn {\n  json: {\n    ...inputData,\n    documentAnalysisTemplates: documentAnalysisTemplates,\n    analysisTemplatesJson: JSON.stringify(documentAnalysisTemplates, null, 2)\n  }\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        960,
        800
      ],
      "id": "0fcbcbda-f2c3-4e89-be17-7cb7193a12da",
      "name": "사전정의한_문서별분석항목"
    },
    {
      "parameters": {
        "jsCode": "// 1. 직전 노드(HTTP Request)의 결과 가져오기\nconst items = $input.all();\nconst inputItem = items[0]; // 첫 번째 아이템\n\nlet extractedText = '';\n\n// 2. 텍스트 데이터 추출 (HTTP Request 결과 처리)\nif (inputItem.json.data) {\n    // 일반적인 API 응답 형태\n    extractedText = inputItem.json.data;\n} else if (typeof inputItem.json === 'string') {\n    // 텍스트 파일 자체가 응답인 경우\n    extractedText = inputItem.json;\n} else {\n    // 그 외의 경우 (객체 등)\n    extractedText = $input.first().json.data;\n}\n\n// 3. 초기 설정 데이터 가져오기 (중요!)\n// HTTP Request를 거치며 userId 등이 사라졌으므로, '가짜 데이터(PDF URL)2' 노드에서 다시 가져옵니다.\nlet initialData = {};\ntry {\n    // '가짜 데이터(PDF URL)2' 노드의 첫 번째 실행 데이터를 참조\n    initialData = $('가짜 데이터(PDF URL)2').first().json;\n} catch (error) {\n    console.log(\"초기 데이터 노드를 찾을 수 없습니다. 기본값을 사용합니다.\");\n}\n\n// 4. 결과 반환\nreturn {\n    json: {\n        extractedText: extractedText,\n        // 오류가 나던 부분 수정 (file -> initialData, body -> initialData)\n        fileName: 'test_document.txt', \n        userId: initialData.userId || 1,\n        target_landlord_name: initialData.target_landlord_name || '',\n        target_deposit: initialData.target_deposit || 0,\n        timestamp: new Date().toISOString()\n    }\n};"
      },
      "id": "71b4f0cb-d0cb-4867-9c35-b83299c29784",
      "name": "텍스트 정리1",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        560,
        800
      ]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.pdf.co/v1/pdf/convert/to/text",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "url",
              "value": "=https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/public/{{ $('Supabase S3').item.json.Key }}"
            },
            {
              "name": "lang",
              "value": "kor"
            },
            {
              "name": "inline",
              "value": "true"
            },
            {
              "name": "async",
              "value": "true"
            }
          ]
        },
        "options": {
          "timeout": 300000
        }
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -144,
        800
      ],
      "id": "2e6b8e0b-9ca2-4ef2-86c7-80ef89794dfe",
      "name": "OCR 요청"
    },
    {
      "parameters": {
        "url": "https://api.pdf.co/v1/job/check",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "jobid",
              "value": "={{ $json.jobId }}"
            },
            {
              "name": "x-api-key",
              "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
            }
          ]
        },
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {}
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        192,
        800
      ],
      "id": "ea675704-3016-491e-86ee-6d2efc8313dc",
      "name": "JOB 상태 확인1"
    },
    {
      "parameters": {
        "tableId": "documentfile",
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "file_key",
              "fieldValue": "={{ $json.Key }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        -384,
        688
      ],
      "id": "3cb773dd-c0d0-428a-97fa-104bb9c37f10",
      "name": "Create a row1",
      "credentials": {
        "supabaseApi": {
          "id": "qlMJpvjZT1ckjAaE",
          "name": "Supabase account 4"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/doongzi/{{ $now.valueOf() }}",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "supabaseApi",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "={{ $binary.file0.mimeType }}"
            }
          ]
        },
        "sendBody": true,
        "contentType": "binaryData",
        "inputDataFieldName": "file0",
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -576,
        688
      ],
      "id": "d1250843-0964-4865-8bea-d73deba3cabe",
      "name": "Supabase S3",
      "credentials": {
        "httpHeaderAuth": {
          "id": "kFiPmSKoN1IFuLKu",
          "name": "Header Auth account"
        },
        "supabaseApi": {
          "id": "qlMJpvjZT1ckjAaE",
          "name": "Supabase account 4"
        }
      }
    },
    {
      "parameters": {
        "method": "PATCH",
        "url": "https://jrjqlhnsnwybffkiaknx.supabase.co/rest/v1/whethertocheck",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "supabaseApi",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            {
              "name": "user_id",
              "value": "eq.61a8fc1d-67b0-45db-b913-602654b45c3c"
            },
            {
              "name": "id",
              "value": "=in.{{ $json.target_ids }}"
            },
            {
              "name": "checked",
              "value": "eq.0"
            }
          ]
        },
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Prefer",
              "value": "return=representation"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "checked",
              "value": "1"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1968,
        848
      ],
      "id": "315cdd31-9e01-4dee-9f28-8a05536b7169",
      "name": "supabase boolean 수정",
      "alwaysOutputData": true,
      "credentials": {
        "supabaseApi": {
          "id": "qlMJpvjZT1ckjAaE",
          "name": "Supabase account 4"
        }
      },
      "onError": "continueErrorOutput"
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "=너는 부동산 계약의 숨겨진 위험을 찾아내는 '깐깐한 부동산 감사관(Strict Auditor)' AI 에이전트야. 사용자는 부동산 문서(등기부등본/건축물대장/임대차계약서)를 업로드했어.\n\n너는 외부 도구나 함수를 호출할 수 없다. 오직 너의 내부 지식과 아래 제공된 텍스트만을 바탕으로 직접 분석을 수행하고, 그 결과를 즉시 JSON으로 출력해야 한다.\n\n[너의 핵심 임무]\n\n제공된 [파일 내용]을 정밀 독해하여 문서 종류를 파악한다.\n\n[체크리스트 항목]과 [필수 검증 로직]을 기준으로 위험 요소를 직접 검증한다.\n\n중요: 사전 정의된 [체크리스트 항목]의 id를 정확히 매핑하여 결과에 출력해야 한다. (DB 업데이트용)\n\n분석 결과를 바탕으로 경고(WARNING)나 재검토(REVIEW_REQUIRED)가 필요한 부분을 찾아낸다.\n\n[분석 태도]\n\n절대로 위험이 감지되었는데 \"괜찮다\"고 하지 마세요.\n\n너의 목표는 단순한 내용 요약이 아니라, 사용자가 놓칠 수 있는 '독소조항'과 '권리 위험'을 찾아내어 경고(Warning)하는 것이야.\n\n'False Positive(위험한데 안전하다고 하는 것)'를 0%로 만드는 것이 너의 최우선 임무야.\n\n[필수 검증 로직 (Rule-based Logic)]\n너는 아래 기준을 마음속에 새기고 문서를 직접 분석해야 해:\n\n임대차계약서: \"모든 수선 비용 임차인 부담\", \"일방적 계약 해지\" 같은 독소조항이 있으면 무조건 WARNING.\n\n등기부등본: \"가압류\", \"가처분\", \"신탁등기\"가 포함되어 있거나, 채권최고액이 과도하면 REVIEW_REQUIRED.\n\n건축물대장: \"위반건축물\", \"무허가\" 표기가 보이면 전세사기 위험으로 간주하고 WARNING.\n\n[입력 파일 데이터]\n\n파일명: {{ $json.fileName }}\n\n사용자ID: {{ $json.userId }}\n\n파일 내용(Text): \"\"\" {{ $json.extractedText }} \"\"\"\n\n[체크리스트 항목 (ID 포함)] 형식: 'ID' : '체크리스트 내용'\nchecklist_map = {\n    '1': '매매가격 확인하기',\n    '2': '보증보험 가입 가능 여부 확인하기',\n    '3': '선순위 권리관계 확인하기',\n    '4': '집과 소유자 관련된 돈문제가 있는지 확인하기',\n    '5': '단독/다가구 주택이면 필요한 추가 확인하기',\n    '6': '무허가·불법 건축물 여부 확인하기',\n    '7': '이 집에 소유권은 누구에게 있는지 확인하기',\n    '8': '신탁등기 상태 확인하기',\n    '9': '임대인 확인하기',\n    '10': '대리인 계약한다면? 위임장 확인하기',\n    '11': '공인중개사 확인하기',\n    '12': '미납국세·임금채권 확인하기(선택)',\n    '13': '계약 내용 꼼꼼히 확인하기',\n    '14': '특약사항 위험 요소 확인하기',\n    '15': '잔금 지급 전 : 권리변동, 이중계약, 특약 불이행 점검하기',\n    '16': '주택 상태 확인 및 이사하기',\n    '17': '전입신고하여 대항력 확보하기',\n    '18': '임대차 신고제 대상인지 확인하기',\n    '19': '임대차 신고제 대상인 경우 신고하기',\n    '20': '확정일자 받기',\n    '21': '(선택) 전세보증금 반환보증 가입'\n}\n\n[작업 지시 사항]\n\n(문서 분류) 입력된 텍스트를 읽고 이것이 '임대차계약서', '등기부등본', '건축물대장' 중 무엇인지 스스로 판단해.\n\n(정밀 검증) 위 [체크리스트 항목] 하나하나를 [파일 내용]과 대조하여 만족 여부를 판단해.\n\n매우 중요: 입력된 체크리스트 항목 앞에 있는 **숫자(ID)**를 결과 JSON의 id 필드에 똑같이 넣어야 해.\n\n위험 요소가 발견되면 status를 WARNING 또는 REVIEW_REQUIRED로 설정해.\n\n안전하거나 확인이 완료되었다면 COMPLETED로 설정해.\n\n(진단 브리핑) 분석 결과 요약은 **\"어린이집 선생님\"**처럼 친절하고 쉬운 존댓말로 작성해.\n\n(결과 출력) 도구 호출 구문(XML)이나 사족을 붙이지 말고, 아래 JSON 스키마에 맞춘 데이터만 깔끔하게 출력해.\n\n[JSON 출력 스키마] !important!\n\n<function_calls> 태그 사용 금지.\n\nMarkdown 코드 블럭(```json) 없이 순수 JSON 텍스트만 출력.\n\nchecklist_verification 배열의 id 필드는 필수입니다.\n\n{ \"classification\": { \"doc_type\": \"string (임대차계약서 | 등기부등본 | 건축물대장 | 기타)\", \"confidence_score\": number, \"rationale\": \"string (분류 근거)\" }, \"checklist_verification\": [ { \"id\": number, // [핵심] 입력받은 체크리스트의 ID (예: 12, 15...) \"checklist_item\": \"string (체크리스트 내용)\", \"status\": \"string (COMPLETED | WARNING | REVIEW_REQUIRED)\", \"evidence_text\": \"string (근거 문구, 없으면 '관련 내용 없음')\" } ], \"diagnosis_report\": { \"summary\": \"string (친절한 말투 요약)\" }, \"specific_analysis\": { \"template_name\": \"string\", \"items\": [ { \"category\": \"string\", \"finding\": \"string\", \"risk_level\": \"string (HIGH | MEDIUM | LOW)\" } ] } }",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [
        1184,
        800
      ],
      "id": "7393dfcf-5b53-4e74-b85c-8b3f35f806ae",
      "name": "AI Agent2"
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "={{ $('사전정의한_문서별분석항목').item.json.userId }}"
      },
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "typeVersion": 1.3,
      "position": [
        1280,
        672
      ],
      "id": "803577bb-07f1-47dd-a5cf-5e7139214e94",
      "name": "Simple Memory2"
    },
    {
      "parameters": {
        "model": {
          "__rl": true,
          "value": "claude-sonnet-4-20250514",
          "mode": "list",
          "cachedResultName": "Claude Sonnet 4"
        },
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatAnthropic",
      "typeVersion": 1.3,
      "position": [
        1184,
        960
      ],
      "id": "532cdcb4-b562-437d-af63-2f9457968639",
      "name": "Anthropic Chat Model2",
      "credentials": {
        "anthropicApi": {
          "id": "7IafSEZYG12CFsKa",
          "name": "Anthropic account"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "// 1. 외부 데이터(Context) 가져오기\n// AI 모델은 userId를 출력하지 않을 수 있으므로, 확실한 소스('텍스트 정리1')에서 가져옵니다.\nlet userId = 'guest';\ntry {\n    const textNode = $('텍스트 정리1').first().json;\n    userId = textNode.userId || textNode.user_id || 'guest';\n} catch (e) {\n    // 노드 참조 실패 시 input에서 시도\n    userId = $input.first().json.userId || 'guest';\n}\n\n// 2. AI 응답 데이터 가져오기\nconst inputItem = $input.first().json;\nlet rawOutput = inputItem.output || inputItem.text || inputItem.json || \"{}\";\nlet aiResult = {};\n\n// 3. JSON 파싱 및 복구 로직 (Truncated JSON 대응)\nif (typeof rawOutput === 'string') {\n    // 마크다운 코드블럭 제거\n    let cleaned = rawOutput.replace(/```json/gi, '').replace(/```/g, '').trim();\n    \n    try {\n        // [A] 정상 파싱 시도\n        aiResult = JSON.parse(cleaned);\n    } catch (e) {\n        // [B] 복구 시도: 마지막으로 닫힌 객체(},)까지 살리기\n        const lastValidIndex = cleaned.lastIndexOf('},');\n        if (lastValidIndex !== -1) {\n            // 배열과 객체를 강제로 닫음\n            const salvaged = cleaned.substring(0, lastValidIndex + 1) + \"]}\";\n            try {\n                aiResult = JSON.parse(salvaged);\n                // 리포트에 데이터 잘림 경고 추가\n                if (!aiResult.diagnosis_report) aiResult.diagnosis_report = {};\n                aiResult.diagnosis_report.summary = (aiResult.diagnosis_report.summary || \"\") + \"\\n(※ 내용이 길어 일부 분석이 잘렸으나, 확보된 데이터로 리포트를 생성했습니다.)\";\n            } catch (e2) {\n                aiResult = { checklist_verification: [] };\n            }\n        } else {\n             aiResult = { checklist_verification: [] };\n        }\n    }\n} else {\n    aiResult = rawOutput;\n}\n\n// -------------------------------------------------------\n// 4. 데이터 매핑 (HTML 리포트 및 DB 적재용)\n// -------------------------------------------------------\n\n// A. 문서 종류\nconst classification = aiResult.classification || {};\nconst docType = classification.doc_type || \"부동산 문서\";\n\n// B. 체크리스트 검증 결과 (DB 적재용)\n// AI가 데이터를 안 줬을 경우를 대비해 빈 배열 처리\nconst verificationList = aiResult.checklist_verification || [];\n\n// C. 리포트용 데이터 가공 (HTML 생성용)\nlet riskGrade = \"low\"; \nconst issues = [];\nconst safes = [];\nconst analysisItems = aiResult.specific_analysis?.items || [];\n\n// 위험 등급 산정 및 이슈 분류\nconst hasDanger = verificationList.some(i => i.status === 'WARNING') || analysisItems.some(i => i.risk_level === 'HIGH');\nconst hasCaution = verificationList.some(i => i.status === 'REVIEW_REQUIRED') || analysisItems.some(i => i.risk_level === 'MEDIUM');\n\nif (hasDanger) riskGrade = \"high\";\nelse if (hasCaution) riskGrade = \"medium\";\n\n// 체크리스트 항목 분류\nverificationList.forEach(item => {\n    const status = (item.status || '').toUpperCase();\n    if (status === 'WARNING' || status === 'REVIEW_REQUIRED') {\n        issues.push({\n            title: `[항목 ${item.id}] ${item.checklist_item}`,\n            description: item.evidence_text || \"위험/확인필요 요소가 감지되었습니다.\",\n            solution: status === 'WARNING' ? \"수정 또는 특약 삭제 요구\" : \"공인중개사 및 임대인에게 재확인\",\n            severity: status === 'WARNING' ? 'danger' : 'warning'\n        });\n    } else {\n        safes.push({ \n            title: item.checklist_item, \n            description: (item.evidence_text && item.evidence_text !== '관련 내용 없음') ? item.evidence_text : \"✅ 검증 완료\" \n        });\n    }\n});\n\n// 추가 분석 항목 분류\nanalysisItems.forEach(item => {\n    const level = (item.risk_level || '').toUpperCase();\n    if (level === 'HIGH' || level === 'MEDIUM') {\n        issues.push({\n            title: item.category,\n            description: item.finding,\n            solution: \"상세 검토 필요\",\n            severity: level === 'HIGH' ? 'danger' : 'warning'\n        });\n    } else {\n        safes.push({ title: item.category, description: item.finding });\n    }\n});\n\n// D. 날짜 처리 (KST 기준)\nconst now = new Date();\nconst kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));\nconst yyyy = kstDate.getFullYear();\nconst mm = String(kstDate.getMonth() + 1).padStart(2, '0');\nconst dd = String(kstDate.getDate()).padStart(2, '0');\nconst reportDateStr = `${yyyy}-${mm}-${dd}`;\n\n// 5. 최종 결과 반환 (Downstream 노드들이 필요한 모든 데이터 포함)\nreturn {\n    json: {\n        // [중요] DB 업데이트 노드를 위해 최상위에 위치\n        userId: userId,\n        checklist_verification: verificationList,\n        \n        // [중요] HTML 생성 노드를 위해 analysis 객체 내에 정리\n        analysis: {\n            doc_type: docType,\n            risk_grade: riskGrade,\n            summary: aiResult.diagnosis_report?.summary || `검증 항목 ${verificationList.length}개 중 ${issues.length}건의 주의사항이 발견되었습니다.`,\n            issues: issues,\n            safes: safes,\n            schedule: {\n                contract_date: reportDateStr,\n                move_in_date: \"미확인\",\n                report_date: reportDateStr\n            }\n        }\n    }\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1536,
        800
      ],
      "id": "5b953ffc-bf55-4f93-92c0-ebb94475fafe",
      "name": "후처리2"
    },
    {
      "parameters": {
        "url": "={{ $json.url }}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "jobId",
              "value": "={{ $json.jobId }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        368,
        800
      ],
      "id": "934ab42e-4541-4db8-9eed-8c3a85446ade",
      "name": "결과 확인하기1"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.pdf.co/v1/pdf/convert/from/html",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "jhna01@naver.com_x3YwuvvsYFzpXVqNlxauK8lP7nZQvGFQXTkznB2RHjbAQyQuQN23lmLthLLKxwDe"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "html",
              "value": "={{ $json.html_content }}"
            },
            {
              "name": "name",
              "value": "={{ $json.file_name }}"
            },
            {
              "name": "margins",
              "value": "5px 5px 5px 5px"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        2032,
        608
      ],
      "id": "64aa18ae-81de-48dd-abfe-a41384b424b0",
      "name": "HTML to PDF"
    },
    {
      "parameters": {
        "url": "={{ $json.url }}",
        "options": {
          "response": {
            "response": {
              "responseFormat": "file"
            }
          }
        }
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        2208,
        608
      ],
      "id": "924ca784-306f-484a-a100-e3ad09cbba3f",
      "name": "PDF 다운로드"
    },
    {
      "parameters": {
        "jsCode": "// 1. 데이터 수신 (후처리 노드에서 표준화된 데이터 가져오기)\nconst inputJson = $input.first().json;\nconst data = inputJson.analysis || {}; \n\n// 2. 주요 변수 매핑\nconst docType = data.doc_type || \"문서 분석 리포트\";\nconst summary = data.summary || \"요약 정보가 없습니다.\";\nconst riskGrade = data.risk_grade || 'low'; // safe, low, medium, high\nconst risks = data.issues || []; // 위험 항목들\nconst safes = data.safes || [];  // 안전 항목들 (검증 완료 포함)\nconst schedule = data.schedule || {};\n\n// 3. 현재 시간 및 파일명 생성 (한국 시간 기준)\nconst now = new Date();\nconst kstOffset = 9 * 60 * 60 * 1000; \nconst kstDate = new Date(now.getTime() + kstOffset);\nconst yyyy = kstDate.getFullYear();\nconst mm = String(kstDate.getMonth() + 1).padStart(2, '0');\nconst dd = String(kstDate.getDate()).padStart(2, '0');\nconst reportDateStr = `${yyyy}-${mm}-${dd}`;\nconst timeString = `${yyyy}${mm}${dd}_${String(kstDate.getUTCHours()).padStart(2,'0')}${String(kstDate.getUTCMinutes()).padStart(2,'0')}`;\n\n// 파일명 생성\nconst fileIdentifier = inputJson.userId || \"guest\";\nconst finalFileName = `${fileIdentifier}_${docType}_${timeString}_report.pdf`.replace(/\\s+/g, '_');\n\n// 4. 리포트 스타일링 로직 (뱃지 색상 및 텍스트)\nlet badgeColor = \"#4CAF50\"; // 초록 (안전)\nlet badgeText = \"안전한 둥지\";\nlet headerColor = \"#2E7D32\";\n\nif (riskGrade === 'medium') { \n    badgeColor = \"#FF9800\"; // 주황 (주의)\n    badgeText = \"주의가 필요해요\"; \n    headerColor = \"#EF6C00\";\n}\nif (riskGrade === 'high' || riskGrade === 'danger') { \n    badgeColor = \"#F44336\"; // 빨강 (위험)\n    badgeText = \"위험 요소 발견!\"; \n    headerColor = \"#C62828\";\n}\n\n// 5. HTML 템플릿 조립\nconst htmlContent = `\n<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n<meta charset=\"UTF-8\">\n<style>\n  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');\n  \n  body { \n    font-family: 'Pretendard', sans-serif; \n    background-color: #f5f5f5; \n    color: #333; \n    padding: 40px; \n    max-width: 800px; \n    margin: 0 auto; \n    line-height: 1.6;\n  }\n\n  /* 헤더 섹션 */\n  .header { text-align: center; margin-bottom: 30px; }\n  .brand { font-size: 24px; font-weight: 800; color: #333; }\n  .brand span { color: #8CB800; }\n\n  /* 카드 공통 스타일 */\n  .card { \n    background: white; \n    border-radius: 16px; \n    box-shadow: 0 4px 20px rgba(0,0,0,0.06); \n    padding: 30px; \n    margin-bottom: 25px; \n    border: 1px solid #eaeaea; \n  }\n\n  /* 요약 섹션 */\n  .badge { \n    background-color: ${badgeColor}; \n    color: white; \n    padding: 6px 14px; \n    border-radius: 30px; \n    font-size: 14px; \n    font-weight: bold; \n    display: inline-block; \n    margin-bottom: 15px; \n  }\n  \n  h1 { margin: 0 0 15px 0; font-size: 26px; color: #222; }\n  .summary-text { font-size: 16px; color: #555; white-space: pre-line; word-break: keep-all;}\n\n  /* 스케줄 그리드 */\n  .schedule-container {\n    display: flex;\n    justify-content: space-between;\n    background-color: #F8F9FA;\n    border-radius: 12px;\n    padding: 20px;\n    margin-top: 25px;\n    text-align: center;\n  }\n  .schedule-item { flex: 1; border-right: 1px solid #e0e0e0; }\n  .schedule-item:last-child { border-right: none; }\n  .schedule-label { font-size: 12px; color: #888; margin-bottom: 5px; display: block; }\n  .schedule-value { font-size: 15px; font-weight: bold; color: #333; display: block; }\n\n  /* 섹션 타이틀 */\n  h2 { font-size: 18px; margin: 0 0 15px 0; border-left: 4px solid ${headerColor}; padding-left: 10px; color: #444; }\n\n  /* 위험 항목 스타일 */\n  .risk-item { \n    background-color: #FFF5F5; \n    border: 1px solid #FFCDD2; \n    border-radius: 8px; \n    padding: 15px; \n    margin-bottom: 12px; \n  }\n  .risk-title { color: #D32F2F; font-weight: bold; font-size: 15px; display: flex; align-items: center; }\n  .risk-icon { margin-right: 8px; }\n  .risk-desc { font-size: 14px; margin: 8px 0; color: #444; word-break: keep-all; }\n  .risk-solution { \n    background: rgba(255,255,255,0.7); \n    padding: 8px; \n    border-radius: 6px; \n    font-size: 13px; \n    color: #B71C1C; \n    font-weight: 600; \n  }\n\n  /* 안전 항목 스타일 */\n  .safe-list { list-style: none; padding: 0; margin: 0; }\n  .safe-item { \n    display: flex; \n    justify-content: space-between;\n    align-items: center;\n    padding: 12px 15px; \n    border-bottom: 1px solid #f0f0f0; \n  }\n  .safe-item:last-child { border-bottom: none; }\n  .safe-content { display: flex; flex-direction: column; }\n  .safe-title { font-weight: bold; color: #2E7D32; font-size: 15px; }\n  .safe-desc { font-size: 13px; color: #666; margin-top: 2px; }\n  .check-icon { color: #4CAF50; font-size: 18px; font-weight: bold; }\n\n  .footer { text-align: center; font-size: 11px; color: #aaa; margin-top: 40px; }\n</style>\n</head>\n<body>\n\n  <div class=\"header\">\n    <div class=\"brand\">🏠 둥지 <span>AI 리포트</span></div>\n  </div>\n\n  <div class=\"card\">\n    <div style=\"text-align: center;\">\n      <span class=\"badge\">${badgeText}</span>\n      <h1>${docType} 분석 결과</h1>\n      <div class=\"summary-text\">${summary}</div>\n    </div>\n\n    <div class=\"schedule-container\">\n      <div class=\"schedule-item\">\n        <span class=\"schedule-label\">계약/발급일</span>\n        <span class=\"schedule-value\">${schedule.contract_date || '-'}</span>\n      </div>\n      <div class=\"schedule-item\">\n        <span class=\"schedule-label\">입주 예정</span>\n        <span class=\"schedule-value\">${schedule.move_in_date || '-'}</span>\n      </div>\n      <div class=\"schedule-item\">\n        <span class=\"schedule-label\">분석 완료일</span>\n        <span class=\"schedule-value\">${schedule.report_date || reportDateStr}</span>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"card\">\n    <h2>✅ 둥지가 꼼꼼하게 확인했어요!</h2>\n    ${safes.length > 0 ? `\n      <div class=\"safe-list\">\n        ${safes.map(item => `\n          <div class=\"safe-item\">\n            <div class=\"safe-content\">\n              <span class=\"safe-title\">${item.title}</span>\n              ${item.description && item.description !== '✅ 검증 완료' \n                ? `<span class=\"safe-desc\">${item.description}</span>` \n                : ''}\n            </div>\n            <span class=\"check-icon\">✔</span>\n          </div>\n        `).join('')}\n      </div>\n    ` : `\n      <div style=\"text-align:center; padding: 20px; color: #999;\">\n        특이사항 없이 안전한 것으로 보입니다.\n      </div>\n    `}\n  </div>\n\n  ${risks.length > 0 ? `\n  <div class=\"card\">\n    <h2>⚠️ 사용자의 확인 필요한 항목 (${risks.length}건)</h2>\n    ${risks.map(item => `\n      <div class=\"risk-item\">\n        <div class=\"risk-title\">\n            <span class=\"risk-icon\">⛔</span> ${item.title}\n        </div>\n        <div class=\"risk-desc\">${item.description}</div>\n        <div class=\"risk-solution\">💡 ${item.solution}</div>\n      </div>\n    `).join('')}\n  </div>\n  ` : ''}\n\n  <div class=\"footer\">\n    본 리포트는 AI 자동 분석 결과이며 법적 효력은 없습니다.<br>\n    계약 체결 전 반드시 전문가(공인중개사, 변호사)와 최종 내용을 확인하시기 바랍니다.<br>\n    © DOONGZI Service\n  </div>\n\n</body>\n</html>\n`;\n\nreturn {\n  json: {\n    html_content: htmlContent,\n    file_name: finalFileName,\n    user_id: inputJson.userId \n  }\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1776,
        608
      ],
      "id": "ab4a2157-a6db-4f3d-ac8f-fe76d4ea5952",
      "name": "HTML 생성하기1"
    },
    {
      "parameters": {
        "url": "=https://jrjqlhnsnwybffkiaknx.supabase.co/storage/v1/object/public/{{ $('Supabase S3').item.json.Key }}",
        "options": {
          "response": {
            "response": {
              "responseFormat": "file"
            }
          }
        }
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        -144,
        592
      ],
      "id": "af3080a8-d8fa-40c3-b651-2ceebc56e162",
      "name": "PDF다운로드"
    },
    {
      "parameters": {
        "amount": 120
      },
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        16,
        800
      ],
      "id": "7c09d282-521b-4cfb-b442-18dbf00ee4ae",
      "name": "대기",
      "webhookId": "97207f1d-c064-449d-bdeb-1dc25b5a6182"
    },
    {
      "parameters": {
        "jsCode": "// 1. 데이터 가져오기 (직전 노드인 '후처리2'에서 정리된 데이터를 바로 사용)\nconst inputData = $input.first().json;\n\n// 2. 주요 변수 추출\n// 후처리2 노드가 userId와 checklist_verification을 최상위에 배치해서 넘겨주므로 바로 접근 가능합니다.\nconst userId = inputData.userId; \nconst verification = inputData.checklist_verification || [];\n\n// 3. 'COMPLETED' 상태인 항목의 ID만 추출\nconst completedIds = verification\n  .filter(item => {\n    // 대소문자 구분 없이 처리 ('Completed', 'COMPLETED' 모두 호환)\n    const status = (item.status || '').toUpperCase(); \n    return status === 'COMPLETED';\n  })\n  .map(item => {\n    // [우선순위 1] 명시된 정수형 'id'가 있으면 사용\n    if (item.id !== undefined && item.id !== null) {\n      return item.id;\n    }\n    // [우선순위 2] id가 누락된 경우 'checklist_item' 텍스트 앞의 숫자 추출 (비상용)\n    const text = item.checklist_item || \"\";\n    const match = text.toString().match(/^(\\d+)/);\n    return match ? parseInt(match[1], 10) : undefined;\n  })\n  .filter(id => id !== undefined); // undefined 제거 (유효한 ID만 남김)\n\n// 4. DB 쿼리용 문자열 생성: (1,3,5) 형태\nlet targetIdsString = \"(-1)\"; // 기본값: 업데이트할 대상이 없을 때 에러 방지용 (-1은 보통 ID로 안 씀)\n\nif (completedIds.length > 0) {\n  // 숫자 배열을 쉼표로 연결 -> 1,3,5\n  const joinedIds = completedIds.join(',');\n  targetIdsString = `(${joinedIds})`;\n}\n\n// 5. 결과 반환\nreturn {\n  json: {\n    userId: userId,\n    target_ids: targetIdsString, // 예: \"(3,4,20)\" 또는 \"(-1)\"\n    count: completedIds.length\n  }\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1776,
        848
      ],
      "id": "b8ed7266-34e3-40f1-af24-0e02abd2b99d",
      "name": "DB 적재용 전처리 (ID추출)"
    },
    {
      "parameters": {
        "tableId": "analyzefile",
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "bucket",
              "fieldValue": "doongzi"
            },
            {
              "fieldId": "file_key",
              "fieldValue": "={{ $('[DB] 파일엔드포인트 적재').item.json.file_key }}"
            },
            {
              "fieldId": "output",
              "fieldValue": "={{ $json.html_content }}"
            },
            {
              "fieldId": "document_id",
              "fieldValue": "={{ $('[DB] 파일엔드포인트 적재').item.json.id }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        1552,
        -176
      ],
      "id": "7e65172f-108f-4ce9-9e55-bd2a47ac1504",
      "name": "분석 결과 DB 저장",
      "credentials": {
        "supabaseApi": {
          "id": "qlMJpvjZT1ckjAaE",
          "name": "Supabase account 4"
        }
      }
    },
    {
      "parameters": {
        "tableId": "analyzefile",
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "bucket",
              "fieldValue": "doongzi"
            },
            {
              "fieldId": "file_key",
              "fieldValue": "={{ $('Create a row1').item.json.file_key }}"
            },
            {
              "fieldId": "output",
              "fieldValue": "={{ $json.html_content }}"
            },
            {
              "fieldId": "document_id",
              "fieldValue": "={{ $('Create a row1').item.json.id }}"
            }
          ]
        }
      },
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        2032,
        432
      ],
      "id": "4f7f9243-5fd8-4df5-9d82-c53691095fca",
      "name": "분석 결과 DB 저장1",
      "credentials": {
        "supabaseApi": {
          "id": "qlMJpvjZT1ckjAaE",
          "name": "Supabase account 4"
        }
      }
    },
    {
      "parameters": {
        "sendTo": "jhna01@naver.com",
        "subject": "[둥지] 사용자님의 체크리스트, 둥지가 다 확인해놨어요!",
        "message": "<div style=\"max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8f9fa; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; border-radius: 16px;\">      <div style=\"background-color: #ffffff; padding: 40px 30px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); text-align: center; border: 1px solid #eaeaea;\">          <div style=\"font-size: 48px; margin-bottom: 20px;\">🏠</div>     <h2 style=\"color: #2E7D32; margin: 0 0 10px 0; font-size: 24px; font-weight: 800;\">체크리스트 업데이트 완료!</h2>     <p style=\"color: #888; font-size: 14px; margin-top: 0;\">AI가 서류를 분석하여 체크리스트를 채웠습니다.</p>      <div style=\"height: 1px; background-color: #eee; margin: 30px 0;\"></div>      <div style=\"text-align: left; margin-bottom: 35px; color: #444; line-height: 1.6;\">       <p style=\"margin-bottom: 10px;\">안녕하세요, <strong>둥지(Doongzi)</strong>입니다.</p>       <p style=\"margin-bottom: 0;\">         업로드해주신 문서를 바탕으로 <br>         <strong>[나의 계약 체크리스트]</strong> 현황이 업데이트되었습니다.<br><br>         혹시 놓친 위험 요소는 없는지, <br>         지금 둥지 웹사이트에서 꼼꼼한 분석 결과를 확인해보세요!       </p>     </div>      <a href=\"https://doongzi.site\" target=\"_blank\" style=\"display: inline-block; background-color: #4CAF50; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2); transition: background-color 0.2s;\">       내 체크리스트 확인하러 가기 →     </a>      <p style=\"margin-top: 20px; font-size: 12px; color: #aaa;\">       위 버튼이 클릭되지 않는다면, 둥지 홈페이지로 직접 접속해주세요.     </p>    </div>    <div style=\"text-align: center; margin-top: 30px; font-size: 12px; color: #999;\">     <p style=\"margin: 0;\">© DOONGZI Service. All rights reserved.</p>     <p style=\"margin: 5px 0 0;\">안전한 보금자리를 위한 선택, 둥지</p>   </div>  </div>",
        "options": {}
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        2240,
        832
      ],
      "id": "efb5fa23-3030-4939-b07d-a1f154b41d7a",
      "name": "체크가 완료되었어요!",
      "webhookId": "1215d75a-601d-4e7c-adbf-a8beab1beb13",
      "credentials": {
        "gmailOAuth2": {
          "id": "iUO5HBmvgTtRnJ8V",
          "name": "Gmail account 2"
        }
      }
    },
    {
      "parameters": {
        "sendTo": "jhna01@naver.com",
        "subject": "[둥지] 체크리스트 리포트",
        "message": "<div style=\"max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 16px; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; color: #333;\">      <div style=\"text-align: center; margin-bottom: 30px;\">     <h2 style=\"color: #2E7D32; margin: 0; font-size: 24px;\">🏠 둥지 AI 분석 완료</h2>     <p style=\"color: #666; font-size: 14px; margin-top: 5px;\">꼼꼼하게 확인하고 리포트를 작성했어요!</p>   </div>    <div style=\"background-color: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 25px;\">     <p style=\"margin: 0; line-height: 1.6;\">       안녕하세요! <strong>둥지(Doongzi)</strong>입니다.<br><br>       보내주신 부동산 문서를 깐깐하게 분석했습니다.<br>       혹시 모를 독소조항이나 위험 요소는 없는지, <br>       <strong>첨부된 PDF 리포트</strong>를 통해 지금 바로 확인해보세요.     </p>   </div>    <div style=\"text-align: center; margin-bottom: 30px;\">     <p style=\"margin-bottom: 10px; font-weight: bold; color: #2E7D32;\">👇 아래 첨부파일을 확인해주세요 👇</p>     <div style=\"display: inline-block; border: 2px dashed #4CAF50; border-radius: 8px; padding: 10px 20px; background-color: #fff; color: #555;\">       📄 상세 분석 리포트.pdf     </div>   </div>    <div style=\"border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 12px; color: #aaa;\">     <p style=\"margin: 0;\">본 메일은 둥지(Doongzi) 서비스에서 자동으로 발송되었습니다.</p>     <p style=\"margin: 5px 0 0;\">안전한 계약 되시길 응원합니다! 🍀</p>   </div>  </div>",
        "options": {
          "attachmentsUi": {
            "attachmentsBinary": [
              {}
            ]
          }
        }
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        2384,
        608
      ],
      "id": "9f92f96e-7498-48d1-8673-e6a79ea2930d",
      "name": "pdf 보내드려요!",
      "webhookId": "1215d75a-601d-4e7c-adbf-a8beab1beb13",
      "credentials": {
        "gmailOAuth2": {
          "id": "iUO5HBmvgTtRnJ8V",
          "name": "Gmail account 2"
        }
      }
    }
  ],
  "connections": {
    "OpenAI Chat Model1": {
      "ai_languageModel": [
        [
          {
            "node": "LLM 계약서 분석1",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "LLM 계약서 분석1": {
      "main": [
        [
          {
            "node": "후처리1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "텍스트 정리": {
      "main": [
        [
          {
            "node": "프롬프트 생성기1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "프롬프트 생성기1": {
      "main": [
        [
          {
            "node": "LLM 계약서 분석1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Webhook": {
      "main": [
        [
          {
            "node": "Switch",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF to Text (OCR)": {
      "main": [
        [
          {
            "node": "Wait",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Wait": {
      "main": [
        [
          {
            "node": "JOB 상태 확인",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "결과 확인하기": {
      "main": [
        [
          {
            "node": "텍스트 정리",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Switch": {
      "main": [
        [
          {
            "node": "[S3] 사용자 파일 적재",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Supabase S3",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTML 생성하기": {
      "main": [
        [
          {
            "node": "분석 완료 응답",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "후처리1": {
      "main": [
        [
          {
            "node": "HTML 생성하기",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "[S3] 사용자 파일 적재": {
      "main": [
        [
          {
            "node": "[DB] 파일엔드포인트 적재",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "[DB] 파일엔드포인트 적재": {
      "main": [
        [
          {
            "node": "PDF to Text (OCR)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "JOB 상태 확인": {
      "main": [
        [
          {
            "node": "결과 확인하기",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "사전정의된 체크리스트항목": {
      "main": [
        [
          {
            "node": "사전정의한_문서별분석항목",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "사전정의한_문서별분석항목": {
      "main": [
        [
          {
            "node": "AI Agent2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "텍스트 정리1": {
      "main": [
        [
          {
            "node": "사전정의된 체크리스트항목",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OCR 요청": {
      "main": [
        [
          {
            "node": "대기",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "JOB 상태 확인1": {
      "main": [
        [
          {
            "node": "결과 확인하기1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create a row1": {
      "main": [
        [
          {
            "node": "OCR 요청",
            "type": "main",
            "index": 0
          },
          {
            "node": "PDF다운로드",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Supabase S3": {
      "main": [
        [
          {
            "node": "Create a row1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "supabase boolean 수정": {
      "main": [
        [
          {
            "node": "체크가 완료되었어요!",
            "type": "main",
            "index": 0
          }
        ],
        []
      ]
    },
    "AI Agent2": {
      "main": [
        [
          {
            "node": "후처리2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Simple Memory2": {
      "ai_memory": [
        [
          {
            "node": "AI Agent2",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "Anthropic Chat Model2": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent2",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "후처리2": {
      "main": [
        [
          {
            "node": "HTML 생성하기1",
            "type": "main",
            "index": 0
          },
          {
            "node": "DB 적재용 전처리 (ID추출)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "결과 확인하기1": {
      "main": [
        [
          {
            "node": "텍스트 정리1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTML to PDF": {
      "main": [
        [
          {
            "node": "PDF 다운로드",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF 다운로드": {
      "main": [
        [
          {
            "node": "pdf 보내드려요!",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTML 생성하기1": {
      "main": [
        [
          {
            "node": "HTML to PDF",
            "type": "main",
            "index": 0
          },
          {
            "node": "분석 결과 DB 저장1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "대기": {
      "main": [
        [
          {
            "node": "JOB 상태 확인1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "DB 적재용 전처리 (ID추출)": {
      "main": [
        [
          {
            "node": "supabase boolean 수정",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "5f88ed242640bcdbf29cbeff7ee373d030f91def272711de4395602c1a416b9a"
  }
}
