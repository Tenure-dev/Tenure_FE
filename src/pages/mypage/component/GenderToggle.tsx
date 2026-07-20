import { Button } from '@/shared/components';

export type Gender = 'male' | 'female';

export interface GenderToggleProps {
  value: Gender;
  onChange: (gender: Gender) => void;
}

const GenderToggle = ({ value, onChange }: GenderToggleProps) => (
  <div className="flex gap-2">
    <Button
      variant="solid"
      size="44"
      state={value === 'male' ? 'press' : 'default'}
      className="w-full! flex-1"
      onClick={() => onChange('male')}
    >
      남성
    </Button>
    <Button
      variant="solid"
      size="44"
      state={value === 'female' ? 'press' : 'default'}
      className="w-full! flex-1"
      onClick={() => onChange('female')}
    >
      여성
    </Button>
  </div>
);

export default GenderToggle;
