import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      text: 'text-emerald-800 dark:text-emerald-200',
      icon: <FiCheckCircle className="w-5 h-5 text-emerald-500" />,
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      border: 'border-rose-200 dark:border-rose-800/50',
      text: 'text-rose-800 dark:text-rose-200',
      icon: <FiAlertCircle className="w-5 h-5 text-rose-500" />,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800/50',
      text: 'text-amber-800 dark:text-amber-200',
      icon: <FiAlertCircle className="w-5 h-5 text-amber-500" />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800/50',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <FiInfo className="w-5 h-5 text-blue-500" />,
    },
  };

  const currentStyle = styles[type] || styles.success;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center p-4 space-x-3 max-w-sm rounded-xl border shadow-premium dark:shadow-premium-dark transition-all duration-300 transform translate-y-0 scale-100 ${currentStyle.bg} ${currentStyle.border} ${currentStyle.text}`}
      role="alert"
    >
      <div className="flex-shrink-0">{currentStyle.icon}</div>
      <div className="flex-1 text-sm font-medium pr-2">{message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-auto p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
        aria-label="Close toast"
      >
        <FiX className="w-4 h-4 opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
};

export default Toast;
export const useToastState = () => {
  const [toast, setToast] = React.useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const ToastComponent = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={closeToast} />
  ) : null;

  return { showToast, ToastComponent };
};
