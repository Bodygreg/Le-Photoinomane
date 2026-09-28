import rateLimit from 'express-rate-limit'

// Connexion admin : un seul compte administrateur, donc une limite globale
// de 5 échecs par tranche de 15 minutes, quelle que soit l'origine.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  keyGenerator: () => 'admin-login',
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
})

// Formulaires publics (contact + livre d'or) : plafond global de 20 envois par heure.
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  keyGenerator: () => 'public-forms',
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de messages envoyés. Réessayez plus tard.' },
})