import SeriesCard from '../components/SeriesCard'
import mockSeries from '../data/mockSeries'
import './Home.css'

function Home() {
  return (
    <div className="home">
      {mockSeries.map((series) => (
        <SeriesCard
          key={series.id}
          id={series.id}
          title={series.title}
          excerpt={series.excerpt}
        />
      ))}
    </div>
  )
}

export default Home