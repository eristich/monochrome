import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../login-page'

// Mock des modules
vi.mock('@/lib/api/hooks/use-user', () => ({
  useLogin: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

vi.mock('@/store/auth-store', () => ({
  useAuthStore: () => ({
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: false,
    token: null,
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

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait afficher le titre de la page', () => {
    renderLoginPage()
    expect(screen.getByText('Se connecter')).toBeInTheDocument()
  })

  it('devrait afficher les champs de formulaire', () => {
    renderLoginPage()

    expect(screen.getByTestId('login-email-input')).toBeInTheDocument()
    expect(screen.getByTestId('login-password-input')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bouton de connexion' })).toBeInTheDocument()
  })

  it('devrait afficher les liens de navigation', () => {
    renderLoginPage()

    expect(screen.getByText('Mot de passe oublié ?')).toBeInTheDocument()
    expect(screen.getByText('Créer un compte')).toBeInTheDocument()
  })

  it('devrait permettre la saisie des champs', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    const emailInput = screen.getByTestId('login-email-input')
    const passwordInput = screen.getByTestId('login-password-input')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('devrait afficher les icônes', () => {
    renderLoginPage()

    expect(screen.getByTestId('icon-mdi:email-outline')).toBeInTheDocument()
    expect(screen.getByTestId('icon-mdi:eye-outline')).toBeInTheDocument()
    expect(screen.getByTestId('icon-mdi:login')).toBeInTheDocument()
  })

    it('devrait avoir un formulaire valide', () => {
    renderLoginPage()

    // Option 1: Utiliser getByRole avec aria-label
    const form = screen.getByRole('form', { name: 'Formulaire de connexion' })
    expect(form).toBeInTheDocument()

    // Option 2: Utiliser getByTestId
    const formByTestId = screen.getByTestId('login-form')
    expect(formByTestId).toBeInTheDocument()
  })

  it('devrait avoir des champs avec les bons types', () => {
    renderLoginPage()

    const emailInput = screen.getByTestId('login-email-input')
    const passwordInput = screen.getByTestId('login-password-input')

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('devrait avoir des placeholders appropriés', () => {
    renderLoginPage()

    const emailInput = screen.getByTestId('login-email-input')
    const passwordInput = screen.getByTestId('login-password-input')

    expect(emailInput).toHaveAttribute('placeholder', 'Entrez votre e-mail')
    expect(passwordInput).toHaveAttribute('placeholder', 'Entrez votre mot de passe')
  })
})
