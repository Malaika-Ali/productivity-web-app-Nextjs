"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SocialLoginButton from "@/components/common/auth/SocialLoginButton";
import OrDivider from "@/components/common/auth/OrDivider";
import AuthFormField from "@/components/common/auth/AuthFormField";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { toast } from "sonner"

export default function Page() {
    const [showPwd, setShowPwd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const signupSchema = z.object({
        fullname: z.string()
            .min(1, "Full Name is required")
            .regex(
                /^[A-Za-z\s]+$/,
                "Full Name can only contain alphabets"
            ),

        email: z.string()
            .min(1, "Email is required")
            .email("Invalid Email Address"),

        password: z.string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters"),
    });

    const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema), });

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            const { data: result, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullname,
                    },
                },
            });
            if (error) {
                throw error;
            }
            console.log('User and profile created!');
            toast.success("User has been created")
        } catch (error) {
            console.log("signup failed: ", error.message)
            toast.error(`Signup Failed: ${error.message}`)
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
                            Create your account{" "}
                            <span role="img" aria-label="rocket">🚀</span>
                        </h2>
                        <p className="text-[14px] text-gray-500 font-medium">
                            Start building better habits today
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
                        {/* Full name */}
                        <AuthFormField
                            id="signup-name"
                            label="Full name"
                            type="text"
                            placeholder="Jane Smith"
                            autoComplete="name"
                            error={errors.fullname}
                            {...register("fullname")}
                        />
                        {errors.fullname && (
                            <p className="text-red-500 text-sm">{errors.fullname.message}</p>
                        )}

                        {/* Email */}
                        <AuthFormField
                            id="signup-email"
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
                            id="signup-password"
                            label="Password"
                            type={showPwd ? "text" : "password"}
                            placeholder="name123"
                            autoComplete="new-password"
                            error={errors.password}
                            {...register("password")}
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

                        {/* Terms note */}
                        <p className="text-[12px] text-gray-400 leading-relaxed -mt-1">
                            By signing up you agree to our{" "}
                            <Link href="/terms" className="text-purple-600 font-semibold hover:underline">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-purple-600 font-semibold hover:underline">
                                Privacy Policy
                            </Link>.
                        </p>

                        {/* Submit */}
                        <Button
                            disabled={isLoading}
                            type="submit"
                            className="w-full h-12 rounded-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-[15px] font-bold tracking-wide shadow-md shadow-purple-200 transition-all mt-1 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Sign up free"
                            )}
                        </Button>
                    </form>

                    {/* Log in link */}
                    <p className="mt-6 text-center text-[13.5px] text-gray-500 font-medium">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-purple-600 font-bold hover:text-purple-700 transition-colors"
                        >
                            Log in
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