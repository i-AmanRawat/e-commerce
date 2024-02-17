"use client";

import { z } from "zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";

import { size } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { sizeFormSchema } from "@/schemas";
import {
  FormDescription,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";

type SizeFormValues = z.infer<typeof sizeFormSchema>;

interface SizeFormProps {
  initialData: size | null;
}

export function SizeForm({ initialData }: SizeFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit a size" : "Add a new size";
  const toastMessage = initialData ? "Size updated!" : "Size created!";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  async function onSubmit(values: SizeFormValues) {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, values);
      }

      router.push(`/${params.storeId}/sizes`);

      router.refresh();

      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);

      toast.success("Size deleted!");

      router.push(`/api/${params.storeId}/sizes`);

      router.refresh();
    } catch (error) {
      toast.error("Make sure you removed all products using this size first!");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder={
                        initialData ? initialData.value : "size name"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide size name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder={
                        initialData ? initialData.value : "size value"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide size value</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading} className="ml-auth">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}
