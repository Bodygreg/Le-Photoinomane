import translator from '../deepl.js'

const LANGUAGES = { en: 'EN-GB', ru: 'RU', zh: 'ZH' }

export async function translateSeriesContent(title, excerpt, description) {
  const translations = {}

  for (const [key, deeplCode] of Object.entries(LANGUAGES)) {
    try {
      const [tTitle, tExcerpt, tDescription] = await Promise.all([
        translator.translateText(title, 'fr', deeplCode),
        translator.translateText(excerpt, 'fr', deeplCode),
        translator.translateText(description, 'fr', deeplCode),
      ])

      translations[key] = {
        title: tTitle.text,
        excerpt: tExcerpt.text,
        description: tDescription.text,
      }
    } catch (err) {
      console.error(`Erreur traduction (${key}):`, err.message)
      // En cas d'échec, on laisse cette langue de côté plutôt que de bloquer toute la création
    }
  }

  return translations
}