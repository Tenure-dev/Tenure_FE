import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DoubleButton } from '@/shared/components';
import { clearAuthStorage } from '@/shared/lib/api';

interface SettingsRowItem {
  label: string;
  onClick: () => void;
}

interface SettingsSectionData {
  title?: string;
  items: SettingsRowItem[];
}

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
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    clearAuthStorage();
    navigate('/login');
  };

  const sections: SettingsSectionData[] = [
    {
      items: [
        { label: '프로필 수정', onClick: () => navigate('/mypage/edit') },
        { label: '계정 공개 범위', onClick: () => navigate('/settings/visibility') },
        { label: '로그인 정보', onClick: () => {} },
        { label: '알림', onClick: () => navigate('/settings/notifications') },
        { label: '로그아웃', onClick: () => setShowLogoutModal(true) },
        { label: '회원탈퇴', onClick: () => navigate('/settings/withdraw') },
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

  return (
    <div className="relative min-h-screen w-full bg-[#FFFFFF]">
      <header className="flex h-[52px] items-center px-[16px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center"
        >
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

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-[16px]">
          <div className="rounded-[12px] bg-white p-[24px]">
            <p className="text-center text-[16px] font-semibold text-[#111111]">
              정말로 로그아웃 하시겠습니까?
            </p>
            <div className="mt-[20px]">
              <DoubleButton
                layout="half"
                leftLabel="취소"
                rightLabel="로그아웃"
                onLeftClick={() => setShowLogoutModal(false)}
                onRightClick={handleLogout}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
