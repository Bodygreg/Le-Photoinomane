import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Nettoie les tables avant d'insérer (utile si tu relances le script plusieurs fois)
  await prisma.photo.deleteMany()
  await prisma.series.deleteMany()

  const series1 = await prisma.series.create({
    data: {
      title: 'Titre 1',
      excerpt: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966.",
      photos: {
        create: [
          { url: 'https://placehold.co/800x600', caption: 'Photo A', order: 0 },
          { url: 'https://placehold.co/800x600', caption: 'Photo B', order: 1 },
          { url: 'https://placehold.co/800x600', caption: 'Photo C', order: 2 },
        ],
      },
    },
  })

  const series2 = await prisma.series.create({
    data: {
      title: 'Titre 2',
      excerpt: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      photos: {
        create: [
          { url: 'https://placehold.co/800x600', caption: 'Photo A', order: 0 },
          { url: 'https://placehold.co/800x600', caption: 'Photo B', order: 1 },
        ],
      },
    },
  })

  console.log('Données insérées :', { series1: series1.id, series2: series2.id })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })