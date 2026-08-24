"use client"


import { FormEvent, useState } from "react"
import Link from "next/link"
import { signinSchema } from "@/lib/validations/auth"

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event:FormEvent<HTMLElement>) {
    event.preventDefault();
    setError("");

    const validationResult = signinSchema.safeParse({ email, password });
    if (!validationResult.success) {
      setError(validationResult.error.issues[0]?.message || "Invalid credentials");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      window.location.href = "/automation";
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className=" flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1>Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Login to your marketing workspace
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email"
            required
            value={email}
            onChange={(event)=>(
              setEmail(event.target.value)
            )}
            placeholder="example@gmail.com"
            className="mt-1 w-full rounded-md border px-3 py-2"

             />

          <div>
            <label className="text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="Your password"
            />
          </div>
          {error && <p className=" text-sm text-red-500 mt-2">{error}</p>}

<button type="submit" disabled={loading} className=" mt-3 w-full rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50">
  {loading ? "Signing in..." : "Sign In"}
</button>

<a 
  href="/api/auth/google" 
  className="flex items-center justify-center border rounded-md py-2 w-full mt-3"
>
  Sign in with Google
</a>
          
<p className=" mt-2 text-center text-sm text-muted-foreground">
  Don't have an account?{" "}
  <Link href="/signup" className=" font-semibold underline">
    Sign up
  </Link>
</p>

          </div>

        </form>

      </div>


    </main>
  )
}
