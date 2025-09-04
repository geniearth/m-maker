import { z } from 'zod'

// 한국 전화번호 검증
const phoneRegex = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/

// 기본 리드 정보 스키마
export const leadFormSchema = z.object({
  // Step 1: 기본 정보
  name: z.string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(50, '이름은 50자를 초과할 수 없습니다'),
  
  phone: z.string()
    .regex(phoneRegex, '올바른 전화번호 형식이 아닙니다 (010-XXXX-XXXX)')
    .transform(val => val.replace(/-/g, '')),
  
  email: z.string()
    .email('올바른 이메일 주소를 입력해주세요')
    .optional(),
  
  // Step 2: 상세 정보 (선택)
  birthYear: z.string()
    .regex(/^(19|20)\d{2}$/, '올바른 연도를 입력해주세요')
    .optional(),
  
  gender: z.enum(['male', 'female', 'other']).optional(),
  
  region: z.string().optional(),
  
  // Step 3: 관심사/니즈
  interests: z.array(z.string()).optional(),
  
  budget: z.string().optional(),
  
  timeline: z.enum(['immediate', '1month', '3months', '6months', 'planning']).optional(),
  
  message: z.string().max(500, '메시지는 500자를 초과할 수 없습니다').optional(),
})

// 동의 스키마
export const consentSchema = z.object({
  privacyRequired: z.boolean()
    .refine(val => val === true, '개인정보 수집 및 이용에 동의해주세요'),
  
  marketingOptional: z.object({
    all: z.boolean().default(false),
    sms: z.boolean().default(false),
    email: z.boolean().default(false),
    kakao: z.boolean().default(false),
  }).optional(),
  
  thirdPartyOptional: z.boolean().default(false),
})

// 전체 폼 스키마
export const fullLeadFormSchema = leadFormSchema.merge(consentSchema)

// 보험 리드 전용 스키마
export const insuranceLeadSchema = leadFormSchema.extend({
  // 보험 관련 필드
  insuranceType: z.enum(['life', 'health', 'auto', 'home', 'travel', 'pet']),
  
  currentInsurance: z.boolean(),
  
  familySize: z.string().regex(/^\d+$/, '숫자만 입력해주세요').optional(),
  
  healthConditions: z.array(z.string()).optional(),
  
  desiredCoverage: z.string().optional(),
})

// 부동산 리드 전용 스키마
export const realEstateLeadSchema = leadFormSchema.extend({
  // 부동산 관련 필드
  propertyType: z.enum(['apartment', 'house', 'villa', 'officetel', 'land']),
  
  transactionType: z.enum(['buy', 'sell', 'rent', 'lease']),
  
  priceRange: z.object({
    min: z.string().optional(),
    max: z.string().optional(),
  }).optional(),
  
  area: z.string().optional(),
  
  moveInDate: z.string().optional(),
})

// 교육 리드 전용 스키마
export const educationLeadSchema = leadFormSchema.extend({
  // 교육 관련 필드
  educationType: z.enum(['language', 'coding', 'exam', 'certificate', 'hobby']),
  
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  
  targetGoal: z.string().optional(),
  
  preferredSchedule: z.array(z.string()).optional(),
  
  learningMethod: z.enum(['online', 'offline', 'hybrid']).optional(),
})

// 타입 추출
export type LeadFormData = z.infer<typeof leadFormSchema>
export type ConsentData = z.infer<typeof consentSchema>
export type FullLeadFormData = z.infer<typeof fullLeadFormSchema>
export type InsuranceLeadData = z.infer<typeof insuranceLeadSchema>
export type RealEstateLeadData = z.infer<typeof realEstateLeadSchema>
export type EducationLeadData = z.infer<typeof educationLeadSchema>