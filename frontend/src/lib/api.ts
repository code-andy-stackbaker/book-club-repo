import axios from 'axios'
import { pickApiBase } from './config'

// Resolve once on startup.
const base = pickApiBase()

export const api = axios.create({
  baseURL: `${base}/api`,
  timeout: 8000,
})

// Domain types (unchanged)
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