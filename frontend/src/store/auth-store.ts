import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserType } from '@/lib/schema/user'

type AuthState = {
  isAuthenticated: boolean
  token?: string
  user?: UserType
  login: (token: string, user?: UserType) => void
  logout: () => void
  setUser: (user: AuthState['user']) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: undefined,
      user: undefined,
      login: (token, user) =>
        set({
          isAuthenticated: true,
          token,
          user,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          token: undefined,
          user: undefined,
        }),
      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),
    }),
    {
      name: 'auth-storage', // nom de la clé dans le localStorage
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
      }),
    }
  )
)

