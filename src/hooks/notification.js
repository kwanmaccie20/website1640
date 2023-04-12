import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";

export const useNotification = (userId) => {
  const supabase = useSupabaseClient();
  const { data, ...rest } = useSWR(
    userId ? `notification-${userId}` : null,
    async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("staff_id", userId)
        .order("created_at", { ascending: false });
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) return data;
    }
  );
  return {
    data,
    ...rest,
  };
};
