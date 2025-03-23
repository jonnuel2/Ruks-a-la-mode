import { ReactNode } from "react";
import { Audio } from "react-loader-spinner";

interface ButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
  icon?: ReactNode;
}
export default function Button({ label, onClick, icon, loading }: ButtonProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center space-x-4 border border-coffee w-fit p-2 cursor-pointer "
    >
      {loading ? (
        <Audio />
      ) : (
        <p className={`text-sm font-medium text-coffee hover:opacity-60`}>
          {label}
        </p>
      )}

      {icon}
    </div>
  );
}
