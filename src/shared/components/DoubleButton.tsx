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
        className="!w-full"
        disabled={disabled}
        onClick={onLeftClick}
      >
        {leftLabel}
      </Button>
    );
  }

  if (layout === 'half') {
    return (
      <div className="flex w-full gap-[10px]">
        <Button
          variant="ghost"
          size="54"
          className="min-w-0 flex-1"
          disabled={disabled}
          onClick={onLeftClick}
        >
          {leftLabel}
        </Button>
        <Button
          variant="filled"
          size="54"
          className="min-w-0 flex-1"
          disabled={disabled}
          onClick={onRightClick}
        >
          {rightLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-[10px]">
      <Button
        variant="ghost"
        size="54"
        className="min-w-0 flex-[2]"
        disabled={disabled}
        onClick={onLeftClick}
      >
        {leftLabel}
      </Button>
      <Button
        variant="filled"
        size="54"
        className="min-w-0 flex-1"
        disabled={disabled}
        onClick={onRightClick}
      >
        {rightLabel}
      </Button>
    </div>
  );
};

export default DoubleButton;
