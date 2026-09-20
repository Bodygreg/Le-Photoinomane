import cloudinary from '../cloudinary.js'

export async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier reçu.' })
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'le-photoinomane' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      stream.end(req.file.buffer)
    })

    res.json({ url: result.secure_url })
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'upload." })
  }
}