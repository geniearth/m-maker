import { Template } from './types'

export const reviewTemplate: Template = {
  id: 'review-001',
  name: '제품 리뷰 & 체험단 모집',
  description: '고객 후기와 체험을 강조하는 리뷰형 랜딩페이지',
  category: 'review',
  settings: {
    primaryColor: '#7C3AED',
    secondaryColor: '#EC4899',
    fontFamily: 'Pretendard',
    borderRadius: 'lg',
    spacing: 'relaxed',
  },
  blocks: [
    {
      id: 'hero-review',
      type: 'hero',
      data: {
        title: '3만명이 경험한 피부 변화의 비밀',
        subtitle: '2주만에 확실한 효과, 100% 천연 성분 화장품',
        backgroundImage: '/images/review-hero.jpg',
        ctaText: '무료 체험 신청하기',
        ctaAction: '#form',
        features: [
          '⭐ 평균 평점 4.9/5.0',
          '📝 실제 사용 후기 3,000개+',
          '🎁 첫 구매 50% 할인',
        ],
      },
    },
    {
      id: 'product-showcase',
      type: 'showcase',
      data: {
        title: '당신의 피부가 원하는 단 하나의 솔루션',
        products: [
          {
            image: '/images/product1.jpg',
            name: '하이드레이팅 세럼',
            price: '78,000원',
            discountPrice: '39,000원',
            badge: '50% OFF',
            features: ['히알루론산 3중 보습', '24시간 수분 지속', '민감 피부 테스트 완료'],
          },
        ],
      },
    },
    {
      id: 'reviews-highlight',
      type: 'testimonials',
      data: {
        title: '실제 사용자들의 생생한 후기',
        subtitle: '포토리뷰 1,000개 돌파! 직접 확인하세요',
        testimonials: [
          {
            name: '김○○',
            age: '30대 초반',
            rating: 5,
            content: '건조했던 피부가 하루 종일 촉촉해요. 메이크업도 훨씬 잘 먹고 지인들이 피부 좋아졌다고 물어봐요.',
            date: '2024년 8월',
            image: '/images/review1.jpg',
          },
          {
            name: '이○○',
            age: '20대 후반',
            rating: 5,
            content: '여드름 자국이 많았는데 2주 사용하니 확실히 옅어졌어요. 피부톤도 밝아지고 화장 안 한 날도 자신감 생겼어요!',
            date: '2024년 8월',
            image: '/images/review2.jpg',
          },
          {
            name: '박○○',
            age: '40대 초반',
            rating: 5,
            content: '주름 개선 효과가 정말 있네요. 팔자주름이 옅어지고 피부 탄력이 살아났어요. 10년은 젊어진 느낌!',
            date: '2024년 7월',
            image: '/images/review3.jpg',
          },
          {
            name: '최○○',
            age: '30대 후반',
            rating: 5,
            content: '민감성 피부라 걱정했는데 자극 없이 순해요. 붉은기도 가라앉고 피부 진정 효과가 탁월해요.',
            date: '2024년 8월',
            image: '/images/review4.jpg',
          },
          {
            name: '정○○',
            age: '20대 초반',
            rating: 5,
            content: '학생이라 비싼 화장품 못 쓰는데 이건 가성비 최고예요. 효과도 고급 브랜드 못지않아요!',
            date: '2024년 8월',
            image: '/images/review5.jpg',
          },
          {
            name: '강○○',
            age: '50대 초반',
            rating: 5,
            content: '딸이 선물해줬는데 정말 만족스러워요. 기미가 옅어지고 피부가 맑아진 느낌이에요.',
            date: '2024년 7월',
            image: '/images/review6.jpg',
          },
        ],
      },
    },
    {
      id: 'before-after',
      type: 'gallery',
      data: {
        title: '2주 사용 전후 비교',
        subtitle: '눈으로 확인하는 확실한 변화',
        images: [
          {
            before: '/images/before1.jpg',
            after: '/images/after1.jpg',
            caption: '모공 축소 & 피부결 개선',
            duration: '2주 사용',
          },
          {
            before: '/images/before2.jpg',
            after: '/images/after2.jpg',
            caption: '기미·잡티 개선',
            duration: '4주 사용',
          },
          {
            before: '/images/before3.jpg',
            after: '/images/after3.jpg',
            caption: '주름 개선 & 탄력 증가',
            duration: '8주 사용',
          },
        ],
      },
    },
    {
      id: 'ingredients',
      type: 'benefits',
      data: {
        title: '피부 전문가가 인정한 핵심 성분',
        benefits: [
          {
            icon: '🌿',
            title: '병풀 추출물 72%',
            description: '손상된 피부 재생, 진정 효과',
          },
          {
            icon: '💧',
            title: '히알루론산 3중 복합체',
            description: '깊은 보습, 수분 보호막 형성',
          },
          {
            icon: '✨',
            title: '나이아신아마이드 5%',
            description: '미백, 주름 개선 기능성 성분',
          },
          {
            icon: '🍃',
            title: '센텔라 아시아티카',
            description: '피부 진정, 트러블 케어',
          },
          {
            icon: '🌸',
            title: '아데노신',
            description: '주름 개선, 피부 탄력 증진',
          },
          {
            icon: '🥥',
            title: '천연 오일 복합체',
            description: '피부 장벽 강화, 영양 공급',
          },
        ],
      },
    },
    {
      id: 'certification',
      type: 'trust',
      data: {
        title: '믿고 사용할 수 있는 이유',
        badges: [
          { icon: '🏆', text: '2024 뷰티 어워드 대상' },
          { icon: '✅', text: '피부과 테스트 완료' },
          { icon: '🌱', text: 'EWG 그린 등급' },
          { icon: '🐰', text: '동물실험 NO' },
          { icon: '🇰🇷', text: '국내 생산' },
          { icon: '📜', text: '식약처 기능성 인증' },
        ],
      },
    },
    {
      id: 'special-offer',
      type: 'urgency',
      data: {
        title: '🎉 리뷰 이벤트 특별 혜택',
        benefits: [
          '첫 구매 50% 할인 (78,000원 → 39,000원)',
          '무료 배송 + 샘플 3종 증정',
          '30일 사용 후 불만족 시 100% 환불',
          '포토리뷰 작성 시 정품 1개 추가 증정',
        ],
        deadline: '2024년 9월 30일',
        remainingSpots: 30,
        countdownTimer: true,
      },
    },
    {
      id: 'form-review',
      type: 'form',
      data: {
        title: '무료 체험 신청',
        subtitle: '선착순 100명 한정! 지금 바로 신청하세요',
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
            type: 'email',
            name: 'email',
            label: '이메일',
            required: false,
            placeholder: 'example@email.com',
          },
          {
            type: 'select',
            name: 'skinType',
            label: '피부 타입',
            required: true,
            options: [
              { value: 'dry', label: '건성' },
              { value: 'oily', label: '지성' },
              { value: 'combination', label: '복합성' },
              { value: 'sensitive', label: '민감성' },
              { value: 'normal', label: '중성' },
            ],
          },
          {
            type: 'checkbox',
            name: 'skinConcerns',
            label: '피부 고민 (복수 선택)',
            options: [
              { value: 'wrinkle', label: '주름/탄력' },
              { value: 'whitening', label: '미백/기미' },
              { value: 'moisture', label: '건조함' },
              { value: 'pore', label: '모공' },
              { value: 'trouble', label: '트러블' },
              { value: 'sensitive', label: '민감/붉은기' },
            ],
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
              { value: '50s', label: '50대 이상' },
            ],
          },
          {
            type: 'radio',
            name: 'purchaseIntent',
            label: '구매 의향',
            required: true,
            options: [
              { value: 'immediate', label: '즉시 구매' },
              { value: 'afterTrial', label: '체험 후 결정' },
              { value: 'considering', label: '검토 중' },
            ],
          },
        ],
        submitText: '무료 체험 신청하기',
        consentText: '개인정보 수집 및 이용에 동의합니다',
      },
    },
    {
      id: 'faq-review',
      type: 'faq',
      data: {
        title: '자주 묻는 질문',
        faqs: [
          {
            question: '정말 무료 체험이 가능한가요?',
            answer: '네, 선착순 100명에게는 7일분 체험 키트를 무료로 보내드립니다. 배송비도 무료입니다.',
          },
          {
            question: '피부에 맞지 않으면 어떻게 하나요?',
            answer: '30일 이내 제품 사용 후 만족하지 않으시면 100% 환불해 드립니다. 사용하신 제품도 환불 가능합니다.',
          },
          {
            question: '임산부도 사용 가능한가요?',
            answer: '100% 천연 성분으로 만들어져 임산부도 안심하고 사용 가능합니다. 단, 개인차가 있을 수 있으니 패치 테스트 후 사용을 권장합니다.',
          },
          {
            question: '효과는 언제부터 나타나나요?',
            answer: '개인차가 있지만 대부분 2주 이내에 피부 변화를 느끼실 수 있습니다. 꾸준히 사용하시면 더 좋은 효과를 보실 수 있습니다.',
          },
          {
            question: '다른 제품과 함께 사용해도 되나요?',
            answer: '네, 기존 스킨케어 루틴에 추가하셔도 됩니다. 단, 비슷한 기능성 성분이 들어간 제품은 중복 사용을 피해주세요.',
          },
        ],
      },
    },
  ],
}