import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import RegisterPage from '../register-page'

// Mock des modules
vi.mock('@/lib/api/hooks/use-user', () => ({
  useRegister: () => ({
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

const renderRegisterPage = () => {
  return render(
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait afficher le titre de la page', () => {
    renderRegisterPage()
    const title = document.querySelector('h2')
    expect(title?.textContent).toBe('Créer un compte')
  })

  it('devrait afficher les champs de formulaire', () => {
    renderRegisterPage()

    expect(document.querySelector('input[placeholder="Entrez votre pseudonyme"]')).toBeInTheDocument()
    expect(document.querySelector('input[placeholder="Entrez votre adresse e-mail"]')).toBeInTheDocument()
    expect(document.querySelector('input[placeholder="Entrez votre mot de passe"]')).toBeInTheDocument()
    expect(document.querySelector('button')).toBeInTheDocument()
  })

  it('devrait afficher les liens de navigation', () => {
    renderRegisterPage()

    expect(document.querySelector('a[href="/app/auth/forgot-password"]')).toBeInTheDocument()
    expect(document.querySelector('a[href="/app/auth/login"]')).toBeInTheDocument()
  })

  it('devrait permettre la saisie des champs', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    const nameInput = document.querySelector('input[placeholder="Entrez votre pseudonyme"]') as HTMLInputElement
    const emailInput = document.querySelector('input[placeholder="Entrez votre adresse e-mail"]') as HTMLInputElement
    const passwordInput = document.querySelector('input[placeholder="Entrez votre mot de passe"]') as HTMLInputElement

    await user.type(nameInput, 'TestUser')
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(nameInput.value).toBe('TestUser')
    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
  })

  it('devrait afficher les icônes', () => {
    renderRegisterPage()

    expect(document.querySelector('[data-testid="icon-mdi:user-outline"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="icon-mdi:email-outline"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="icon-mdi:lock-outline"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="icon-mdi:register-outline"]')).toBeInTheDocument()
  })

  it('devrait avoir des champs avec les bons types', () => {
    renderRegisterPage()

    const nameInput = document.querySelector('input[placeholder="Entrez votre pseudonyme"]') as HTMLInputElement
    const emailInput = document.querySelector('input[placeholder="Entrez votre adresse e-mail"]') as HTMLInputElement
    const passwordInput = document.querySelector('input[placeholder="Entrez votre mot de passe"]') as HTMLInputElement

    expect(nameInput.type).toBe('text')
    expect(emailInput.type).toBe('email')
    expect(passwordInput.type).toBe('password')
  })

  it('devrait avoir un bouton de soumission', () => {
    renderRegisterPage()

    const submitButton = document.querySelector('button')
    expect(submitButton?.textContent).toContain("S'enregistrer")
  })

  it('devrait avoir un formulaire valide', () => {
    renderRegisterPage()

    const form = document.querySelector('form')
    expect(form).toBeInTheDocument()
  })
})
