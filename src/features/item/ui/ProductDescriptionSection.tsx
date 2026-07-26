export interface ProductDescriptionSectionProps {
  description: string;
}

const ProductDescriptionSection = ({ description }: ProductDescriptionSectionProps) => {
  return (
    <div className="border-border-secondary border-t-2 p-4 md:px-6">
      <p className="text-title-4 text-text-primary mb-3">제품 설명</p>
      <div className="bg-bg-tertiary text-body-3 text-text-primary rounded-md p-3 leading-relaxed whitespace-pre-line">
        {description}
      </div>
    </div>
  );
};

export default ProductDescriptionSection;
