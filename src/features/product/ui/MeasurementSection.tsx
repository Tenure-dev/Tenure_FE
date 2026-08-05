import AccordionSection from './AccordionSection';
import InfoGridRow, { type InfoGridItem } from './InfoGridRow';

export interface MeasurementSectionProps {
  title: string;
  fields: InfoGridItem[];
}

const MeasurementSection = ({ title, fields }: MeasurementSectionProps) => {
  const rows: [InfoGridItem, InfoGridItem?][] = [];
  for (let i = 0; i < fields.length; i += 2) {
    rows.push([fields[i], fields[i + 1]]);
  }

  return (
    <AccordionSection title={title}>
      {rows.map((pair) => (
        <InfoGridRow key={pair[0].label} items={pair} />
      ))}
    </AccordionSection>
  );
};

export default MeasurementSection;
