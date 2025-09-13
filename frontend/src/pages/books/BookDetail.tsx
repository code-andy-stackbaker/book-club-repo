import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import { getBook } from '../../lib/books';
import type { BookWithAuthor } from '../../lib/books';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookWithAuthor | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch on mount; "alive" flag prevents setState after unmount.
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        const data = await getBook(id);
        if (alive) setBook(data);
      } catch (e: any) {
        if (alive) setError(e?.response?.data?.message || 'Failed to load book');
      }
    })();
    return () => { alive = false };
  }, [id]);

  if (!id) return <Alert kind="error">Missing book id</Alert>;
  if (!book && !error) return <Spinner label="Loading book…" />;

  return (
    <div className="space-y-4">
      {error && <Alert kind="error">{error}</Alert>}
      {book && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <div className="flex gap-2">
              <Link to={`/books/${book.id}/edit`}><Button variant="ghost">Edit</Button></Link>
              <Link to="/books"><Button>Back to list</Button></Link>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <dt className="text-xs uppercase text-gray-500">Author</dt>
                <dd className="text-sm">{book.author?.name || <em className="text-gray-400">—</em>}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-gray-500">Published</dt>
                <dd className="text-sm">{book.publishedYear ?? <em className="text-gray-400">—</em>}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs uppercase text-gray-500">Description</dt>
                <dd className="text-sm text-gray-700 whitespace-pre-wrap">
                  {book.description || <em className="text-gray-400">—</em>}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-gray-500">Created</dt>
                <dd className="text-sm">{new Date(book.createdAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-gray-500">Updated</dt>
                <dd className="text-sm">{new Date(book.updatedAt).toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </>
      )}
    </div>
  );
}