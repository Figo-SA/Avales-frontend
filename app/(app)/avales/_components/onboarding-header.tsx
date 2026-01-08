import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OnboardingHeader() {
  return (
    <div className="px-4 sm:px-6 py-8">
      <Link
        href="/avales"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a mis avales
      </Link>
    </div>
  );
}
