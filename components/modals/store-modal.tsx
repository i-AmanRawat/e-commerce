"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useStoreModal } from "@/hooks/use-store-model";
import { Modal } from "@/components/ui/modal";
import { storeFormSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const form = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof storeFormSchema>) => {
    console.log(values);
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage new product and category"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className=" space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input placeholder="E-commerce" {...field} />
                  </FormControl>
                  <FormDescription>This is your store name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-x-2 flex justify-end  ">
              <Button variant="outline" onClick={storeModal.onClose}>
                Cancel
              </Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
