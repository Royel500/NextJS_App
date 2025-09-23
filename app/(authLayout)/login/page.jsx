"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (session) {
    redirect("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response.ok) {
        form.reset();
        console.log("Logged in successfully");
        redirect("/");
      } else {
        console.log("Login failed:", response.error);
      }
    } catch (error) {
      console.log("Error logging in:", error);
    }
  };

  return (
    <section className="mt-30 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
          Login
        </h2>

        {/* Email */}
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
        >
          Login
        </button>

        <p className="text-center text-gray-700 dark:text-gray-200">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-green-600 hover:underline font-semibold"
          >
            Register
          </Link>
        </p>
      </form>
    </section>
  );
}
