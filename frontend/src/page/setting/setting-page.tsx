import React from 'react';
import UICategoryLink from '@/component/micro/ui-category-link';
import { useCurrentUser } from '@/lib/api/hooks/use-user';
import { useAuthStore } from '@/store/auth-store';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

function getInitials(name?: string) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

const SettingPage: React.FC = () => {
  const { data: user } = useCurrentUser();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/app/auth/login');
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Cercle avec initiales */}
      <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-2xl font-bold text-white mb-4">
        {getInitials(user?.name)}
      </div>
      {/* Nom complet et email */}
      <div className="text-xl font-semibold text-black">{user?.name}</div>
      <div className="text-base text-gray-600 mb-8">{user?.email}</div>

      {/* Paramètres de configuration */}
      <div className="w-full mt-2">
        <h3 className="text-xl italic font-semibold text-black">Paramètres de configuration</h3>
        <div className="w-full flex flex-col gap-2.5 pt-3">
          <UICategoryLink to="/app/setting/export-diffusion">
            <h4>Télécharger le rapport d'écoute mensuel</h4>
            <Icon icon="mdi:tray-arrow-down" width={24} height={24} color="black" />
          </UICategoryLink>
          <UICategoryLink to="/app/setting/change-password">
            <h4>Modifier le mot de passe du compte</h4>
            <Icon icon="mdi:account-key-outline" width={24} height={24} color="black" />
          </UICategoryLink>
          <UICategoryLink to="/app/setting/manage-users">
            <h4>Gérer les utilisateurs</h4>
            <Icon icon="mdi:account-group-outline" width={24} height={24} color="black" />
          </UICategoryLink>
          <UICategoryLink to="/app/setting/report">
            <h4>Signaler un compte ou reporter un bug</h4>
            <Icon icon="mdi:report-problem" width={24} height={24} color="black" />
          </UICategoryLink>
          <UICategoryLink
            to="#"
            onClick={() => {/* TODO: ajouter la logique de suppression de compte */}}
            className="bg-[#ea6868] hover:bg-red-400"
          >
            <h4>Supprimer son compte</h4>
            <Icon icon="mdi:account-cancel-outline" width={24} height={24} color="black" />
          </UICategoryLink>
          <UICategoryLink
            to="#"
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300"
          >
            <h4>Se déconnecter</h4>
            <Icon icon="mdi:logout" width={24} height={24} color="black" />
          </UICategoryLink>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
