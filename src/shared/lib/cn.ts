import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-headline-1',
        'text-headline-2',
        'text-headline-3',
        'text-title-1',
        'text-title-2',
        'text-title-3',
        'text-title-4',
        'text-body-1',
        'text-body-2',
        'text-body-3',
        'text-body-4',
        'text-btn-1',
        'text-btn-2',
        'text-btn-3',
        'text-btn-4',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default cn;
