import { api } from './api'
import type { Author } from './api'

export async function listAuthors(): Promise<Author[]> {
  const { data } = await api.get<Author[]>('/authors')
  return data
}

export async function getAuthor(id: string): Promise<Author> {
  const { data } = await api.get<Author>(`/authors/${id}`)
  return data
}

export async function createAuthor(body: Pick<Author, 'name' | 'bio'>) {
  const { data } = await api.post<Author>('/authors', body)
  return data
}

export async function updateAuthor(id: string, body: Partial<Pick<Author, 'name' | 'bio'>>) {
  const { data } = await api.patch<Author>(`/authors/${id}`, body)
  return data
}

export async function deleteAuthor(id: string) {
  await api.delete(`/authors/${id}`)
}