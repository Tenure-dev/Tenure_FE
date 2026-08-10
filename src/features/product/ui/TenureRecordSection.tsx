import AccordionSection from './AccordionSection';
import InfoGridRow from './InfoGridRow';
import type { ItemTenureRecord } from '../model/types';

export interface TenureRecordSectionProps {
  record: ItemTenureRecord;
}

const TenureRecordSection = ({ record }: TenureRecordSectionProps) => {
  return (
    <AccordionSection title="Tenure 기록 기준">
      <InfoGridRow
        items={[
          { label: '관심', value: `${record.interestCount}명` },
          { label: 'OOTD 인증', value: `${record.ootdVerifiedCount}회` },
        ]}
      />
      <InfoGridRow
        items={[
          { label: '최초 보유 날짜', value: record.firstOwnedDate },
          { label: '사이즈', value: record.size },
        ]}
      />
      <InfoGridRow
        items={[
          { label: '착용 대상', value: record.wornFor },
          { label: '카테고리', value: record.category },
        ]}
      />
    </AccordionSection>
  );
};

export default TenureRecordSection;
