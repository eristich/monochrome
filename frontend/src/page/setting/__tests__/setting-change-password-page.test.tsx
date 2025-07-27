import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SettingChangePasswordPage from '../setting-change-password-page'

// Mock des modules
vi.mock('@/lib/api/hooks/use-user', () => ({
  useChangePassword: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }: { icon: string; [key: string]: unknown }) => <div data-testid={`icon-${icon}`} {...props} />,
}))

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderSettingChangePasswordPage = () => {
  const queryClient = createQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SettingChangePasswordPage />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('SettingChangePasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait afficher le titre de la page', () => {
    renderSettingChangePasswordPage()

    expect(screen.getByText('Modifier le mot de passe du compte')).toBeInTheDocument()
  })

  it('devrait afficher les champs de saisie pour les mots de passe', () => {
    renderSettingChangePasswordPage()

    expect(screen.getByTestId('setting-change-password-current-password')).toBeInTheDocument()
    expect(screen.getByTestId('setting-change-password-new-password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Entrez votre mot de passe actuel')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Entrez votre nouveau mot de passe')).toBeInTheDocument()
  })

  it('devrait afficher le bouton de sauvegarde', () => {
    renderSettingChangePasswordPage()

    const submitButton = screen.getByTestId('setting-change-password-submit-button')
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveTextContent('Sauvegarder')
    expect(screen.getByTestId('icon-mdi:content-save-outline')).toBeInTheDocument()
  })

  it('devrait permettre la saisie dans les champs de mot de passe', async () => {
    const user = userEvent.setup()
    renderSettingChangePasswordPage()

    const currentPasswordInput = screen.getByTestId('setting-change-password-current-password')
    const newPasswordInput = screen.getByTestId('setting-change-password-new-password')

    await user.type(currentPasswordInput, 'ancien123')
    await user.type(newPasswordInput, 'nouveau456')

    expect(currentPasswordInput).toHaveValue('ancien123')
    expect(newPasswordInput).toHaveValue('nouveau456')
  })

  it('devrait afficher les icônes d\'œil pour les champs de mot de passe', () => {
    renderSettingChangePasswordPage()

    expect(screen.getAllByTestId('icon-mdi:eye-outline')).toHaveLength(2)
  })
})
