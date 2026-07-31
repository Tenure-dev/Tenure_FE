export interface InfoGridItem {
  label: string;
  value: string;
}

export interface InfoGridRowProps {
  items: [InfoGridItem, InfoGridItem?];
}

const InfoGridRow = ({ items }: InfoGridRowProps) => {
  const [first, second] = items;

  return (
    <div className="border-border-light text-body-3 flex border-t py-3 first:border-t-0">
      <div className="flex flex-1 items-center justify-between pr-3">
        <span className="text-text-secondary">{first.label}</span>
        <span className="text-text-primary">{first.value}</span>
      </div>
      {second && (
        <>
          <div className="bg-border-light w-px" />
          <div className="flex flex-1 items-center justify-between pl-3">
            <span className="text-text-secondary">{second.label}</span>
            <span className="text-text-primary">{second.value}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default InfoGridRow;
