"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

interface AuthImageProps {
  className?: string;
}

export default function AuthImage({ className }: AuthImageProps) {
  const [imageSources, setImageSources] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      try {
        const response = await fetch("/api/auth-images");
        if (!response.ok) throw new Error("No se pudieron cargar las imagenes");
        const data = (await response.json()) as { images: string[] };
        if (isMounted && Array.isArray(data.images) && data.images.length > 0) {
          setImageSources(data.images);
        } else if (isMounted) {
          setImageSources(["/images/auth-image.png"]);
        }
      } catch {
        if (isMounted) {
          setImageSources(["/images/auth-image.png"]);
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  const images = useMemo(
    () => imageSources.map((src) => ({ src, alt: "Authentication" })),
    [imageSources],
  );

  useEffect(() => {
    if (images.length < 2) return;
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div
      className={`hidden md:block absolute inset-0 w-full h-full ${
        className || ""
      }`}
      aria-hidden="true"
    >
      {images.length > 0 && (
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          priority={currentIndex === 0}
          width={760}
          height={1024}
          className="w-full h-full object-cover object-center"
        />
      )}
    </div>
  );
}
