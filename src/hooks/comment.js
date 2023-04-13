import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";

export const useIdeaComment = (ideaId) => {
  const supabase = useSupabaseClient();
  const { data: comments, ...rest } = useSWR(`comment-${ideaId}`, async () => {
    const { data, error, count } = await supabase
      .from("comments")
      .select(
        "*, staff(id, first_name, last_name, email), ideas(campaigns(final_closure_date))",
        { count: "exact" }
      )
      .eq("idea_id", ideaId)
      .order("created_at", { ascending: false });
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    if (data) {
      return {
        data,
        count,
      };
    }
  });
  return {
    comments: comments?.data || [],
    count: comments?.count || 0,
    ...rest,
  };
};
