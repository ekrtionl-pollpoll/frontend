import { zodResolver } from "@hookform/resolvers/zod";
  import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Button } from "./ui/button";
import { formSchema, TFormSchema } from "../lib/types";
import { useAuth } from "../contexts/useAuth";

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
    // setError,
  } = useForm<TFormSchema>({ resolver: zodResolver(formSchema(type)) });
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || "/";

  const isSignIn = type === "sign-in";

  const onSubmit = async (data: TFormSchema) => {
    if (isSignIn) {
      try {
        const response = await signIn(data.email, data.password);
        console.log(response);
        toast.success("로그인 성공");
        navigate(from, { replace: true });
      } catch (error) {
        toast.error("로그인 실패");
        console.error(error);
      }
    } else {
      try {
        // const response = await signUp(data);
      } catch (error) {
        console.error(error);
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
              <input
                {...register("username")}
                id='name'
                type='text'
                placeholder='Your name'
                className='input'
              />
              {errors.username && (
                <p className='text-red-300 text-[12px] mt-1'>
                  {errors.username.message}
                </p>
              )}
            </div>
          )}
          <div className='flex flex-col gap-1 sm:gap-2'>
            <label htmlFor='email'>Email</label>
            <input
              {...register("email")}
              id='email'
              type='email'
              placeholder='Your email address'
              className='input'
            />
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
            disabled={isSubmitting}
          >
            {isSignIn ? "Sign in" : "Create an Account"}
          </Button>
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
      <Toaster />
    </div>
  );
};

export default AuthForm;
