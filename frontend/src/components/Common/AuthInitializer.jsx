import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../../redux/slices/authSlice.js";

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
        withCredentials: true, // Ensures the HTTP-only cookie is sent
      })
      .then((response) => {
        if (response.data.user) {
          dispatch(setUser(response.data.user));
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);
      });
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
