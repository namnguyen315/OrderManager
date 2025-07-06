"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import CompanySelector from "./customComponents/CompanySelector";
import ProductItem from "./customComponents/ProductItem";

const statusOptions = ["Chưa xử lý", "Đã xử lý", "Chờ đặt hàng"];

const schema = z.object({
  companyId: z.string().min(1, "Chọn công ty"),
  receivedDate: z.string().min(1, "Chọn ngày tiếp nhận"),
  items: z
    .array(
      z.object({
        productName: z.string().min(1, "Tên sản phẩm là bắt buộc"),
        unit: z.string().min(1, "Đơn vị là bắt buộc"),
        quantity: z.number().min(1, "Tối thiểu là 1"),
        image: z.any().optional(),
        status: z.string(),
      })
    )
    .min(1, "Phải có ít nhất một sản phẩm"),
});

type Company = {
  id: string;
  name: string;
};

type Props = {
  companies: Company[];
};

const defaultValue = {
  productName: "",
  unit: "",
  quantity: 1,
  status: "Chưa xử lý",
  image: null,
};

export default function OrderForm({ companies }: Props) {
  const { register, control, handleSubmit, setValue, watch, getValues } =
    useForm({
      resolver: zodResolver(schema),
      defaultValues: {
        companyId: "",
        receivedDate: new Date().toISOString().slice(0, 10),
        items: [defaultValue], // ✅ Có sẵn một trường nhập lúc đầu
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const selectedCompanyId = watch("companyId");

  // ✅ Tạo dòng mới và focus vào productName
  const handleAddNewItem = () => {
    const newIndex = fields.length;
    append(defaultValue);

    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>(
        `input[name="items.${newIndex}.productName"]`
      );
      input?.focus();
    });
  };

  const onSubmit = (data: any) => {
    console.log("✅ Dữ liệu hợp lệ:", data);
    // TODO: Gửi API
  };

  const onError = (errors: any) => {
    console.log("❌ Validation lỗi:", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="space-y-6 p-4 max-w-5xl mx-auto"
    >
      {/* Công ty + Ngày tiếp nhận */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <CompanySelector
          companies={companies}
          selectedCompanyId={selectedCompanyId}
          setValue={(val: string) => setValue("companyId", val)}
        />

        <div className="w-full sm:w-[200px]">
          <Label className="mb-1">Ngày tiếp nhận</Label>
          <Input type="date" {...register("receivedDate")} />
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="space-y-3">
        {fields.map((field, index) => (
          <ProductItem
            key={field.id}
            index={index}
            lastIndex={fields.length - 1}
            register={register}
            watch={watch}
            setValue={setValue}
            remove={remove}
            append={append}
            field={field}
            statusOptions={statusOptions}
          />
        ))}

        <Button type="button" variant="outline" onClick={handleAddNewItem}>
          + Thêm sản phẩm
        </Button>
      </div>

      <Button type="submit" className="mt-4">
        Gửi đơn hàng
      </Button>
    </form>
  );
}
