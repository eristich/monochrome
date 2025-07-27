import React from "react";
import UITitleH2 from "../../component/nano/ui-title-h2";
import UIInputText from "../../component/nano/ui-input-text";
import UIButton from "../../component/nano/ui-button";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUserRequestSchema,
  type CreateUserRequestType
} from '@/lib/schema/user'
import { useRegister } from "@/lib/api/hooks/use-user";
import { toast } from "sonner";

const RegisterPage: React.FC = () => {
  const registerMutation = useRegister();
  const navigate = useNavigate();

  const form = useForm<CreateUserRequestType>({
    resolver: zodResolver(CreateUserRequestSchema),
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<CreateUserRequestType> = (data) => {
    console.log(data);
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Vous êtes maintenant enregistré, veuillez vous connecter');
        navigate('/app/auth/login');
      },
      onError: () => toast.error('Impossible de créer un compte pour le moment')
    });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="mb-4 flex">
        <UITitleH2>Créer un compte</UITitleH2>
      </div>
      <FormProvider {...form}>
        <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-2"
        data-testid="register-form"
        aria-label="Formulaire de création de compte"
        >
          <UIInputText
            label="Nom"
            type="text"
            placeholder="Entrez votre pseudonyme"
            autoFocus
            className="mt-1"
            icon={<Icon icon="mdi:user-outline" width={24} height={24} color="black" />}
            data-testid="register-name-input"
            aria-label="Nom de l'utilisateur"
            error={errors.name?.message}
            {...form.register('name')}
          />
          <UIInputText
            label="Adresse e-mail"
            type="email"
            placeholder="Entrez votre adresse e-mail"
            className="mt-1"
            icon={<Icon icon="mdi:email-outline" width={24} height={24} color="black" />}
            data-testid="register-email-input"
            aria-label="Adresse e-mail"
            error={errors.email?.message}
            {...form.register('email')}
          />
          <UIInputText
            label="Mot de passe"
            type="password"
            placeholder="Entrez votre mot de passe"
            className="mt-1"
            data-testid="register-password-input"
            aria-label="Mot de passe"
            icon={<Icon icon="mdi:lock-outline" width={24} height={24} color="black" />}
            error={errors.password?.message}
            {...form.register('password')}
          />
          <UIButton
            type="submit"
            disabled={registerMutation.isPending}
            data-testid="register-button"
            aria-label="Bouton de création de compte"
          >
          <Icon icon="mdi:register-outline" width={24} height={24} color="white" />
            S'enregistrer
          </UIButton>
        </form>
      </FormProvider>
      <div className="flex flex-col items-center mt-6 space-y-2">
        <Link
          to="/app/auth/forgot-password"
          className="text-sm text-black underline hover:bg-gray-100"
          data-testid="register-forgot-password-link"
          aria-label="Lien vers la page de récupération de mot de passe"
        >
          Mot de passe oublié ?
        </Link>
        <Link
          to="/app/auth/login"
          className="text-sm text-black underline hover:bg-gray-100"
          data-testid="register-login-link"
          aria-label="Lien vers la page de connexion"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
