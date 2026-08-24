"use client"
import { FormEvent, useState } from "react"
import Link from "next/link"
import { signupSchema } from "@/lib/validations/auth"

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const validationResult = signupSchema.safeParse({ name, email, password });
        if (!validationResult.success) {
            setError(validationResult.error.issues[0]?.message || "Invalid input");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to sign up");
            }
            alert("Account created successfully");
            window.location.href = "/login"

        } catch (error) {
            setError("Something went wrong");

        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6">
                <div>
                    <h1 className="text-3xl font-semibold">
                        Create an account
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Start managing your company's social media.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            placeholder="Minimum 8 characters"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-foreground underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </main>
    )
}
