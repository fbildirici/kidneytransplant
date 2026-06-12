import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-medium bg-navy-600 text-white",
        size === "sm" && "w-8 h-8 text-xs",
        size === "md" && "w-10 h-10 text-sm",
        size === "lg" && "w-14 h-14 text-lg",
        className
      )}
    >
      {src ? (
        <img src={src} alt={name || "Avatar"} className="w-full h-full rounded-full object-cover" />
      ) : initials ? (
        initials
      ) : (
        <User size={size === "sm" ? 16 : size === "md" ? 20 : 28} />
      )}
    </div>
  );
}
