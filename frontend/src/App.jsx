import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import SeriesDetail from './pages/SeriesDetail'
import Contact from './pages/Contact'
import GuestBook from './pages/GuestBook'
import About from './pages/About'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/series/:id" element={<SeriesDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/livre-or" element={<GuestBook />} />
            <Route path="/a-propos" element={<About />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App