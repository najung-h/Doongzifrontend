import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Mail,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  DollarSign,
  Shield,
  Search,
  AlertTriangle,
  ClipboardList,
  Landmark,
  Building,
  User,
  FileText,
  TrendingDown,
  Building2,
  FileCheck,
  Home,
  Send,
  Pin,
  ScrollText,
  CheckCircle
} from 'lucide-react';
import { checklistAPI } from '../api/checklist';
import Navigation from '../components/common/Navigation';

type SubChecklistItem = {
  id: string;
  title: string;
  whatIsIt: string;
  whyDoIt: string;
  additionalNote?: string;
  completed: boolean;
};

type ChecklistItem = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  helpKeyword?: string;
  whatIsIt?: string;  // 추가 필드
  whyDoIt?: string;
  subItems?: SubChecklistItem[]; // 그룹 헤더일 때
  buttons?: Array<{
    label: string;
    url?: string;
    type?: 'primary' | 'secondary' | 'modal';
  }>;
  isGroup?: boolean; // 그룹 헤더인지 여부
};

type ChecklistTab = {
  id: 'before' | 'during' | 'after';
  name: string;
  items: ChecklistItem[];
};

// 아이콘 매핑
const getItemIcon = (title: string) => {
  const iconProps = { size: 18, strokeWidth: 2 };

  if (title.includes('매매가격')) return <DollarSign {...iconProps} />;
  if (title.includes('보증보험')) return <Shield {...iconProps} />;
  if (title.includes('선순위') || title.includes('권리')) return <Search {...iconProps} />;
  if (title.includes('소유자') || title.includes('돈문제')) return <AlertTriangle {...iconProps} />;
  if (title.includes('소유권')) return <ClipboardList {...iconProps} />;
  if (title.includes('신탁')) return <Landmark {...iconProps} />;
  if (title.includes('다가구')) return <Building {...iconProps} />;
  if (title.includes('무허가') || title.includes('불법')) return <AlertTriangle {...iconProps} />;
  if (title.includes('임대인')) return <User {...iconProps} />;
  if (title.includes('대리인') || title.includes('위임')) return <FileText {...iconProps} />;
  if (title.includes('미납') || title.includes('국세')) return <TrendingDown {...iconProps} />;
  if (title.includes('공인중개사')) return <Building2 {...iconProps} />;
  if (title.includes('계약 내용')) return <FileCheck {...iconProps} />;
  if (title.includes('특약')) return <AlertTriangle {...iconProps} />;
  if (title.includes('잔금')) return <DollarSign {...iconProps} />;
  if (title.includes('주택 상태')) return <Home {...iconProps} />;
  if (title.includes('전입신고')) return <Home {...iconProps} />;
  if (title.includes('임대차 계약 신고')) return <Send {...iconProps} />;
  if (title.includes('임대차 신고제 대상인지')) return <ClipboardList {...iconProps} />;
  if (title.includes('임대차 신고제 대상인 경우')) return <FileText {...iconProps} />;
  if (title.includes('확정일자')) return <Pin {...iconProps} />;
  if (title.includes('전세보증금')) return <Shield {...iconProps} />;
  if (title.includes('등기부등본')) return <ScrollText {...iconProps} />;
  if (title.includes('계약서')) return <FileText {...iconProps} />;
  return <CheckCircle {...iconProps} />;
};

const initialChecklist: ChecklistTab[] = [
  {
    id: 'before',
    name: '계약 전',
    items: [
      {
        id: 'before-1',
        title: '매매가격 확인하기',
        whatIsIt: '이 집이 실제로 얼마에 팔리는지 시세를 알아보는 거예요. 내가 낼 전세금이 집값에 비해 너무 비싼지 확인해서, 위험한 \'깡통전세\'를 피하려는 거예요.',
        whyDoIt: '\'깡통전세\'는 집주인 빚이 너무 많거나 집값이 떨어져서, 나중에 내가 낸 전세금을 돌려받기 어려운 위험한 집을 말해요. 만약 집값(예: 3억)이랑 전세금(예: 2억 8천)이 별 차이 안 나면, 집이 경매로 넘어갔을 때 내 보증금을 다 못 받을 수도 있어요.',
        completed: false,
        buttons: [
          { label: '국토교통부 전월세 실거래가 조회', url: 'https://rt.molit.go.kr/pt/gis/gis.do?srhThingSecd=A&mobileAt=', type: 'secondary' },
          { label: '깡통전세 위험도 분석', type: 'primary' }
        ]
      },
      {
        id: 'before-2',
        title: '보증보험 가입 가능 여부 확인하기',
        whatIsIt: '내가 낸 전세금을 나중에 집주인 대신 보증 기관(HUG 등)이 꼭 돌려주겠다고 약속하는 \'보험\'에 가입할 수 있는지 미리 알아보는 거예요.',
        whyDoIt: '만약 이 집에 \'보증보험\' 가입이 안 된다면, 그건 집주인 빚이 너무 많거나, 집에 다른 문제가 있을 가능성이 높다는 신호예요. 이런 집은 나중에 보증금을 돌려받기 더 위험할 수 있어요.',
        completed: false,
        buttons: [
          { label: 'HUG 전세보증보험', url: 'https://www.khug.or.kr/hug/web/ig/dr/igdr000001.jsp', type: 'secondary' },
          { label: 'SGI 전세보증보험', url: 'https://www.sgic.co.kr/biz/ccp/index.html?p=CCPPRD040301F01', type: 'secondary' },
          { label: '보증보험 가입 가능 여부 확인', type: 'modal' }
        ]
      },
      {
        id: 'before-3',
        title: '등기부등본 확인하기',
        completed: false,
        isGroup: true,
        subItems: [
          {
            id: 'before-3-1',
            title: '선순위 권리관계 확인하기',
            whatIsIt: '집에 이미 설정된 전세권·근저당·임차권(선순위 보증금) 같은 권리들이 있는지 확인하는 절차예요. 누가 먼저 돈을 돌려받을 권리가 있는지 등기부에서 순서를 확인하는 과정입니다.',
            whyDoIt: '선순위 권리가 많으면 내 보증금이 후순위로 밀려 돌려받지 못할 위험이 커져요. 특히 선순위 보증금이나 근저당 합계가 시세를 넘으면 전세사기 위험이 매우 높기 때문입니다.',
            completed: false
          },
          {
            id: 'before-3-2',
            title: '집과 소유자에 관련된 돈문제가 있는지 확인하기',
            whatIsIt: '소유자에게 가압류·압류·강제경매·세금 체납 등이 걸려있는지 확인하는 과정이에요. 즉, 집주인의 재정 상태가 위험해서 집이 공매·경매로 넘어갈 가능성을 확인하는 단계입니다.',
            whyDoIt: '이런 기록이 있으면 집주인이 경제적으로 위험한 상태일 확률이 높아요. 결과적으로 전세보증금을 제대로 돌려받지 못할 가능성이 높아지기 때문에 반드시 확인해야 합니다.',
            completed: false
          }
        ],
        buttons: [
          { label: '등기부등본 발급하러가기', url: 'https://www.iros.go.kr/index.jsp', type: 'secondary' },
          { label: '등기부등본 분석하러가기', type: 'primary' }
        ]
      },
      {
        id: 'before-4',
        title: '단독/다가구 주택이면 필요한 추가 확인',
        whatIsIt: '단독·다가구 주택은 한 건물 등기부로 모든 세대가 묶여 있는 구조라서, 실제 임차 세대별 권리관계를 등기부만으로 알 수 없어요. 따라서 전입한 사람 수, 기존 세입자의 보증금, 전입 날짜 등을 확인하기 위해 \'전입세대 열람\', \'확정일자 현황\'을 추가로 확인하는 절차예요.',
        whyDoIt: '단독·다가구는 앞선 세입자의 보증금이 많으면 내 보증금이 후순위가 되어 못 돌려받을 위험이 매우 커요. 또 등기부만으로는 선순위 임차인이 있는지 알 수 없기 때문에, 전입세대/확정일자 정보를 반드시 확인해야 안전하게 보증금을 보호할 수 있어요.',
        completed: false,
        buttons: [
          { label: '전입세대 확인 방법', url: 'https://www.gov.kr/', type: 'secondary' }
        ]
      },
      {
        id: 'before-5',
        title: '무허가·불법 건축물 여부 확인하기',
        whatIsIt: '위반건축물은 아닌지, 건물 용도가 주택이 맞는지(근린생활시설은 아닌지), 건물의 동호수가 건축물 대장상 동호수와 일치하는지 확인하기 위해서 하는거에요.',
        whyDoIt: '전입신고를 할 수 없는 무허가 및 불법 건축물은 주택임대차보호법 적용을 받지 않아 보증금 보호가 어려운 경우가 있어서 꼭 확인해야 해요.',
        completed: false,
        buttons: [
          { label: '건축물대장 분석하러가기', type: 'primary' }
        ]
      }
    ]
  },
  {
    id: 'during',
    name: '계약 중',
    items: [
      {
        id: 'during-1',
        title: '등기부등본 확인하기',
        completed: false,
        isGroup: true,
        subItems: [
          {
            id: 'during-1-1',
            title: '이 집에 소유권은 누구에게 있는지 확인하기',
            whatIsIt: '소유권을 가진 사람이 누구인지, 몇 명인지 등기부등본을 통해 확인하는 과정이에요. 소유자가 두 명 이상이면 모든 공유자와 계약해야 한다는 점도 함께 확인해야 해요.',
            whyDoIt: '실제 집주인이 아닌 사람과 계약하면 계약이 무효가 될 수 있고, 보증금을 돌려받지 못할 위험이 커져요. 또 공유주택인 경우 모든 공유자의 동의 없이 계약하면 법적 효력이 없기 때문에 반드시 확인해야 해요.',
            completed: false
          },
          {
            id: 'during-1-2',
            title: '신탁등기 상태 확인하기',
            whatIsIt: '등기부등본에서 이 집이 신탁회사에 맡겨진 상태인지(신탁등기) 확인하는 절차예요. 신탁등기면 겉보기 집주인이 아니라 신탁회사가 실제 권한을 가지고 있는 구조예요.',
            whyDoIt: '신탁된 집을 집주인과만 계약하면 계약이 무효가 될 수 있어, 보증금을 한순간에 잃을 위험이 있어요. 반드시 신탁회사 동의가 필요한 집이므로, 이를 모르고 계약하면 추후 강제퇴거·보증금 미반환 위험이 매우 커져요.',
            additionalNote: '신탁등기 상태가 확인되었다면 주민센터가서 신탁원부 확인하는거 필요합니다.',
            completed: false
          }
        ],
        buttons: [
          { label: '등기부등본 발급하러가기', url: 'https://www.iros.go.kr/index.jsp', type: 'secondary' },
          { label: '등기부등본 분석하러가기', type: 'primary' }
        ]
      },
      {
        id: 'during-2',
        title: '임대인 확인하기',
        whatIsIt: '지금 나와 계약하는 사람이 이 집의 진짜 주인이 맞는지 신분증으로 확인하는 과정이에요. 등기부등본의 소유자 정보와 실제 계약 상대가 동일한지 대조하는 절차예요.',
        whyDoIt: '가짜 임대인에게 속아 계약하면 전세보증금을 통째로 잃는 전형적인 전세사기 유형이기 때문이에요. 임대인 확인은 전세사기를 막기 위한 가장 기본이면서도 가장 중요한 체크 단계예요.',
        completed: false
      },
      {
        id: 'during-3',
        title: '대리인과 계약한다면? 위임장 확인하기',
        whatIsIt: '임대인이 직접 나오지 않고 대리인이 나왔다면, 집주인이 "대신 계약해도 된다"라고 허락했다는 위임장 + 인감증명서를 확인하는 과정이에요. 대리인의 신분증과 임대인과의 관계도 반드시 확인해야 해요.',
        whyDoIt: '위임장과 인감증명서가 없으면 대리인과의 계약은 법적으로 무효가 될 수 있어 보증금을 보호받지 못해요. 가족·친구라 해도 공식 위임이 없으면 사기와 동일한 결과를 초래할 수 있기 때문이에요.',
        completed: false,
        buttons: [
          { label: '인감증명발급 사실확인', url: 'https://www.gov.kr/mw/EgovPageLink.do?link=ingam/ingam', type: 'secondary' }
        ]
      },
      {
        id: 'during-4',
        title: '공인중개사 확인하기',
        whatIsIt: '집을 소개해준 중개사가 국가에 등록된 정식 공인중개사가 맞는지 확인하는 절차예요. 등록번호·자격증 번호·개업공인중개사 여부 등을 조회해 진짜 중개인인지 확인해요.',
        whyDoIt: '무등록 중개업자는 사고가 나도 책임을 지지 않고, 보증보험도 가입돼 있지 않아 어떤 보호도 받을 수 없어요. 중개사 확인은 거래 안전장치를 확보하는 유일한 법적 보호막이기 때문이에요.',
        completed: false,
        buttons: [
          { label: '공인중개사 자격확인', url: 'https://www.vworld.kr/dtld/broker/dtld_list_s001.do', type: 'secondary' }
        ]
      },
      {
        id: 'during-5',
        title: '(선택) 미납국세·임금채권 확인하기',
        whatIsIt: '임대인이 세금(국세)을 체납했거나 직원 임금을 밀린 상태인지 확인하는 과정이에요. 이 정보는 등기부에 나오지 않지만 임대인의 경제적 위험도를 파악하는 핵심 신호예요.',
        whyDoIt: '세금·임금채권은 경매 시 전세보증금보다 우선해서 가져가는 채권이라 내 보증금이 밀릴 수 있어요. 임대인의 재정 상태가 위험하면 전세금 반환이 어려워질 가능성이 높아 반드시 확인해야 해요.',
        completed: false
      },
      {
        id: 'during-6',
        title: '계약서 작성하기',
        completed: false,
        isGroup: true,
        subItems: [
          {
            id: 'during-6-1',
            title: '계약 내용 꼼꼼히 확인하기',
            whatIsIt: '계약서에 적힌 주소, 보증금, 이사 날짜, 임대인 정보 등이 실제 사실과 정확히 일치하는지 글자 하나까지 확인하는 과정이에요. 등기부에서 확인한 정보와 계약서 내용이 동일한지도 반드시 대조해야 해요.',
            whyDoIt: '숫자·주소 하나만 틀려도 분쟁이 발생하거나 계약 효력이 흔들릴 수 있어 큰 금전적 피해로 이어질 수 있어요. 특히 주소, 동·호수, 보증금 오기입은 전세사기에서 가장 흔한 피해 유형이에요.',
            completed: false
          },
          {
            id: 'during-6-2',
            title: '특약사항 위험 요소 확인하기',
            whatIsIt: '계약서 특약에 임차인에게 불리한 조항, 책임을 떠넘기는 내용, 모호한 문구가 있는지 점검하는 과정이에요. 특약은 일반 조항보다 우선 적용되기 때문에 매우 중요한 부분이에요.',
            whyDoIt: '특약이 잘못 적혀 있으면 법적 분쟁 시 임차인이 불리해지고, 보증금 반환·수리비 부담 문제가 발생할 수 있어요. 특히 전세사기에서 악성 특약이 숨어 있는 경우가 많아 반드시 사전 점검이 필요해요.',
            completed: false
          }
        ],
        buttons: [
          { label: '계약서 분석하러가기', type: 'primary' }
        ]
      }
    ]
  },
  {
    id: 'after',
    name: '계약 후',
    items: [
      {
        id: 'after-1',
        title: '잔금 지급 전 : 권리변동·이중계약·특약 불이행 점검하기',
        whatIsIt: '전세 잔금을 최종 지급하기 직전에 다시 한번 확인하는 과정이에요. 잔금을 내는 순간부터 임대차 계약이 실제로 성립되며, 그 즉시 발생하는 위험요소를 미리 차단하는 단계에요.',
        whyDoIt: '계약서만 작성한 상태에서는 아직 법적 보호를 받지 못하기 때문에, 잔금을 지급하기 전에 집의 권리관계가 안전하게 유지되고 있는지 반드시 다시 확인해야 해요. 등기부등본을 새로 발급해 소유권 변경·근저당 설정·압류 등 위험 요소가 생기지 않았는지, 기존 세입자가 정확히 퇴거했는지, 그리고 계약서에 적힌 특약사항들이 실제로 이행되었는지 점검해야 잔금 지급 이후 내 보증금을 안전하게 보호할 수 있어요.',
        completed: false,
        buttons: [
          { label: '등기부등본 발급하러가기', url: 'https://www.iros.go.kr/index.jsp', type: 'secondary' },
          { label: '등기부등본 분석하러가기', type: 'primary' }
        ]
      },
      {
        id: 'after-2',
        title: '주택 상태 확인 및 이사하기',
        whatIsIt: '입주 전·후에 집 상태를 사진으로 남기고, 이사 업체와 일정·책임을 미리 맞춰두며, 전기·가스처럼 빠져나가는 공과금도 정리해 두는 거예요.',
        whyDoIt: '사진을 찍어두지 않으면 나중에 원래 있던 하자까지 내 책임이 되는 일이 생길 수 있고, 이사 업체나 공과금 정리를 미뤄두면 예상치 못한 비용 분쟁이 생길 수 있어요.',
        completed: false
      },
      {
        id: 'after-3',
        title: '전입신고하여 대항력 확보하기',
        whatIsIt: '①그 집에 진짜 이사해서 살고, ②주민센터에 "저 이 집으로 이사 왔어요"라고 신고(전입신고)하는 거예요.',
        whyDoIt: '이 두 가지를 완료해야 \'대항력\'이라는 힘이 생겨요. 이 힘이 있으면, 계약 기간 중에 집주인이 바뀌어도 "난 계약 기간 끝날 때까지 여기서 살 거예요!"라고 당당하게 말할 수 있어요. 새 주인이 나가라고 해도 안 나가도 돼요.',
        completed: false
      },
      {
        id: 'after-4',
        title: '임대차 계약 신고하기',
        completed: false,
        isGroup: true,
        subItems: [
          {
            id: 'after-4-1',
            title: '임대차 신고제 대상인지 확인하기',
            whatIsIt: '보증금과 월세에 따라 임대차 신고제 대상인지 확인하는 거예요.',
            whyDoIt: '신고제 대상인데 신고하지 않으면, 100만원 이하의 과태료가 부과돼요.',
            completed: false
          },
          {
            id: 'after-4-2',
            title: '임대차 신고제 대상인 경우 신고하기',
            whatIsIt: '이 집에 얼마에, 어떤 조건으로, 언제부터 언제까지 살기로 계약했다는 내용을 정부에 공식적으로 신고하는 제도에요.',
            whyDoIt: '신고 대상자는 반드시 신고해야 하고, 신고를 하면 확정일자가 자동으로 부여돼요. 확정일자와 대항력을 모두 갖추면 우선변제권을 확보할 수 있어요.',
            completed: false
          }
        ]
      },
      {
        id: 'after-5',
        title: '확정일자 받기',
        whatIsIt: '계약서에 \'확정일자\'라는 도장을 받아서, \'내 보증금을 다른 채권자들보다 먼저 돌려받을 수 있는 권리\'인 우선변제권을 확보하는 거예요.',
        whyDoIt: '전입신고만 하면 보증금 반환 순서가 다른 채권자들보다 뒤로 밀릴 수 있어요. 확정일자를 받아두어야 경매가 진행될 때 내 보증금을 우선해서 돌려받을 수 있는 권리가 생겨요.',
        completed: false
      },
      {
        id: 'after-6',
        title: '(선택) 전세보증금 반환보증 가입하기',
        whatIsIt: '전세계약이 끝났을 때 임대인이 보증금을 돌려주지 않더라도, HUG나 SGI가 대신 보증금을 먼저 지급해주는 보험이에요. 전세보증금이 위험해질 때를 대비해서 보증기관이 세입자의 돈을 대신 지켜주는 장치예요.',
        whyDoIt: '전세사기는 대부분 세입자가 계약 기간 종료 후 보증금을 못 돌려받는 상황에서 발생해요. 세입자가 통제할 수 없는 상황이 존재하기 때문에 마지막 안전망으로 가입하는 것을 권장합니다.',
        completed: false,
        buttons: [
          { label: 'HUG 전세보증보험', url: 'https://www.khug.or.kr/', type: 'secondary' },
          { label: 'SGI 전세보증보험', url: 'https://www.sgic.co.kr/', type: 'secondary' }
        ]
      }
    ]
  }
];

export default function ChecklistPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'before' | 'during' | 'after'>('before');
  const [checklist, setChecklist] = useState<ChecklistTab[]>(initialChecklist);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const currentTab = checklist.find(tab => tab.id === activeTab);
  
  // 현재 탭의 진행률 계산 (서브 항목만 카운트)
  const getAllCheckableItems = () => {
    let totalItems = 0;
    let completedItems = 0;
    
    currentTab?.items.forEach(item => {
      if (item.isGroup && item.subItems) {
        // 그룹 헤더는 카운트하지 않고 서브 항목만 카운트
        totalItems += item.subItems.length;
        completedItems += item.subItems.filter(sub => sub.completed).length;
      } else if (!item.isGroup) {
        // 일반 항목 카운트
        totalItems += 1;
        completedItems += item.completed ? 1 : 0;
      }
    });
    
    return { totalItems, completedItems };
  };
  
  const { totalItems: currentTabItems, completedItems: currentTabCompleted } = getAllCheckableItems();
  const currentTabProgress = currentTabItems > 0 ? (currentTabCompleted / currentTabItems) * 100 : 0;

  const toggleItem = (itemId: string) => {
    setChecklist(prev => prev.map(tab => ({
      ...tab,
      items: tab.items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    })));
  };
  
  const toggleSubItem = (itemId: string, subItemId: string) => {
    setChecklist(prev => prev.map(tab => ({
      ...tab,
      items: tab.items.map(item => {
        if (item.id === itemId && item.subItems) {
          return {
            ...item,
            subItems: item.subItems.map(sub =>
              sub.id === subItemId ? { ...sub, completed: !sub.completed } : sub
            )
          };
        }
        return item;
      })
    })));
  };
  
  // 그룹의 완료 상태 확인
  const isGroupCompleted = (item: ChecklistItem) => {
    if (!item.subItems) return false;
    return item.subItems.every(sub => sub.completed);
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isAllCompleted = currentTabCompleted === currentTabItems && currentTabItems > 0;

  // PDF 다운로드 핸들러
  const handleExportPDF = async () => {
    try {
      const result = await checklistAPI.exportPDF(checklist);
      if (result.success && result.pdfUrl) {
        window.open(result.pdfUrl, '_blank');
        alert('PDF가 생성되었습니다!');
      }
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    }
  };

  // 이메일 전송 핸들러
  const handleSendEmail = async () => {
    try {
      const result = await checklistAPI.sendEmail('user@example.com', checklist);
      if (result.success) {
        alert(result.message || '이메일이 전송되었습니다!');
      }
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      alert('이메일 전송 중 오류가 발생했습니다.');
    }
  };

  // 등기부등본 발급 핸들러
  const handleIssueRegistry = async () => {
    try {
      const result = await checklistAPI.issueRegistry('', '', '');
      if (result.success && result.registryUrl) {
        window.open(result.registryUrl, '_blank');
        alert(result.message || '등기부등본이 발급되었습니다!');
      }
    } catch (error) {
      console.error('등기부등본 발급 실패:', error);
      alert('등기부등본 발급 중 오류가 발생했습니다.');
    }
  };

  // 보증보험 확인 핸들러
  const handleCheckInsurance = async () => {
    try {
      const result = await checklistAPI.checkInsurance({
        address: '',
        deposit: 0,
        monthlyRent: 0
      });
      
      if (result.success) {
        alert(`${result.message}\n\n${result.details || ''}`);
      }
    } catch (error) {
      console.error('보증보험 확인 실패:', error);
      alert('보증보험 확인 중 오류가 발생했습니다.');
    }
  };

  // 위험도 분석 핸들러
  const handleAnalyzeRisk = async () => {
    try {
      const result = await checklistAPI.analyzeRisk({
        address: '',
        marketPrice: 0,
        deposit: 0
      });
      
      if (result.success) {
        const recommendations = result.recommendations?.join('\n• ') || '';
        alert(`위험도 분석 결과\n\n위험도: ${result.riskLevel} (점수: ${result.riskScore})\n\n${result.message}\n\n권장사항:\n• ${recommendations}`);
      }
    } catch (error) {
      console.error('위험도 분석 실패:', error);
      alert('위험도 분석 중 오류가 발생했습니다.');
    }
  };

  // 서브 항목 렌더링 함수
  const renderSubItem = (parentId: string, subItem: SubChecklistItem) => {
    const isExpanded = expandedItems.has(subItem.id);
    
    return (
      <div
        key={subItem.id}
        style={{
          marginBottom: '8px',
          marginLeft: '4px',
          border: '1px solid #E8E8E8',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: subItem.completed ? '#F8F8F8' : '#FFFFFF'
        }}
      >
        {/* Sub Item Header */}
        <div
          style={{
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {/* Icon */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleSubItem(parentId, subItem.id);
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: subItem.completed ? '#8FBF4D' : '#E8E8E8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              color: subItem.completed ? '#FFFFFF' : '#5A7A3C'
            }}>
            {getItemIcon(subItem.title)}
          </div>

          {/* Title */}
          <div
            onClick={() => toggleExpand(subItem.id)}
            style={{
              flex: 1,
              cursor: 'pointer'
            }}>
            <h5 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: subItem.completed ? '#999999' : '#2C2C2C',
              textDecoration: subItem.completed ? 'line-through' : 'none',
              margin: 0
            }}>
              {subItem.title}
            </h5>
          </div>

          {/* Expand Icon */}
          <div
            onClick={() => toggleExpand(subItem.id)}
            style={{
              color: '#999999',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>

          {/* Checkbox */}
          <input
            type="checkbox"
            checked={subItem.completed}
            onChange={(e) => {
              e.stopPropagation();
              toggleSubItem(parentId, subItem.id);
            }}
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              accentColor: '#8FBF4D',
              flexShrink: 0
            }}
          />
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div style={{
            padding: '0 18px 16px',
            borderTop: '1px solid #F0F0F0'
          }}>
            {/* What is it */}
            <div style={{
              backgroundColor: '#E3F2FD',
              borderRadius: '8px',
              padding: '14px',
              marginTop: '14px',
              marginBottom: '10px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#2196F3',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  Q
                </div>
                <div style={{ flex: 1 }}>
                  <h6 style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#1976D2',
                    margin: '0 0 6px 0'
                  }}>
                    이게 뭐예요?
                  </h6>
                  <p style={{
                    fontSize: '12px',
                    color: '#424242',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {subItem.whatIsIt}
                  </p>
                </div>
              </div>
            </div>

            {/* Why do it */}
            <div style={{
              backgroundColor: '#FFF3E0',
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#FF9800',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  A
                </div>
                <div style={{ flex: 1 }}>
                  <h6 style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#E65100',
                    margin: '0 0 6px 0'
                  }}>
                    왜 해야 하나요?
                  </h6>
                  <p style={{
                    fontSize: '12px',
                    color: '#424242',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {subItem.whyDoIt}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Additional Note */}
            {subItem.additionalNote && (
              <div style={{
                backgroundColor: '#FFF8E1',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px',
                borderLeft: '3px solid #FFC107'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#F57C00',
                  lineHeight: '1.5',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  💡 {subItem.additionalNote}
                </p>
              </div>
            )}

            {/* Ask Chatbot Button */}
            <button
              onClick={() => navigate('/chatbot')}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #8FBF4D',
                backgroundColor: '#FFFFFF',
                color: '#8FBF4D',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <MessageCircle size={14} />
              어미새에게 자세히 물어보기
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF8F3'
    }}>
      {/* Top Navigation */}
      <Navigation />

      {/* Header */}
      <div style={{
        textAlign: 'center',
        padding: '40px 40px 30px',
        backgroundColor: '#F5F3E6'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '12px'
        }}>
          <img
            src="/baby.png"
            alt="아기새"
            style={{
              width: '56px',
              height: '56px',
              objectFit: 'contain'
            }}
          />
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#2C2C2C',
            letterSpacing: '-0.5px'
          }}>
            둥지 짓기 플랜
          </h1>
        </div>
        <p style={{
          fontSize: '14px',
          color: '#666666',
          letterSpacing: '-0.2px'
        }}>
          집 구하는 순서대로 하나씩 따라해보세요
        </p>
      </div>

      {/* Main Content Card */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 20px 60px'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}>
          {/* Card Header */}
          <div style={{
            padding: '24px 28px',
            borderBottom: '1px solid #E8E8E8'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#2C2C2C'
              }}>
                전월세 계약 체크리스트
              </h3>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #8FBF4D',
                    borderRadius: '20px',
                    color: '#8FBF4D',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onClick={handleExportPDF}
                >
                  <Download size={14} />
                  PDF
                </button>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#8FBF4D',
                    border: 'none',
                    borderRadius: '20px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onClick={handleSendEmail}
                >
                  <Mail size={14} />
                  메일
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '20px'
            }}>
              {checklist.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px',
                    backgroundColor: activeTab === tab.id ? '#8FBF4D' : '#FFFFFF',
                    color: activeTab === tab.id ? '#FFFFFF' : '#666666',
                    border: activeTab === tab.id ? 'none' : '1px solid #E8E8E8',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: activeTab === tab.id ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div style={{
              position: 'relative',
              marginBottom: '12px'
            }}>
              <div style={{
                height: '32px',
                backgroundColor: '#F0F0F0',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${currentTabProgress}%`,
                  backgroundColor: '#8FBF4D',
                  transition: 'width 0.3s ease',
                  borderRadius: '16px'
                }} />
                {/* Baby Bird Icon - flying to the nest */}
                {currentTabProgress < 100 && (
                  <img
                    src="/baby.png"
                    alt="아기새"
                    style={{
                      position: 'absolute',
                      left: `calc(${currentTabProgress}% - 7px)`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain',
                      transition: 'left 0.3s ease',
                      zIndex: 2,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}
                  />
                )}
                {/* Nest Icon - empty nest or baby in nest when complete */}
                <img
                  src={currentTabProgress >= 100 ? "/rest.png" : "/nest.png"}
                  alt={currentTabProgress >= 100 ? "아기새가 둥지에 도착" : "빈 둥지"}
                  style={{
                    position: 'absolute',
                    right: '4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    objectFit: 'contain',
                    transition: 'opacity 0.3s ease',
                    zIndex: 1,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
                  }}
                />
              </div>
              <div style={{
                position: 'absolute',
                right: '48px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '13px',
                fontWeight: '700',
                color: '#2C2C2C'
              }}>
                {currentTabCompleted} / {currentTabItems} 완료
              </div>
            </div>

            {/* Celebration Message */}
            {isAllCompleted && (
              <div style={{
                textAlign: 'center',
                padding: '8px',
                backgroundColor: '#E8F5E9',
                borderRadius: '8px',
                marginTop: '12px'
              }}>
                <span style={{
                  fontSize: '14px',
                  color: '#2E7D32',
                  fontWeight: '600'
                }}>
                  🎉 축하합니다! 아기새가 둥지에 안착했어요!
                </span>
              </div>
            )}
          </div>

          {/* Checklist Items */}
          <div style={{
            padding: '20px 28px 28px'
          }}>
            {currentTab?.items.map((item) => {
              // 그룹 헤더인 경우
              if (item.isGroup && item.subItems) {
                const isGroupExpanded = expandedItems.has(item.id);
                const groupCompleted = isGroupCompleted(item);
                
                return (
                  <div key={item.id} style={{
                    marginBottom: '16px',
                    borderLeft: '4px solid #8FBF4D',
                    borderRadius: '12px',
                    paddingLeft: '16px'
                  }}>
                    {/* Group Header - 클릭 가능 */}
                    <div
                      style={{
                        padding: '16px 20px 16px 4px',
                        borderRadius: '12px',
                        marginBottom: isGroupExpanded ? '12px' : '0',
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleExpand(item.id)}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        {/* Icon */}
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: groupCompleted ? '#8FBF4D' : '#7AA83F',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: '#FFFFFF'
                        }}>
                          {getItemIcon(item.title)}
                        </div>

                        {/* Title */}
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            fontSize: '15px',
                            fontWeight: '700',
                            color: groupCompleted ? '#999999' : '#5A7A3C',
                            textDecoration: groupCompleted ? 'line-through' : 'none',
                            margin: 0
                          }}>
                            {item.title}
                          </h4>
                        </div>

                        {/* Expand Icon */}
                        <div style={{ color: '#7AA83F' }}>
                          {isGroupExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {/* Sub Items - 토글되었을 때만 표시 */}
                    {isGroupExpanded && (
                      <>
                        {item.subItems.map(subItem => renderSubItem(item.id, subItem))}

                        {/* Group Buttons */}
                        {item.buttons && item.buttons.length > 0 && (
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                            marginTop: '12px',
                            marginLeft: '4px',
                            marginBottom: '12px'
                          }}>
                            {item.buttons.map((button, btnIndex) => (
                              <button
                                key={btnIndex}
                                onClick={() => {
                                  if (button.url) {
                                    window.open(button.url, '_blank');
                                  } else if (button.type === 'primary') {
                                    // TODO: 웹훅 연결 예정
                                    console.log('문서 분석 요청:', button.label);
                                  } else if (button.type === 'modal') {
                                    alert('준비 중입니다.');
                                  }
                                }}
                                style={{
                                  flex: '1 1 auto',
                                  minWidth: '140px',
                                  padding: '12px 20px',
                                  borderRadius: '8px',
                                  border: button.type === 'primary' ? 'none' : '1px solid #8FBF4D',
                                  backgroundColor: button.type === 'primary' ? '#8FBF4D' : '#FFFFFF',
                                  color: button.type === 'primary' ? '#FFFFFF' : '#8FBF4D',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                {button.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              }
              
              // 일반 항목인 경우
              const isExpanded = expandedItems.has(item.id);
              
              return (
                <div
                  key={item.id}
                  style={{
                    marginBottom: '12px',
                    border: '1px solid #E8E8E8',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: item.completed ? '#F8F8F8' : '#FFFFFF'
                  }}
                >
                  {/* Item Header */}
                  <div
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleExpand(item.id)}
                  >
                    {/* Icon */}
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: item.completed ? '#8FBF4D' : '#E8E8E8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: item.completed ? '#FFFFFF' : '#5A7A3C'
                    }}>
                      {getItemIcon(item.title)}
                    </div>

                    {/* Title */}
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: item.completed ? '#999999' : '#2C2C2C',
                        textDecoration: item.completed ? 'line-through' : 'none',
                        margin: 0
                      }}>
                        {item.title}
                      </h4>
                    </div>

                    {/* Expand Icon */}
                    <div style={{ color: '#999999' }}>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>

                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={item.completed || false}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleItem(item.id);
                      }}
                      style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        accentColor: '#8FBF4D',
                        flexShrink: 0
                      }}
                    />
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div style={{
                      padding: '0 20px 20px',
                      borderTop: '1px solid #F0F0F0'
                    }}>
                      {/* What is it */}
                      <div style={{
                        backgroundColor: '#E3F2FD',
                        borderRadius: '8px',
                        padding: '16px',
                        marginTop: '16px',
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px'
                        }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#2196F3',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '700',
                            flexShrink: 0
                          }}>
                            Q
                          </div>
                          <div style={{ flex: 1 }}>
                            <h5 style={{
                              fontSize: '13px',
                              fontWeight: '700',
                              color: '#1976D2',
                              margin: '0 0 8px 0'
                            }}>
                              이게 뭐예요?
                            </h5>
                            <p style={{
                              fontSize: '13px',
                              color: '#424242',
                              lineHeight: '1.6',
                              margin: 0
                            }}>
                              {item.whatIsIt}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Why do it */}
                      <div style={{
                        backgroundColor: '#FFF3E0',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px'
                        }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#FF9800',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '700',
                            flexShrink: 0
                          }}>
                            A
                          </div>
                          <div style={{ flex: 1 }}>
                            <h5 style={{
                              fontSize: '13px',
                              fontWeight: '700',
                              color: '#E65100',
                              margin: '0 0 8px 0'
                            }}>
                              왜 해야 하나요?
                            </h5>
                            <p style={{
                              fontSize: '13px',
                              color: '#424242',
                              lineHeight: '1.6',
                              margin: 0
                            }}>
                              {item.whyDoIt}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {item.buttons && item.buttons.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '10px',
                          marginBottom: '12px'
                        }}>
                          {item.buttons.map((button, btnIndex) => (
                            <button
                              key={btnIndex}
                              onClick={() => {
                                if (button.url) {
                                  window.open(button.url, '_blank');
                                } else if (button.label === '등기부등본 발급받기') {
                                  handleIssueRegistry();
                                } else if (button.label === '보증보험 가입 가능 여부 확인') {
                                  handleCheckInsurance();
                                } else if (button.label === '깡통전세 위험도 분석') {
                                  handleAnalyzeRisk();
                                } else if (button.type === 'primary') {
                                  // TODO: 웹훅 연결 예정
                                  console.log('문서 분석 요청:', button.label);
                                } else if (button.type === 'modal') {
                                  alert('준비 중입니다.');
                                }
                              }}
                              style={{
                                flex: '1 1 auto',
                                minWidth: '140px',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                border: button.type === 'primary' ? 'none' : '1px solid #2D7A8E',
                                backgroundColor: button.type === 'primary' ? '#2D7A8E' : '#FFFFFF',
                                color: button.type === 'primary' ? '#FFFFFF' : '#2D7A8E',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              {button.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Ask Chatbot Button */}
                      <button
                        onClick={() => navigate('/chatbot')}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #8FBF4D',
                          backgroundColor: '#FFFFFF',
                          color: '#8FBF4D',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <MessageCircle size={16} />
                        어미새에게 자세히 물어보기
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}