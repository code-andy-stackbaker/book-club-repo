export default function Alert({ kind = 'info', children }: { kind?: 'info' | 'error' | 'success'; children: React.ReactNode }) {
  const map = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
  } as const;
  return <div className={`rounded-xl border px-3 py-2 text-sm ${map[kind]}`}>{children}</div>;
}