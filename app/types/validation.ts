// app/types/validation.ts

// バリデーションルールの型
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

// フィールドバリデーション設定の型
export interface FieldValidation {
  [fieldName: string]: ValidationRule
}

// バリデーション結果の型
export interface FieldValidationResult {
  isValid: boolean
  error: string | null
}

// フォーム全体のバリデーション結果の型
export interface FormValidationResult {
  isValid: boolean
  errors: Record<string, string>
  fields: Record<string, FieldValidationResult>
}

// 共通バリデーションルール
export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255
  },
  password: {
    required: true,
    minLength: 6,
    maxLength: 128
  },
  username: {
    required: false,
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_-]+$/
  },
  confirmPassword: {
    required: true,
    minLength: 6,
    maxLength: 128
  }
} as const

// バリデーションメッセージ
export const VALIDATION_MESSAGES = {
  required: (field: string) => `${field}は必須です`,
  minLength: (field: string, min: number) => `${field}は${min}文字以上で入力してください`,
  maxLength: (field: string, max: number) => `${field}は${max}文字以下で入力してください`,
  pattern: (field: string) => `${field}の形式が正しくありません`,
  passwordMismatch: 'パスワードが一致しません',
  emailInvalid: 'メールアドレスの形式が正しくありません',
  usernameInvalid: 'ユーザー名は英数字、アンダースコア、ハイフンのみ使用できます'
} as const