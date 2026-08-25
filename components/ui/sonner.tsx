"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-neutral-900 group-[.toaster]:border-[#EAE3D9] group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:font-sans",
          description: "group-[.toast]:text-neutral-500 group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-[#18181B] group-[.toast]:text-white group-[.toast]:rounded-full group-[.toast]:text-xs group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-[#FAF8F5] group-[.toast]:text-neutral-700 group-[.toast]:rounded-full group-[.toast]:text-xs group-[.toast]:font-medium",
          success:
            "group-[.toaster]:border-emerald-200 group-[.toaster]:bg-[#FAFDF9]",
          error:
            "group-[.toaster]:border-rose-200 group-[.toaster]:bg-[#FFF8F8]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
