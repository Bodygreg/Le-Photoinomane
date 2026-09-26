import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SeriesCard from '../components/SeriesCard'
import './Home.css'

function Home() {
  const { t, i18n } = useTranslation()
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/series?lang=${i18n.language}`)
      .then((res) => {
        if (!res.ok) throw new Error(t('home.error'))
        return res.json()
      })
      .then((data) => {
        setSeries(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [i18n.language])

  if (loading) return <p className="home__status">{t('home.loading')}</p>
  if (error) return <p className="home__status">{error}</p>

  return (
    <div className="home">
      {series.map((s) => (
        <SeriesCard
          key={s.id}
          id={s.id}
          title={s.title}
          excerpt={s.excerpt}
          photos={s.photos}
        />
      ))}
    </div>
  )
}

export default Home