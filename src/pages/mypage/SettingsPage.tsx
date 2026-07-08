import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SettingsRowItem {
  label: string;
  onClick: () => void;
}

interface SettingsSectionData {
  title?: string;
  items: SettingsRowItem[];
}

const sections: SettingsSectionData[] = [
  {
    items: [
      { label: '프로필 수정', onClick: () => {} },
      { label: '계정 공개 범위', onClick: () => {} },
      { label: '로그인 정보', onClick: () => {} },
      { label: '알림', onClick: () => {} },
      { label: '로그아웃', onClick: () => {} },
      { label: '회원탈퇴', onClick: () => {} },
    ],
  },
  {
    title: '거래',
    items: [
      { label: '배송지 관리', onClick: () => {} },
      { label: '정산 계좌 관리', onClick: () => {} },
      { label: '기본 배송비', onClick: () => {} },
      { label: '수수료 부담 기본값', onClick: () => {} },
      { label: '구매 제안 받기 기본값', onClick: () => {} },
    ],
  },
  {
    title: '서비스',
    items: [
      { label: '공지사항', onClick: () => {} },
      { label: '문의하기', onClick: () => {} },
      { label: '약관', onClick: () => {} },
      { label: '개인정보 처리방침', onClick: () => {} },
      { label: '버전 정보', onClick: () => {} },
    ],
  },
];

const SettingsRow = ({ label, onClick }: SettingsRowItem) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-[52px] w-full items-center justify-between border-b border-[#F0F0F0] px-[16px] text-[15px] text-[#111111]"
  >
    <span>{label}</span>
    <ChevronRight size={18} className="text-[#767676]" />
  </button>
);

const SettingsSection = ({ title, items }: SettingsSectionData) => (
  <section className="mt-[24px] first:mt-0">
    {title && <p className="px-[16px] pb-2 text-[12px] text-[#767676]">{title}</p>}
    {items.map((item) => (
      <SettingsRow key={item.label} label={item.label} onClick={item.onClick} />
    ))}
  </section>
);

const SettingsPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#FFFFFF]">
      <header className="flex h-[52px] items-center px-[16px]">
        <button type="button" onClick={() => {}} className="flex items-center justify-center">
          <ChevronLeft size={24} className="text-[#111111]" />
        </button>
        <h1 className="ml-2 text-[15px] font-semibold text-[#111111]">설정</h1>
      </header>

      {sections.map((section, index) => (
        <SettingsSection
          key={section.title ?? `section-${index}`}
          title={section.title}
          items={section.items}
        />
      ))}
    </div>
  );
};

export default SettingsPage;
