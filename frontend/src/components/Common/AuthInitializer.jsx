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
        // A 401 simply means there is no saved login session yet.
        // Keep genuine request failures visible for troubleshooting.
        if (error.response?.status !== 401) {
          console.error("Failed to fetch user:", error);
        }
      });
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
