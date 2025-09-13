import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' };

export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition border';
  const styles =
    variant === 'primary'
      ? 'bg-gray-900 text-white hover:bg-black border-transparent'
      : variant === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700 border-transparent'
      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300';
  return <button {...props} className={`${base} ${styles} ${className}`} />;
}