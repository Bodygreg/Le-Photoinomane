const API_URL = import.meta.env.VITE_API_URL

// Appels de l'espace admin : envoie toujours le cookie de session,
// et renvoie à l'accueil si la session est expirée (401).
export function adminFetch(path, options = {}) {
  return fetch(`${API_URL}${path}`, { ...options, credentials: 'include' }).then((res) => {
    if (res.status === 401) {
      localStorage.removeItem('adminSession')
      window.location.href = '/'
    }
    return res
  })
}