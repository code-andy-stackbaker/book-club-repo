import { Link, Navigate, Route, Routes } from 'react-router-dom';
import AuthorsList from './pages/authors/AuthorsList';
import AuthorDetail from './pages/authors/AuthorDetail';
import AuthorForm from './pages/authors/AuthorForm';

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
          {/* Authors */}
          <Route path="/authors" element={<AuthorsList />} />
          <Route path="/authors/new" element={<AuthorForm />} />
          <Route path="/authors/:id" element={<AuthorDetail />} />
          <Route path="/authors/:id/edit" element={<AuthorForm />} />
          {/* Books placeholder (Phase 7 will fill this in) */}
          <Route path="/books" element={<div className="text-gray-600">Books page coming next.</div>} />
        </Routes>
      </main>
    </div>
  );
}