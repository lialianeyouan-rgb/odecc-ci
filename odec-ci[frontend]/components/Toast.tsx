import React, { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
};

const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  onClose,
  duration = 4500,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const baseClasses =
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-xl shadow-2xl font-montserrat font-semibold flex items-center gap-3 animate-fade-in min-w-[280px] max-w-[90vw] justify-center";

  const typeClasses = {
    success:
      "bg-green-600 text-white border-2 border-green-500 shadow-green-900/30",
    error:
      "bg-red-600 text-white border-2 border-red-500 shadow-red-900/30",
    info: "bg-odec-blue-900 text-white border-2 border-odec-blue-700",
  };

  const iconSvg = {
    success: (
      <svg
        className="w-6 h-6 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-6 h-6 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    info: (
      <svg
        className="w-6 h-6 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`${baseClasses} ${typeClasses[type]}`}
    >
      {iconSvg[type]}
      <span>{message}</span>
    </div>
  );
};

export default Toast;
