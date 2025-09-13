import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { Input, TextArea } from '../../components/ui/Input';
import { createBook, getBook, updateBook } from '../../lib/books';
import { listAuthors } from '../../lib/authors';
import type { Author } from '../../lib/api';
import { useToast } from '../../components/toast/ToastProvider';

type Mode = 'create' | 'edit';

export default function BookForm() {
  const { id } = useParams<{ id: string }>();
  const mode: Mode = id ? 'edit' : 'create';
  const navigate = useNavigate();
  const toast = useToast();

  // Local, serializable form state.
  const [values, setValues] = useState<{ title: string; authorId: string; description: string; year: string }>({
    title: '',
    authorId: '',
    description: '',
    year: ''
  });

  // Reference data + page loading state.
  const [authors, setAuthors] = useState<Author[] | null>(null);
  const [loading, setLoading] = useState(true);   // covers authors + book (if edit)
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; authorId?: string; year?: string }>({});

  useEffect(() => {
    // Fetch authors and (if editing) the book in parallel.
    let alive = true;
    (async () => {
      try {
        const [authorsList, book] = await Promise.all([
          listAuthors(),
          mode === 'edit' && id ? getBook(id) : Promise.resolve(null)
        ]);
        if (!alive) return;

        setAuthors(authorsList);
        if (book) {
          setValues({
            title: book.title ?? '',
            authorId: book.authorId ?? '',
            description: book.description ?? '',
            year: (book.publishedYear ?? '').toString()
          });
        }
      } catch (e: any) {
        if (alive) setError(e?.response?.data?.message || 'Failed to load form data');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false };
  }, [id, mode]);

  const yearsHint = useMemo(() => '0–9999 (optional)', []);

  // Client-side guard rails; backend still validates.
  function validate() {
    const next: typeof fieldErrors = {};
    if (!values.title.trim()) next.title = 'Title is required';
    if (values.title.length > 200) next.title = 'Title is too long';

    if (!values.authorId) next.authorId = 'Author is required';

    if (values.year.trim()) {
      const n = Number(values.year);
      if (!Number.isInteger(n) || n < 0 || n > 9999) next.year = 'Year must be an integer between 0 and 9999';
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Trim strings; coerce year when present.
    const payload = {
      title: values.title.trim(),
      authorId: values.authorId,
      description: values.description.trim() || undefined,
      publishedYear: values.year.trim() ? Number(values.year) : undefined
    };

    try {
      setSaving(true);
      if (mode === 'create') {
        await createBook(payload);
        toast.show('Book created', 'success');
      } else if (id) {
        await updateBook(id, payload);
        toast.show('Book updated', 'success');
      }
      navigate('/books'); // simple, reliable refresh
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to save book';
      setError(msg);
      toast.show(msg, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner label="Loading…" />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{mode === 'create' ? 'New book' : 'Edit book'}</h2>
      {error && <Alert kind="error">{error}</Alert>}

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-white p-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Title</label>
          <Input
            value={values.title}
            onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
            placeholder="e.g. The Hobbit"
          />
          {fieldErrors.title && <p className="text-xs text-red-600">{fieldErrors.title}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Author</label>
          <select
            value={values.authorId}
            onChange={(e) => setValues((v) => ({ ...v, authorId: e.target.value }))}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 bg-white"
          >
            <option value="">Select an author…</option>
            {authors?.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          {fieldErrors.authorId && <p className="text-xs text-red-600">{fieldErrors.authorId}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">
            Published year <span className="text-gray-400">({yearsHint})</span>
          </label>
          <Input
            inputMode="numeric"
            value={values.year}
            onChange={(e) => setValues((v) => ({ ...v, year: e.target.value }))}
            placeholder="e.g. 1937"
          />
          {fieldErrors.year && <p className="text-xs text-red-600">{fieldErrors.year}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Description</label>
          <TextArea
            rows={5}
            value={values.description}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            placeholder="Optional"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}