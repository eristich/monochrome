import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MusicPage from '../music-page'

// Mock des modules
vi.mock('@/lib/api/hooks/use-music', () => ({
  useMusicList: () => ({
    data: [
      {
        id: '1',
        name: 'Test Music 1',
        artist: 'Test Artist 1',
        owner: null,
        originalFilename: 'test1.mp3',
        updatedAt: '2024-01-01T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Test Music 2',
        artist: 'Test Artist 2',
        owner: null,
        originalFilename: 'test2.mp3',
        updatedAt: '2024-01-01T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
      },
    ],
    isLoading: false,
  }),
  useUploadMusic: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useRemoveMusic: () => ({
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

const renderMusicPage = () => {
  const queryClient = createQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MusicPage />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('MusicPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait afficher le lien de donation', () => {
    renderMusicPage()
    expect(screen.getByTestId('music-donation-link')).toBeInTheDocument()
  })

  it('devrait afficher la barre de recherche', () => {
    renderMusicPage()

    const searchInput = screen.getByTestId('music-searchbar-input')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('placeholder', 'Rechercher une musique, un artiste...')
    expect(searchInput).toHaveAttribute('role', 'searchbox')
  })

  it('devrait afficher la liste des musiques', () => {
    renderMusicPage()

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Liste des musiques')

    expect(screen.getByTestId('music-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('music-item-2')).toBeInTheDocument()
  })

  it('devrait afficher les détails des musiques', () => {
    renderMusicPage()

    expect(screen.getByText('Test Artist 1')).toBeInTheDocument()
    expect(screen.getByText('Test Artist 2')).toBeInTheDocument()
  })

  it('devrait afficher le bouton d\'upload', () => {
    renderMusicPage()

    const uploadButton = screen.getByTestId('music-upload-button')
    expect(uploadButton).toBeInTheDocument()
    expect(uploadButton).toHaveAttribute('aria-label', 'Téléverser une musique')
    expect(uploadButton).toHaveAttribute('title', 'Téléverser une musique')
  })

  it('devrait afficher un message quand aucune musique n\'est trouvée', async () => {
    const user = userEvent.setup()
    renderMusicPage()

    const searchInput = screen.getByTestId('music-searchbar-input')

    await user.type(searchInput, 'Musique inexistante')

    expect(screen.getByText('Aucune musique trouvée.')).toBeInTheDocument()
  })

  it('devrait avoir un focus automatique sur la barre de recherche', () => {
    renderMusicPage()

    const searchInput = screen.getByTestId('music-searchbar-input')
    expect(searchInput).toHaveFocus()
  })

  it('devrait afficher les icônes appropriées', () => {
    renderMusicPage()

    expect(screen.getByTestId('icon-mdi:search')).toBeInTheDocument()
    expect(screen.getByTestId('icon-mdi:music-note-plus')).toBeInTheDocument()
  })

  it('devrait avoir un input file caché pour l\'upload', () => {
    renderMusicPage()

    const fileInput = screen.getByRole('presentation')
    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('accept', 'audio/*')
    expect(fileInput).toHaveClass('hidden')
  })

  it('devrait afficher les boutons de suppression pour chaque musique', () => {
    renderMusicPage()

    expect(screen.getByTestId('music-item-delete-button-1')).toBeInTheDocument()
    expect(screen.getByTestId('music-item-delete-button-2')).toBeInTheDocument()
  })

  it('devrait avoir une structure de conteneur appropriée', () => {
    renderMusicPage()

    const container = screen.getByTestId('music-donation-link').parentElement?.parentElement
    expect(container).toHaveClass('w-full', 'max-w-md', 'mx-auto', 'flex', 'flex-col', 'gap-2')
  })

  it('devrait avoir une liste scrollable avec les bons attributs ARIA', () => {
    renderMusicPage()

    const list = screen.getByRole('list')
    expect(list).toHaveAttribute('aria-label', 'Liste des musiques')
    expect(list).toHaveAttribute('aria-live', 'polite')
    expect(list).toHaveClass('flex-1', 'overflow-y-auto', 'flex', 'flex-col', 'gap-3', 'pb-4')
  })
})

describe('MusicPage - États de chargement', () => {
  it('devrait afficher un message quand aucune musique n\'est trouvée lors de la recherche', async () => {
    const user = userEvent.setup()
    renderMusicPage()

    const searchInput = screen.getByTestId('music-searchbar-input')

    await user.type(searchInput, 'Musique inexistante')

    expect(screen.getByText('Aucune musique trouvée.')).toBeInTheDocument()
  })
})
