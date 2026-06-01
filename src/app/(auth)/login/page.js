"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SocialLoginButton from "../../../components/common/auth/SocialLoginButton";
import OrDivider from "../../../components/common/auth/OrDivider";
import AuthFormField from "../../../components/common/auth/AuthFormField";
import { useForm } from "react-hook-form";
import * as z from "zod"; 

import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';

export default function Page() {
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <div className="flex-1 flex flex-col min-h-screen">

      {/* Centred form area */}
      <div className="flex-1 flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-100">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-[28px] font-black text-gray-900 leading-tight tracking-tight mb-1.5">
              Welcome back{" "}
              <span role="img" aria-label="wave">👋</span>
            </h2>
            <p className="text-[14px] text-gray-500 font-medium">
              Log in to continue your streak
            </p>
          </div>

          {/* Google */}
          <SocialLoginButton provider="google" />

          {/* Divider */}
          <div className="my-5">
            <OrDivider />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email */}
            <AuthFormField
              id="login-email"
              label="Email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
              {...register("email")}
            />

            {/* Password */}
            <AuthFormField
              id="login-password"
              label="Password"
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              {...register("password")}
              rightSlot={
                <Link
                  href="/forgot-password"
                  className="text-[13px] font-bold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Forgot password?
                </Link>
              }
              inputSlot={
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff /> : <Eye />}
                </button>
              }
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 rounded-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-[15px] font-bold tracking-wide shadow-md shadow-purple-200 transition-all mt-1 cursor-pointer"
            >
              Log in
            </Button>
          </form>

          {/* Sign up link */}
          <p className="mt-6 text-center text-[13.5px] text-gray-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-purple-600 font-bold hover:text-purple-700 transition-colors"
            >
              Sign up free
            </Link>
          </p>

        </div>
      </div>

      {/* Footer */}
      <footer className="pb-8 flex justify-center gap-6">
        <Link href="/privacy" className="text-[12px] text-gray-400 hover:text-gray-600 font-medium transition-colors">
          Privacy Policy
        </Link>
        <Link href="/terms" className="text-[12px] text-gray-400 hover:text-gray-600 font-medium transition-colors">
          Terms of Service
        </Link>
      </footer>

    </div>
  );
}
