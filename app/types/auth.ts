// app/types/auth.ts
import type { SupabaseUser, SupabaseSession, Profile } from './supabase'

// 認証状態の型
export interface AuthState {
  user: SupabaseUser | null
  session: SupabaseSession | null
  profile: Profile | null
  isLoading: boolean
  isInitialized: boolean
}

// ログインフォームの型
export interface LoginForm {
  email: string
  password: string
}

// サインアップフォームの型
export interface SignupForm {
  email: string
  password: string
  confirmPassword: string
  username?: string
}

// プロフィール更新フォームの型
export interface ProfileUpdateForm {
  username: string
  avatar_url?: string
}

// パスワードリセットフォームの型
export interface PasswordResetForm {
  email: string
}

// パスワード変更フォームの型
export interface PasswordUpdateForm {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

// 認証エラーの型
export interface AuthError {
  message: string
  status?: number
  code?: string
}

// 認証レスポンスの型
export interface AuthResponse<T = any> {
  data: T | null
  error: AuthError | null
  success: boolean
}

// フォームバリデーション結果の型
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// 認証プロバイダーの型
export type AuthProvider = 'google' | 'github' | 'discord' | 'twitter'

// 認証イベントの型
export type AuthEvent = 
  | 'SIGNED_IN' 
  | 'SIGNED_OUT' 
  | 'TOKEN_REFRESHED' 
  | 'USER_UPDATED' 
  | 'PASSWORD_RECOVERY'

// ユーザーロールの型（将来的な拡張用）
export type UserRole = 'user' | 'admin' | 'moderator'

// 拡張ユーザー情報の型
export interface ExtendedUser {
  id: string
  email: string
  username?: string
  avatar_url?: string
  role: UserRole
  emailConfirmed: boolean
  createdAt: string
  lastSignIn?: string
}