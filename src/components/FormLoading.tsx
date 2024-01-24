import { useFormStatus } from "react-dom";
import { PageLoading } from "./PageLoading";

export const FormLoading = () => {
  const { pending } = useFormStatus();

  return pending ? <PageLoading /> : null;
};
