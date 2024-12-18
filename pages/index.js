import { Register } from "@/components/Auth";
import React from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state) => state.authState?.user);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 flex flex-col items-center justify-center text-white">
      <header className="w-full p-5 bg-blue-600 shadow-lg">
        <h1 className="text-4xl font-bold text-center">ErasmusPlus</h1>
      </header>

      <main className="flex flex-col items-center gap-10 mt-10">
        {user && (
          <div className="text-center text-xl bg-white text-gray-800 p-4 rounded-lg shadow-md">
            Welcome, <span className="font-bold">{user.username}</span>!
          </div>
        )}

        <div className="text-2xl font-semibold bg-white text-gray-800 p-6 rounded-lg shadow-lg">
          Explore the world of opportunities with ErasmusPlus!
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            className="bg-white text-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
          >
            <h3 className="font-semibold text-lg">Next.js Documentation</h3>
            <p className="text-sm">Learn about the Next.js framework.</p>
          </a>
          <a
            href="https://tailwindcss.com/docs"
            target="_blank"
            className="bg-white text-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
          >
            <h3 className="font-semibold text-lg">Tailwind CSS Documentation</h3>
            <p className="text-sm">Learn how to style your application.</p>
          </a>
        </div>
      </main>

      <footer className="mt-10 p-5 w-full bg-blue-600 text-center shadow-lg">
        <p className="text-sm">&copy; 2024 ErasmusPlus. All rights reserved.</p>
      </footer>
    </div>
  );
}
