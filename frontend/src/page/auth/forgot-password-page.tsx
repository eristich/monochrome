import React from 'react'
import UITitleH2 from '@/component/nano/ui-title-h2'
import UIInputText from '@/component/nano/ui-input-text'
import UIButton from '@/component/nano/ui-button'
import UIInputCode from '@/component/micro/ui-input-code'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import {
  type SubmitHandler,
  FormProvider,
  useForm,
  Controller
} from 'react-hook-form'
import {
  type AskPasswordRecoveryRequestType,
  type ValidPasswordRecoveryRequestType,
  AskPasswordRecoveryRequestSchema,
  ValidPasswordRecoveryRequestSchema,
} from '@/lib/schema/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import {
  useRequestPasswordRecovery,
  useValidPasswordRecovery
} from '@/lib/api/hooks/use-user'
import { toast } from 'sonner'

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<'ask' | 'valid'>('ask');
  const [recoveryEmail, setRecoveryEmail] = React.useState<string>('');
  const askPasswordRecovery = useRequestPasswordRecovery();
  const validPasswordRecovery = useValidPasswordRecovery();

  const askRecoveryForm = useForm<AskPasswordRecoveryRequestType>({
    resolver: zodResolver(AskPasswordRecoveryRequestSchema),
    mode: 'onSubmit',
  });

  const validRecoveryForm = useForm<ValidPasswordRecoveryRequestType>({
    resolver: zodResolver(ValidPasswordRecoveryRequestSchema),
    mode: 'onSubmit',
  });

  React.useEffect(() => {
    if (recoveryEmail) {
      validRecoveryForm.setValue('email', recoveryEmail);
    }
  }, [recoveryEmail, validRecoveryForm]);

  const { handleSubmit: handleAskSubmit, formState: { errors: askErrors } } = askRecoveryForm;
  const { handleSubmit: handleValidSubmit, formState: { errors: validErrors } } = validRecoveryForm;

  const onAskSubmit: SubmitHandler<AskPasswordRecoveryRequestType> = (data) => {
    // Ici, vous pouvez ajouter la logique de connexion avec les données validées
    // Exemple : console.log(getValues());
    askPasswordRecovery.mutate(data, {
      onSuccess: () => {
        toast.success('Code de récupération envoyé à votre adresse e-mail, veuillez vérifier votre boîte de réception');
        setRecoveryEmail(data.email);
        setStep('valid');
      },
      onError: () => toast.error('Impossible d\'envoyer le code de récupération, veuillez réessayer plus tard')
    });
  };

  const onValidSubmit: SubmitHandler<ValidPasswordRecoveryRequestType> = (data) => {
    // Ici, vous pouvez ajouter la logique de connexion avec les données validées
    // Exemple : console.log(getValues());
    validPasswordRecovery.mutate({
      ...data, email: recoveryEmail,
    }, {
      onSuccess: () => {
        toast.success('Mot de passe réinitialisé avec succès');
        navigate('/app/auth/login');
      },
      onError: () => toast.error('Impossible de réinitialiser le mot de passe, veuillez réessayer plus tard')
    });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="mb-4 flex">
        <UITitleH2>Mot de passe oublié</UITitleH2>
      </div>
      {step === 'ask' && (
        <FormProvider {...askRecoveryForm}>
          <form
            onSubmit={handleAskSubmit(onAskSubmit)}
            className="flex flex-col gap-4"
            aria-label="Formulaire de récupération de mot de passe"
            data-testid="forgot-password-form-ask"
          >
            <UIInputText
              label="Adresse e-mail"
              type="email"
              placeholder="Entrez votre adresse e-mail"
              className="mt-1"
              autoFocus
              aria-label="Adresse e-mail"
              data-testid="forgot-password-email-input"
              icon={<Icon icon="mdi:email-outline" width={24} height={24} color="black" />}
              error={askErrors.email?.message}
              {...askRecoveryForm.register('email')}
            />
            <UIButton
              type="submit"
              disabled={askPasswordRecovery.isPending}
              data-testid="forgot-password-ask-button"
              aria-label="Bouton de récupération de mot de passe"
            >
              <Icon icon="mdi:email-search-outline" width={24} height={24} color="white" />
              Recevoir code de récupération
            </UIButton>
          </form>
        </FormProvider>
      )}
      {step === 'valid' && (
        <FormProvider {...validRecoveryForm}>
          <form
            onSubmit={handleValidSubmit(onValidSubmit)}
            className="flex flex-col gap-4"
            aria-label="Formulaire pour finaliser la récupération du mot de passe"
            data-testid="forgot-password-form-valid"
          >
            <Controller
              control={validRecoveryForm.control}
              name="code"
              render={({ field }) => (
                <UIInputCode
                  {...field}
                  label="Code de récupération"
                  aria-label="Code de récupération 5 chiffres"
                  data-testid="forgot-password-code-input"
                />
              )}
            />
            <UIInputText
              label="Mot de passe"
              type="password"
              placeholder="Entrez votre nouveau mot de passe"
              className="mt-1"
              aria-label="Mot de passe"
              data-testid="forgot-password-password-input"
              icon={<Icon icon="mdi:eye-outline" width={24} height={24} color="black" />}
              error={validErrors.password?.message}
              {...validRecoveryForm.register('password')}
            />
            <UIButton
              type="submit"
              disabled={validPasswordRecovery.isPending}
              aria-label="Bouton de finalisation de la récupération"
              data-testid="forgot-password-valid-button"
            >
              <Icon icon="mdi:password-check-outline" width={24} height={24} color="white" />
              Finaliser la récupération
            </UIButton>
          </form>
        </FormProvider>
      )}
      <div className="flex flex-col items-center mt-6 space-y-2">
        <Link
          to="/app/auth/login"
          data-testid="forgot-password-login-link"
          className="text-sm text-black underline hover:bg-gray-100"
          aria-label="Lien vers la page de connexion"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
