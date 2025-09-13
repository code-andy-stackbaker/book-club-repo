import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { Input, TextArea } from '../../components/ui/Input';
import { createAuthor, getAuthor, updateAuthor } from '../../lib/authors';
import type { Author } from '../../lib/api';
import { useToast } from '../../components/toast/ToastProvider';

type Mode = 'create' | 'edit';

export default function AuthorForm() {
  const { id } = useParams<{ id: string }>();
  // If there's an id in the route we’re editing; otherwise we’re creating.
  const mode: Mode = id ? 'edit' : 'create';
  const navigate = useNavigate();
  const toast = useToast();

  const [values, setValues] = useState<{ name: string; bio: string }>({ name: '', bio: '' });
  // For edit flow we fetch the record first; show a spinner until data arrives.
  const [loading, setLoading] = useState(mode === 'edit');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; bio?: string }>({});

  useEffect(() => {
    // Fetch the current author when editing. Guard with an "alive" flag so we
    // don’t set state after unmount if the user navigates away quickly.
    if (mode === 'edit' && id) {
      let alive = true;
      (async () => {
        try {
          const data: Author = await getAuthor(id);
          if (alive) setValues({ name: data.name, bio: data.bio || '' });
        } catch (e: any) {
          if (alive) setError(e?.response?.data?.message || 'Failed to load author');
        } finally {
          if (alive) setLoading(false);
        }
      })();
      return () => {
        alive = false;
      };
    }
  }, [id, mode]);

  // Keep client-side rules aligned with backend DTO limits.
  // Goal is fast feedback without duplicating business logic.
  function validate() {
    const next: typeof fieldErrors = {};
    if (!values.name.trim()) next.name = 'Name is required';
    if (values.name.length > 120) next.name = 'Name is too long';
    if (values.bio.length > 2000) next.bio = 'Bio is too long';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  // Single submit handler covers both create and edit flows.
  // We trim payload to avoid accidental whitespace diffs.
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      if (mode === 'create') {
        await createAuthor({ name: values.name.trim(), bio: values.bio.trim() || undefined });
        toast.show('Author created', 'success');
        navigate('/authors'); // list refresh is cheap; avoids local cache juggling
      } else if (id) {
        await updateAuthor(id, { name: values.name.trim(), bio: values.bio.trim() || undefined });
        toast.show('Author updated', 'success');
        navigate('/authors');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to save author';
      setError(msg);           // inline error block
      toast.show(msg, 'error'); // global toast for visibility anywhere on the page
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner label="Loading…" />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{mode === 'create' ? 'New author' : 'Edit author'}</h2>
      {error && <Alert kind="error">{error}</Alert>}
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-white p-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Name</label>
          <Input
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            placeholder="e.g. Ursula K. Le Guin"
          />
          {fieldErrors.name && <p className="text-xs text-red-600">{fieldErrors.name}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Bio</label>
          <TextArea
            rows={5}
            value={values.bio}
            onChange={(e) => setValues((v) => ({ ...v, bio: e.target.value }))}
            placeholder="Optional"
          />
          {fieldErrors.bio && <p className="text-xs text-red-600">{fieldErrors.bio}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}