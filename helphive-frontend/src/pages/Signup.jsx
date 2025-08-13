// src/pages/Signup.jsx
import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleGoogleResponse = async (response) => {
    const userObject = jwt_decode(response.credential);

    try {
      const res = await axios.post("/api/auth/google-signup", {
        name: userObject.name,
        email: userObject.email,
        picture: userObject.picture,
        googleId: userObject.sub,
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create your account</h2>

        {/* Form */}
        <form action="/api/auth/signup" method="POST">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="w-full mb-4 p-3 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full mb-4 p-3 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full mb-4 p-3 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500">or sign up with</div>

        {/* Google Sign-In */}
        <div id="googleSignInDiv" className="flex justify-center mt-4" />
      </div>
    </div>
  );
};

export default Signup;
