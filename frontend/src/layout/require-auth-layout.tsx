import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Icon } from "@iconify/react";
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store'

export default function RequireAuthLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const navigate = useNavigate()
  const location = useLocation()

  // Détermine l'onglet actif selon la route
  const getActiveTab = () => {
    if (location.pathname.startsWith('/app/music')) return 'music';
    if (location.pathname.startsWith('/app/setting')) return 'setting';
    return 'home';
  };
  const activeTab = getActiveTab();

  useEffect(() => {
    document.body.classList.add('auth-locked-scroll');
    return () => {
      document.body.classList.remove('auth-locked-scroll');
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/app/auth/login', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <>
      {isAuthenticated ? (
        <div className="w-full h-full flex flex-col items-center bg-white px-2 pb-20 overflow-y-hidden">
          <Outlet />
          <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-[84px] z-50">
            <Link
              to="/app/home"
              className="flex flex-col items-center text-gray-700 no-underline"
            >
              <Icon icon="mdi:home-outline" width={24} height={24} color="black" />
              <span
                className="text-[10px] font-normal leading-4 text-black m-[3px]"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Radio
              </span>
              <span className={`w-[55px] h-[4px] bg-black rounded-full m-1 transition-all duration-300 ease-in-out ${activeTab === 'home' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}></span>
            </Link>
            <Link
              to="/app/music"
              className="flex flex-col items-center text-gray-700 no-underline"
            >
              <Icon icon="mdi:music-note-outline" width={24} height={24} color="black" />
              <span
                className="text-[10px] font-normal leading-4 text-black m-[3px]"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Musique
              </span>
              <span className={`w-[55px] h-[4px] bg-black rounded-full m-1 transition-all duration-300 ease-in-out ${activeTab === 'music' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}></span>
            </Link>
            <Link
              to="/app/setting"
              className="flex flex-col items-center no-underline"
            >
              <Icon icon="mdi:account-outline" width={24} height={24} color="black" />
              <span
                className="text-[10px] font-normal leading-4 text-black m-[3px]"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Compte
              </span>
              <span className={`w-[55px] h-[4px] bg-black rounded-full m-1 transition-all duration-300 ease-in-out ${activeTab === 'setting' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}></span>
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  )
}
