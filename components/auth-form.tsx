import { authSchema } from "@/lib/validations/auth";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers";
import { cn } from "@/lib/utils";
import { signIn } from "@/app/auth";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof authSchema>;

/* trunk-ignore(eslint) */
const AuthForm = ({ className, ...props }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(authSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: FormData){
    setIsLoading(true);

    const [settledResult] = await Promise.allSettled([
      signIn("credentials", {
        username: data.username.toLowerCase(),
        password: data.password,
        redirect: false,
      }),
      new Promise((resolve) => setTimeout(resolve, 700)),
    ]);

    const signInResult = settledResult.status === "fulfilled" ? settledResult.value: null;

    if(!signInResult?.ok) {
      return toast
    }

  }
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={
        (onSubmit)}>
        </form>
    </div>
  );
};

export default AuthForm;

