// Import necessary modules and components
import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";
import loginUsers from "@/seed/data/login-data";
// Register component
export function Register() {
  const [userCredentials, setuserCredentials] = useState({
    username: "",
    password: "",
    repeatPassword: "",
    role: "admin",
  });

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e) => {
    setuserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userCredentials.password !== userCredentials.repeatPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("api/auth/register", userCredentials);
      const data = res.data;

      alert(`User registered: ${data.user?.username}`);
      setuserCredentials({
        username: "",
        password: "",
        repeatPassword: "",
        role: "admin",
      });
      dispatch(login({ user: data.user, token: data.token }));
      router.push("/");
    } catch (error) {
      alert(`Error registering user: ${error.response?.data?.message}`);
      console.error("Error registering user: ", error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      <h1 className="text-2xl font-bold">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-full max-w-md">
        <input
          value={userCredentials.username}
          onChange={handleChange}
          name="username"
          type="text"
          placeholder="Username"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative">
          <input
            value={userCredentials.password}
            onChange={handleChange}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
          </div>
        </div>
        <input
          value={userCredentials.repeatPassword}
          onChange={handleChange}
          name="repeatPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Repeat Password"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          id="role"
          name="role"
          value={userCredentials.role}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="admin">Admin</option>
          <option value="student">Student</option>
          <option value="professor">Professor</option>
          <option value="coordinator">Coordinator</option>
        </select>
        <button type="submit" className="button">
          Register
        </button>
      </form>
    </div>
  );
}

// Login component
export const Login = () => {
  const [userCredentials, setuserCredentials] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    console.log("Password visibility changed:", showPassword);
  }, [showPassword]);

  const handleChange = (e) => {
    setuserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("api/auth/login", userCredentials);
      const data = res.data;

      alert(`User logged in: ${data.user?.username}`);
      setuserCredentials({ username: "", password: "" });
      dispatch(login({ user: data.user, token: data.token }));
      router.push("/");
    } catch (error) {
      alert(`Error logging in: ${error.response?.data?.message}`);
      console.error("Error logging in: ", error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full ">
      <h1 className="text-2xl font-bold">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-full max-w-md pb-32">
        <input
          value={userCredentials.username}
          onChange={handleChange}
          name="username"
          type="text"
          placeholder="Username"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative">
          <input
            value={userCredentials.password}
            onChange={handleChange}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
          </div>
        </div>
        <button type="submit" className="button">
          Login
        </button>
      </form>
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
          <div className="text-gray-600">C3: CO331</div>
        </div>
        <div className="border p-4 rounded">
          <div className="text-2xl ">Admin</div>
          <div className="text-gray-600">A1: {loginUsers.a1.username}</div>
        </div>
      </div>
    </div>
  );
};
