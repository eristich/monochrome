import React from 'react'
import UITitleH2 from '@/component/nano/ui-title-h2'
import UIInputText from '@/component/nano/ui-input-text'
import UIButton from '@/component/nano/ui-button'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin } from '@/lib/api/hooks/use-user'
import {
  LoginUserRequestSchema,
  type LoginUserRequestType
} from '@/lib/schema/user'
import { useAuthStore } from '@/store/auth-store'
import { toast } from 'sonner'


const LoginPage: React.FC = () => {
  const loginMutation = useLogin();
  // const currentUser = useCurrentUser();
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const form = useForm<LoginUserRequestType>({
    resolver: zodResolver(LoginUserRequestSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<LoginUserRequestType> = (data) => {
    loginMutation.mutate(data, {
      onSuccess: ({ token }) => {
        authStore.login(token); // Stocke immédiatement
        navigate('/app/home', { replace: true });
        // Optionnel : currentUser.refetch(); // Si tu veux rafraîchir les infos utilisateur
      },
      onError: () => toast.error('Identifiants invalides')
    });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="mb-4 flex">
        <UITitleH2>Se connecter</UITitleH2>
      </div>
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          aria-label="Formulaire de connexion"
          data-testid="login-form"
        >
          <UIInputText
            label="Adresse e-mail"
            type="email"
            placeholder="Entrez votre e-mail"
            autoFocus
            className="mt-1"
            data-testid="login-email-input"
            aria-label="Adresse e-mail"
            icon={<Icon icon="mdi:email-outline" width={24} height={24} color="black" />}
            error={errors.email?.message}
            {...form.register("email")}
          />
          <UIInputText
            label="Mot de passe"
            type="password"
            placeholder="Entrez votre mot de passe"
            className="mt-1"
            data-testid="login-password-input"
            aria-label="Mot de passe"
            icon={<Icon icon="mdi:eye-outline" width={24} height={24} color="black" />}
            error={errors.password?.message}
            {...form.register("password")}
          />
          <UIButton
            type="submit"
            disabled={loginMutation.isPending}
            aria-label="Bouton de connexion"
            data-testid="login-button"
          >
            <Icon icon="mdi:login" width={24} height={24} color="white" />
            S'authentifier
          </UIButton>
        </form>
      </FormProvider>
      <div className="flex flex-col items-center mt-6 space-y-2">
        <Link
          to="/app/auth/forgot-password"
          className="text-sm text-black underline hover:bg-gray-100"
          data-testid="login-forgot-password-link"
          aria-label="Lien vers la page de réinitialisation du mot de passe"
        >
          Mot de passe oublié ?
        </Link>
        <Link
          to="/app/auth/register"
          className="text-sm text-black underline hover:bg-gray-100"
          data-testid="login-register-link"
          aria-label="Lien vers la page de création de compte"
        >
          Créer un compte
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
