import { z } from "zod";

export const formSchema = (mode: "sign-in" | "sign-up") =>
  z
    .object({
      username:
        mode === "sign-in"
          ? z.string().optional().nullable() // 로그인 시 필요 없음
          : z.string().min(2, "닉네임을 입력해주세요"), // 회원가입 시 필수

      email: z.string().email("올바른 이메일을 입력해주세요"),

      password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다"),

      confirmPassword:
        mode === "sign-in"
          ? z.string().optional().nullable() // 로그인 시 필요 없음
          : z.string().min(8, "비밀번호를 다시 입력해주세요"),
    })
    .refine(
      (data) => mode === "sign-in" || data.password === data.confirmPassword, // 회원가입 시 비밀번호 확인
      {
        path: ["confirmPassword"],
        message: "비밀번호가 일치하지 않습니다",
      }
    );


export type TFormSchema = z.infer<ReturnType<typeof formSchema>>;
