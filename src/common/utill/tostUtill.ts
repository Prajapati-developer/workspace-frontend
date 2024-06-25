import { toast } from "react-toastify";

export const successToast = (message: string, props?: any) => {
  return toast.success(message, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    ...props,
  });
};
export const errorToast = (message: string, props?: any) => {
  return toast.error(message, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,

    draggable: true,
    progress: undefined,
    theme: "dark",
    ...props,
  });
};
export const dismiss = () => {
  toast.dismiss();
};
