"use client";

import { Copy, Server } from "lucide-react";
import toast from "react-hot-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};
const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export function ApiAlert({
  title,
  description,
  variant = "public",
}: ApiAlertProps) {
  function onCopy() {
    navigator.clipboard.writeText(description);
    toast.success("API route copied!");
  }

  return (
    <Alert>
      <Server className="w-4 h-4" />
      <AlertTitle className="flex items-center space-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-semibold font-mono ">
          {description}
        </code>
        <Button variant="outline" size="icon" onClick={onCopy}>
          <Copy className="w-4 h-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
