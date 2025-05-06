"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const route = useRouter();
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) route.back();
      }}
    >
      <DialogContent className="max-h-full overflow-auto">
        {children}
      </DialogContent>
    </Dialog>
  );
}
