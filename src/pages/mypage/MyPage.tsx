import MyPageHeader from './component/MyPageHeader';
import ProfileActions from './component/ProfileAction';
import ProfileSection from './component/ProfileSection';
import ProfileStats from './component/ProfileStats';
import ProfileTabs from './component/ProfileTabs';

const MyPage = () => {
  return (
    <div className="bg-bg-white text-text-primary mx-auto min-h-screen max-w-md">
      <MyPageHeader />
      <ProfileSection />
      <ProfileStats />
      <ProfileActions />
      <ProfileTabs />
    </div>
  );
};

export default MyPage;
