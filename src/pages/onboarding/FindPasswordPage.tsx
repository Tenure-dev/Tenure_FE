import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/components';
import { sendPasswordResetCode, verifyEmailCode, resetPassword } from '@/features/auth/api/authApi';
import { ApiError } from '@/shared/lib/api';

const TOTAL_STEPS = 3;
type Step = 1 | 2 | 3;

const STEP_TITLES: Record<Step, string> = {
  1: '비밀번호 찾기',
  2: '비밀번호 찾기',
  3: '비밀번호 찾기',
};

type EmailStepError = 'idle' | 'invalid' | 'notFound';
type CodeStepError = 'idle' | 'wrong';

const inputClassName =
  'h-[52px] w-full rounded-[8px] border border-[#E2E6E8] px-[16px] text-[15px] text-[#111111] outline-none focus:border-[#00AAFF] disabled:bg-[#F5F6F8]';

const StepHeader = ({ title, step, onBack }: { title: string; step: Step; onBack: () => void }) => (
  <div>
    <header className="flex h-[52px] items-center px-[20px]">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로가기"
        className="flex items-center justify-center"
      >
        <ChevronLeft size={24} className="text-[#111111]" />
      </button>
      <h1 className="ml-2 text-[15px] font-semibold text-[#111111]">{title}</h1>
    </header>
    <div className="h-[4px] w-full bg-[#EAEDF0]">
      <div
        className="h-full bg-[#00AAFF] transition-all"
        style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
      />
    </div>
  </div>
);

const FindPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  // Step 1 — 이메일 입력
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<EmailStepError>('idle');
  const isEmailValid = z.string().email().safeParse(email).success;
  const canProceedStep1 = isEmailValid;

  const sendCodeMutation = useMutation({ mutationFn: sendPasswordResetCode });

  const handleSendCode = () => {
    if (!isEmailValid) {
      setEmailError('invalid');
      return;
    }
    setEmailError('idle');
    sendCodeMutation.mutate(
      { email },
      {
        onSuccess: () => setStep(2),
        onError: (error) => {
          setEmailError(
            error instanceof ApiError && error.code === 'AUTH_1004' ? 'notFound' : 'invalid',
          );
        },
      },
    );
  };

  let emailMessage: string | null = null;
  if (emailError === 'invalid') {
    emailMessage = '올바른 이메일 형식이 아닙니다';
  } else if (emailError === 'notFound') {
    emailMessage = '가입되지 않은 이메일입니다';
  }

  // Step 2 — 인증번호 확인
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<CodeStepError>('idle');
  const canProceedStep2 = code.trim().length > 0;

  const verifyCodeMutation = useMutation({ mutationFn: verifyEmailCode });

  const handleResend = () => {
    setCodeError('idle');
    sendCodeMutation.mutate({ email });
  };

  const handleVerifyCode = () => {
    verifyCodeMutation.mutate(
      { email, code },
      {
        onSuccess: () => setStep(3),
        onError: () => setCodeError('wrong'),
      },
    );
  };

  // Step 3 — 새 비밀번호 설정
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const isPasswordLongEnough = newPassword.length >= 8;
  const isPasswordMatched = newPasswordConfirm.length > 0 && newPassword === newPasswordConfirm;
  const canProceedStep3 = isPasswordLongEnough && isPasswordMatched;

  const resetPasswordMutation = useMutation({ mutationFn: resetPassword });

  const handleComplete = () => {
    setResetError(null);
    resetPasswordMutation.mutate(
      { email, newPassword, newPasswordConfirm },
      {
        onSuccess: () => {
          navigate('/login', { state: { toast: '비밀번호가 재설정되었습니다' } });
        },
        onError: (error) => {
          console.error(error);
          setResetError('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
      return;
    }
    setStep((prev) => (prev - 1) as Step);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-[#FFFFFF] font-sans">
      <StepHeader title={STEP_TITLES[step]} step={step} onBack={handleBack} />

      {step === 1 && (
        <div className="flex flex-1 flex-col px-[20px] py-[24px]">
          <div className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('idle');
              }}
              placeholder="이메일을 입력해주세요"
              className={inputClassName}
            />
            {emailMessage && <p className="text-[13px] text-[#FF3B30]">{emailMessage}</p>}
          </div>

          <div className="mt-auto pt-6">
            <Button
              type="button"
              variant="filled"
              size="54"
              className="!w-full"
              disabled={!canProceedStep1 || sendCodeMutation.isPending}
              onClick={handleSendCode}
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-1 flex-col px-[20px] py-[24px]">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setCodeError('idle');
                }}
                placeholder="인증번호를 입력해주세요"
                className={`${inputClassName} flex-1`}
              />
              <Button
                type="button"
                variant="ghost"
                size="44"
                onClick={handleResend}
                disabled={sendCodeMutation.isPending}
              >
                재전송
              </Button>
            </div>
            {codeError === 'wrong' && (
              <p className="text-[13px] text-[#FF3B30]">인증번호가 틀렸습니다</p>
            )}
          </div>

          <div className="mt-auto pt-6">
            <Button
              type="button"
              variant="filled"
              size="54"
              className="!w-full"
              disabled={!canProceedStep2 || verifyCodeMutation.isPending}
              onClick={handleVerifyCode}
            >
              인증하기
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-1 flex-col px-[20px] py-[24px]">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호 (8자 이상)"
              className={`${inputClassName} pr-[44px]`}
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

          <div className="relative mt-3">
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              placeholder="비밀번호 확인"
              className={`${inputClassName} pr-[44px]`}
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
              aria-label="비밀번호 확인 표시 전환"
              className="absolute top-1/2 right-[14px] -translate-y-1/2 text-[#767676]"
            >
              {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {newPasswordConfirm.length > 0 && !isPasswordMatched && (
            <p className="mt-2 text-[13px] text-[#FF3B30]">비밀번호가 일치하지 않습니다</p>
          )}

          {resetError && <p className="mt-2 text-[13px] text-[#FF3B30]">{resetError}</p>}

          <div className="mt-auto pt-6">
            <Button
              type="button"
              variant="filled"
              size="54"
              className="!w-full"
              disabled={!canProceedStep3 || resetPasswordMutation.isPending}
              onClick={handleComplete}
            >
              완료
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindPasswordPage;
