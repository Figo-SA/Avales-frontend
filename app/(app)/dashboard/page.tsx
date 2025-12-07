"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/signin");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Verificando acceso...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Dashboard</p>
    </div>
  );
}
