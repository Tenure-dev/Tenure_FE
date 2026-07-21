import { useRef, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, ChevronLeft, Search } from 'lucide-react';
import { Button, DoubleButton } from '@/shared/components';

const TOTAL_STEPS = 4;
type Step = 1 | 2 | 3 | 4;

const STEP_TITLES: Record<Step, string> = {
  1: '회원가입',
  2: '회원가입',
  3: '주소 등록',
  4: '프로필 작성',
};

const MOCK_EXISTING_EMAILS = ['test@example.com', 'user@tenure.com'];
const MOCK_VALID_CODE = '123456';

type EmailVerifyState = 'idle' | 'invalid' | 'exists' | 'sent' | 'wrong' | 'verified';

const signupSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  verificationCode: z.string().min(1, '인증코드를 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const TERMS: {
  key: 'service' | 'privacy' | 'marketing' | 'thirdParty';
  label: string;
  required: boolean;
}[] = [
  { key: 'service', label: '서비스 이용 약관 동의', required: true },
  { key: 'privacy', label: '개인정보처리방침 동의', required: true },
  { key: 'marketing', label: '마케팅 정보 수신 동의', required: false },
  { key: 'thirdParty', label: '개인정보 제3자 제공 동의', required: false },
];

const MOCK_ADDRESSES = [
  '서울특별시 강남구 테헤란로 123',
  '서울특별시 마포구 월드컵로 45',
  '경기도 성남시 분당구 판교역로 235',
  '서울특별시 종로구 종로 100',
  '부산광역시 해운대구 센텀중앙로 55',
];

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

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  // Step 1 — 이메일 인증
  const [emailVerifyState, setEmailVerifyState] = useState<EmailVerifyState>('idle');

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      verificationCode: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const email = watch('email');
  const verificationCode = watch('verificationCode');
  const password = watch('password');
  const passwordConfirm = watch('passwordConfirm');

  const isCodeEnabled = ['sent', 'wrong', 'verified'].includes(emailVerifyState);

  const handleEmailVerify = () => {
    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) {
      setEmailVerifyState('invalid');
      return;
    }
    if (MOCK_EXISTING_EMAILS.includes(email)) {
      setEmailVerifyState('exists');
      return;
    }
    setEmailVerifyState('sent');
  };

  const handleCodeVerify = () => {
    setEmailVerifyState(verificationCode === MOCK_VALID_CODE ? 'verified' : 'wrong');
  };

  let emailMessage: { text: string; color: string } | null = null;
  if (errors.email) {
    emailMessage = { text: errors.email.message ?? '', color: 'text-[#FF3B30]' };
  } else if (emailVerifyState === 'invalid') {
    emailMessage = { text: '올바른 이메일 형식이 아닙니다', color: 'text-[#FF3B30]' };
  } else if (emailVerifyState === 'exists') {
    emailMessage = { text: '이미 사용 중인 이메일입니다', color: 'text-[#FF3B30]' };
  }

  let codeMessage: { text: string; color: string } | null = null;
  if (emailVerifyState === 'wrong') {
    codeMessage = { text: '인증번호가 일치하지 않습니다', color: 'text-[#FF3B30]' };
  } else if (emailVerifyState === 'verified') {
    codeMessage = { text: '인증되었습니다', color: 'text-[#00AAFF]' };
  }

  const passwordMatchMessage =
    passwordConfirm.length > 0
      ? password === passwordConfirm
        ? { text: '비밀번호가 일치합니다', color: 'text-[#00AAFF]' }
        : { text: '비밀번호가 일치하지 않습니다', color: 'text-[#FF3B30]' }
      : null;

  const canProceedStep1 =
    emailVerifyState === 'verified' &&
    !errors.password &&
    password.length >= 8 &&
    passwordConfirm.length > 0 &&
    password === passwordConfirm;

  // Step 2 — 약관 동의
  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    marketing: false,
    thirdParty: false,
  });
  const allAgreed = Object.values(agreements).every(Boolean);
  const toggleAllAgreements = () => {
    const next = !allAgreed;
    setAgreements({
      service: next,
      privacy: next,
      marketing: next,
      thirdParty: next,
    });
  };
  const toggleAgreement = (key: keyof typeof agreements) =>
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  const canProceedStep2 = agreements.service && agreements.privacy;

  // Step 3 — 주소 등록
  const [addressQuery, setAddressQuery] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const filteredAddresses = addressQuery.trim()
    ? MOCK_ADDRESSES.filter((addr) => addr.includes(addressQuery.trim()))
    : MOCK_ADDRESSES;
  const canProceedStep3 = selectedAddress.length > 0;

  // Step 4 — 프로필 작성
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(60);
  const canComplete = nickname.trim().length > 0;

  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);
  const [pendingPhotoPreview, setPendingPhotoPreview] = useState<string | null>(null);
  const [showProfileToast, setShowProfileToast] = useState(false);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingPhotoPreview(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const handleCancelPendingPhoto = () => setPendingPhotoPreview(null);

  const handleConfirmPendingPhoto = () => {
    setPhotoPreview(pendingPhotoPreview);
    setPendingPhotoPreview(null);
  };

  const handleCompleteProfile = () => {
    setShowProfileToast(true);
    setTimeout(() => setShowProfileToast(false), 2000);
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
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="이메일을 입력해주세요"
                className={`${inputClassName} flex-1`}
                {...register('email')}
              />
              <Button
                type="button"
                variant="ghost"
                size="44"
                onClick={handleEmailVerify}
                disabled={!email}
              >
                인증하기
              </Button>
            </div>
            {emailMessage && (
              <p className={`text-[13px] ${emailMessage.color}`}>{emailMessage.text}</p>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="인증코드를 입력해주세요"
                disabled={!isCodeEnabled}
                className={`${inputClassName} flex-1`}
                {...register('verificationCode')}
              />
              <Button
                type="button"
                variant="ghost"
                size="44"
                onClick={handleCodeVerify}
                disabled={!isCodeEnabled || !verificationCode}
              >
                인증하기
              </Button>
            </div>
            {codeMessage && (
              <p className={`text-[13px] ${codeMessage.color}`}>{codeMessage.text}</p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요 (8자 이상)"
              className={inputClassName}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-[13px] text-[#FF3B30]">{errors.password.message}</p>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <input
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              className={inputClassName}
              {...register('passwordConfirm')}
            />
            {passwordMatchMessage && (
              <p className={`text-[13px] ${passwordMatchMessage.color}`}>
                {passwordMatchMessage.text}
              </p>
            )}
          </div>

          <div className="mt-auto pt-6">
            <Button
              type="button"
              variant="filled"
              size="54"
              className="!w-full"
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-1 flex-col px-[20px] py-[24px]">
          <label className="flex items-center gap-2 border-b border-[#F0F0F0] pb-4 text-[15px] font-semibold text-[#111111]">
            <input
              type="checkbox"
              checked={allAgreed}
              onChange={toggleAllAgreements}
              className="size-[18px] accent-[#00AAFF]"
            />
            모두 동의
          </label>

          <div className="mt-4 flex flex-col gap-4">
            {TERMS.map((term) => (
              <div key={term.key} className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[14px] text-[#111111]">
                  <input
                    type="checkbox"
                    checked={agreements[term.key]}
                    onChange={() => toggleAgreement(term.key)}
                    className="size-[16px] accent-[#00AAFF]"
                  />
                  {term.label}
                  <span className="text-[#767676]">({term.required ? '필수' : '선택'})</span>
                </label>
                <button
                  type="button"
                  onClick={() => {}}
                  className="text-[13px] text-[#767676] underline"
                >
                  약관보기
                </button>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6">
            <Button
              type="button"
              variant="filled"
              size="54"
              className="!w-full"
              disabled={!canProceedStep2}
              onClick={() => setStep(3)}
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-1 flex-col px-[20px] py-[24px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute top-1/2 left-[14px] -translate-y-1/2 text-[#767676]"
            />
            <input
              type="text"
              value={addressQuery}
              onChange={(e) => setAddressQuery(e.target.value)}
              placeholder="도로명, 지번, 건물명으로 검색"
              className={`${inputClassName} pl-[44px]`}
            />
          </div>

          <ul className="mt-3 flex flex-col">
            {filteredAddresses.map((addr) => (
              <li key={addr}>
                <button
                  type="button"
                  onClick={() => setSelectedAddress(addr)}
                  className={`flex h-[52px] w-full items-center border-b border-[#F0F0F0] px-[4px] text-left text-[14px] ${
                    selectedAddress === addr ? 'font-semibold text-[#00AAFF]' : 'text-[#111111]'
                  }`}
                >
                  {addr}
                </button>
              </li>
            ))}
            {filteredAddresses.length === 0 && (
              <p className="py-4 text-center text-[13px] text-[#767676]">검색 결과가 없습니다</p>
            )}
          </ul>

          <input
            type="text"
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
            placeholder="상세 주소를 입력해주세요"
            className={`${inputClassName} mt-3`}
          />

          <div className="mt-auto pt-6">
            <Button
              type="button"
              variant="filled"
              size="54"
              className="!w-full"
              disabled={!canProceedStep3}
              onClick={() => setStep(4)}
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-1 flex-col px-[20px] py-[24px]">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsPhotoSheetOpen(true)}
              className="relative flex size-[96px] items-center justify-center overflow-hidden rounded-full bg-[#EAEDF0]"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="프로필 사진" className="size-full object-cover" />
              ) : (
                <Camera size={28} className="text-[#767676]" />
              )}
              <span className="absolute right-0 bottom-0 flex size-[28px] items-center justify-center rounded-full bg-[#111111]">
                <Camera size={14} className="text-white" />
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            className={`${inputClassName} mt-6`}
          />

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`h-[48px] flex-1 rounded-[8px] text-[15px] font-medium ${
                gender === 'male' ? 'bg-[#111111] text-white' : 'bg-[#EAEDF0] text-[#111111]'
              }`}
            >
              남성
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`h-[48px] flex-1 rounded-[8px] text-[15px] font-medium ${
                gender === 'female' ? 'bg-[#111111] text-white' : 'bg-[#EAEDF0] text-[#111111]'
              }`}
            >
              여성
            </button>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-[14px] text-[#111111]">
              <span>키</span>
              <span className="font-semibold">{height}cm</span>
            </div>
            <input
              type="range"
              min={100}
              max={200}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="mt-2 w-full accent-[#00AAFF]"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-[14px] text-[#111111]">
              <span>몸무게</span>
              <span className="font-semibold">{weight}kg</span>
            </div>
            <input
              type="range"
              min={30}
              max={150}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="mt-2 w-full accent-[#00AAFF]"
            />
          </div>

          <div className="mt-auto pt-6">
            <Button
              type="button"
              variant="filled"
              size="54"
              className="!w-full"
              disabled={!canComplete}
              onClick={handleCompleteProfile}
            >
              완료
            </Button>
          </div>
        </div>
      )}

      {isPhotoSheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          onClick={() => setIsPhotoSheetOpen(false)}
        >
          <div
            className="w-full max-w-[390px] rounded-t-[16px] bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setIsPhotoSheetOpen(false);
                fileInputRef.current?.click();
              }}
              className="flex h-[52px] w-full items-center justify-center border-b border-[#F0F0F0] text-[15px] text-[#111111]"
            >
              앨범에서 선택하기
            </button>
            <button
              type="button"
              onClick={() => {
                setPhotoPreview(null);
                setIsPhotoSheetOpen(false);
              }}
              className="flex h-[52px] w-full items-center justify-center border-b border-[#F0F0F0] text-[15px] text-[#111111]"
            >
              기본 이미지로 변경
            </button>
            <button
              type="button"
              onClick={() => setIsPhotoSheetOpen(false)}
              className="flex h-[52px] w-full items-center justify-center border-b border-[#F0F0F0] text-[15px] text-[#111111]"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {pendingPhotoPreview && (
        <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-[390px] flex-col bg-[#FFFFFF]">
          <header className="flex h-[52px] items-center justify-between px-[16px]">
            <button type="button" onClick={handleCancelPendingPhoto} aria-label="닫기">
              <ChevronLeft size={24} className="text-[#111111]" />
            </button>
            <h1 className="text-[15px] font-semibold text-[#111111]">사진 확인</h1>
            <div className="size-[24px]" />
          </header>
          <div className="flex flex-1 items-center justify-center">
            <div className="size-[200px] overflow-hidden rounded-full">
              <img
                src={pendingPhotoPreview}
                alt="선택한 프로필 사진 미리보기"
                className="size-full object-cover"
              />
            </div>
          </div>
          <div className="px-[20px] pb-[24px]">
            <DoubleButton
              layout="half"
              leftLabel="취소하기"
              rightLabel="완료하기"
              onLeftClick={handleCancelPendingPhoto}
              onRightClick={handleConfirmPendingPhoto}
            />
          </div>
        </div>
      )}

      {showProfileToast && (
        <div className="fixed bottom-[24px] left-1/2 z-50 -translate-x-1/2 rounded-[8px] bg-[#111111] px-[16px] py-[12px] text-[13px] text-white">
          프로필이 수정되었습니다
        </div>
      )}

      {/* TODO: 개발 확인용 임시 버튼 — 나중에 제거 */}
      <button
        type="button"
        onClick={() => setStep((prev) => (prev < TOTAL_STEPS ? ((prev + 1) as Step) : prev))}
        className="mx-[20px] mb-[20px] h-[40px] shrink-0 rounded-[8px] border border-dashed border-[#FF9500] bg-[#FFF4E5] text-[13px] font-medium text-[#FF9500]"
      >
        [DEV] 다음 단계
      </button>
    </div>
  );
};

export default SignupPage;
