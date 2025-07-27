import React from 'react';
import UINavigationBack from '../../component/micro/ui-navigation-back';
import UITitleH2 from '@/component/nano/ui-title-h2';
import UIButton from '@/component/nano/ui-button';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useChangePassword } from '@/lib/api/hooks/use-user';
import { toast } from 'sonner';
import {
  type ChangePasswordRequestType,
  // type ChangePasswordResponseType,
  ChangePasswordRequestSchema,
} from '@/lib/schema/user';
import UIInputText from '@/component/nano/ui-input-text';


const SettingChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const changePasswordMutation = useChangePassword();


  const form = useForm<ChangePasswordRequestType>({
    resolver: zodResolver(ChangePasswordRequestSchema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data: ChangePasswordRequestType) => {
    console.log('onSubmit Export :', data);
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Mot de passe modifié avec succès', { position: 'bottom-center' });
        navigate(-1);
      },
      onError: () => toast.error('Erreur lors de la modification du mot de passe', { position: 'bottom-center' }),
    })
  };

  return (
    <div className="fixed inset-0 z-55 bg-white flex flex-col mx-auto shadow-lg py-2 px-3">
      <UINavigationBack title="Exporter le rapport d'écoute mensuel" />
      {/* Ici, ajouter le contenu d'export réel plus tard */}
      <div className="flex flex-col gap-6 mt-7 px-2">
        <UITitleH2>
          Modifier le mot de passe du compte
        </UITitleH2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <UIInputText
            data-testid="setting-change-password-current-password"
            label="Mot de passe actuel"
            type="password"
            placeholder="Entrez votre mot de passe actuel"
            autoFocus
            icon={<Icon icon="mdi:eye-outline" width={24} height={24} color="black" />}
            error={errors.password?.message}
            {...form.register("password")}
          />

          <UIInputText
            data-testid="setting-change-password-new-password"
            label="Nouveau mot de passe"
            type="password"
            placeholder="Entrez votre nouveau mot de passe"
            autoFocus
            icon={<Icon icon="mdi:eye-outline" width={24} height={24} color="black" />}
            error={errors.newPassword?.message}
            {...form.register("newPassword")}
          />
          <UIButton
            data-testid="setting-change-password-submit-button"
            type="submit"
            disabled={changePasswordMutation.isPending}
          >
            <Icon icon="mdi:content-save-outline" width={24} height={24} />
            Sauvegarder
          </UIButton>
        </form>
      </div>
    </div>
  );
};

export default SettingChangePasswordPage;
