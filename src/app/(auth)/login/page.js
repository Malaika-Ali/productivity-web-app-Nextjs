"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SocialLoginButton from "@/components/common/auth/SocialLoginButton";
import OrDivider from "@/components/common/auth/OrDivider";
import AuthFormField from "@/components/common/auth/AuthFormField";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff } from 'lucide-react';
import { supabase } from "@/lib/supabase/browserClient";
import { toast } from "sonner"

// export const metadata = {
//   title: "LogIn",
// };

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter();

  const loginSchema = z.object({
    email: z.string()
      .min(1, "Email is required")
      .email("Invalid Email Address"),

    password: z.string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema), });
  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const { data: result, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        throw error;
      }
      console.log('User has successfully Logged In', result);
      toast.success("Successfully Logged In")
      const ses = await supabase.auth.getSession()
      // console.log("session ifo:", ses)
      const user_id=ses.data.session.user.id
      // console.log("user id", user_id)
      const res = await supabase
        .from('profiles')          
        .select('onboarding_completed')               
        .eq('id', user_id) 
        .single()
        const isOnBoarded=res.data.onboarding_completed
        // console.log("is onboarded", isOnBoarded)
      if(isOnBoarded) {router.push("/dashboard/today")}
        else{router.push("/onboarding")}
    } catch (error) {
      console.log("Login failed: ", error.message)
      toast.error(`login Failed: ${error.message}`)
    } finally {
      setIsLoading(false);
    }
  }


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
              type="text"
              placeholder="name@example.com"
              autoComplete="email"
              error={errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            {/* Password */}
            <AuthFormField
              id="login-password"
              label="Password"
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password}
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
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}

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
