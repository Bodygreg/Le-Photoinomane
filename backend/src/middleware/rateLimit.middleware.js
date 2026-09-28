import rateLimit from 'express-rate-limit'

// Connexion admin : 5 échecs maximum par tranche de 15 minutes et par IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
})

// Formulaires publics (contact, livre d'or) : 10 envois par heure et par IP
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de messages envoyés. Réessayez plus tard.' },
})