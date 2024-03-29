import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";

export const useUserProfile = (userId) => {
  const supabase = useSupabaseClient();
  const { data, ...rest } = useSWR(
    userId ? `profile-${userId}` : null,
    async () => {
      const { data } = await supabase
        .from("staff")
        .select("*, roles(id, title), departments!staff_department_id_fkey(*)")
        .eq("id", userId)
        .single()
        .throwOnError();
      if (data) {
        return data;
      }
    }
  );
  return {
    profile: data,
    ...rest,
  };
};
