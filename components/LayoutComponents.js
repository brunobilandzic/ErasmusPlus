import Link from "next/link";
import { useState } from "react";
import { MdMenu, MdPerson, MdVerifiedUser } from "react-icons/md";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="p-4">{children}</main>
    </>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      onClick={() => {
        if (isOpen) setIsOpen(false);
        else setIsOpen(true);
      }}
      className={`bg-gray-800 p-4 flex justify-between text-slate-200 ${
        !isOpen && "items-center"
      }`}>
      <nav className="">
        <div
          className={`md:hidden ${
            isOpen && "hidden"
          }  text-xl hover:cursor-pointer`}>
          <MdMenu onClick={() => setIsOpen(!isOpen)} />
        </div>
        <ul
          className={`flex flex-col md:flex-row md:space-x-4 ${
            !isOpen && "hidden md:flex"
          }`}>
          <li className="mb-2 md:mb-0">
            <Link href="/">
              <div className="text-white hover:text-gray-400">Home</div>
            </Link>
          </li>
          <li className="mb-2 md:mb-0">
            <Link href="/">
              <div className="text-white hover:text-gray-400">About</div>
            </Link>
          </li>
          <li className="mb-2 md:mb-0">
            <Link href="/">
              <div className="text-white hover:text-gray-400">Contact</div>
            </Link>
          </li>
        </ul>
      </nav>
      <div>
        <Link href="/">
          <MdPerson />
        </Link>
      </div>
    </div>
  );
}
