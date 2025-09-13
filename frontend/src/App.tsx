import { Link, Navigate, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Book Club</h1>
          <nav className="space-x-4 text-sm">
            <Link to="/authors" className="hover:underline">Authors</Link>
            <Link to="/books" className="hover:underline">Books</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/authors" replace />} />
          <Route path="/authors" element={<div className="text-gray-600">Authors page (coming next).</div>} />
          <Route path="/books" element={<div className="text-gray-600">Books page (coming next).</div>} />
        </Routes>
      </main>
    </div>
  )
}