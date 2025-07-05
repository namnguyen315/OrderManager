import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function UploadImage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => setImagePreview(reader.result as string);
          reader.readAsDataURL(file);
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <label className="block font-medium">1. Tải ảnh từ máy:</label>
      <Input type="file" accept="image/*" onChange={handleFileChange} />

      <label className="block font-medium">2. Hoặc dán hình (Ctrl + V):</label>
      <div
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
        className={`border-2 rounded-md p-4 text-center text-gray-500 transition-colors
          ${isFocused ? "border-blue-500" : "border-dashed border-gray-400"}
        `}
      >
        Click hoặc chọn vùng này rồi Ctrl + V ảnh vào
      </div>

      {imagePreview && (
        <div className="mt-4">
          <label className="block font-medium">Ảnh xem trước:</label>
          <Image
            src={imagePreview}
            alt="Preview"
            className="max-w-sm rounded-md border"
            width={300}
            height={300}
          />
        </div>
      )}
    </div>
  );
}
