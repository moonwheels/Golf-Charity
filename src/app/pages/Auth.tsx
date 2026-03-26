import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { z } from "zod";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Logo } from "../components/Logo";

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

const LoginLogo = ({ variant = "light" }: { variant?: "light" | "dark" }) => {
  const isDark = variant === "dark";

  return (
    <div className="flex items-center gap-2.5">
      <Logo className="w-10 h-10 sm:w-12 sm:h-12" />
      <span
        className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
          isDark ? "text-gray-900" : "text-white"
        }`}
      >
        <span className={isDark ? "text-[#145A41]" : "text-white"}>Golf</span>
        <span className={isDark ? "text-[#D4AF37]" : "text-[#FFD95A]"}>Give</span>
      </span>
    </div>
  );
};

export function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: "error" | "success";
    message: string;
  } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const redirectTo =
    typeof location.state?.from === "string" ? location.state.from : "/dashboard";

  const authSchema = useMemo(
    () =>
      z
        .object({
          fullName: z.string().trim(),
          email: z.email("Invalid email format"),
          password: z
            .string()
            .min(8, "Password must be at least 8 characters"),
          confirmPassword: z.string(),
          terms: z.boolean(),
        })
        .superRefine((values, context) => {
          if (mode !== "signup") {
            return;
          }

          if (values.fullName.length < 2) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["fullName"],
              message: "Full name is required",
            });
          }

          if (values.confirmPassword !== values.password) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["confirmPassword"],
              message: "Passwords do not match",
            });
          }

          if (!values.terms) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["terms"],
              message: "You must accept the terms",
            });
          }
        }),
    [mode],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    defaultValues,
    resolver: zodResolver(authSchema),
    mode: "onBlur",
  });

  const toggleMode = () => {
    setMode((current) => (current === "login" ? "signup" : "login"));
    setFeedback(null);
    setShowPassword(false);
    reset(defaultValues);
  };

  const onSubmit = async (values: AuthFormValues) => {
    setFeedback(null);

    try {
      if (mode === "login") {
        const authData = await signIn({
          email: values.email,
          password: values.password,
        });

        if (!authData.session) {
          setFeedback({
            kind: "error",
            message: "Login succeeded but no active session was returned.",
          });
          return;
        }

        navigate(redirectTo, { replace: true });
        return;
      }

      const authData = await signUp({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      });

      if (authData.session && authData.user) {
        navigate("/dashboard", { replace: true });
        return;
      }

      setFeedback({
        kind: "success",
        message:
          "Account created. Check your email to confirm your account before logging in.",
      });
      setMode("login");
      reset({
        ...defaultValues,
        email: values.email,
      });
    } catch (authError) {
      const message =
        authError instanceof Error ? authError.message : "Authentication failed.";
      setFeedback({
        kind: "error",
        message,
      });
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-gradient-to-br from-[#0B3D2E] to-[#145A41] p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid)" />
          </svg>
        </div>

        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFD95A]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-400/6 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col h-full">
          <Link to="/" className="inline-block mb-auto">
            <LoginLogo variant="light" />
          </Link>

          <div className="my-12 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[#FFD95A] text-xs font-bold tracking-[0.15em] mb-6 border border-white/10 backdrop-blur-md">
              <Check className="w-3.5 h-3.5" /> PLAY. WIN. GIVE BACK.
            </div>
            <h1 className="text-[3rem] leading-[1.05] font-bold text-white tracking-tight">
              Connect GolfGive to a real backend
            </h1>
            <p className="mt-5 max-w-lg text-base text-white/75 font-medium leading-relaxed">
              Secure authentication, role-aware access, and real-time Supabase data in a cleaner TypeScript flow.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD95A]/15 text-[#FFD95A]">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Realtime subscriptions</p>
                  <p className="mt-1 text-sm font-medium text-white/60">
                    Profile and data updates can stream into the UI without a manual refresh.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD95A]/15 text-[#FFD95A]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">RLS and role-based access</p>
                  <p className="mt-1 text-sm font-medium text-white/60">
                    Authenticated users only see their own records unless their role grants admin access.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-white/50 font-medium">
            <div className="flex items-center gap-4">
              <span>© 2026 GolfGive</span>
              <span>•</span>
              <span>Supabase Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Scalable auth + data foundation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white">
        <div className="lg:hidden absolute top-8 left-6">
          <Link to="/" className="inline-block scale-90 origin-left">
            <LoginLogo variant="dark" />
          </Link>
        </div>

        <div className="w-full max-w-md mt-16 lg:mt-0">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {mode === "login" ? "Sign in to GolfGive" : "Create your GolfGive account"}
            </h2>
            <p className="text-gray-500 font-medium">
              {mode === "login"
                ? "Use your email and password to access your Supabase-backed dashboard."
                : "Create an account to start using authentication and project CRUD."}
            </p>
          </div>

          {feedback ? (
            <Alert
              className={`mb-6 ${
                feedback.kind === "error"
                  ? "border-red-200 bg-red-50 text-red-900"
                  : "border-emerald-200 bg-emerald-50 text-emerald-900"
              }`}
            >
              <AlertTitle>{feedback.kind === "error" ? "Authentication error" : "Success"}</AlertTitle>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {mode === "signup" ? (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-bold text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  className={`h-12 rounded-xl bg-gray-50 border-gray-200 ${errors.fullName ? "border-red-500" : ""}`}
                  {...register("fullName")}
                />
                {errors.fullName ? (
                  <p className="text-xs font-bold text-red-500">{errors.fullName.message}</p>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`h-12 rounded-xl bg-gray-50 border-gray-200 ${errors.email ? "border-red-500" : ""}`}
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-xs font-bold text-red-500">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`h-12 rounded-xl bg-gray-50 border-gray-200 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs font-bold text-red-500">{errors.password.message}</p>
              ) : null}
            </div>

            {mode === "signup" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-bold text-gray-700">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat your password"
                    className={`h-12 rounded-xl bg-gray-50 border-gray-200 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword ? (
                    <p className="text-xs font-bold text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-start space-x-3 pt-2">
                  <Controller
                    control={control}
                    name="terms"
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                        className={errors.terms ? "border-red-500 mt-0.5" : "mt-0.5"}
                      />
                    )}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor="terms" className="text-sm font-medium text-gray-600">
                      I agree to the terms and privacy policy.
                    </label>
                    {errors.terms ? (
                      <p className="text-xs font-bold text-red-500">{errors.terms.message}</p>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-[#145A41] hover:bg-[#0B3D2E] text-white font-extrabold shadow-lg shadow-[#145A41]/20 group flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Log In" : "Create Account"}
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm font-medium">
              {mode === "login" ? "New to GolfGive?" : "Already have an account?"}{" "}
              <button
                onClick={toggleMode}
                className="text-[#145A41] font-bold hover:text-[#0B3D2E] transition-colors hover:underline"
              >
                {mode === "login" ? "Create an account" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
