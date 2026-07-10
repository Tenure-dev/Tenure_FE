import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="flex min-h-screen justify-center bg-bg-white">
      <div className="min-h-screen w-full min-w-[320px] max-w-[768px] bg-bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
