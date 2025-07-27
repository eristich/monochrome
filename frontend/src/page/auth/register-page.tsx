import React from "react";
import UITitleH2 from "../../component/nano/ui-title-h2";
import UIInputText from "../../component/nano/ui-input-text";
import UIButton from "../../component/nano/ui-button";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
// import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUserRequestSchema,
  type CreateUserRequestType
} from '@/lib/schema/user'
import { useRegister } from "@/lib/api/hooks/use-user";
import { toast } from "sonner";

// const registerSchema = z.object({
//   username: z.string().min(3, { message: 'lol' }).max(30, { message: 'lol' }),
//   email: z.string().email({ message: "Adresse e-mail invalide" }),
//   password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
// });

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <UIInputText
            label="Nom"
            type="text"
            placeholder="Entrez votre pseudonyme"
            autoFocus
            className="mt-1"
            icon={<Icon icon="mdi:user-outline" width={24} height={24} color="black" />}
            error={errors.name?.message}
            {...form.register('name')}
          />
          <UIInputText
            label="Adresse e-mail"
            type="email"
            placeholder="Entrez votre adresse e-mail"
            className="mt-1"
            icon={<Icon icon="mdi:email-outline" width={24} height={24} color="black" />}
            error={errors.email?.message}
            {...form.register('email')}
          />
          <UIInputText
            label="Mot de passe"
            type="password"
            placeholder="Entrez votre mot de passe"
            className="mt-1"
            icon={<Icon icon="mdi:lock-outline" width={24} height={24} color="black" />}
            error={errors.password?.message}
            {...form.register('password')}
          />
        <UIButton type="submit" disabled={registerMutation.isPending}>
          <Icon icon="mdi:register-outline" width={24} height={24} color="white" />
            S'enregistrer
          </UIButton>
        </form>
      </FormProvider>
      <div className="flex flex-col items-center mt-6 space-y-2">
        <Link
          to="/app/auth/forgot-password"
          className="text-sm text-black underline hover:bg-gray-100"
        >
          Mot de passe oublié ?
        </Link>
        <Link
          to="/app/auth/login"
          className="text-sm text-black underline hover:bg-gray-100"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
