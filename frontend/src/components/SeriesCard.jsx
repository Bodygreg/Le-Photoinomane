import { Link } from 'react-router-dom'
import './SeriesCard.css'

function SeriesCard({ id, title, excerpt, photos }) {
  const coverUrl = photos && photos.length > 0 ? photos[0].url : null

  return (
    <Link to={`/series/${id}`} className="series-card">
      <h2 className="series-card__title">{title}</h2>
      <div className="series-card__image">
        {coverUrl ? (
          <img src={coverUrl} alt={title} />
        ) : (
          <span>Couverture série {id}</span>
        )}
      </div>
      <p className="series-card__excerpt">{excerpt}</p>
    </Link>
  )
}

export default SeriesCard