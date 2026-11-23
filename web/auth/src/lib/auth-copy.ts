import type { Locale } from '../../../../shared/ui/localization/locale';

export type AuthEntryCopy = {
  signInTitle: string;
  signUpTitle: string;
  signInSubtitle: string;
  signUpSubtitle: string;
  emailLabel: string;
  phoneLabel: string;
  optionalTag: string;
  passwordLabel: string;
  forgotPassword: string;
  signInButton: string;
  signingInButton: string;
  createAccountButton: string;
  creatingAccountButton: string;
  alreadyHaveAccount: string;
  newToCrimFig: string;
  accountCreated: string;
  backToSignIn: string;
  missingCredentials: string;
  passwordGuidance: string;
  genericError: string;
};

const EN: AuthEntryCopy = {
  signInTitle: 'Sign in',
  signUpTitle: 'Create account',
  signInSubtitle: 'Welcome back to CrimFig.',
  signUpSubtitle: 'One account for the CrimFig ecosystem.',
  emailLabel: 'Email address',
  phoneLabel: 'Phone number',
  optionalTag: '(optional)',
  passwordLabel: 'Password',
  forgotPassword: 'Forgot password?',
  signInButton: 'Sign in',
  signingInButton: 'Signing in…',
  createAccountButton: 'Create account',
  creatingAccountButton: 'Creating account…',
  alreadyHaveAccount: 'Already have an account?',
  newToCrimFig: 'New to CrimFig?',
  accountCreated: 'Account created. Check your email to verify your address before signing in.',
  backToSignIn: 'Back to sign in',
  missingCredentials: 'Enter your email address and password.',
  passwordGuidance: 'Use 8 to 128 characters with upper and lower case letters and a number.',
  genericError: 'Unable to connect. Please try again.',
};

const FR: AuthEntryCopy = {
  signInTitle: 'Se connecter',
  signUpTitle: 'Créer un compte',
  signInSubtitle: 'Bon retour sur CrimFig.',
  signUpSubtitle: 'Un seul compte pour l’écosystème CrimFig.',
  emailLabel: 'Adresse e-mail',
  phoneLabel: 'Numéro de téléphone',
  optionalTag: '(facultatif)',
  passwordLabel: 'Mot de passe',
  forgotPassword: 'Mot de passe oublié ?',
  signInButton: 'Se connecter',
  signingInButton: 'Connexion…',
  createAccountButton: 'Créer un compte',
  creatingAccountButton: 'Création du compte…',
  alreadyHaveAccount: 'Vous avez déjà un compte ?',
  newToCrimFig: 'Nouveau sur CrimFig ?',
  accountCreated: 'Compte créé. Vérifiez votre e-mail pour confirmer votre adresse avant de vous connecter.',
  backToSignIn: 'Retour à la connexion',
  missingCredentials: 'Saisissez votre adresse e-mail et votre mot de passe.',
  passwordGuidance: 'Utilisez 8 à 128 caractères avec majuscules, minuscules et un chiffre.',
  genericError: 'Connexion impossible. Veuillez réessayer.',
};

const ES: AuthEntryCopy = {
  signInTitle: 'Iniciar sesión',
  signUpTitle: 'Crear cuenta',
  signInSubtitle: 'Bienvenido de nuevo a CrimFig.',
  signUpSubtitle: 'Una sola cuenta para el ecosistema CrimFig.',
  emailLabel: 'Correo electrónico',
  phoneLabel: 'Número de teléfono',
  optionalTag: '(opcional)',
  passwordLabel: 'Contraseña',
  forgotPassword: '¿Olvidaste tu contraseña?',
  signInButton: 'Iniciar sesión',
  signingInButton: 'Iniciando sesión…',
  createAccountButton: 'Crear cuenta',
  creatingAccountButton: 'Creando cuenta…',
  alreadyHaveAccount: '¿Ya tienes una cuenta?',
  newToCrimFig: '¿Nuevo en CrimFig?',
  accountCreated: 'Cuenta creada. Revisa tu correo para verificar tu dirección antes de iniciar sesión.',
  backToSignIn: 'Volver a iniciar sesión',
  missingCredentials: 'Ingresa tu correo electrónico y contraseña.',
  passwordGuidance: 'Usa de 8 a 128 caracteres con mayúsculas, minúsculas y un número.',
  genericError: 'No se pudo conectar. Inténtalo de nuevo.',
};

const AUTH_ENTRY_COPY: Partial<Record<Locale, AuthEntryCopy>> = {
  en: EN,
  fr: FR,
  es: ES,
};

export function getAuthEntryCopy(locale: Locale): AuthEntryCopy {
  return AUTH_ENTRY_COPY[locale] ?? EN;
}

export type ForgotPasswordCopy = {
  title: string;
  subtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  sentMessage: string;
  backToSignIn: string;
  sending: string;
  sendLink: string;
};

const FORGOT_PASSWORD_COPY: Partial<Record<Locale, ForgotPasswordCopy>> = {
  en: {
    title: 'Reset Password',
    subtitle: 'Enter your email to receive a password reset link',
    emailLabel: 'EMAIL ADDRESS',
    emailPlaceholder: 'name@example.com',
    sentMessage: 'If an account with this email exists, a password reset link has been sent. Please check your inbox.',
    backToSignIn: 'Back to Sign In',
    sending: 'Sending Link...',
    sendLink: 'Send Reset Link',
  },
  fr: {
    title: 'Réinitialiser le mot de passe',
    subtitle: 'Saisissez votre e-mail pour recevoir un lien de réinitialisation',
    emailLabel: 'ADRESSE E-MAIL',
    emailPlaceholder: 'nom@exemple.com',
    sentMessage: 'Si un compte existe avec cet e-mail, un lien de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.',
    backToSignIn: 'Retour à la connexion',
    sending: 'Envoi du lien...',
    sendLink: 'Envoyer le lien',
  },
  es: {
    title: 'Restablecer contraseña',
    subtitle: 'Ingresa tu correo para recibir un enlace de restablecimiento',
    emailLabel: 'CORREO ELECTRÓNICO',
    emailPlaceholder: 'nombre@ejemplo.com',
    sentMessage: 'Si existe una cuenta con este correo, se ha enviado un enlace de restablecimiento. Revisa tu bandeja de entrada.',
    backToSignIn: 'Volver a iniciar sesión',
    sending: 'Enviando enlace...',
    sendLink: 'Enviar enlace',
  },
};

export function getForgotPasswordCopy(locale: Locale): ForgotPasswordCopy {
  return FORGOT_PASSWORD_COPY[locale] ?? FORGOT_PASSWORD_COPY.en!;
}

export type MfaChallengeCopy = {
  title: string;
  subtitle: string;
  codeLabel: string;
  expiredError: string;
  verificationFailed: string;
};

const MFA_CHALLENGE_COPY: Partial<Record<Locale, MfaChallengeCopy>> = {
  en: {
    title: 'Two-Factor Verification',
    subtitle: 'Enter the 6-digit authenticator code or 8-character backup code',
    codeLabel: 'AUTHENTICATOR / BACKUP CODE',
    expiredError: 'MFA challenge session expired or invalid. Please sign in again.',
    verificationFailed: 'Verification failed',
  },
  fr: {
    title: 'Vérification à deux facteurs',
    subtitle: 'Saisissez le code à 6 chiffres ou le code de secours à 8 caractères',
    codeLabel: 'CODE D’AUTHENTIFICATION / DE SECOURS',
    expiredError: 'La session de vérification MFA a expiré ou est invalide. Veuillez vous reconnecter.',
    verificationFailed: 'Échec de la vérification',
  },
  es: {
    title: 'Verificación en dos pasos',
    subtitle: 'Ingresa el código de 6 dígitos o el código de respaldo de 8 caracteres',
    codeLabel: 'CÓDIGO DE AUTENTICACIÓN / RESPALDO',
    expiredError: 'La sesión de verificación MFA expiró o no es válida. Inicia sesión de nuevo.',
    verificationFailed: 'Error de verificación',
  },
};

export function getMfaChallengeCopy(locale: Locale): MfaChallengeCopy {
  return MFA_CHALLENGE_COPY[locale] ?? MFA_CHALLENGE_COPY.en!;
}

export type ResetPasswordCopy = {
  title: string;
  subtitle: string;
  mismatchError: string;
  missingTokenError: string;
  failedError: string;
  successMessage: string;
  signInNow: string;
  newPasswordLabel: string;
};

const RESET_PASSWORD_COPY: Partial<Record<Locale, ResetPasswordCopy>> = {
  en: {
    title: 'Create New Password',
    subtitle: 'Set a secure password for your CrimFig account',
    mismatchError: 'Passwords do not match',
    missingTokenError: 'Missing or invalid reset token. Please request a new link.',
    failedError: 'Password reset failed',
    successMessage: 'Your password has been reset successfully. You can now log in with your new credentials.',
    signInNow: 'Sign In Now',
    newPasswordLabel: 'NEW PASSWORD',
  },
  fr: {
    title: 'Créer un nouveau mot de passe',
    subtitle: 'Définissez un mot de passe sécurisé pour votre compte CrimFig',
    mismatchError: 'Les mots de passe ne correspondent pas',
    missingTokenError: 'Jeton de réinitialisation manquant ou invalide. Veuillez demander un nouveau lien.',
    failedError: 'Échec de la réinitialisation du mot de passe',
    successMessage: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
    signInNow: 'Se connecter',
    newPasswordLabel: 'NOUVEAU MOT DE PASSE',
  },
  es: {
    title: 'Crear nueva contraseña',
    subtitle: 'Establece una contraseña segura para tu cuenta de CrimFig',
    mismatchError: 'Las contraseñas no coinciden',
    missingTokenError: 'Token de restablecimiento faltante o no válido. Solicita un nuevo enlace.',
    failedError: 'Error al restablecer la contraseña',
    successMessage: 'Tu contraseña se ha restablecido correctamente. Ya puedes iniciar sesión.',
    signInNow: 'Iniciar sesión',
    newPasswordLabel: 'NUEVA CONTRASEÑA',
  },
};

export function getResetPasswordCopy(locale: Locale): ResetPasswordCopy {
  return RESET_PASSWORD_COPY[locale] ?? RESET_PASSWORD_COPY.en!;
}

export type VerifyEmailCopy = {
  title: string;
  verifying: string;
  missingToken: string;
  verifiedDefault: string;
  invalidDefault: string;
  failedDefault: string;
  resendOk: string;
  resendRateLimit: string;
  resendUnauth: string;
  resendError: string;
};

const VERIFY_EMAIL_COPY: Partial<Record<Locale, VerifyEmailCopy>> = {
  en: {
    title: 'Email Verification',
    verifying: 'Verifying your email address...',
    missingToken: 'Open the verification link from your email, or request a fresh link while signed in.',
    verifiedDefault: 'Email verified successfully! Your account is now active.',
    invalidDefault: 'Email verification link is invalid or has expired.',
    failedDefault: 'Verification request failed.',
    resendOk: 'Check the email inbox for your signed-in account.',
    resendRateLimit: 'Too many requests. Wait before retrying.',
    resendUnauth: 'Sign in to resend a verification link.',
    resendError: 'The resend could not be confirmed. Check your inbox before trying again.',
  },
  fr: {
    title: 'Vérification de l’e-mail',
    verifying: 'Vérification de votre adresse e-mail...',
    missingToken: 'Ouvrez le lien de vérification depuis votre e-mail ou demandez un nouveau lien en étant connecté.',
    verifiedDefault: 'E-mail vérifié avec succès ! Votre compte est désormais actif.',
    invalidDefault: 'Le lien de vérification est invalide ou a expiré.',
    failedDefault: 'La demande de vérification a échoué.',
    resendOk: 'Consultez la boîte de réception de votre compte connecté.',
    resendRateLimit: 'Trop de demandes. Veuillez patienter avant de réessayer.',
    resendUnauth: 'Connectez-vous pour renvoyer un lien de vérification.',
    resendError: 'Le renvoi n’a pas pu être confirmé. Vérifiez votre boîte de réception avant de réessayer.',
  },
  es: {
    title: 'Verificación de correo',
    verifying: 'Verificando tu dirección de correo...',
    missingToken: 'Abre el enlace de verificación desde tu correo o solicita un nuevo enlace con sesión iniciada.',
    verifiedDefault: '¡Correo verificado con éxito! Tu cuenta ya está activa.',
    invalidDefault: 'El enlace de verificación no es válido o ha expirado.',
    failedDefault: 'La solicitud de verificación falló.',
    resendOk: 'Revisa la bandeja de entrada de tu cuenta iniciada.',
    resendRateLimit: 'Demasiadas solicitudes. Espera antes de volver a intentarlo.',
    resendUnauth: 'Inicia sesión para reenviar un enlace de verificación.',
    resendError: 'No se pudo confirmar el reenvío. Revisa tu bandeja de entrada antes de intentarlo de nuevo.',
  },
};

export function getVerifyEmailCopy(locale: Locale): VerifyEmailCopy {
  return VERIFY_EMAIL_COPY[locale] ?? VERIFY_EMAIL_COPY.en!;
}

export type AuthDashboardCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ssoTitle: string;
  ssoBadge: string;
  ssoDesc: string;
  ssoLink: string;
  mfaTitle: string;
  mfaSub: string;
  mfaDesc: string;
  mfaLink: string;
  appsTitle: string;
  appsSub: string;
};

const AUTH_DASHBOARD_COPY: Partial<Record<Locale, AuthDashboardCopy>> = {
  en: {
    eyebrow: 'Account Management & Security',
    title: 'Security Dashboard',
    subtitle: 'Manage your single sign-on identity, active sessions, multi-factor authentication, and connected CrimFig portals.',
    ssoTitle: 'Zero-Trust SSO',
    ssoBadge: 'Active & Guarded',
    ssoDesc: 'Your session is verified with high-entropy cryptographic token rotation and client fingerprint checks.',
    ssoLink: 'Review Active Devices →',
    mfaTitle: 'Two-Factor (2FA)',
    mfaSub: 'Authenticator & SMS',
    mfaDesc: 'Add a second layer of security to prevent unauthorized access even if your password is compromised.',
    mfaLink: 'Configure 2FA & Passkeys →',
    appsTitle: 'Connected Apps',
    appsSub: 'Single Identity',
  },
  fr: {
    eyebrow: 'Gestion du compte et sécurité',
    title: 'Tableau de bord de sécurité',
    subtitle: 'Gérez votre identité SSO, vos sessions actives, votre authentification multifacteur et vos portails CrimFig connectés.',
    ssoTitle: 'SSO Zero-Trust',
    ssoBadge: 'Actif et protégé',
    ssoDesc: 'Votre session est vérifiée par rotation cryptographique de jetons et contrôle d’empreinte client.',
    ssoLink: 'Voir les appareils actifs →',
    mfaTitle: 'Double facteur (2FA)',
    mfaSub: 'Authentificateur et SMS',
    mfaDesc: 'Ajoutez une seconde couche de sécurité pour empêcher tout accès non autorisé.',
    mfaLink: 'Configurer 2FA et clés d’accès →',
    appsTitle: 'Applications connectées',
    appsSub: 'Identité unique',
  },
  es: {
    eyebrow: 'Gestión de cuenta y seguridad',
    title: 'Panel de seguridad',
    subtitle: 'Administra tu identidad de inicio de sesión único, sesiones activas, autenticación multifactor y portales CrimFig conectados.',
    ssoTitle: 'SSO Zero-Trust',
    ssoBadge: 'Activo y protegido',
    ssoDesc: 'Tu sesión se verifica con rotación criptográfica de tokens y comprobaciones de huella del cliente.',
    ssoLink: 'Revisar dispositivos activos →',
    mfaTitle: 'Doble factor (2FA)',
    mfaSub: 'Autenticador y SMS',
    mfaDesc: 'Agrega una segunda capa de seguridad para evitar accesos no autorizados.',
    mfaLink: 'Configurar 2FA y llaves de acceso →',
    appsTitle: 'Aplicaciones conectadas',
    appsSub: 'Identidad única',
  },
};

export function getAuthDashboardCopy(locale: Locale): AuthDashboardCopy {
  return AUTH_DASHBOARD_COPY[locale] ?? AUTH_DASHBOARD_COPY.en!;
}

export type ConnectedAppsCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  connectedBadge: string;
  adsTitle: string;
  adsDesc: string;
  adsLaunch: string;
  billingTitle: string;
  billingDesc: string;
  billingLaunch: string;
};

const CONNECTED_APPS_COPY: Partial<Record<Locale, ConnectedAppsCopy>> = {
  en: {
    eyebrow: 'Single Sign-On Integrations',
    title: 'Connected Portals & Authorized Apps',
    subtitle: 'Manage OAuth2 clients, API keys, and first-party CrimFig ecosystem portals linked to your identity.',
    connectedBadge: 'Connected',
    adsTitle: 'CrimFig Ads & Publishing',
    adsDesc: 'Full access to advertiser campaigns, creative assets, and promoter ad spaces.',
    adsLaunch: 'Launch Ads Portal',
    billingTitle: 'Billing & Escrow',
    billingDesc: 'Manage wallet funding, bank payouts, subscription renewals, and publisher milestones.',
    billingLaunch: 'Launch Billing Portal',
  },
  fr: {
    eyebrow: 'Intégrations SSO',
    title: 'Portails connectés et applications autorisées',
    subtitle: 'Gérez les clients OAuth2, clés API et portails CrimFig liés à votre identité.',
    connectedBadge: 'Connecté',
    adsTitle: 'CrimFig Ads & Publishing',
    adsDesc: 'Accès complet aux campagnes publicitaires, créations et espaces promoteurs.',
    adsLaunch: 'Ouvrir le portail Ads',
    billingTitle: 'Facturation et séquestre',
    billingDesc: 'Gérez le financement du portefeuille, les virements bancaires et les renouvellements.',
    billingLaunch: 'Ouvrir le portail Facturation',
  },
  es: {
    eyebrow: 'Integraciones SSO',
    title: 'Portales conectados y aplicaciones autorizadas',
    subtitle: 'Administra clientes OAuth2, claves API y portales de CrimFig vinculados a tu identidad.',
    connectedBadge: 'Conectado',
    adsTitle: 'CrimFig Ads & Publishing',
    adsDesc: 'Acceso completo a campañas de anunciantes, creatividades y espacios de promotores.',
    adsLaunch: 'Abrir portal de Ads',
    billingTitle: 'Facturación y depósito',
    billingDesc: 'Administra fondos de billetera, pagos bancarios y renovaciones de suscripción.',
    billingLaunch: 'Abrir portal de Facturación',
  },
};

export function getConnectedAppsCopy(locale: Locale): ConnectedAppsCopy {
  return CONNECTED_APPS_COPY[locale] ?? CONNECTED_APPS_COPY.en!;
}

export type SessionsCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  currentBrowser: string;
  thisDevice: string;
  activeNow: string;
  sessionDesc: string;
  remoteTitle: string;
  remoteDesc: string;
  signOutAll: string;
};

const SESSIONS_COPY: Partial<Record<Locale, SessionsCopy>> = {
  en: {
    eyebrow: 'Device Security',
    title: 'Active Browser & Device Sessions',
    subtitle: 'Review hardware devices, browsers, and IP locations that currently have access to your CrimFig account.',
    currentBrowser: 'Current Web Browser',
    thisDevice: 'This Device',
    activeNow: 'Authenticated • Active Now',
    sessionDesc: 'Protected by rotating cryptographically signed JWT access tokens and secure HTTP-only refresh cookies.',
    remoteTitle: 'Remote Session Invalidation',
    remoteDesc: 'Lost a laptop or phone? Sign out of all other active sessions across all devices to protect your campaigns and billing balance.',
    signOutAll: 'Sign Out All Other Sessions',
  },
  fr: {
    eyebrow: 'Sécurité des appareils',
    title: 'Sessions navigateur et appareils actifs',
    subtitle: 'Consultez les appareils, navigateurs et localisations IP ayant actuellement accès à votre compte CrimFig.',
    currentBrowser: 'Navigateur web actuel',
    thisDevice: 'Cet appareil',
    activeNow: 'Authentifié • Actif maintenant',
    sessionDesc: 'Protégé par des jetons d’accès JWT signés à rotation et des cookies de rafraîchissement HTTP-only sécurisés.',
    remoteTitle: 'Invalidation de session à distance',
    remoteDesc: 'Appareil perdu ? Déconnectez toutes les autres sessions actives pour protéger vos campagnes et votre solde.',
    signOutAll: 'Déconnecter toutes les autres sessions',
  },
  es: {
    eyebrow: 'Seguridad del dispositivo',
    title: 'Sesiones activas de navegador y dispositivos',
    subtitle: 'Revisa los dispositivos, navegadores y ubicaciones IP que actualmente tienen acceso a tu cuenta de CrimFig.',
    currentBrowser: 'Navegador web actual',
    thisDevice: 'Este dispositivo',
    activeNow: 'Autenticado • Activo ahora',
    sessionDesc: 'Protegido por tokens de acceso JWT firmados con rotación y cookies de actualización HTTP-only seguras.',
    remoteTitle: 'Invalidación remota de sesiones',
    remoteDesc: '¿Perdiste un portátil o teléfono? Cierra sesión en todos los demás dispositivos para proteger tus campañas y saldo.',
    signOutAll: 'Cerrar sesión en los demás dispositivos',
  },
};

export function getSessionsCopy(locale: Locale): SessionsCopy {
  return SESSIONS_COPY[locale] ?? SESSIONS_COPY.en!;
}

export type OrganizationCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  workspaceTitle: string;
  activeSeat: string;
  inviteTeammate: string;
  workspaceDesc: string;
};

const ORGANIZATION_COPY: Partial<Record<Locale, OrganizationCopy>> = {
  en: {
    eyebrow: 'Team & Governance',
    title: 'Organization & Team Members',
    subtitle: 'Invite team members, assign fine-grained RBAC roles, and manage shared advertiser workspaces.',
    workspaceTitle: 'Primary Workspace',
    activeSeat: '1 Active Seat',
    inviteTeammate: 'Invite Teammate',
    workspaceDesc: 'Collaborate on advertiser campaigns, creative reviews, and publisher properties with role-based permissions.',
  },
  fr: {
    eyebrow: 'Équipe et gouvernance',
    title: 'Organisation et membres de l’équipe',
    subtitle: 'Invitez des membres, attribuez des rôles RBAC précis et gérez les espaces annonceurs partagés.',
    workspaceTitle: 'Espace principal',
    activeSeat: '1 siège actif',
    inviteTeammate: 'Inviter un membre',
    workspaceDesc: 'Collaborez sur les campagnes, la modération des créations et les sites éditeurs avec des permissions par rôle.',
  },
  es: {
    eyebrow: 'Equipo y gobernanza',
    title: 'Organización y miembros del equipo',
    subtitle: 'Invita a miembros del equipo, asigna roles RBAC detallados y administra espacios compartidos de anunciantes.',
    workspaceTitle: 'Espacio principal',
    activeSeat: '1 asiento activo',
    inviteTeammate: 'Invitar compañero',
    workspaceDesc: 'Colabora en campañas de anunciantes, revisiones creativas y propiedades de editores con permisos por rol.',
  },
};

export function getOrganizationCopy(locale: Locale): OrganizationCopy {
  return ORGANIZATION_COPY[locale] ?? ORGANIZATION_COPY.en!;
}

export type SecuritySettingsCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  passwordTitle: string;
  passwordDesc: string;
  changePassword: string;
  mfaTitle: string;
  mfaDesc: string;
  configureMfa: string;
};

const SECURITY_SETTINGS_COPY: Partial<Record<Locale, SecuritySettingsCopy>> = {
  en: {
    eyebrow: 'Credentials & Access Controls',
    title: 'Security & Two-Factor Authentication',
    subtitle: 'Protect your CrimFig identity with modern two-factor credentials, biometric passkeys, and robust password policies.',
    passwordTitle: 'Account Password',
    passwordDesc: 'Choose a strong, unique password with at least 8 characters, numbers, and symbols.',
    changePassword: 'Change Password',
    mfaTitle: 'Multi-Factor Authentication (MFA)',
    mfaDesc: 'Require a verification code from Google Authenticator, Authy, or 1Password when signing in from an unrecognized device.',
    configureMfa: 'Configure Authenticator App',
  },
  fr: {
    eyebrow: 'Identifiants et contrôles d’accès',
    title: 'Sécurité et authentification à deux facteurs',
    subtitle: 'Protégez votre identité CrimFig avec l’authentification à deux facteurs, les clés d’accès et des mots de passe robustes.',
    passwordTitle: 'Mot de passe du compte',
    passwordDesc: 'Choisissez un mot de passe fort et unique d’au moins 8 caractères, avec chiffres et symboles.',
    changePassword: 'Changer le mot de passe',
    mfaTitle: 'Authentification multifacteur (MFA)',
    mfaDesc: 'Exigez un code de vérification depuis Google Authenticator, Authy ou 1Password lors de la connexion depuis un nouvel appareil.',
    configureMfa: 'Configurer l’application d’authentification',
  },
  es: {
    eyebrow: 'Credenciales y controles de acceso',
    title: 'Seguridad y autenticación en dos pasos',
    subtitle: 'Protege tu identidad de CrimFig con credenciales de dos factores, llaves biométricas y contraseñas seguras.',
    passwordTitle: 'Contraseña de la cuenta',
    passwordDesc: 'Elige una contraseña segura y única con al menos 8 caracteres, números y símbolos.',
    changePassword: 'Cambiar contraseña',
    mfaTitle: 'Autenticación multifactor (MFA)',
    mfaDesc: 'Solicita un código de verificación de Google Authenticator, Authy o 1Password al iniciar sesión desde un dispositivo nuevo.',
    configureMfa: 'Configurar aplicación autenticadora',
  },
};

export function getSecuritySettingsCopy(locale: Locale): SecuritySettingsCopy {
  return SECURITY_SETTINGS_COPY[locale] ?? SECURITY_SETTINGS_COPY.en!;
}

export type ProfileCopy = {
  artworkAttribution: string;
  viewFullAttribution: string;
  originalAssetPack: string;
  cc0License: string;
  avatarAttributionTitle: string;
  closeAttribution: string;
  source: string;
  artist: string;
  license: string;
  modifications: string;
};

const PROFILE_COPY: Partial<Record<Locale, ProfileCopy>> = {
  en: {
    artworkAttribution: 'Attribution',
    viewFullAttribution: 'Details',
    originalAssetPack: 'OpenGameArt source',
    cc0License: 'CC0 1.0 license',
    avatarAttributionTitle: 'Avatar artwork attribution',
    closeAttribution: 'Close attribution',
    source: 'Source',
    artist: 'Artist',
    license: 'License',
    modifications: 'Modifications',
  },
  fr: {
    artworkAttribution: 'Attribution',
    viewFullAttribution: 'Détails',
    originalAssetPack: 'Source OpenGameArt',
    cc0License: 'Licence CC0 1.0',
    avatarAttributionTitle: 'Attribution de l’illustration d’avatar',
    closeAttribution: 'Fermer l’attribution',
    source: 'Source',
    artist: 'Artiste',
    license: 'Licence',
    modifications: 'Modifications',
  },
  es: {
    artworkAttribution: 'Atribución',
    viewFullAttribution: 'Detalles',
    originalAssetPack: 'Fuente OpenGameArt',
    cc0License: 'Licencia CC0 1.0',
    avatarAttributionTitle: 'Atribución de la ilustración del avatar',
    closeAttribution: 'Cerrar atribución',
    source: 'Fuente',
    artist: 'Artista',
    license: 'Licencia',
    modifications: 'Modificaciones',
  },
};

export function getProfileCopy(locale: Locale): ProfileCopy {
  return PROFILE_COPY[locale] ?? PROFILE_COPY.en!;
}
