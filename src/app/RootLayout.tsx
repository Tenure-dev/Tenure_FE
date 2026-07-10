import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="bg-bg-white flex min-h-screen justify-center">
      <div className="bg-bg-white min-h-screen w-full max-w-[768px] min-w-[320px]">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
