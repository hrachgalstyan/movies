"use client";

import Input from "@/components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import CheckedIcon from "@/assets/images/tick.svg";
import Image from "next/image";

type LoginFormData = {
  email: string;
  password: string;
};

const validationSchema = yup.object().shape({
  email: yup.string().email("Email is not valid").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const SignInPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = useCallback(
    async (data) => {
      const { email, password } = data;

      await signIn("credentials", { email, password, redirect: false }).then(
        (value) => {
          if (value?.error) {
            console.log(value?.error);
          } else {
            router.push(`/`);
          }
        }
      );
    },
    [router]
  );

  return (
    <>
      <p className="text-[64px] text-[#ffffff] font-semibold leading-[80px]">
        Sign In
      </p>
      <form
        className="flex flex-col justify-center items-center pt-[40px] gap-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          className="w-[300px] h-[45px] px-4 text-sm rounded-[10px] bg-secondary border border-solid border-secondary appearance-none outline-none"
          type={"email"}
          placeholder={"Email"}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          className="w-[300px] h-[45px] px-4 text-sm rounded-[10px] bg-secondary border border-solid border-secondary appearance-none outline-none"
          type={"password"}
          placeholder={"Password"}
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="inline-flex items-center">
          <label
            className="relative flex items-center p-[8px] rounded-full cursor-pointer"
            htmlFor="remember_me"
          >
            <input
              type="checkbox"
              className="bg-secondary relative h-5 w-5 cursor-pointer appearance-none peer rounded-[5px] border border-[#1a3b4a] transition-all checked:border-[#1a3b4a] checked:bg-primary"
              id="remember_me"
            />
            <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
              <Image src={CheckedIcon} width={14} height={14} alt="icon" />
            </span>
          </label>
          <label
            className="text-sm leading-[24px] text-white cursor-pointer select-none"
            htmlFor="remember_me"
          >
            Remember Me
          </label>
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full h-[54px] rounded-[10px] text-[16px] leading-[24px] text-center font-bold"
        >
          Login
        </button>
      </form>
    </>
  );
};

export default SignInPage;
