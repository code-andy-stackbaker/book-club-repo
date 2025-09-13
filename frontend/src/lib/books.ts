import { api } from './api'
import type { Author, Book } from './api'

// Backend includes author on list/detail; keep type handy for views.
export type BookWithAuthor = Book & { author?: Author }

export async function listBooks(): Promise<BookWithAuthor[]> {
  const { data } = await api.get<BookWithAuthor[]>('/books')
  return data
}

export async function getBook(id: string): Promise<BookWithAuthor> {
  const { data } = await api.get<BookWithAuthor>(`/books/${id}`)
  return data
}

export async function createBook(body: {
  title: string
  authorId: string
  description?: string
  publishedYear?: number
}) {
  const { data } = await api.post<Book>('/books', body)
  return data
}

export async function updateBook(id: string, body: {
  title?: string
  authorId?: string
  description?: string
  publishedYear?: number | null
}) {
  const { data } = await api.patch<Book>(`/books/${id}`, body)
  return data
}

export async function deleteBook(id: string) {
  await api.delete(`/books/${id}`)
}