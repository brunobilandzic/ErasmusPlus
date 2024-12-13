import Link from "next/link";
// most important two hooks in react
import { useEffect, useState } from "react";
import { MdMenu, MdPerson } from "react-icons/md";
// redux, provider needed to wrap the app with context from the store.js
import { Provider, useDispatch, useSelector } from "react-redux";
// store is the global state
import store from "../redux/store";
// login and logout is a method to change the state
import { login, logout } from "../redux/slices/authSlice";
import axios from "axios";

// Layout is a wrapper for the app
// AuthWrap is a wrapper for the app so that the user can be checked from the redux state
// Because Use selector needs to be wrapped in a provider
export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Provider store={store}>
        <AuthWrap>{children}</AuthWrap>
      </Provider>
    </>
  );
}

export const AuthWrap = ({ children }) => {
  // useSelector is a hook to access the global state
  // accessing auth state from the global state
  const authState = useSelector((state) => state.auth);
  // useDispatch is a hook to change the global state that renturns a function to change the state
  // we provide a methon from a slice to that function to change the state
  const dispatch = useDispatch();
  //login user if token is in local storage
  useEffect(() => {
    // as fetch user data is async it needs to be defined and then called because useEffect cannot be async
    const fetchUserData = async () => {
      // if token is not undefined
      // send a request to get the user from the token
      const token = localStorage.getItem("token");
      // for debugging:
      console.log("token before if statement:", token);
      // console.log(`logic test before logic rest: ${token != null} ${typeof token === "string"} ${token?.length > 0} ${token!=undefined} ${token != "undefined"}`);
      if (token != "undefined" && token != null) {
        // also for debugging:
        // console.log(
        //   `logic test after logic test: ${token !== null} ${
        //     typeof token === "string"
        //   } ${token?.length > 0} ${token != undefined} ${token != "undefined"}`
        // );
        // console.log("token after logic test:", token);
        try {
          // get user from token
          // handler in pages/api/auth/user.js
          const response = await axios.get("/api/auth/user", {
            // append the token to the request via headers
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // if user is in the response data, dispatch login action to set the user in the global state
          if (response?.data?.user) {
            dispatch(login(response.data.user));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    // call defined async function

    fetchUserData();
  }, [dispatch]);

  return (
    <>
      <Navbar authState={authState} />
      <main className="p-4">{children}</main>
    </>
  );
};

function Navbar({ authState }) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(authState);
  }, [authState]);
  return (
    <div
      onClick={() => {
        if (isOpen) setIsOpen(false);
        else setIsOpen(true);
      }}
      className={`bg-gray-800 p-4 flex justify-between text-slate-200 items-start`}>
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
      <div className="flex items-center gap-2">
        <div className="hover:cursor-pointer items-center flex gap-2 ">
          {authState.loggedIn ? (
            <>
              <div onClick={() => dispatch(logout())}>Logout</div>

              <div>{authState?.user?.username}</div>
            </>
          ) : (
            <>
              <Link href="/login">
                <div className="hover:cursor-pointer">Login</div>
              </Link>
              <Link href="/register">
                <div className=" hover:cursor-pointer">Register</div>
              </Link>
            </>
          )}
        </div>
        <div
          className="text-xl hover:cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            console.log("clicked");
          }}>
          <Link href="/register">
            <MdPerson />
          </Link>
        </div>
      </div>
    </div>
  );
}
