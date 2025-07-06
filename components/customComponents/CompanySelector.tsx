"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Company = {
  id: string;
  name: string;
};

type Props = {
  companies: Company[];
  selectedCompanyId: string;
  setValue: (id: string) => void;
};

export default function CompanySelector({
  companies,
  selectedCompanyId,
  setValue,
}: Props) {
  const [open, setOpen] = useState(false);
  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  return (
    <div className="w-full">
      <Label className="mb-1">Chọn công ty</Label>
      <Popover open={open} onOpenChange={setOpen}>
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
                    setValue(company.id);
                    setOpen(false);
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
  );
}
