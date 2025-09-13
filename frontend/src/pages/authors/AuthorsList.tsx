import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { listAuthors, deleteAuthor } from '../../lib/authors';
import type { Author } from '../../lib/api';
import { useToast } from '../../components/toast/ToastProvider';

export default function AuthorsList() {
  const [items, setItems] = useState<Author[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await listAuthors();
        if (alive) setItems(data);
      } catch (e: any) {
        if (alive) setError(e?.response?.data?.message || 'Failed to load authors');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function onDelete(id: string) {
    if (!confirm('Delete this author? This cannot be undone.')) return;
    try {
      setBusyId(id);
      await deleteAuthor(id);
      setItems((prev) => (prev ? prev.filter((a) => a.id !== id) : prev));
      toast.show('Author deleted', 'success');
    } catch (e: any) {
      toast.show(e?.response?.data?.message || 'Failed to delete author', 'error');
    } finally {
      setBusyId(null);
    }
  }

  if (items === null && !error) return <Spinner label="Loading authors..." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Authors</h2>
        <Button onClick={() => navigate('/authors/new')}>New author</Button>
      </div>

      {error && <Alert kind="error">{error}</Alert>}

      {items && items.length === 0 && (
        <Alert kind="info">No authors yet. Click “New author” to add one.</Alert>
      )}

      {items && items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Bio</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2">
                    <Link to={`/authors/${a.id}`} className="text-gray-900 hover:underline">
                      {a.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {a.bio || <span className="italic text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => navigate(`/authors/${a.id}`)}>View</Button>
                      <Button variant="ghost" onClick={() => navigate(`/authors/${a.id}/edit`)}>Edit</Button>
                      <Button
                        variant="danger"
                        onClick={() => onDelete(a.id)}
                        disabled={busyId === a.id}
                      >
                        {busyId === a.id ? 'Deleting…' : 'Delete'}
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