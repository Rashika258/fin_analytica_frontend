import { authSchema } from "@/lib/validations/auth";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { signIn } from "@/app/auth";
import { toast } from "./ui/use-toast";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { buttonVariants } from "./ui/button";
import { Icons } from "./icons";
import { useRouter } from "next/router";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof authSchema>;

const AuthForm = ({ className, ...props }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(authSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const [settledResult] = await Promise.allSettled([
      signIn("credentials", {
        username: data.username.toLowerCase(),
        password: data.password,
        redirect: false,
      }),
      new Promise((resolve) => setTimeout(resolve, 700)),
    ]);

    const signInResult =
      settledResult.status === "fulfilled" ? settledResult.value : null;

    if (!signInResult?.ok) {
      return toast({
        title: "Something went wrong",
        description: "Your sign in request failed. Please try again",
        variant: "destructive",
      });
    }
    setIsLoading(false);

    if (!signInResult?.error) {
      return toast({
        title: "Something went wrong.",
        description: signInResult.error,
        variant: "destructive",
      });
    }

    router.refresh();
    router.push("/dashboard");
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <div className="grid gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Username"
              type="text"
              autoCapitalize="none"
              autoComplete="text"
              autoCorrect="off"
              disabled={isLoading}
              {...register("username")}
            />
            {errors?.username && (
              <p className="px-1 text-xs text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            className={cn(
              "mt-2",
              buttonVariants({
                variant: "default",
                size: "default",
              })
            )}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin"></Icons.spinner>
            )}
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;