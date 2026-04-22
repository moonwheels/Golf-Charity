import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams, useNavigate, useLocation } from "react-router";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { fetchProfile, hasActiveSubscription } from "../../../services/profileApi";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

type AuthMode = "login" | "signup";
type AuthFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

const defaultValues: AuthFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20c11 0 20-9.01 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.193 5.235C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

export function AuthModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const authParam = searchParams.get("auth");
  const isOpen = authParam === "login" || authParam === "signup";
  
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: "error" | "success";
    message: string;
  } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const redirectTo = typeof location.state?.from === "string" ? location.state.from : "/dashboard";

  useEffect(() => {
    if (authParam === "login" || authParam === "signup") {
      setMode(authParam);
    }
  }, [authParam]);

  const handleClose = (open: boolean) => {
    if (!open) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("auth");
      setSearchParams(newParams);
      setFeedback(null);
      reset(defaultValues);
    }
  };

  const authSchema = useMemo(
    () =>
      z
        .object({
          fullName: z.string().trim(),
          email: z.email("Invalid email format"),
          password: z.string().min(8, "Password must be at least 8 characters"),
          confirmPassword: z.string(),
          terms: z.boolean(),
        })
        .superRefine((values, context) => {
          if (mode !== "signup") return;

          if (values.fullName.length < 2) {
            context.addIssue({ code: z.ZodIssueCode.custom, path: ["fullName"], message: "Full name is required" });
          }
          if (values.confirmPassword !== values.password) {
            context.addIssue({ code: z.ZodIssueCode.custom, path: ["confirmPassword"], message: "Passwords do not match" });
          }
          if (!values.terms) {
            context.addIssue({ code: z.ZodIssueCode.custom, path: ["terms"], message: "You must accept the terms" });
          }
        }),
    [mode],
  );

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AuthFormValues>({
    defaultValues,
    resolver: zodResolver(authSchema),
    mode: "onBlur",
  });

  const toggleMode = () => {
    const newMode = mode === "login" ? "signup" : "login";
    setSearchParams({ auth: newMode });
    setFeedback(null);
    setShowPassword(false);
    reset(defaultValues);
  };

  const onSubmit = async (values: AuthFormValues) => {
    setFeedback(null);

    try {
      if (mode === "login") {
        const authData = await signIn({ email: values.email, password: values.password });
        if (!authData.session) throw new Error("Login succeeded but no active session was returned.");

        const profile = authData.user ? await fetchProfile(authData.user.id) : null;
        if (!profile) throw new Error("Your account was authenticated, but your profile could not be loaded. Please try again.");

        navigate(
          profile.role === "admin" ? "/admin" : hasActiveSubscription(profile) ? redirectTo : "/dashboard/subscription",
          { replace: true }
        );
        return;
      }

      const authData = await signUp({ email: values.email, password: values.password, fullName: values.fullName });
      if (authData.session && authData.user) {
        navigate("/dashboard/subscription", { replace: true });
        return;
      }

      setFeedback({ kind: "success", message: "Account created. Check your email to confirm your account before logging in." });
      setSearchParams({ auth: "login" });
      reset({ ...defaultValues, email: values.email });
    } catch (authError) {
      setFeedback({ kind: "error", message: authError instanceof Error ? authError.message : "Authentication failed." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[380px] p-6 sm:p-7 bg-white border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] rounded-2xl md:rounded-3xl gap-0">
        <DialogHeader className="mb-5 flex flex-col items-center text-center sm:text-center space-y-0.5">
          <DialogTitle className="text-[24px] font-bold text-gray-900 tracking-tight text-center w-full">
            {mode === "login" ? "Welcome back" : "Create account"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-[14px] font-medium text-center w-full">
            {mode === "login" ? "Sign in to continue" : "Join to continue"}
          </DialogDescription>
        </DialogHeader>

        {feedback && (
          <Alert className={`mb-4 border py-2.5 px-3 ${feedback.kind === "error" ? "border-red-200 bg-red-50 text-red-900" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`}>
            <AlertDescription className="text-[13px] font-medium text-center w-full block">{feedback.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {mode === "signup" && (
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-[13px] font-medium text-gray-800">Full Name</Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-[16px] h-[16px]" strokeWidth={2} />
                </div>
                <Input id="fullName" placeholder="John Doe" className={`h-[44px] pl-10 pr-3 text-[14px] placeholder:text-gray-400 rounded-lg bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-400 transition-all ${errors.fullName ? "border-red-500 hover:border-red-500" : ""}`} {...register("fullName")} />
              </div>
              {errors.fullName && <p className="text-xs font-bold text-red-500">{errors.fullName.message}</p>}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email" className="text-[13px] font-medium text-gray-800">Email Address</Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-[16px] h-[16px]" strokeWidth={2} />
              </div>
              <Input id="email" type="email" placeholder="you@example.com" className={`h-[44px] pl-10 pr-3 text-[14px] placeholder:text-gray-400 rounded-lg bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-400 transition-all ${errors.email ? "border-red-500 hover:border-red-500" : ""}`} {...register("email")} />
            </div>
            {errors.email && <p className="text-xs font-bold text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-[13px] font-medium text-gray-800">Password</Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-[16px] h-[16px]" strokeWidth={2} />
              </div>
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className={`h-[44px] pl-10 pr-10 text-[14px] placeholder:text-gray-400 rounded-lg bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-400 transition-all ${errors.password ? "border-red-500 hover:border-red-500" : ""}`} {...register("password")} />
              <button type="button" onClick={() => setShowPassword(c => !c)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center p-1">
                {showPassword ? <EyeOff className="w-[16px] h-[16px]" /> : <Eye className="w-[16px] h-[16px]" />}
              </button>
            </div>
            {errors.password && <p className="text-xs font-bold text-red-500">{errors.password.message}</p>}
          </div>

          {mode === "signup" && (
            <>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-[13px] font-medium text-gray-800">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-[16px] h-[16px]" strokeWidth={2} />
                  </div>
                  <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Repeat your password" className={`h-[44px] pl-10 pr-10 text-[14px] placeholder:text-gray-400 rounded-lg bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-400 transition-all ${errors.confirmPassword ? "border-red-500 hover:border-red-500" : ""}`} {...register("confirmPassword")} />
                  <button type="button" onClick={() => setShowPassword(c => !c)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center p-1">
                    {showPassword ? <EyeOff className="w-[16px] h-[16px]" /> : <Eye className="w-[16px] h-[16px]" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs font-bold text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <Controller
                  control={control}
                  name="terms"
                  render={({ field }) => (
                    <Checkbox id="terms" checked={field.value} onCheckedChange={(c) => field.onChange(Boolean(c))} className={`w-4 h-4 rounded-[3px] border-gray-300 ${errors.terms ? "border-red-500" : ""}`} />
                  )}
                />
                <div className="grid gap-1 leading-none">
                  <label htmlFor="terms" className="text-[13px] text-gray-500 cursor-pointer flex items-center">
                    I agree to the&nbsp;<span className="text-[#145A41] font-bold">Terms & Conditions</span>
                  </label>
                </div>
              </div>
              {errors.terms && <p className="text-xs font-bold text-red-500">{errors.terms.message}</p>}
            </>
          )}

          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full h-[46px] rounded-[8px] bg-[#145A41] hover:bg-[#0E3D2C] text-white font-bold text-[15px] transition-all flex justify-center items-center gap-2">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{mode === "login" ? "Sign In" : "Create Account"}</>}
            </Button>
          </div>
        </form>

        {mode === "login" && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-[13px]">
                <span className="px-3 bg-white text-gray-500">or</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full h-[46px] rounded-[8px] font-medium text-[14px] border-gray-200 hover:bg-gray-50 flex items-center justify-center">
              <GoogleIcon />
              Continue with Google
            </Button>
          </>
        )}

        <div className="mt-5 text-center">
          <p className="text-[13px] text-gray-500">
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button onClick={toggleMode} className="text-[#145A41] font-bold hover:underline">
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
