import { readFile } from 'node:fs/promises'
import path from 'node:path'

const booksPath = path.join(process.cwd(), 'src', 'assets', 'json', 'authors.json')

export default async function handler(_request, response) {
  try {
    const authors = JSON.parse(await readFile(booksPath, 'utf8'))
    const count = authors.reduce((total, author) => total + author.famousWorks.length, 0)

    response.status(200).json({ count, source: 'authors.json' })
  } catch (error) {
    console.error('Error counting books:', error)
    response.status(500).json({ error: 'Unable to count books.' })
  }
}
