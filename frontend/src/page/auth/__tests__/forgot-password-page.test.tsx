import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import ForgotPasswordPage from '../forgot-password-page'

// Mock des modules
vi.mock('@/lib/api/hooks/use-user', () => ({
  useRequestPasswordRecovery: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useValidPasswordRecovery: () => ({
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

const renderForgotPasswordPage = () => {
  return render(
    <BrowserRouter>
      <ForgotPasswordPage />
    </BrowserRouter>
  )
}

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait afficher le titre de la page', () => {
    renderForgotPasswordPage()
    const title = screen.getByRole('heading', { level: 2 })
    expect(title).toHaveTextContent('Mot de passe oublié')
  })

  it('devrait afficher le formulaire de demande de récupération par défaut', () => {
    renderForgotPasswordPage()

    expect(screen.getByPlaceholderText('Entrez votre adresse e-mail')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent('Recevoir code de récupération')
  })

  it('devrait afficher le lien de navigation vers la connexion', () => {
    renderForgotPasswordPage()

    const loginLink = screen.getByTestId('forgot-password-login-link')
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute('href', '/app/auth/login')
  })

  it('devrait permettre la saisie de l\'email', async () => {
    const user = userEvent.setup()
    renderForgotPasswordPage()

    const emailInput = screen.getByPlaceholderText('Entrez votre adresse e-mail')

    await user.type(emailInput, 'test@example.com')

    expect(emailInput).toHaveValue('test@example.com')
  })

  it('devrait afficher les icônes dans le formulaire de demande', () => {
    renderForgotPasswordPage()

    expect(screen.getByTestId('icon-mdi:email-outline')).toBeInTheDocument()
    expect(screen.getByTestId('icon-mdi:email-search-outline')).toBeInTheDocument()
  })

  it('devrait avoir un champ email avec le bon type', () => {
    renderForgotPasswordPage()

    const emailInput = screen.getByPlaceholderText('Entrez votre adresse e-mail')

    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('devrait avoir un formulaire valide', () => {
    renderForgotPasswordPage()

    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()
  })

  it('devrait avoir un bouton de soumission', () => {
    renderForgotPasswordPage()

    const submitButton = screen.getByRole('button')
    expect(submitButton).toHaveTextContent('Recevoir code de récupération')
  })

  it('devrait avoir un placeholder approprié pour l\'email', () => {
    renderForgotPasswordPage()

    const emailInput = screen.getByTestId('forgot-password-email-input')

    expect(emailInput).toHaveAttribute('placeholder', 'Entrez votre adresse e-mail')
  })
})
