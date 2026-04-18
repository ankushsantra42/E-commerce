import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}

      toastOptions={{
        classNames: {
          error: "!bg-red-100 !text-red-800 !border !border-red-300",
          success: "!bg-green-100 !text-green-800 !border !border-green-300",
          warning: "!bg-yellow-100 !text-yellow-800 !border !border-yellow-300",
          info: "!bg-blue-100 !text-blue-800 !border !border-blue-300",
        },
      }}
      {...props} />
  );
}

export { Toaster }
