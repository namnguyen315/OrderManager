"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadImage from "./UploadImage";
import { useRef, useEffect, useState } from "react";

type Props = {
  index: number;
  register: any;
  watch: any;
  getValues: () => any;
  setValue: any;
  remove: (index: number) => void;
  append: (item: any) => void;
  field: any;
  statusOptions: string[];
  lastIndex: number;
};

export default function ProductItem({
  index,
  register,
  watch,
  getValues,
  setValue,
  remove,
  append,
  field,
  statusOptions,
  lastIndex,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [summary, setSummary] = useState<{
    productName: string;
    quantity: number;
    unit: string;
    status: string;
    image: string[];
  }>({
    productName: "",
    quantity: 0,
    unit: "",
    status: "",
    image: [],
  });

  const image = watch(`items.${index}.image`);

  const productNameRef = useRef<HTMLInputElement>(null);
  const unitRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);

  const focusInput = (name: string) => {
    const input = document.querySelector<HTMLInputElement>(
      `input[name="${name}"]`
    );
    input?.focus();
  };

  const handleRemove = () => {
    const prevIndex = index - 1;
    const nextIndex = index === lastIndex ? prevIndex : index;

    remove(index);
    requestAnimationFrame(() => {
      if (nextIndex >= 0) {
        focusInput(`items.${nextIndex}.productName`);
      }
    });
  };

  const handleKeyNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const current = e.currentTarget;
    const row = parseInt(current.dataset.row || "0", 10);
    const col = current.dataset.col;
    const direction = e.key;

    if (
      ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(direction)
    ) {
      e.preventDefault();
      let targetRow = row;
      let targetCol = col;

      if (direction === "ArrowRight") {
        if (col === "productName") targetCol = "unit";
        else if (col === "unit") targetCol = "quantity";
      }

      if (direction === "ArrowLeft") {
        if (col === "quantity") targetCol = "unit";
        else if (col === "unit") targetCol = "productName";
      }

      if (direction === "ArrowDown") targetRow += 1;
      if (direction === "ArrowUp") targetRow -= 1;

      const selector = `[data-row="${targetRow}"][data-col="${targetCol}"]`;
      const nextInput = document.querySelector<HTMLInputElement>(selector);
      nextInput?.focus();
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        document.activeElement === productNameRef.current &&
        e.key === "Delete"
      ) {
        if (window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
          handleRemove();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Tách register để gộp ref an toàn
  const { ref: productNameFormRef, ...productNameRest } = register(
    `items.${index}.productName`
  );
  const { ref: unitFormRef, ...unitRest } = register(`items.${index}.unit`);
  const { ref: quantityFormRef, ...quantityRest } = register(
    `items.${index}.quantity`,
    {
      valueAsNumber: true,
    }
  );

  return collapsed ? (
    <div className="flex items-center justify-between w-full border p-3 rounded-lg">
      <div className="flex items-center gap-3 overflow-x-auto">
        <span className="font-medium">{summary.productName}</span>
        <span className="text-sm text-muted-foreground">
          {summary.quantity} {summary.unit}
        </span>
        <span className="text-sm text-muted-foreground">{summary.status}</span>
        {summary.image?.length > 0 && (
          <img
            src={summary.image[0]}
            alt="Hình"
            className="w-10 h-10 object-cover rounded-md"
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setCollapsed(false)}>
          Sửa
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:bg-red-100"
          onClick={() => {
            if (window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
              handleRemove();
            }
          }}
        >
          ✕
        </Button>
      </div>
    </div>
  ) : (
    <div className="relative flex flex-col items-end gap-2 border p-3 rounded-lg overflow-x-auto">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 p-0 text-red-500 hover:bg-red-100"
        onClick={() => {
          if (window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
            handleRemove();
          }
        }}
      >
        ✕
      </Button>

      <div className="w-full flex flex-row justify-between gap-3">
        <div className="flex flex-col w-[320px]">
          <Label className="text-sm">Tên sản phẩm</Label>
          <Input
            {...productNameRest}
            data-row={index}
            data-col="productName"
            ref={(el) => {
              productNameFormRef(el);
              productNameRef.current = el;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                unitRef.current?.focus();
              } else {
                handleKeyNavigation(e);
              }
            }}
          />
        </div>

        <div className="flex flex-col w-[150px]">
          <Label className="text-sm">Đơn vị</Label>
          <Input
            {...unitRest}
            data-row={index}
            data-col="unit"
            ref={(el) => {
              unitFormRef(el);
              unitRef.current = el;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                quantityRef.current?.focus();
              } else {
                handleKeyNavigation(e);
              }
            }}
          />
        </div>

        <div className="flex flex-col w-[150px]">
          <Label className="text-sm">Số lượng</Label>
          <Input
            {...quantityRest}
            type="number"
            data-row={index}
            data-col="quantity"
            ref={(el) => {
              quantityFormRef(el);
              quantityRef.current = el;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                append({
                  productName: "",
                  unit: "",
                  quantity: 1,
                  status: "Chưa xử lý",
                  image: [],
                });
                requestAnimationFrame(() => {
                  focusInput(`items.${index + 1}.productName`);
                });
              } else {
                handleKeyNavigation(e);
              }
            }}
          />
        </div>

        <div className="flex flex-col w-[200px]">
          <Label className="text-sm">Trạng thái</Label>
          <Select
            onValueChange={(val) => setValue(`items.${index}.status`, val)}
            defaultValue={field.status}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <Label className="text-sm">Hình ảnh</Label>
        <UploadImage
          value={image || []}
          onChange={(val: string[]) => setValue(`items.${index}.image`, val)}
        />
      </div>

      <div className="w-full flex justify-end">
        <Button
          type="button"
          variant="default"
          onClick={() => {
            const values = getValues();
            const item = values.items?.[index];

            const newSummary = {
              productName: item?.productName || "",
              quantity: item?.quantity || 0,
              unit: item?.unit || "",
              status: item?.status || "",
              image: item?.image || [],
            };

            setSummary(newSummary);
            setCollapsed(true);
          }}
        >
          Hoàn tất
        </Button>
      </div>
    </div>
  );
}
