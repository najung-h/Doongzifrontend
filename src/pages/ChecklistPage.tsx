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
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { checklistAPI } from '../api/checklist';
import Navigation from '../components/common/Navigation';
import RiskAnalysisModal from '../components/common/RiskAnalysisModal';
import RegistryAnalysisModal from '../components/common/RegistryAnalysisModal';
import ContractAnalysisModal from '../components/common/ContractAnalysisModal';
import BuildingAnalysisModal from '../components/common/BuildingAnalysisModal';

// --- Types ---
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
  whatIsIt?: string;
  whyDoIt?: string;
  subItems?: SubChecklistItem[];
  buttons?: Array<{
    label: string;
    url?: string;
    type?: 'primary' | 'secondary' | 'modal';
  }>;
  isGroup?: boolean;
};

type ChecklistTab = {
  id: 'before' | 'during' | 'after';
  name: string;
  items: ChecklistItem[];
};

// --- Icon Helper ---
const getItemIcon = (title: string) => {
  const iconProps = { size: 20, strokeWidth: 2 }; // 아이콘 크기 통일

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

// --- Initial Data ---
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
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isRegistryModalOpen, setIsRegistryModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);

  const currentTab = checklist.find(tab => tab.id === activeTab);

  // 현재 탭의 진행률 계산
  const getAllCheckableItems = () => {
    let totalItems = 0;
    let completedItems = 0;

    currentTab?.items.forEach(item => {
      if (item.isGroup && item.subItems) {
        totalItems += item.subItems.length;
        completedItems += item.subItems.filter(sub => sub.completed).length;
      } else if (!item.isGroup) {
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

  const handleSendEmail = async () => {
    try {
      // TODO: 실제 userId 사용
      const result = await checklistAPI.sendEmail('asgi.doongzi@gmail.com', checklist);
      if (result.success) {
        alert(result.message || '이메일이 전송되었습니다!');
      }
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      alert('이메일 전송 중 오류가 발생했습니다.');
    }
  };

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

  const handleAnalyzeRisk = () => {
    setIsRiskModalOpen(true);
  };

  // Sub Item Renderer
  const renderSubItem = (parentId: string, subItem: SubChecklistItem) => {
    const isExpanded = expandedItems.has(subItem.id);

    return (
      <div
        key={subItem.id}
        className={`mb-3 ml-1 border rounded-xl overflow-hidden transition-all duration-200
          ${subItem.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}
      >
        <div className="p-4 flex items-center gap-3">
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleSubItem(parentId, subItem.id);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors
              ${subItem.completed ? 'bg-[var(--color-accent-green)] text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
          >
            {getItemIcon(subItem.title)}
          </div>

          <div onClick={() => toggleExpand(subItem.id)} className="flex-1 cursor-pointer">
            <h5 className={`text-sm font-bold m-0 ${subItem.completed ? 'text-gray-400 line-through' : 'text-[var(--color-text-primary)]'}`}>
              {subItem.title}
            </h5>
          </div>

          <div onClick={() => toggleExpand(subItem.id)} className="text-gray-400 cursor-pointer">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          <input
            type="checkbox"
            checked={subItem.completed}
            onChange={(e) => {
              e.stopPropagation();
              toggleSubItem(parentId, subItem.id);
            }}
            className="w-5 h-5 cursor-pointer accent-[var(--color-accent-green)] shrink-0"
          />
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
            {/* What is it */}
            <div className="bg-blue-50 rounded-lg p-4 mt-4 mb-3 border border-blue-100">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  Q
                </div>
                <div className="flex-1">
                  <h6 className="text-xs font-bold text-blue-700 mb-1">이게 뭐예요?</h6>
                  <p className="text-xs text-gray-700 leading-relaxed m-0">{subItem.whatIsIt}</p>
                </div>
              </div>
            </div>

            {/* Why do it */}
            <div className="bg-orange-50 rounded-lg p-4 mb-3 border border-orange-100">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  A
                </div>
                <div className="flex-1">
                  <h6 className="text-xs font-bold text-orange-800 mb-1">왜 해야 하나요?</h6>
                  <p className="text-xs text-gray-700 leading-relaxed m-0">{subItem.whyDoIt}</p>
                </div>
              </div>
            </div>

            {subItem.additionalNote && (
              <div className="bg-yellow-50 rounded-lg p-3 mb-3 border-l-4 border-yellow-400">
                <p className="text-xs text-yellow-800 leading-relaxed m-0 font-medium">
                  💡 {subItem.additionalNote}
                </p>
              </div>
            )}

            <button
              onClick={() => navigate('/chatbot')}
              className="w-full py-2.5 rounded-lg border border-[var(--color-accent-green)] bg-white text-[var(--color-accent-green)] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-bg-secondary)] transition-colors"
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
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Navigation />

      {/* Header */}
      <div className="text-center pt-12 pb-10 px-5 bg-[var(--color-bg-secondary)] border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-3">
          <img src="/baby.png" alt="아기새" className="w-12 h-12 object-contain drop-shadow-md" />
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
            둥지 짓기 플랜
          </h1>
        </div>
        <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
          집 구하는 순서대로 하나씩 따라해보세요
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-[800px] mx-auto px-4 md:px-5 -mt-8 pb-20 relative z-10">
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-gray-100">

          {/* Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
              전월세 계약 체크리스트
            </h3>
            <div className="flex gap-3 self-end md:self-auto">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] text-xs font-bold hover:bg-gray-50 transition-colors"
              >
                <Download size={14} /> PDF
              </button>
              <button
                onClick={handleSendEmail}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent-green)] text-white text-xs font-bold hover:bg-[#689F38] transition-colors shadow-md"
              >
                <Mail size={14} /> 메일
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100 rounded-2xl mb-8">
            {checklist.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-2 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-white text-[var(--color-accent-green)] shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-10 px-2">
            <div className="h-3 bg-gray-200 rounded-full relative overflow-visible">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${currentTabProgress}%`,
                  background: 'linear-gradient(90deg, #AED581 0%, var(--color-accent-green) 100%)'
                }}
              >
                {currentTabProgress < 100 && (
                  <div className="absolute -right-5 top-1/2 -translate-y-1/2 drop-shadow-md transform transition-all">
                    <img src="/baby.png" alt="아기새" className="w-10 h-10 object-contain" />
                  </div>
                )}
              </div>
            </div>
            <div className="text-right mt-3 text-xs font-bold text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-accent-green)]">{Math.round(currentTabProgress)}%</span> 달성 ({currentTabCompleted} / {currentTabItems})
            </div>
            
            {isAllCompleted && (
              <div className="mt-4 text-center p-3 bg-green-50 rounded-xl border border-green-100">
                <span className="text-sm font-bold text-green-700 flex items-center justify-center gap-2">
                  🎉 축하합니다! 아기새가 둥지에 안착했어요!
                </span>
              </div>
            )}
          </div>

          {/* Checklist Items List */}
          <div className="flex flex-col gap-4">
            {currentTab?.items.map((item) => {
              const isExpanded = expandedItems.has(item.id);
              const isGroup = item.isGroup && item.subItems;
              const isGroupCompleted = isGroup && isGroupCompleted(item);
              const isImportant = item.title.includes('확인') || item.title.includes('계약');

              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200
                    ${isExpanded
                      ? 'border-[var(--color-accent-green)] shadow-md ring-1 ring-[var(--color-accent-green)]'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {/* Header */}
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className={`p-5 flex items-center gap-4 cursor-pointer transition-colors
                      ${item.completed ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors
                        ${(item.completed || isGroupCompleted)
                          ? 'bg-[var(--color-accent-green)] text-white'
                          : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                      {getItemIcon(item.title)}
                    </div>

                    <div className="flex-1">
                      <h4 className={`text-base font-bold m-0 flex items-center flex-wrap gap-2
                        ${(item.completed || isGroupCompleted)
                          ? 'text-gray-400 line-through decoration-2 decoration-gray-300'
                          : 'text-[var(--color-text-primary)]'
                        }`}
                      >
                        {item.title}
                        {!item.completed && !isGroupCompleted && isImportant && (
                          <span className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 whitespace-nowrap">
                            필수
                          </span>
                        )}
                      </h4>
                    </div>

                    <div className="text-gray-400 shrink-0">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>

                    {!isGroup && (
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleItem(item.id);
                        }}
                        className="w-6 h-6 cursor-pointer accent-[var(--color-accent-green)] shrink-0 ml-2 rounded-md"
                      />
                    )}
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-6 border-t border-gray-100 bg-white">
                      {isGroup ? (
                        <div className="mt-4 flex flex-col gap-2">
                          {item.subItems?.map(subItem => renderSubItem(item.id, subItem))}
                        </div>
                      ) : (
                        <>
                          <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <h5 className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">Q</span>
                              이게 뭐예요?
                            </h5>
                            <p className="text-sm text-gray-700 leading-relaxed pl-7 m-0">{item.whatIsIt}</p>
                          </div>
                          <div className="mt-3 mb-4 bg-orange-50 rounded-xl p-4 border border-orange-100">
                            <h5 className="text-xs font-bold text-orange-800 mb-1 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">A</span>
                              왜 해야 하나요?
                            </h5>
                            <p className="text-sm text-gray-700 leading-relaxed pl-7 m-0">{item.whyDoIt}</p>
                          </div>
                        </>
                      )}

                      {/* Action Buttons */}
                      {item.buttons && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.buttons.map((btn, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (btn.url) {
                                  window.open(btn.url, '_blank');
                                } else if (btn.label === '보증보험 가입 가능 여부 확인') {
                                  handleCheckInsurance();
                                } else if (btn.label === '깡통전세 위험도 분석') {
                                  handleAnalyzeRisk();
                                } else if (btn.label === '등기부등본 분석하러가기') {
                                  setIsRegistryModalOpen(true);
                                } else if (btn.label === '계약서 분석하러가기') {
                                  setIsContractModalOpen(true);
                                } else if (btn.label === '건축물대장 분석하러가기') {
                                  setIsBuildingModalOpen(true);
                                } else if (btn.type === 'primary') {
                                  console.log('문서 분석 요청:', btn.label);
                                } else if (btn.type === 'modal') {
                                  alert('준비 중입니다.');
                                }
                              }}
                              className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200
                                ${btn.type === 'primary'
                                  ? 'bg-[var(--color-accent-green)] text-white hover:bg-[#689F38] shadow-md'
                                  : 'bg-white text-[var(--color-accent-green)] border border-[var(--color-accent-green)] hover:bg-green-50'
                                }`}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {!isGroup && (
                        <button
                          onClick={() => navigate('/chatbot')}
                          className="w-full mt-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                          <MessageCircle size={16} />
                          어미새에게 자세히 물어보기
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RiskAnalysisModal isOpen={isRiskModalOpen} onClose={() => setIsRiskModalOpen(false)} />
      <RegistryAnalysisModal isOpen={isRegistryModalOpen} onClose={() => setIsRegistryModalOpen(false)} />
      <ContractAnalysisModal isOpen={isContractModalOpen} onClose={() => setIsContractModalOpen(false)} />
      <BuildingAnalysisModal isOpen={isBuildingModalOpen} onClose={() => setIsBuildingModalOpen(false)} />
    </div>
  );
}