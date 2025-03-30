import Navbar from "../components/Navbar";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.error?.message || error.statusText;
    //  errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  return (
    <div className='root-layout'>
      <Navbar />
      <div
        id='error-page'
        className='flex flex-col gap-8 justify-center items-center h-1/2'
      >
        <h1 className='text-4xl font-bold'>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className='text-slate-400'>
          <i>{errorMessage}</i>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
