// Import necessary modules and components
import axios from "axios";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/redux/slices/authSlice";

// Register component
export function Register() {
  // State for user credentials and password visibility
  const [userCredentials, setuserCredentials] = useState({
    username: "",
    password: "",
    repeatPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

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
      alert(`User registered: ${data.username}`);
      setuserCredentials({
        username: "",
        password: "",
        repeatPassword: "",
      });

      // Dispatch login action to set user in global state
      dispatch(login({ username: data.username, id: data.id, token: data.token }));
    } catch (error) {
      // Handle errors
      alert(`Error registering user: ${error.response?.data?.message} `);
      console.log("Error registering user: ", error);
    }
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
          <div className="absolute right-2 top-2 hover:cursor-pointer text-2xl">
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
