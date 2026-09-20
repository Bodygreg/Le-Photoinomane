import { useState, useEffect } from 'react'
import SeriesCard from '../components/SeriesCard'
import './Home.css'

function Home() {
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/series`)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors du chargement des séries.')
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
  }, [])

  if (loading) return <p className="home__status">Chargement...</p>
  if (error) return <p className="home__status">{error}</p>

  return (
    <div className="home">
      {series.map((s) => (
        <SeriesCard
          key={s.id}
          id={s.id}
          title={s.title}
          excerpt={s.excerpt}
        />
      ))}
    </div>
  )
}

export default Home