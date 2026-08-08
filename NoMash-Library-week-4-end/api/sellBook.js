import { readFile } from 'node:fs/promises'
import path from 'node:path'

const booksPath = path.join(process.cwd(), 'src', 'assets', 'json', 'authors.json')

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    response.status(405).json({ error: 'Use POST to sell a book.' })
    return
  }

  try {
    const authors = JSON.parse(await readFile(booksPath, 'utf8'))
    const books = authors.flatMap((author) =>
      author.famousWorks.map((book) => ({ ...book, author: author.name }))
    )
    const requestedTitle = request.body?.title?.trim()
    const book = books.find((item) => item.title === requestedTitle) || books[0]

    response.status(200).json({
      success: true,
      message: `Book sold: ${book.title}`,
      book,
      receipt: `SALE-${book.year}-${book.title.replaceAll(' ', '-').toUpperCase()}`
    })
  } catch (error) {
    console.error('Error selling book:', error)
    response.status(500).json({ error: 'Unable to sell the book.' })
  }
}
