import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface AccordionSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

const AccordionSection = ({ title, defaultOpen = true, children }: AccordionSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-border-secondary border-t-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-title-4 text-text-primary flex w-full items-center justify-between p-4 md:px-6"
      >
        {title}
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="px-4 pb-4 md:px-6">{children}</div>}
    </div>
  );
};

export default AccordionSection;
