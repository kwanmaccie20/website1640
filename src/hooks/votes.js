import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";

export const useCountVotes = (ideaId) => {
  const supabase = useSupabaseClient();
  const { data, ...rest } = useSWR(`count-vote-${ideaId}`, async () => {
    const { count, data, error } = await supabase
      .from("votes")
      .select("idea_id", { count: "exact" })
      .eq("idea_id", ideaId)
      .is("is_upvote", true);
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    if (data) {
      return count;
    }
  });
  return {
    count: data,
    ...rest,
  };
};
