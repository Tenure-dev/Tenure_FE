import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export interface ProfileSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  unit: string;
  value: number;
  onChange: (value: number) => void;
}

const THUMB_CLASS = cn(
  'absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent',
  '[&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none',
  '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2',
  '[&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-bg-white [&::-webkit-slider-thumb]:shadow-md',
  '[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full',
  '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand [&::-moz-range-thumb]:bg-bg-white',
);

const ProfileSlider = ({
  label,
  min,
  max,
  step = 1,
  unit,
  value,
  onChange,
}: ProfileSliderProps) => {
  const [open, setOpen] = useState(true);
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-2"
      >
        <span className="text-body-1 text-text-primary font-semibold">{label}</span>
        {open ? (
          <ChevronUp size={18} className="text-text-tertiary" />
        ) : (
          <ChevronDown size={18} className="text-text-tertiary" />
        )}
      </button>

      {open && (
        <div className="flex items-center gap-3 py-2">
          <div className="relative h-5 flex-1">
            <div className="bg-gray-bg absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full" />
            <div
              className="bg-brand absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
              style={{ width: `${pct}%` }}
            />
            <input
              type="range"
              aria-label={label}
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className={THUMB_CLASS}
            />
          </div>
          <span className="text-body-2 text-text-primary w-16 shrink-0 text-right font-medium">
            {value}
            {unit}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileSlider;
