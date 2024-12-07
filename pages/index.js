import React from "react";

export default function Home() {
  return (
    <div>
      <div className="text-4xl fontold mb-5 w-full text-center">
        hello world
      </div>
      <div className="w-full text-center">
        {" "}
        <a
          href="https://nextjs.org/docs"
          target="_blank">
          Next.js Documentation
        </a>
        <br />
        <a
          href="https://tailwindcss.com/docs"
          target="_blank">
          Tailwind CSS Documentation
        </a>
      </div>
    </div>
  );
}
