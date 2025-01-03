import Link from "next/link";
import { useEffect, useState } from "react";
import { MdMenu, MdPerson } from "react-icons/md";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../redux/store";
import { login, logout } from "../redux/slices/authSlice";
import axios from "axios";
import loginUsers, { usernamePassword } from "@/seed/data/login-data";

export default function Layout({ children }) {
  return (
    <Provider store={store}>
      <AuthWrap>{children}</AuthWrap>
    </Provider>
  );
}

const AuthWrap = ({ children }) => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token && token !== "undefined") {
        try {
          const response = await axios
            .get("/api/auth/user", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch((error) => {
              console.error(
                "Error fetching user data, probably token expired:",
                error
              );
              dispatch(logout());
            });
          if (response?.data?.user) {
            dispatch(login({ user: response.data.user, token }));
          } else {
            dispatch(logout());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          dispatch(logout());
        }
      }
    };

    fetchUserData();
  }, [dispatch]);

  return (
    <>
      <div className="relative h-screen">
        <Navbar authState={authState} />
        <div className="flex flex-col  items-center p-4">{children}</div>
        <footer className="text-slate-200 bg-gray-800  py-5 w-full text-center ">
          {" "}
          <p className="text-sm">
            &copy; 2024 ErasmusPlus. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

const Navbar = ({ authState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="bg-gray-800 p-4 flex justify-between text-slate-200 items-start">
      <nav>
        <div
          className="md:hidden text-xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}>
          <MdMenu />
        </div>
        <ul
          className={`flex flex-col md:flex-row md:space-x-4 ${
            !isOpen && "hidden md:flex"
          }`}>
          <li key={"home"} className="mb-2 md:mb-0">
            <Link href="/">Home</Link>
          </li>
          <li key={"erasmusprogramslink"} className="mb-2 md:mb-0">
            <Link href="/erasmusprograms">Erasmus Programs</Link>
          </li>

          {authState.loggedIn && authState.user.role === "student" && (
            <StudentNavbar />
          )}
        </ul>
      </nav>
      <div className="flex items-center gap-2">
        {authState.loggedIn ? (
          <>
            <div className="cursor-pointer" onClick={() => dispatch(logout())}>
              Logout
            </div>
            <div>{authState?.user?.username}</div>
          </>
        ) : (
          <>
            <Link href="/login">
              <div className="cursor-pointer">Login</div>
            </Link>
            <Link href="/register">
              <div className="cursor-pointer">Register</div>
            </Link>
          </>
        )}
        <div className="text-xl cursor-pointer">
          <Link href="/register">
            <MdPerson />
          </Link>
        </div>
      </div>
    </div>
  );
};

const StudentNavbar = () => {
  return (
    <>

      <li key={"applicationslink"} className="mb-2 md:mb-0">
        <Link href="/applications">Applications</Link>
      </li>
      <li key={"universitieslink"} className="mb-2 md:mb-0">
        <Link href="/universities">Universities</Link>
      </li>
    </>
  );
};

export const Landing = () => {
  return (
    <div className="flex flex-col space-y-5 items-center">
      <h1 className="text-4xl font-bold">
        Welcome Erasmus Plus mobility tracker system
      </h1>
      <div className="text-lg grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="https://nextjs.org/docs" target="_blank">
          <div className="border p-4 rounded">
            <div className="text-2xl font-bold">NextJS</div>
            <div className="text-gray-600">
              React framework that enables server-side rendering and static site
              generation for React applications. When browsing docs, be sure to
              be in page mode
            </div>
          </div>
        </a>
        <a href="https://tailwindcss.com/docs" target="_blank">
          <div className="border p-4 rounded">
            <div className="text-2xl font-bold">Tailwindcss</div>
            <div className="text-gray-600">
              Utility-first CSS framework for rapidly building custom designs.
              Using classNames to style components.
            </div>
          </div>
        </a>
        <a href="https://reactjs.org/docs/getting-started.html" target="_blank">
          <div className="border p-4 rounded">
            <div className="text-2xl font-bold">React</div>
            <div className="text-gray-600">
              A JavaScript library for building user interfaces. Learn how to
              build components and manage state in your applications.
            </div>
          </div>
        </a>
      </div>
      <div className="text-4xl w-full text-center font-bold">Login users:</div>
      <div className="text-lg grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        <div className="border p-4 rounded">
          <div className="text-2xl ">Students</div>
          <div className="text-gray-600">S1: {loginUsers.s1.username}</div>
          <div className="text-gray-600">S2: {loginUsers.s2.username}</div>
        </div>
        <div className="border p-4 rounded">
          <div className="text-2xl ">Professors</div>
          <div className="text-gray-600">P1: {loginUsers.p1.username}</div>
          <div className="text-gray-600">P2: {loginUsers.p2.username}</div>
        </div>
        <div className="border p-4 rounded">
          <div className="text-2xl ">Coordinators</div>
          <div className="text-gray-600">C1: {loginUsers.c1.username}</div>
          <div className="text-gray-600">C2: {loginUsers.c2.username}</div>
        </div>
        <div className="border p-4 rounded">
          <div className="text-2xl ">Admin</div>
          <div className="text-gray-600">A1: {loginUsers.a1.username}</div>
        </div>
      </div>
    </div>
  );
};
