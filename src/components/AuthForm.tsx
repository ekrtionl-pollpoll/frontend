import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { formSchema, TFormSchema } from "../lib/types";
import { useState } from "react";
import { api } from "@/config/apiClient";
import { useAuthStore } from "@/store/authStore";
import { useUser } from "@/hooks/useUser";

interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

interface LocationState {
  from?: {
    pathname: string;
  };
}

const AuthForm = ({ type }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TFormSchema>({ resolver: zodResolver(formSchema(type)) });
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || "/";
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const { signInMutation, signUpMutation } = useUser();
  const isSignIn = type === "sign-in";
  const [emailMessage, setEmailMessage] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");

  // State 추가됨
  // Add state to track verification status
  const [isUsernameVerified, setIsUsernameVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Add state to track if fields are in edit mode
  const [isUsernameEditable, setIsUsernameEditable] = useState(true);
  const [isEmailEditable, setIsEmailEditable] = useState(true);

  const checkEmailDuplicate = async () => {
    const email = watch("email"); // 현재 입력된 이메일 가져오기
    if (!isSignIn && email) {
      try {
        const response = await api.post("/auth/check/email", { email });

        setEmailMessage("사용 가능한 이메일입니다.");
        setIsEmailVerified(true);
        setIsEmailEditable(false);
      } catch (error: any) {
        if (error.response?.status === 409) {
          setEmailMessage("이미 사용 중인 이메일입니다.");
          setIsEmailVerified(false);
        } else {
          console.error(error);
          setEmailMessage("서버 오류가 발생했습니다.");
          setIsEmailVerified(false);
        }
      }
    }
  };

  const checkUsernameDuplicate = async () => {
    const username = watch("username"); // 현재 입력된 유저네임 가져오기
    if (!isSignIn && username) {
      try {
        const response = await api.post("/auth/check/username", { username });

        setUsernameMessage("사용 가능한 유저네임입니다.");
        setIsUsernameVerified(true);
        setIsUsernameEditable(false);
      } catch (error: any) {
        if (error.response?.status === 409) {
          setUsernameMessage("이미 사용 중인 유저네임입니다.");
          setIsUsernameVerified(false);
        } else {
          console.error(error);
          setUsernameMessage("서버 오류가 발생했습니다.");
          setIsUsernameVerified(false);
        }
      }
    }
  };

  // Function to toggle edit mode for username
  const toggleUsernameEdit = () => {
    setIsUsernameEditable(true);
    setIsUsernameVerified(false);
    setUsernameMessage("");
  };

  // Function to toggle edit mode for email
  const toggleEmailEdit = () => {
    setIsEmailEditable(true);
    setIsEmailVerified(false);
    setEmailMessage("");
  };

  const isSignUpFormValid = () => {
    if (isSignIn) return true;

    return (
      isUsernameVerified &&
      isEmailVerified &&
      !!watch("password") &&
      !!watch("confirmPassword") &&
      !errors.password &&
      !errors.confirmPassword
    );
  };

  const onSubmit = async (data: TFormSchema) => {
    if (isSignIn) {
      try {
        console.log("로그인 데이터:", data);
        const response = await signInMutation.mutateAsync(data);
        console.log("로그인 결과:", response);
        toast.success("로그인 성공");
        navigate(from, { replace: true });
      } catch (error: any) {
        console.error("로그인 에러 상세:", error);
        if (error.status === 401) {
          toast.error("이메일 또는 비밀번호가 일치하지 않습니다.");
        } else if (error.status === 404) {
          toast.error("존재하지 않는 계정입니다.");
        } else {
          toast.error(`로그인에 실패했습니다. (에러 코드: ${error.status})`);
        }
      }
    } else {
      try {
        console.log("회원가입 데이터:", data);
        const result = await signUpMutation.mutateAsync(data);
        console.log("회원가입 결과:", result);
        toast.success("회원가입이 완료되었습니다. 로그인해주세요.");
        navigate("/signin", { replace: true });
      } catch (error) {
        console.error("회원가입 에러:", error);
        toast.error("회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
      }
    }
  };

  return (
    <div className='card-border w-full max-w-[566px] mx-auto px-4 sm:px-0 my-4'>
      <div className='flex flex-col gap-4 sm:gap-6 card py-8 sm:py-6 px-6 sm:px-10'>
        <div
          className='flex flex-row gap-2 justify-center hover:cursor-pointer'
          onClick={() => navigate("/")}
        >
          <img src='/assets/logo.png' alt='logo' height={32} width={38} />
          <h2 className='text-primary-100'>PollPoll</h2>
        </div>
        <h3 className='text-center text-sm sm:text-base'>
          당신의 의견이 폴폴 날아다닌다! <br /> 자유롭게 투표하고 세상과
          소통하세요.
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          method='post'
          className='w-full space-y-4 sm:space-y-6 mt-2 sm:mt-4 form'
        >
          {!isSignIn && (
            <div className='flex flex-col gap-1 sm:gap-2'>
              <label htmlFor='name'>Name</label>
              <div className='flex gap-2'>
                <input
                  {...register("username")}
                  id='name'
                  type='text'
                  placeholder='Your name'
                  className='input flex-1'
                  disabled={!isUsernameEditable && !isSignIn}
                />
                {!isSignIn &&
                  (isUsernameEditable ? (
                    <Button
                      type='button'
                      className='verify_btn whitespace-nowrap'
                      onClick={checkUsernameDuplicate}
                    >
                      Check Username
                    </Button>
                  ) : (
                    <Button
                      type='button'
                      className='verify_btn whitespace-nowrap'
                      onClick={toggleUsernameEdit}
                    >
                      Edit
                    </Button>
                  ))}
              </div>
              {usernameMessage && (
                <p className='text-green-500 text-[12px] mt-1'>
                  {usernameMessage}
                </p>
              )}
              {errors.username && (
                <p className='text-red-300 text-[12px] mt-1'>
                  {errors.username.message}
                </p>
              )}
            </div>
          )}
          <div className='flex flex-col gap-1 sm:gap-2'>
            <label htmlFor='email'>Email</label>
            <div className='flex gap-2'>
              <input
                {...register("email")}
                id='email'
                type='email'
                placeholder='Your email address'
                className='input flex-1'
                disabled={!isEmailEditable && !isSignIn}
              />
              {!isSignIn &&
                (isEmailEditable ? (
                  <Button
                    type='button'
                    className='verify_btn whitespace-nowrap'
                    onClick={checkEmailDuplicate}
                  >
                    Check Email
                  </Button>
                ) : (
                  <Button
                    type='button'
                    className='verify_btn whitespace-nowrap'
                    onClick={toggleEmailEdit}
                  >
                    Edit
                  </Button>
                ))}
            </div>
            {emailMessage && (
              <p className='text-green-500 text-[12px] mt-1'>{emailMessage}</p>
            )}
            {/* test */}
            {errors.email && (
              <p className='text-red-300 text-[12px] mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1 sm:gap-2'>
            <label htmlFor='password'>Password</label>
            <input
              {...register("password")}
              id='password'
              type='password'
              placeholder='Your password'
              className='input'
            />
            {errors.password && (
              <p className='text-red-300 text-[12px] mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>
          {!isSignIn && (
            <div className='flex flex-col gap-1 sm:gap-2'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input
                {...register("confirmPassword")}
                id='confirmPassword'
                type='password'
                placeholder='Confirm your password'
                className='input'
              />
              {errors.confirmPassword && (
                <p className='text-red-300 text-[12px] mt-1'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}
          <Button
            className='btn w-full mt-6'
            type='submit'
            disabled={
              isSubmitting ||
              (!isSignIn && !isSignUpFormValid()) ||
              signInMutation.isPending ||
              signUpMutation.isPending
            }
          >
            {signInMutation.isPending || signUpMutation.isPending ? (
              <div className='flex items-center justify-center'>
                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                {isSignIn ? "로그인 중..." : "회원가입 중..."}
              </div>
            ) : isSignIn ? (
              "Sign in"
            ) : (
              "Create an Account"
            )}
          </Button>
          {isSignIn && (
            <div className='text-center'>
              <Link
                to='/forgot-password'
                className='text-sm text-user-primary hover:underline'
              >
                forgot password?
              </Link>
            </div>
          )}
        </form>
        <p className='text-center text-sm sm:text-base'>
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            to={!isSignIn ? "/signin" : "/signup"}
            className='font-bold text-user-primary ml-1'
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
