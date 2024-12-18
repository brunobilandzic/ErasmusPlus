import Link from "next/link";
import { useEffect, useState } from "react";
import { MdMenu, MdPerson } from "react-icons/md";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../redux/store";
import { login, logout } from "../redux/slices/authSlice";
import axios from "axios";

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
          const response = await axios.get("/api/auth/user", {
            headers: { Authorization: `Bearer ${token}` },
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
      <Navbar authState={authState} />
      <main className="p-4">{children}</main>
    </>
  );
};

const Navbar = ({ authState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="bg-gray-800 p-4 flex justify-between text-slate-200 items-center">
      <nav>
        <div className="md:hidden text-xl cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <MdMenu />
        </div>
        <ul className={`flex flex-col md:flex-row md:space-x-4 ${!isOpen && "hidden md:flex"}`}>
          {["Home", "About", "Contact"].map((item) => (
            <li key={item} className="mb-2 md:mb-0">
              <Link href={`/${item.toLowerCase()}`}>
                <div className="text-white hover:text-gray-400">{item}</div>
              </Link>
            </li>
          ))}
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
