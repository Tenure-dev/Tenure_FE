import { Fragment, useState, type ReactNode } from 'react';
import { Search } from 'lucide-react';
import {
  Button,
  CTAButton,
  Chip,
  DoubleButton,
  FollowButton,
  SegmentedControl,
  StatusChip,
  type ButtonSize,
  type ButtonState,
  type ButtonVariant,
  type ChipState,
  type FeeChipValue,
} from '@/shared/components';

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-[18px] font-semibold text-[#111111]">{title}</h2>
    {children}
  </section>
);

const Row = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-wrap items-center gap-3">{children}</div>
);

const buttonVariants: ButtonVariant[] = ['filled', 'ghost', 'solid'];
const buttonStates: ButtonState[] = ['default', 'focus', 'press', 'disabled'];
const buttonSizes: ButtonSize[] = ['54', '48', '44', '36'];

const stateLabels: Record<ButtonState, string> = {
  default: 'Default',
  focus: 'Focus',
  press: 'Press',
  disabled: 'Disabled',
};

const feeOptions: FeeChipValue[] = ['판매자 부담', '구매자 부담', '반반 부담'];

const searchIcon = <Search size={16} strokeWidth={2} />;

const TestPage = () => {
  const [activeTab, setActiveTab] = useState('모두');
  const [activeTab2, setActiveTab2] = useState('팔로우');
  const [following, setFollowing] = useState(false);
  const [followingActive, setFollowingActive] = useState(true);

  const chipStates: ChipState[] = ['default', 'press', 'completion'];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[720px] flex-col gap-10 bg-[#FFFFFF] px-5 py-8">
      <header>
        <h1 className="text-[24px] font-semibold text-[#111111]">Component Test</h1>
        <p className="mt-1 text-[14px] text-[#767676]">shared/components 미리보기</p>
      </header>

      <Section title="Button">
        <div className="overflow-x-auto">
          <div className="inline-grid grid-cols-[120px_repeat(4,minmax(142px,1fr))] gap-x-3 gap-y-4">
            <div />
            {buttonStates.map((state) => (
              <p key={state} className="text-center text-[13px] font-medium text-[#505050]">
                {stateLabels[state]}
              </p>
            ))}

            {buttonVariants.flatMap((variant) =>
              buttonSizes.map((size) => (
                <Fragment key={`${variant}-${size}`}>
                  <p className="flex items-center text-[13px] font-medium text-[#505050]">
                    {variant} Size{size}
                  </p>
                  {buttonStates.map((state) => (
                    <Button
                      key={`${variant}-${size}-${state}`}
                      variant={variant}
                      size={size}
                      state={state}
                      leftIcon={searchIcon}
                      rightIcon={searchIcon}
                    >
                      Button
                    </Button>
                  ))}
                </Fragment>
              )),
            )}
          </div>
        </div>
      </Section>

      <Section title="DoubleButton">
        <DoubleButton
          layout="single"
          leftLabel="확인"
          rightLabel=""
          onLeftClick={() => {}}
          onRightClick={() => {}}
        />
        <DoubleButton
          layout="half"
          leftLabel="취소"
          rightLabel="확인"
          onLeftClick={() => {}}
          onRightClick={() => {}}
        />
        <DoubleButton
          layout="wide"
          leftLabel="취소"
          rightLabel="완료"
          onLeftClick={() => {}}
          onRightClick={() => {}}
        />
        <DoubleButton
          layout="half"
          leftLabel="비활성"
          rightLabel="비활성"
          disabled
          onLeftClick={() => {}}
          onRightClick={() => {}}
        />
      </Section>

      <Section title="Chip">
        <Row>
          {chipStates.map((state) => (
            <Chip key={state} label="칩" state={state} />
          ))}
        </Row>
      </Section>

      <Section title="StatusChip">
        <Row>
          <StatusChip label="구매내역" icon={<span>📦</span>} active />
          <StatusChip label="구매내역" icon={<span>📦</span>} active={false} />
        </Row>
      </Section>

      <Section title="FeeChip">
        <Row>
          {feeOptions.map((option) => (
            <button
              key={`selected-${option}`}
              type="button"
              className="inline-flex h-[40px] w-[103px] items-center justify-center rounded-[16px] bg-[#111111] font-sans text-[14px] font-semibold text-[#FFFFFF]"
            >
              {option}
            </button>
          ))}
          {feeOptions.map((option) => (
            <button
              key={`unselected-${option}`}
              type="button"
              className="inline-flex h-[40px] w-[103px] items-center justify-center rounded-[16px] bg-[#E2E6E8] font-sans text-[14px] font-semibold text-[#111111]"
            >
              {option}
            </button>
          ))}
        </Row>
      </Section>

      <Section title="SegmentedControl">
        <SegmentedControl tabs={['모두', '팔로우']} activeTab={activeTab} onChange={setActiveTab} />
        <SegmentedControl
          tabs={['모두', '팔로우']}
          activeTab={activeTab2}
          onChange={setActiveTab2}
        />
      </Section>

      <Section title="FollowButton">
        <Row>
          <FollowButton following={following} onToggle={() => setFollowing((prev) => !prev)} />
          <FollowButton following={false} disabled onToggle={() => {}} />
          <FollowButton following onToggle={() => {}} />
          <FollowButton
            following={followingActive}
            onToggle={() => setFollowingActive((prev) => !prev)}
          />
        </Row>
      </Section>

      <Section title="CTAButton">
        <Row>
          <CTAButton label="구매하기" onClick={() => {}} />
          <CTAButton label="구매하기" disabled onClick={() => {}} />
        </Row>
      </Section>
    </div>
  );
};

export default TestPage;
