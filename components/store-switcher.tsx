"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { store } from "@prisma/client";
import { Store, Check, ChevronsUpDown, Circle, PlusCircle } from "lucide-react";

import { useStoreModal } from "@/hooks/use-store-model";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: store[];
}

export function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
  const params = useParams();
  const router = useRouter();
  const storeModal = useStoreModal();
  const [open, setOpen] = useState(false);

  const formattedStoreItems = items.map((item) => ({
    label: item.name,
    id: item.id,
  }));

  const currentStore = formattedStoreItems.find(
    (item) => item.id === params.storeId
  );

  function onStoreSelect(store: { label: string; id: string }) {
    setOpen(false);
    router.push(`/${store.id}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          <Store className="mr-2 w-4 h-4" />
          {currentStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedStoreItems.map((storeItem) => (
                <CommandItem
                  key={storeItem.id}
                  value={storeItem.label}
                  onSelect={() => onStoreSelect(storeItem)}
                  className="text-sm"
                >
                  <Store className="mr-2 w-4 h-4" />
                  {storeItem.label}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentStore?.id === storeItem.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup heading="">
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 w-5 h-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
