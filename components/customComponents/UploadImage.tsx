"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

type UploadImageProps = {
  value: string[];
  onChange: (images: string[]) => void;
};

export default function UploadImage({ value, onChange }: UploadImageProps) {
  // const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            onChange([...value, reader.result]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    const files: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }

    handleFiles(files.length ? (files as unknown as FileList) : null);
  };

  const removeImage = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = 150;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-row gap-5 w-full">
      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="w-[150px] h-[84px]"
      />

      <div
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
        className={`border-2 rounded-md p-4 text-center text-gray-500 transition-colors w-[150px] h-[84px]
          ${isFocused ? "border-blue-500" : "border-dashed border-gray-400"}
        `}
      >
        paste ảnh vào đây
      </div>
      {value.length > 0 && (
        <div className="flex-1 overflow-x-auto relative">
          {/* Button điều hướng trái */}
          {value.length > 6 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-hidden scroll-smooth"
          >
            {value.map((src, index) => (
              <div key={index} className="relative group shrink-0">
                <Image
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="rounded-md border w-[84px] h-[84px] object-cover cursor-pointer"
                  width={84}
                  height={84}
                  onClick={() => setFullscreenImage(src)}
                />
                <Button
                  type="button"
                  // size="icon"
                  variant="destructive"
                  className="w-[10px] h-[10px] absolute top-1 right-1 opacity-80 hover:opacity-100"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-1 h-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal xem ảnh lớn */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={() => setFullscreenImage(null)}
        >
          <div
            className="relative max-w-4xl w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="button"
              variant="ghost"
              className="absolute top-4 right-4 z-10 text-white hover:bg-red-500"
              onClick={() => setFullscreenImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            <Image
              src={fullscreenImage}
              alt="Fullscreen preview"
              className="rounded-lg object-contain max-h-[90vh] w-full"
              width={1200}
              height={800}
            />
          </div>
        </div>
      )}
    </div>
  );
}
