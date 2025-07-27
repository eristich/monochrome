import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock des modules externes
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children, to, ...props }: { children: React.ReactNode; to: string; [key: string]: unknown }) => {
      return React.createElement('a', { href: to, ...props }, children)
    },
  }
})

vi.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }: { icon: string; [key: string]: unknown }) => {
    return React.createElement('span', { 'data-testid': `icon-${icon}`, ...props }, icon)
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock des stores Zustand
vi.mock('@/store/auth-store', () => ({
  useAuthStore: () => ({
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: false,
    token: null,
  }),
}))

// Mock des hooks API
vi.mock('@/lib/api/hooks/use-user', () => ({
  useLogin: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
  }),
  useRegister: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
  }),
  useRequestPasswordRecovery: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
  }),
  useValidPasswordRecovery: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
  }),
}))
