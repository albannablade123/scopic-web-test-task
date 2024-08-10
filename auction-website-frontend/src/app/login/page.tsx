"use client";
import { useRouter } from "next/navigation";
import React, { SyntheticEvent, useState } from "react";
import styles from "./Login.module.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      // Redirect to products page if login is successful
      await router.push("/homepage");
    } catch (error) {
      // Handle network or other errors
      console.error("Login error:", error);
      // Optionally display an error message to the user
      alert("Login failed. Please check your credentials and try again.");
    }
  };
  return (
    <div className={styles.container}>
      <form onSubmit={submit} className={styles.signin}>
        <h1 className="h3 mb-5 mt-3 fw-normal text-large font-semibold text-center">Sign In</h1>
        <div className="form-floating mb-3">
          <label htmlFor="username" className={styles.formLabel}>
            Username
          </label>
          <input
            type="text"
            id="username"
            className="form-control p-2"
            placeholder="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-floating mb-6">
          <label htmlFor="password" className={styles.formLabel}>
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control p-2"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-center mt-4">
          <button
            className={`w-100 btn btn-lg ${styles.submitButton}`}
            type="submit"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
