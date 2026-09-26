import { useState, useEffect } from 'react'
import './AdminSeries.css'

const emptyForm = { title: '', excerpt: '', description: '', photos: [] }

function AdminSeries() {
  const [seriesList, setSeriesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const token = localStorage.getItem('adminToken')
  const apiUrl = import.meta.env.VITE_API_URL

  const fetchSeries = () => {
    fetch(`${apiUrl}/api/admin/series`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('adminToken')
          window.location.href = '/'
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data) {
          setSeriesList(data)
          setLoading(false)
        }
      })
  }

  useEffect(() => {
    fetchSeries()
  }, [])

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('image', file)

        const res = await fetch(`${apiUrl}/api/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })
        const data = await res.json()

        setForm((prev) => ({
          ...prev,
          photos: [...prev.photos, { url: data.url, caption: '' }],
        }))
      }
    } catch {
      alert("Erreur lors de l'upload d'une image.")
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const updatePhotoCaption = (index, caption) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.map((p, i) => (i === index ? { ...p, caption } : p)),
    }))
  }

  const removePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const setCoverPhoto = (index) => {
    setForm((prev) => {
      const photos = [...prev.photos]
      const [selected] = photos.splice(index, 1)
      return { ...prev, photos: [selected, ...photos] }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const method = editingId ? 'PUT' : 'POST'
    const url = editingId
      ? `${apiUrl}/api/admin/series/${editingId}`
      : `${apiUrl}/api/admin/series`

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })

    setForm(emptyForm)
    setEditingId(null)
    setSaving(false)
    fetchSeries()
  }

  const handleEdit = (series) => {
    setForm({
      title: series.title,
      excerpt: series.excerpt,
      description: series.description,
      photos: series.photos.map((p) => ({ url: p.url, caption: p.caption || '' })),
    })
    setEditingId(series.id)
  }

  const handleCancelEdit = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer définitivement cette série et ses photos ?')) return

    await fetch(`${apiUrl}/api/admin/series/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    fetchSeries()
  }

  return (
    <div>
      <h2 className="admin-dashboard__section-title">
        {editingId ? 'Modifier la série' : 'Nouvelle série'}
      </h2>

      <form className="admin-series-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Extrait (page d'accueil)"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          required
        />
        <textarea
          placeholder="Description complète"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <div className="admin-series-form__photos">
          {form.photos.map((photo, index) => (
            <div key={index} className="admin-series-form__photo">
              <img src={photo.url} alt="" />
              <input
                type="text"
                placeholder="Légende (optionnel)"
                value={photo.caption}
                onChange={(e) => updatePhotoCaption(index, e.target.value)}
              />
              {index === 0 ? (
                <span className="admin-series-form__cover-badge">Couverture</span>
              ) : (
                <button type="button" onClick={() => setCoverPhoto(index)}>★</button>
              )}
              <button type="button" onClick={() => removePhoto(index)}>✕</button>
            </div>
          ))}
        </div>

        <label className="admin-series-form__upload">
          {uploading ? 'Envoi en cours...' : '+ Ajouter des photos'}
          <input type="file" accept="image/*" multiple onChange={handleFileChange} disabled={uploading} hidden />
        </label>

        <div className="admin-series-form__actions">
          {editingId && (
            <button type="button" onClick={handleCancelEdit}>Annuler</button>
          )}
          <button type="submit" disabled={saving || uploading}>
            {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer la série'}
          </button>
        </div>
      </form>

      <h2 className="admin-dashboard__section-title">Séries existantes</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="admin-series-list">
          {seriesList.map((series) => (
            <div key={series.id} className="admin-series-list__item">
              <span>{series.title} ({series.photos.length} photo{series.photos.length > 1 ? 's' : ''})</span>
              <div>
                <button onClick={() => handleEdit(series)}>Modifier</button>
                <button onClick={() => handleDelete(series.id)}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminSeries