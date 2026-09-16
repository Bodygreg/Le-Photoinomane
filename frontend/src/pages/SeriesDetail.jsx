import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import mockSeries from '../data/mockSeries'
import './SeriesDetail.css'

function SeriesDetail() {
  const { id } = useParams()
  const series = mockSeries.find((s) => s.id === Number(id))
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

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
    }, 4000)

    return () => clearInterval(interval)
  }, [isPlaying, series])

  if (!series) {
    return <p>Série introuvable.</p>
  }

  const photo = series.photos[currentPhoto]

  return (
    <div className="series-detail">
      <h1 className="series-detail__title">{series.title}</h1>

      <div className="series-detail__slideshow">
        <button className="series-detail__arrow" onClick={goToPrevious}>‹</button>

        <div className="series-detail__image">
          <span className="series-detail__caption">{photo.caption}</span>
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