import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import { getAuthor } from '../../lib/authors';
import type { Author } from '../../lib/api';

export default function AuthorDetail() {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the record on mount and when id changes.
    // The "alive" flag prevents state updates after unmount (quick nav).
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        const data = await getAuthor(id);
        if (alive) setAuthor(data);
      } catch (e: any) {
        if (alive) setError(e?.response?.data?.message || 'Failed to load author');
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (!id) return <Alert kind="error">Missing author id</Alert>;
  if (!author && !error) return <Spinner label="Loading author…" />;

  return (
    <div className="space-y-4">
      {error && <Alert kind="error">{error}</Alert>}
      {author && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{author.name}</h2>
            <div className="flex gap-2">
              <Link to={`/authors/${author.id}/edit`}><Button variant="ghost">Edit</Button></Link>
              <Link to="/authors"><Button>Back to list</Button></Link>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <dt className="text-xs uppercase text-gray-500">Name</dt>
                <dd className="text-sm">{author.name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-gray-500">Bio</dt>
                <dd className="text-sm text-gray-700">{author.bio || <em className="text-gray-400">—</em>}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-gray-500">Created</dt>
                <dd className="text-sm">{new Date(author.createdAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-gray-500">Updated</dt>
                <dd className="text-sm">{new Date(author.updatedAt).toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </>
      )}
    </div>
  );
}