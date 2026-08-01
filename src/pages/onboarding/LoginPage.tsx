import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Toast } from '@/shared/components';
import logo from '@/shared/assets/logo.png';
import googleLogo from '@/shared/assets/google.webp';
import { login } from '@/features/auth/api/authApi';
import { getMyInfo } from '@/features/auth/api/userApi';
import { ACCESS_TOKEN_STORAGE_KEY, USER_ID_STORAGE_KEY } from '@/shared/lib/api';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/shared/hooks/useToast';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const inputClassName =
  'h-[52px] w-full rounded-[8px] border border-[#E2E6E8] px-[16px] text-[15px] text-[#111111] outline-none focus:border-[#00AAFF]';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useUserStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const loginMutation = useMutation({ mutationFn: login });
  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();

  useEffect(() => {
    const toastOnArrival = (location.state as { toast?: string } | null)?.toast;
    if (toastOnArrival) {
      showToast(toastOnArrival);
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const email = watch('email');
  const password = watch('password');
  const canSubmit = Boolean(email) && Boolean(password) && isValid;

  const onSubmit = (values: LoginFormValues) => {
    setLoginError(null);
    loginMutation.mutate(values, {
      onSuccess: async ({ userId, accessToken }) => {
        localStorage.setItem(USER_ID_STORAGE_KEY, String(userId));
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
        try {
          setUser(await getMyInfo());
        } catch (error) {
          console.error(error);
        }
        navigate('/loading');
      },
      onError: (error) => {
        console.error(error);
        setLoginError('이메일 또는 비밀번호를 확인해주세요');
      },
    });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col justify-center bg-[#FFFFFF] px-[20px] pt-[64px] pb-[48px] font-sans">
      <div className="flex justify-center">
        <img src={logo} alt="Tenure" className="w-[160px]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-[48px] flex flex-col gap-3">
        <input
          type="email"
          placeholder="아이디를 입력해주세요"
          className={inputClassName}
          {...register('email')}
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력해주세요"
            className={`${inputClassName} pr-[44px]`}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="비밀번호 표시 전환"
            className="absolute top-1/2 right-[14px] -translate-y-1/2 text-[#767676]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between px-[2px]">
          <label className="flex items-center gap-2 text-[13px] text-[#505050]">
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="size-[16px] accent-[#00AAFF]"
            />
            로그인 상태 유지
          </label>
          <button
            type="button"
            onClick={() => navigate('/find-password')}
            className="text-[13px] text-[#767676]"
          >
            비밀번호 찾기
          </button>
        </div>

        {loginError && <p className="px-[2px] text-[13px] text-[#FF3B30]">{loginError}</p>}

        <Button
          type="submit"
          variant="filled"
          size="54"
          disabled={!canSubmit || loginMutation.isPending}
          className="mt-2 !w-full"
        >
          로그인
        </Button>
      </form>

      <div className="mt-[32px] flex items-center gap-3">
        <div className="h-px flex-1 bg-[#E2E6E8]" />
        <span className="text-[13px] text-[#A3B6B8]">또는</span>
        <div className="h-px flex-1 bg-[#E2E6E8]" />
      </div>

      <div className="mt-[20px] flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => showToast('소셜 로그인은 준비 중입니다')}
          aria-label="구글로 계속하기"
          className="flex size-[52px] items-center justify-center rounded-full border border-[#E2E6E8] bg-white"
        >
          <img src={googleLogo} alt="" className="size-[40px]" />
        </button>
        <button
          type="button"
          onClick={() => showToast('소셜 로그인은 준비 중입니다')}
          aria-label="네이버로 계속하기"
          className="flex size-[52px] items-center justify-center rounded-full bg-[#03C75A] text-[20px] font-bold text-white"
        >
          N
        </button>
      </div>

      <p className="mt-[32px] text-center text-[13px] text-[#767676]">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="text-[#00AAFF]">
          회원가입
        </Link>
      </p>

      <Toast message={toastMessage} onClose={hideToast} />
    </div>
  );
};

export default LoginPage;
