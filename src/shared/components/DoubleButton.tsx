import Button from './Button';

export type DoubleButtonLayout = 'single' | 'half' | 'wide';

export interface DoubleButtonProps {
  layout: DoubleButtonLayout;
  leftLabel: string;
  rightLabel: string;
  onLeftClick: () => void;
  onRightClick: () => void;
  disabled?: boolean;
}

const DoubleButton = ({
  layout,
  leftLabel,
  rightLabel,
  onLeftClick,
  onRightClick,
  disabled = false,
}: DoubleButtonProps) => {
  if (layout === 'single') {
    return (
      <Button
        variant="filled"
        size="54"
        className="!w-[335px]"
        disabled={disabled}
        onClick={onLeftClick}
      >
        {leftLabel}
      </Button>
    );
  }

  if (layout === 'half') {
    return (
      <div className="flex w-[335px] gap-[10px]">
        <Button
          variant="ghost"
          size="54"
          className="!w-[162.5px]"
          disabled={disabled}
          onClick={onLeftClick}
        >
          {leftLabel}
        </Button>
        <Button
          variant="filled"
          size="54"
          className="!w-[162.5px]"
          disabled={disabled}
          onClick={onRightClick}
        >
          {rightLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-[335px] gap-[10px]">
      <Button
        variant="ghost"
        size="54"
        className="!w-[220px]"
        disabled={disabled}
        onClick={onLeftClick}
      >
        {leftLabel}
      </Button>
      <Button
        variant="filled"
        size="54"
        className="!w-[105px]"
        disabled={disabled}
        onClick={onRightClick}
      >
        {rightLabel}
      </Button>
    </div>
  );
};

export default DoubleButton;
