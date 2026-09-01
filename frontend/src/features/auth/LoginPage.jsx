import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton.jsx";
import AdminLoginForm from "./AdminLoginForm.jsx";
import { showError } from "../../components/common/Toast";

export default function LoginPage() {
  const [mode, setMode] = useState("owner"); // "owner" | "admin"
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      showError(error);
      searchParams.delete("error");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-primary-600 text-center mb-1">VenueSafar</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {mode === "owner" ? "Sign in to manage your venue" : "Super Admin access"}
        </p>

        {mode === "owner" ? <GoogleLoginButton /> : <AdminLoginForm />}

        <button
          onClick={() => setMode(mode === "owner" ? "admin" : "owner")}
          className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-6"
        >
          {mode === "owner" ? "Super Admin login" : "Back to Venue Owner login"}
        </button>
      </div>
    </div>
  );
}