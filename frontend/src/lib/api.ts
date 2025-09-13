import axios from 'axios'

const base = (import.meta.env.VITE_API_URL as string) || ''

if (!base) {
  // Explicit failure helps avoid silent 404s against wrong hosts.
  // Set VITE_API_URL in your .env (e.g., http://localhost:3000)
  // We'll add smarter env inference in a later phase.
  // eslint-disable-next-line no-console
  console.error('VITE_API_URL is not set')
}

export const api = axios.create({
  baseURL: base ? `${base.replace(/\/$/, '')}/api` : '/api',
  timeout: 8000
})

// Domain types we’ll reuse on pages
export type Author = {
  id: string
  name: string
  bio?: string | null
  createdAt: string
  updatedAt: string
}

export type Book = {
  id: string
  title: string
  description?: string | null
  publishedYear?: number | null
  authorId: string
  createdAt: string
  updatedAt: string
}