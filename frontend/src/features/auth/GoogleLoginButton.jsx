import React from "react";
import { authService } from "../../services/authService";

export default function GoogleLoginButton() {
  const handleLogin = () => {
    window.location.href = authService.getGoogleLoginUrl();
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 font-medium text-sm hover:bg-gray-50 transition-colors"
    >
      <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
      Continue with Google
    </button>
  );
}