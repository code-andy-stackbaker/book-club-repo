import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import type { BookWithAuthor } from '../../lib/books';
import { listBooks, deleteBook } from '../../lib/books';
import { useToast } from '../../components/toast/ToastProvider';

export default function BooksList() {
  const [items, setItems] = useState<BookWithAuthor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load once on mount. Guard with "alive" so we don't set state after unmount.
    let alive = true;
    (async () => {
      try {
        const data = await listBooks();
        if (alive) setItems(data);
      } catch (e: any) {
        if (alive) setError(e?.response?.data?.message || 'Failed to load books');
      }
    })();
    return () => { alive = false };
  }, []);

  async function onDelete(id: string) {
    if (!confirm('Delete this book? This cannot be undone.')) return;
    try {
      setBusyId(id);
      await deleteBook(id);
      setItems((prev) => (prev ? prev.filter((b) => b.id !== id) : prev));
      toast.show('Book deleted', 'success');
    } catch (e: any) {
      toast.show(e?.response?.data?.message || 'Failed to delete book', 'error');
    } finally {
      setBusyId(null);
    }
  }

  if (items === null && !error) return <Spinner label="Loading books..." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Books</h2>
        <Button onClick={() => navigate('/books/new')}>New book</Button>
      </div>

      {error && <Alert kind="error">{error}</Alert>}

      {items && items.length === 0 && (
        <Alert kind="info">No books yet. Click “New book” to add one.</Alert>
      )}

      {items && items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">Year</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-2">
                    <Link to={`/books/${b.id}`} className="text-gray-900 hover:underline">
                      {b.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-700">{b.author?.name || <em className="text-gray-400">—</em>}</td>
                  <td className="px-4 py-2 text-gray-700">{b.publishedYear ?? <em className="text-gray-400">—</em>}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => navigate(`/books/${b.id}`)}>View</Button>
                      <Button variant="ghost" onClick={() => navigate(`/books/${b.id}/edit`)}>Edit</Button>
                      <Button
                        variant="danger"
                        onClick={() => onDelete(b.id)}
                        disabled={busyId === b.id}
                      >
                        {busyId === b.id ? 'Deleting…' : 'Delete'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}