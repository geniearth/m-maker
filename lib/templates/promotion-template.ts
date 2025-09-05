import { Template } from './types'

export const promotionTemplate: Template = {
  id: 'promotion-001',
  name: '이벤트 프로모션',
  description: '긴급성과 혜택을 강조하는 프로모션 랜딩페이지',
  category: 'promotion',
  settings: {
    primaryColor: '#DC2626',
    secondaryColor: '#F59E0B',
    fontFamily: 'Pretendard',
    borderRadius: 'lg',
    spacing: 'compact',
  },
  blocks: [
    {
      id: 'hero-promotion',
      type: 'hero',
      data: {
        title: '🔥 단 3일간! 역대급 할인 이벤트',
        subtitle: '최대 70% 할인 + 무료배송 + 사은품 증정',
        backgroundImage: '/images/promotion-hero.jpg',
        ctaText: '지금 바로 구매하기',
        ctaAction: '#form',
        features: [
          '⏰ 72시간 한정 특가',
          '🎁 10만원 이상 구매 시 사은품',
          '🚚 전 상품 무료배송',
        ],
      },
    },
    {
      id: 'countdown-promotion',
      type: 'urgency',
      data: {
        title: '⏰ 이벤트 종료까지',
        countdownTimer: true,
        deadline: '2024-09-08T23:59:59',
        benefits: [
          '최대 70% 할인 적용',
          '선착순 500명 추가 20% 쿠폰',
          '포인트 2배 적립',
        ],
      },
    },
    {
      id: 'deals-promotion',
      type: 'pricing',
      data: {
        title: '놓치면 후회하는 특가 상품',
        subtitle: '인기 상품 한정 수량 특별가',
        products: [
          {
            name: '프리미엄 세트 A',
            originalPrice: '198,000원',
            salePrice: '59,400원',
            discount: '70%',
            features: [
              '정품 3종 세트',
              '여행용 파우치 증정',
              '샘플 5종 추가',
            ],
            stock: 50,
            badge: 'BEST',
          },
          {
            name: '베스트 세트 B',
            originalPrice: '158,000원',
            salePrice: '63,200원',
            discount: '60%',
            features: [
              '정품 2종 세트',
              '미니어처 3종',
              '쿠션 퍼프 증정',
            ],
            stock: 100,
            badge: 'HOT',
          },
          {
            name: '스타터 세트 C',
            originalPrice: '98,000원',
            salePrice: '49,000원',
            discount: '50%',
            features: [
              '정품 1종',
              '트래블 키트',
              '마스크팩 10매',
            ],
            stock: 200,
            badge: 'NEW',
          },
        ],
      },
    },
    {
      id: 'benefits-promotion',
      type: 'benefits',
      data: {
        title: '이번 이벤트만의 특별 혜택',
        benefits: [
          {
            icon: '💰',
            title: '최대 70% 할인',
            description: '정가 대비 최대 70% 할인된 가격',
          },
          {
            icon: '🎁',
            title: '푸짐한 사은품',
            description: '구매 금액별 다양한 사은품 증정',
          },
          {
            icon: '🚚',
            title: '무료배송',
            description: '금액 상관없이 전국 무료배송',
          },
          {
            icon: '💳',
            title: '무이자 할부',
            description: '3~12개월 무이자 할부 가능',
          },
          {
            icon: '🎯',
            title: '포인트 2배',
            description: '구매 금액의 2% 포인트 적립',
          },
          {
            icon: '🔄',
            title: '7일 교환/환불',
            description: '구매 후 7일 이내 교환/환불 가능',
          },
        ],
      },
    },
    {
      id: 'social-proof-promotion',
      type: 'testimonials',
      data: {
        title: '이미 구매한 고객들의 실시간 후기',
        subtitle: '지난 24시간 동안 1,234명이 구매했습니다',
        testimonials: [
          {
            name: '김○○',
            age: '서울',
            rating: 5,
            content: '이 가격에 이런 구성은 처음이에요. 바로 2세트 더 주문했습니다!',
            date: '방금 전',
          },
          {
            name: '이○○',
            age: '부산',
            rating: 5,
            content: '작년에도 샀는데 올해도 놓칠 수 없어서 구매! 선물용으로도 최고예요.',
            date: '5분 전',
          },
          {
            name: '박○○',
            age: '대구',
            rating: 5,
            content: '친구 추천으로 구매했는데 정말 대박이네요. 사은품도 알차고 좋아요!',
            date: '10분 전',
          },
        ],
      },
    },
    {
      id: 'stock-status',
      type: 'urgency',
      data: {
        title: '🔥 실시간 재고 현황',
        subtitle: '인기 상품은 빠르게 품절되고 있습니다!',
        benefits: [
          '프리미엄 세트 A: 잔여 12개 (88% 판매)',
          '베스트 세트 B: 잔여 34개 (66% 판매)',
          '스타터 세트 C: 잔여 89개 (55% 판매)',
        ],
      },
    },
    {
      id: 'bonus-gifts',
      type: 'benefits',
      data: {
        title: '구매 금액별 사은품',
        benefits: [
          {
            icon: '🎁',
            title: '5만원 이상',
            description: '미니어처 3종 세트 (2만원 상당)',
          },
          {
            icon: '🎁',
            title: '10만원 이상',
            description: '정품 클렌징폼 + 파우치 (4만원 상당)',
          },
          {
            icon: '🎁',
            title: '15만원 이상',
            description: '프리미엄 에센스 정품 (7만원 상당)',
          },
        ],
      },
    },
    {
      id: 'form-promotion',
      type: 'form',
      data: {
        title: '초특가 구매 신청',
        subtitle: '품절되기 전에 지금 바로 주문하세요!',
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
            name: 'product',
            label: '구매 상품',
            required: true,
            options: [
              { value: 'premium', label: '프리미엄 세트 A (70% 할인)' },
              { value: 'best', label: '베스트 세트 B (60% 할인)' },
              { value: 'starter', label: '스타터 세트 C (50% 할인)' },
              { value: 'all', label: '전 상품 구매 (추가 10% 할인)' },
            ],
          },
          {
            type: 'select',
            name: 'quantity',
            label: '수량',
            required: true,
            options: [
              { value: '1', label: '1개' },
              { value: '2', label: '2개 (추가 5% 할인)' },
              { value: '3', label: '3개 (추가 10% 할인)' },
              { value: '4', label: '4개 이상' },
            ],
          },
          {
            type: 'text',
            name: 'address',
            label: '배송지 주소',
            required: true,
            placeholder: '서울시 강남구...',
          },
          {
            type: 'radio',
            name: 'payment',
            label: '결제 방법',
            required: true,
            options: [
              { value: 'card', label: '신용카드' },
              { value: 'transfer', label: '계좌이체' },
              { value: 'phone', label: '휴대폰 결제' },
              { value: 'kakao', label: '카카오페이' },
            ],
          },
          {
            type: 'textarea',
            name: 'memo',
            label: '배송 메모',
            required: false,
            placeholder: '부재 시 경비실에 맡겨주세요',
          },
        ],
        submitText: '지금 바로 구매하기',
        consentText: '개인정보 수집 및 이용에 동의합니다',
      },
    },
    {
      id: 'guarantee',
      type: 'trust',
      data: {
        title: '안심하고 구매하세요',
        badges: [
          { icon: '✅', text: '정품 보증' },
          { icon: '🛡️', text: '안전 결제' },
          { icon: '🚚', text: '당일 발송' },
          { icon: '💯', text: '100% 환불 보장' },
          { icon: '📞', text: '고객센터 운영' },
          { icon: '⭐', text: '베스트셀러 1위' },
        ],
      },
    },
    {
      id: 'faq-promotion',
      type: 'faq',
      data: {
        title: '자주 묻는 질문',
        faqs: [
          {
            question: '정품인가요?',
            answer: '100% 정품입니다. 공식 수입원을 통해 들어온 제품으로 정품 인증 스티커가 부착되어 있습니다.',
          },
          {
            question: '언제 배송되나요?',
            answer: '오후 3시 이전 주문 시 당일 발송됩니다. 보통 1-2일 내에 받아보실 수 있습니다.',
          },
          {
            question: '교환/환불이 가능한가요?',
            answer: '제품 수령 후 7일 이내 미개봉 제품에 한해 교환/환불이 가능합니다.',
          },
          {
            question: '할인 쿠폰과 중복 적용되나요?',
            answer: '이벤트 가격은 이미 최대 할인이 적용된 가격으로 추가 쿠폰 적용은 불가합니다.',
          },
          {
            question: '재고가 떨어지면 어떻게 되나요?',
            answer: '선착순 마감되며, 다음 이벤트는 미정입니다. 놓치지 마세요!',
          },
        ],
      },
    },
  ],
}