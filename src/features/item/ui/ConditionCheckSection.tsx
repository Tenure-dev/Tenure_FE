import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import AccordionSection from './AccordionSection';
import type { ItemConditionCheck } from '../model/types';

export interface ConditionCheckSectionProps {
  items: ItemConditionCheck[];
}

const ConditionCheckSection = ({ items }: ConditionCheckSectionProps) => {
  return (
    <AccordionSection title="상태 이상 체크">
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span
              className={
                item.checked ? 'text-body-3 text-text-primary' : 'text-body-3 text-text-disabled'
              }
            >
              {item.label}
            </span>
            <span
              className={cn(
                'flex size-5 items-center justify-center rounded-sm',
                item.checked ? 'bg-brand' : 'bg-gray-bg',
              )}
            >
              {item.checked && <Check size={13} className="text-white" />}
            </span>
          </div>
        ))}
      </div>
    </AccordionSection>
  );
};

export default ConditionCheckSection;
