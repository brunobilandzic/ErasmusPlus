import { Register } from "@/components/Auth";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state) => state.authState?.user);

  return (
    <div>
      {user && <div className="text-center">Welcome {user.username}</div>}
      <div className="text-4xl fontold mb-5 w-full text-center">
        hello world
      </div>
      <div className="w-full text-center">
        {" "}
        <a href="https://nextjs.org/docs" target="_blank">
          Next.js Documentation
        </a>
        <br />
        <a href="https://tailwindcss.com/docs" target="_blank">
          Tailwind CSS Documentation
        </a>
      </div>
    </div>
  );
}
