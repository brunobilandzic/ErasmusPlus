// Import necessary modules and components
import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";

// Register component
export function Register() {
  // State for user credentials and password visibility
  const [userCredentials, setuserCredentials] = useState({
    username: "",
    password: "",
    repeatPassword: "",
    role: "admin",
  });

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Handle input changes
  const handleChange = (e) => {
    setuserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      `Sending request to register user:\n\n${JSON.stringify(
        userCredentials,
        null,
        2
      )}\n`
    );
    try {
      // Check if passwords match
      if (userCredentials.password !== userCredentials.repeatPassword) {
        alert("Passwords do not match");
        return;
      }
      // Send registration request
      const res = await axios.post("api/auth/register", userCredentials);
      const data = res.data;

      // Alert user and reset form
      alert(`User registered: ${data.user?.username}`);
      setuserCredentials({
        username: "",
        password: "",
        repeatPassword: "",
      });

      // Dispatch login action to set user in global state
      dispatch(
        login({user: data.user, token: data.token, roleRequest: data.newRoleRequest})
      );

      // Redirect to home page
      router.push("/");
    } catch (error) {
      // Handle errors
      alert(`Error registering user: ${error.response?.data?.message} `);
      console.log("Error registering user: ", error);
    }
  };

  // Toggle password visibility
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Register form container
    // Username, password, repeat password input fields
    // Tailwind CSS classes for styling
    <div className="text-center">
      <h1 className="text-2xl">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Username input field */}
        <input
          value={userCredentials.username}
          onChange={handleChange}
          name="username"
          type="text"
          placeholder="Username"
          className="p-2 border border-gray-300"
        />
        {/* Password input field with toggle visibility */}
        <div className="relative w-full">
          <input
            value={userCredentials.password}
            onChange={handleChange}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="p-2 border border-gray-300 w-full"
          />
          <div
            onClick={toggleShowPassword}
            className="absolute right-2 top-2 hover:cursor-pointer text-2xl">
            {showPassword ? (
              <IoMdEyeOff onClick={() => setShowPassword(true)} />
            ) : (
              <IoMdEye onClick={() => setShowPassword(false)} />
            )}
          </div>
        </div>
        {/* Repeat password input field */}
        <input
          value={userCredentials.repeatPassword}
          onChange={handleChange}
          name="repeatPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Repeat Password"
          className="p-2 border border-gray-300"
        />
        {/* Role selection dropdown */}
        <select
          id="role"
          name="role"
          value={userCredentials.role}
          onChange={handleChange}
          className="p-2 border border-gray-300 w-full">
          <option value="admin">Admin</option>
          <option value="student">Student</option>
          <option value="professor">Professor</option>
        </select>
        {/* Register button */}
        <button
          onClick={handleSubmit}
          className="bg-gray-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}

// Login component
export const Login = () => {
  // State for user credentials and password visibility
  const [userCredentials, setuserCredentials] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Log password visibility state changes
  useEffect(() => {
    console.log("Password visibility changed:", showPassword);
  }, [showPassword]);

  // Handle input changes
  const handleChange = (e) => {
    setuserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      `Sending request to login user:\n\n${JSON.stringify(userCredentials)}\n`
    );
    try {
      // Send login request
      const res = await axios.post("api/auth/login", userCredentials);
      const data = res.data;

      // Alert user and reset form
      alert(`User logged in: ${data.user?.username}`);
      setuserCredentials({
        username: "",
        password: "",
      });

      // Dispatch login action to set user in global state
      dispatch(
        login({user: data.user, token: data.token, roleRequest: data.roleRequest})
      );

      // Redirect to home page
      router.push("/");
    } catch (error) {
      // Handle errors
      alert(`Error logging in: ${error.response?.data?.message} `);
      console.log("Error logging in: ", error);
    }
  };

  // Toggle password visibility
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Login form container
    // Username, password input fields
    // Tailwind CSS classes for styling
    <div className="text-center">
      <h1 className="text-2xl">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Username input field */}
        <input
          value={userCredentials.username}
          onChange={handleChange}
          name="username"
          type="text"
          placeholder="Username"
          className="p-2 border border-gray-300"
        />
        {/* Password input field with toggle visibility */}
        <div className="relative w-full">
          <input
            value={userCredentials.password}
            onChange={handleChange}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="p-2 border border-gray-300 w-full"
          />
          <div
            onClick={toggleShowPassword}
            className="absolute right-2 top-2 hover:cursor-pointer text-2xl">
            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
          </div>
        </div>
        {/* Login button */}
        <button
          onClick={handleSubmit}
          className="bg-gray-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};
