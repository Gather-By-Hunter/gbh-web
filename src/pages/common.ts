import { toast } from "sonner";

export const displayError = (
  error: string,
  description?: string,
  action?: { label: string; onClick: () => void }
) => {
  return toast.error(error, {
    position: "top-center",
    description,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
  });
};

export const displayMessage = (
  message: string,
  description?: string,
  action?: { label: string; onClick: () => void }
) => {
  return toast(message, {
    position: "top-center",
    description,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
  });
};
