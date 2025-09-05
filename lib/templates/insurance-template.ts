import { Template } from './types'

export const insuranceTemplate: Template = {
  id: 'insurance-001',
  name: '보험 상담 리드 수집',
  description: '신뢰감 있는 보험 상담 신청 랜딩페이지',
  category: 'insurance',
  settings: {
    primaryColor: '#1E40AF',
    secondaryColor: '#059669',
    fontFamily: 'Pretendard',
    borderRadius: 'md',
    spacing: 'normal',
  },
  blocks: [
    {
      id: 'hero-insurance',
      type: 'hero',
      data: {
        title: '월 보험료를 30% 절약하는 방법',
        subtitle: '전문가 무료 상담으로 나에게 딱 맞는 보험 찾기',
        backgroundImage: '/images/insurance-hero.jpg',
        ctaText: '무료 상담 신청하기',
        ctaAction: '#form',
        features: [
          '✓ 15개 보험사 한 번에 비교',
          '✓ 불필요한 보장 제거',
          '✓ 평균 30% 보험료 절감',
        ],
      },
    },
    {
      id: 'benefits-insurance',
      type: 'benefits',
      data: {
        title: '왜 우리 서비스를 선택해야 할까요?',
        benefits: [
          {
            icon: '💰',
            title: '보험료 절감',
            description: '중복 보장 제거와 최적화로 평균 30% 보험료 절감',
          },
          {
            icon: '🔍',
            title: '맞춤형 분석',
            description: '가족 구성, 연령, 직업을 고려한 맞춤 보험 설계',
          },
          {
            icon: '👨‍⚕️',
            title: '전문가 상담',
            description: '10년 이상 경력의 전문 설계사 1:1 상담',
          },
          {
            icon: '📊',
            title: '객관적 비교',
            description: '특정 보험사에 치우치지 않은 공정한 비교',
          },
          {
            icon: '🛡️',
            title: '평생 관리',
            description: '가입 후에도 지속적인 보험 관리 서비스',
          },
          {
            icon: '💯',
            title: '100% 무료',
            description: '상담부터 가입까지 모든 서비스 무료',
          },
        ],
      },
    },
    {
      id: 'comparison-insurance',
      type: 'comparison',
      data: {
        title: '일반 보험 가입 vs 전문가 상담 후 가입',
        subtitle: '똑똑한 선택으로 차이를 만드세요',
        columns: [
          {
            title: '일반 가입',
            highlight: false,
            features: [
              { text: '평균 월 보험료', value: '45만원', negative: true },
              { text: '불필요한 특약', value: '3~5개', negative: true },
              { text: '보장 공백', value: '있음', negative: true },
              { text: '정기 점검', value: '없음', negative: true },
              { text: '보험금 청구 도움', value: '없음', negative: true },
            ],
          },
          {
            title: '전문가 상담 후',
            highlight: true,
            badge: '추천',
            features: [
              { text: '평균 월 보험료', value: '32만원', positive: true },
              { text: '불필요한 특약', value: '0개', positive: true },
              { text: '보장 공백', value: '없음', positive: true },
              { text: '정기 점검', value: '연 2회', positive: true },
              { text: '보험금 청구 도움', value: '전담 지원', positive: true },
            ],
          },
        ],
      },
    },
    {
      id: 'testimonials-insurance',
      type: 'testimonials',
      data: {
        title: '실제 고객님들의 후기',
        subtitle: '매달 3,000명이 선택하는 이유',
        testimonials: [
          {
            name: '김○○',
            age: '30대 직장인',
            rating: 5,
            content: '결혼 준비하면서 보험을 정리하고 싶었는데, 전문가 상담 받고 월 15만원을 절약했어요. 그 돈으로 적금을 들었습니다.',
            date: '2024년 8월',
            savings: '월 15만원 절약',
          },
          {
            name: '박○○',
            age: '40대 자영업자',
            rating: 5,
            content: '암보험만 3개나 들어있었는데 정작 중요한 상해보험은 없었어요. 전체적으로 재설계해서 보장은 늘고 보험료는 줄었습니다.',
            date: '2024년 7월',
            savings: '월 22만원 절약',
          },
          {
            name: '이○○',
            age: '50대 주부',
            rating: 5,
            content: '남편 은퇴 준비하면서 보험료 부담을 줄이고 싶었어요. 불필요한 특약 정리하고 연금보험으로 전환해서 노후 준비까지 했네요.',
            date: '2024년 8월',
            savings: '월 35만원 절약',
          },
        ],
      },
    },
    {
      id: 'process-insurance',
      type: 'process',
      data: {
        title: '간단한 상담 프로세스',
        steps: [
          {
            number: '1',
            title: '상담 신청',
            description: '간단한 정보 입력 (1분)',
          },
          {
            number: '2',
            title: '전문가 배정',
            description: '24시간 내 전문가 연결',
          },
          {
            number: '3',
            title: '맞춤 분석',
            description: '현재 보험 분석 및 개선안 제시',
          },
          {
            number: '4',
            title: '최적화 실행',
            description: '불필요한 보장 제거, 필요한 보장 추가',
          },
        ],
      },
    },
    {
      id: 'urgency-insurance',
      type: 'urgency',
      data: {
        title: '🎁 지금 신청하시면 특별 혜택!',
        benefits: [
          '보험 분석 리포트 무료 제공 (5만원 상당)',
          '첫 달 보험료 캐시백 (최대 10만원)',
          '평생 무료 보험 관리 서비스',
        ],
        deadline: '2024년 9월 30일까지',
        remainingSpots: 50,
      },
    },
    {
      id: 'form-insurance',
      type: 'form',
      data: {
        title: '무료 보험 상담 신청',
        subtitle: '1분이면 신청 완료! 전문가가 연락드립니다',
        fields: [
          {
            type: 'text',
            name: 'name',
            label: '이름',
            required: true,
            placeholder: '홍길동',
          },
          {
            type: 'tel',
            name: 'phone',
            label: '연락처',
            required: true,
            placeholder: '010-1234-5678',
          },
          {
            type: 'select',
            name: 'age',
            label: '연령대',
            required: true,
            options: [
              { value: '20s', label: '20대' },
              { value: '30s', label: '30대' },
              { value: '40s', label: '40대' },
              { value: '50s', label: '50대' },
              { value: '60s', label: '60대 이상' },
            ],
          },
          {
            type: 'select',
            name: 'insuranceType',
            label: '관심 보험',
            required: true,
            options: [
              { value: 'life', label: '생명보험' },
              { value: 'health', label: '건강보험' },
              { value: 'cancer', label: '암보험' },
              { value: 'accident', label: '상해보험' },
              { value: 'pension', label: '연금보험' },
              { value: 'all', label: '전체 점검' },
            ],
          },
          {
            type: 'select',
            name: 'currentPremium',
            label: '현재 월 보험료',
            required: true,
            options: [
              { value: 'none', label: '보험 없음' },
              { value: 'under20', label: '20만원 미만' },
              { value: '20to40', label: '20-40만원' },
              { value: '40to60', label: '40-60만원' },
              { value: 'over60', label: '60만원 이상' },
            ],
          },
          {
            type: 'radio',
            name: 'consultTime',
            label: '상담 가능 시간',
            required: true,
            options: [
              { value: 'morning', label: '오전 (9시-12시)' },
              { value: 'afternoon', label: '오후 (12시-6시)' },
              { value: 'evening', label: '저녁 (6시-9시)' },
              { value: 'anytime', label: '상관없음' },
            ],
          },
        ],
        submitText: '무료 상담 신청하기',
        consentText: '개인정보 수집 및 이용에 동의합니다',
      },
    },
    {
      id: 'faq-insurance',
      type: 'faq',
      data: {
        title: '자주 묻는 질문',
        faqs: [
          {
            question: '정말 무료인가요?',
            answer: '네, 100% 무료입니다. 보험사로부터 수수료를 받기 때문에 고객님께는 비용을 받지 않습니다.',
          },
          {
            question: '특정 보험사 상품만 권유하지 않나요?',
            answer: '아닙니다. 15개 이상 보험사 상품을 공정하게 비교해서 고객님께 가장 유리한 상품을 추천합니다.',
          },
          {
            question: '기존 보험을 해지해야 하나요?',
            answer: '무조건 해지를 권하지 않습니다. 분석 후 유지, 변경, 해지 중 가장 유리한 방법을 제안합니다.',
          },
          {
            question: '상담 후 꼭 가입해야 하나요?',
            answer: '아닙니다. 상담은 정보 제공이 목적이며, 가입 여부는 고객님이 결정하시면 됩니다.',
          },
          {
            question: '개인정보는 안전한가요?',
            answer: '개인정보보호법에 따라 안전하게 관리되며, 상담 목적 외에는 사용되지 않습니다.',
          },
        ],
      },
    },
  ],
}