"use client";

import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof storeFormSchema>) => {
    try {
      console.log(values);
      setIsLoading(true);

      const response = await axios.post("/api/stores", values);

      toast.success("Store created successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
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
                    <Input
                      disabled={isLoading}
                      placeholder="E-commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your store name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-x-2 flex justify-end  ">
              <Button
                disabled={isLoading}
                variant="outline"
                onClick={storeModal.onClose}
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
