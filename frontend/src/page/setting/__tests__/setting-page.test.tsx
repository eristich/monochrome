import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SettingPage from '../setting-page'

// Mock des modules
vi.mock('@/lib/api/hooks/use-user', () => ({
  useCurrentUser: () => ({
    data: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    isLoading: false,
  }),
}))

vi.mock('@/store/auth-store', () => ({
  useAuthStore: () => ({
    logout: vi.fn(),
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

vi.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }: { icon: string; [key: string]: unknown }) => <div data-testid={`icon-${icon}`} {...props} />,
}))

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderSettingPage = () => {
  const queryClient = createQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SettingPage />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('SettingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait afficher les informations de l\'utilisateur', () => {
    renderSettingPage()

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
  })

  it('devrait afficher le titre des paramètres', () => {
    renderSettingPage()

    expect(screen.getByText('Paramètres de configuration')).toBeInTheDocument()
  })

  it('devrait afficher le lien de téléchargement du rapport d\'écoute', () => {
    renderSettingPage()

    const exportLink = screen.getByText('Télécharger le rapport d\'écoute mensuel')
    expect(exportLink).toBeInTheDocument()
    expect(exportLink.closest('a')).toHaveAttribute('href', '/app/setting/export-diffusion')
    expect(screen.getByTestId('icon-mdi:tray-arrow-down')).toBeInTheDocument()
  })

  it('devrait afficher le lien de modification du mot de passe', () => {
    renderSettingPage()

    const passwordLink = screen.getByText('Modifier le mot de passe du compte')
    expect(passwordLink).toBeInTheDocument()
    expect(passwordLink.closest('a')).toHaveAttribute('href', '/app/setting/change-password')
    expect(screen.getByTestId('icon-mdi:account-key-outline')).toBeInTheDocument()
  })

  it('devrait afficher le lien de gestion des utilisateurs', () => {
    renderSettingPage()

    const usersLink = screen.getByText('Gérer les utilisateurs')
    expect(usersLink).toBeInTheDocument()
    expect(usersLink.closest('a')).toHaveAttribute('href', '/app/setting/manage-users')
    expect(screen.getByTestId('icon-mdi:account-group-outline')).toBeInTheDocument()
  })

  it('devrait afficher le lien de signalement', () => {
    renderSettingPage()

    const reportLink = screen.getByText('Signaler un compte ou reporter un bug')
    expect(reportLink).toBeInTheDocument()
    expect(reportLink.closest('a')).toHaveAttribute('href', '/app/setting/report')
    expect(screen.getByTestId('icon-mdi:report-problem')).toBeInTheDocument()
  })

  it('devrait afficher le bouton de suppression de compte', () => {
    renderSettingPage()

    const deleteButton = screen.getByText('Supprimer son compte')
    expect(deleteButton).toBeInTheDocument()
    expect(deleteButton.closest('a')).toHaveClass('bg-[#ea6868]', 'hover:bg-red-400')
    expect(screen.getByTestId('icon-mdi:account-cancel-outline')).toBeInTheDocument()
  })

  it('devrait afficher le bouton de déconnexion', () => {
    renderSettingPage()

    const logoutButton = screen.getByText('Se déconnecter')
    expect(logoutButton).toBeInTheDocument()
    expect(logoutButton.closest('a')).toHaveClass('bg-gray-200', 'hover:bg-gray-300')
    expect(screen.getByTestId('icon-mdi:logout')).toBeInTheDocument()
  })
})
