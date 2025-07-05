"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import UploadImage from "./customComponents/UploadImage";

const statusOptions = ["Đã xử lý", "Chưa xử lý", "Chờ đặt hàng"];

const schema = z.object({
  companyId: z.string().min(1, "Chọn công ty"),
  receivedDate: z.string().min(1, "Chọn ngày tiếp nhận"),
  items: z.array(
    z.object({
      productName: z.string().min(1, "Tên sản phẩm bắt buộc"),
      unit: z.string(),
      quantity: z.number().min(1),
      image: z.any().optional(),
      status: z.string(),
    })
  ),
});

type Company = {
  id: string;
  name: string;
};

type Props = {
  companies: Company[];
};

export default function OrderForm({ companies }: Props) {
  const [companyOpen, setCompanyOpen] = useState(false);

  const { register, control, handleSubmit, setValue, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyId: "",
      receivedDate: new Date().toISOString().slice(0, 10),
      items: [
        {
          productName: "",
          unit: "",
          quantity: 1,
          status: "Chưa xử lý",
          image: null,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const selectedCompanyId = watch("companyId");
  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  const onSubmit = (data: any) => {
    console.log("Dữ liệu gửi đi:", data);
    // TODO: Gửi dữ liệu về API nếu cần
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 max-w-5xl mx-auto"
    >
      {/* Chọn công ty + Ngày tiếp nhận */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full">
          <Label className="mb-1">Chọn công ty</Label>
          <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedCompany ? selectedCompany.name : "Chọn công ty..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Tìm công ty..." className="h-9" />
                <CommandEmpty>Không tìm thấy công ty</CommandEmpty>
                <CommandGroup>
                  {companies.map((company) => (
                    <CommandItem
                      key={company.id}
                      value={company.name}
                      onSelect={() => {
                        setValue("companyId", company.id);
                        setCompanyOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCompanyId === company.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {company.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full sm:w-[200px]">
          <Label className="mb-1">Ngày tiếp nhận</Label>
          <Input type="date" {...register("receivedDate")} />
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="space-y-3">
        {fields.map((field, index) => {
          const image = watch(`items.${index}.image`);

          return (
            <div
              key={field.id}
              className="flex items-end gap-2 border p-3 rounded-lg overflow-x-auto"
            >
              <div className="flex flex-col w-[180px]">
                <Label className="text-sm">Tên sản phẩm</Label>
                <Input {...register(`items.${index}.productName`)} />
              </div>

              <div className="flex flex-col w-[100px]">
                <Label className="text-sm">Đơn vị</Label>
                <Input {...register(`items.${index}.unit`)} />
              </div>

              <div className="flex flex-col w-[90px]">
                <Label className="text-sm">Số lượng</Label>
                <Input
                  type="number"
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div className="flex flex-col w-[150px]">
                <Label className="text-sm">Trạng thái</Label>
                <Select
                  onValueChange={(val) =>
                    setValue(`items.${index}.status`, val)
                  }
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

              <div className="flex flex-col w-[180px]">
                <Label className="text-sm">Hình ảnh</Label>
                {/* <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setValue(
                      `items.${index}.image`,
                      e.target.files?.[0] || null
                    )
                  }
                  onPaste={(e) => {
                    const items = e.clipboardData?.items;
                    if (!items) return;
                    for (const item of items) {
                      if (item.type.startsWith("image/")) {
                        const file = item.getAsFile();
                        if (file) {
                          setValue(`items.${index}.image`, file);
                          break;
                        }
                      }
                    }
                  }}
                /> */}
                <UploadImage />
                {/* Ảnh xem trước */}
                {image && typeof image !== "string" && (
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="mt-1 h-16 object-contain rounded border"
                    width={300}
                    height={300}
                  />
                )}
              </div>

              <div className="pb-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              productName: "",
              unit: "",
              quantity: 1,
              status: "Chưa xử lý",
              image: null,
            })
          }
        >
          + Thêm sản phẩm
        </Button>
      </div>

      <Button type="submit" className="mt-4">
        Gửi đơn hàng
      </Button>
    </form>
  );
}
