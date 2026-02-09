import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link className="block" href="/">
      <Image
        src="/images/LogoFedeLoja.png" // or /images/logo.png if in public/images/
        alt="Logo"
        width={32}
        height={30}
        priority // For above-the-fold logos
        className="w-8 h-8 object-cover" // Optional: Tailwind classes for responsive sizing
      />
    </Link>
  );
}
