import { cn } from '@/shared/lib/cn';

export interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  unit: string;
}

const THUMB_CLASS = cn(
  'pointer-events-none absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent',
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5',
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
  '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-bg-white',
  '[&::-webkit-slider-thumb]:shadow-md',
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5',
  '[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full',
  '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand [&::-moz-range-thumb]:bg-bg-white',
);

const RangeSlider = ({ min, max, step = 1, value, onChange, unit }: RangeSliderProps) => {
  const [low, high] = value;
  const toPct = (v: number) => ((v - min) / (max - min)) * 100;

  const handleLowChange = (next: number) => {
    onChange([Math.min(next, high), high]);
  };

  const handleHighChange = (next: number) => {
    onChange([low, Math.max(next, low)]);
  };

  return (
    <div>
      <div className="text-body-3 text-text-tertiary flex justify-between">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>

      <div className="relative mt-2 h-5">
        <div className="bg-gray-bg absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full" />
        <div
          className="bg-brand absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
          style={{ left: `${toPct(low)}%`, right: `${100 - toPct(high)}%` }}
        />
        <input
          type="range"
          aria-label={`최소 ${unit}`}
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={(e) => handleLowChange(Number(e.target.value))}
          className={cn(THUMB_CLASS, low === high ? 'z-20' : 'z-10')}
        />
        <input
          type="range"
          aria-label={`최대 ${unit}`}
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={(e) => handleHighChange(Number(e.target.value))}
          className={cn(THUMB_CLASS, 'z-10')}
        />
      </div>

      <div className="border-border-secondary text-body-2 text-text-primary mt-3 inline-flex h-9 items-center justify-center rounded-lg border px-3 font-medium">
        {low}
        {unit} - {high}
        {unit}
      </div>
    </div>
  );
};

export default RangeSlider;
