import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import './SeriesDetail.css'

function SeriesDetail() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const [series, setSeries] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/series/${id}?lang=${i18n.language}`)
      .then((res) => {
        if (!res.ok) throw new Error(t('seriesDetail.notFound'))
        return res.json()
      })
      .then((data) => {
        setSeries(data)
        setCurrentPhoto(0)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id, i18n.language])

  const goToPrevious = () => {
    setCurrentPhoto((prev) => (prev === 0 ? series.photos.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentPhoto((prev) => (prev === series.photos.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    if (!isPlaying || !series) return

    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev === series.photos.length - 1 ? 0 : prev + 1))
    }, 2500)

    return () => clearInterval(interval)
  }, [isPlaying, series])

  if (loading) return <p className="series-detail__status">{t('seriesDetail.loading')}</p>
  if (error) return <p className="series-detail__status">{error}</p>

  const photo = series.photos[currentPhoto]

  return (
    <div className="series-detail">
      <h1 className="series-detail__title">{series.title}</h1>

      <div className="series-detail__slideshow">
        <button className="series-detail__arrow" onClick={goToPrevious}>‹</button>

        <div className="series-detail__image">
          <img src={photo.url} alt={photo.caption || series.title} />
          {photo.caption && <span className="series-detail__caption">{photo.caption}</span>}
        </div>

        <button className="series-detail__arrow" onClick={goToNext}>›</button>
      </div>

      <button
        className="series-detail__play"
        onClick={() => setIsPlaying((prev) => !prev)}
      >
        {isPlaying ? '❙❙' : '▶'}
      </button>

      <p className="series-detail__description">{series.description}</p>
    </div>
  )
}

export default SeriesDetail