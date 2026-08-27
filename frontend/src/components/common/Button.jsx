import React from "react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-primary-600 hover:bg-primary-700 text-white",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  outline: "border border-gray-300 hover:bg-gray-50 text-gray-700"
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}