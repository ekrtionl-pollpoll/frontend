import axios from "axios";
import { toast } from "sonner";

const ErrorHandler = (error: any) => {
  if (axios.isAxiosError(error)) {
    const err = error.response;
    if (Array.isArray(err?.data.errors)) {
      err?.data.errors.forEach((error: any) => {
        // toast.error(error.message);
        toast.warning(error.message);
      });
    } else if (typeof err?.data.message === "object") {
      // err.data.errors.forEach((error: any, index: any) => {
      //   toast.error(error.data.errors[index][0]);
      // });
      for (const e in err?.data.errors) {
        toast.warning(err?.data.errors[e][0]);
      }
    } else if (err?.data) {
      toast.warning(err.data);
    } else if (err?.status === 401) {
      toast.warning("Unauthorized");
      window.history.pushState({}, "SignInPage", "/signin");
    } else if (err) {
      toast.warning(err?.data);
    }
  }

  return <div></div>;
};

export default ErrorHandler;
