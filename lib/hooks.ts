import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export { useAuthRedirect } from "./hooks/useAuthRedirect";
export { useDeletePost } from "./hooks/useDeletePost";
export { useSocialAccounts } from "./hooks/useSocialAccounts";
export { useCreatePost } from "./hooks/useCreatePost";
