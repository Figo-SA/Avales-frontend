import Image from "next/image";
import AuthBg from "@/public/images/auth-image.png";

interface AuthImageProps {
  className?: string;
}

export default function AuthImage({ className }: AuthImageProps) {
  return (
    <div
      className={`hidden md:block absolute inset-0 w-full h-full ${
        className || ""
      }`}
      aria-hidden="true"
    >
      <Image
        src={AuthBg}
        priority
        width={760}
        height={1024}
        alt="Authentication"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
}
