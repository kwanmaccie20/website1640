import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useSWR from "swr";
/**
 *
 * @param {Number} pageIndex
 * @param {any} previousPageData
 * @param {("Latest ideas"|"Most view ideas"|"Most popular ideas")} filter
 * @param {string} searchString
 */
export const useIdeaFilter = (pageIndex, filter, campaign, searchString) => {
  const supabase = useSupabaseClient();
  const { data: ideas, ...rest } = useSWR(
    `ideas-page-${pageIndex}`,
    async () => {
      let query = supabase
        .from("ideas")
        .select(
          "*, staff!ideas_author_id_fkey(id, first_name, last_name, email), campaigns!inner(*, academic_year(*)), tags(*), idea_documents(*))",
          { count: "exact" }
        )
        .gte(
          "campaigns.final_closure_date",
          new Date(Date.now()).toISOString()
        );
      if (campaign !== 0) {
        query = query.eq("campaign_id", campaign);
      }
      if (searchString) {
        query = query.textSearch("title", searchString, { type: "plain" });
      }
      if (filter == "Latest ideas") {
        query = query.order("created_at", { ascending: false });
      }
      if (filter == "Most popular ideas") {
        query = query
          .order("ranking_score", { ascending: false })
          .order("created_at", { ascending: false });
      }
      if (filter == "Most view ideas") {
        query = query
          .order("views", { ascending: false })
          .order("created_at", { ascending: false });
      }

      const { data, error, count } = await query.range(
        pageIndex * 5,
        pageIndex * 5 + 4
      );
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) {
        return {
          data: data,
          count: count,
        };
      }
    }
  );
  return {
    ideas: ideas?.data || [],
    count: ideas?.count || 0,
    ...rest,
  };
};

export const useArchivedIdeaFilter = (
  pageIndex,
  filter,
  campaign,
  searchString
) => {
  const supabase = useSupabaseClient();
  const { data: ideas, ...rest } = useSWR(
    `archived-ideas-page-${pageIndex}`,
    async () => {
      let query = supabase
        .from("ideas")
        .select(
          "*, staff!ideas_author_id_fkey(id, first_name, last_name, email), campaigns!inner(*, academic_year(*)), tags(*), idea_documents(*))",
          { count: "exact" }
        )
        .lt("campaigns.final_closure_date", new Date(Date.now()).toISOString());
      if (campaign !== 0) {
        query = query.eq("campaign_id", campaign);
      }
      if (searchString) {
        query = query.textSearch("title", searchString, { type: "plain" });
      }
      if (filter == "Most popular ideas") {
        query = query
          .order("ranking_score", { ascending: false })
          .order("created_at", { ascending: false });
      }
      if (filter == "Most view ideas") {
        query = query
          .order("views", { ascending: false })
          .order("created_at", { ascending: false });
      }

      const { data, error, count } = await query.range(
        pageIndex * 5,
        pageIndex * 5 + 4
      );
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) {
        return {
          data: data,
          count: count,
        };
      }
    }
  );
  return {
    ideas: ideas?.data || [],
    count: ideas?.count || 0,
    ...rest,
  };
};

export const useDepartmentIdeaFilter = (
  pageIndex,
  filter,
  campaign,
  searchString,
  departmentId
) => {
  const supabase = useSupabaseClient();
  const { data: ideas, ...rest } = useSWR(
    departmentId ? `ideas-${departmentId}-page-${pageIndex}` : null,
    async () => {
      let query = supabase
        .from("ideas")
        .select(
          "*, staff!ideas_author_id_fkey!inner(id, first_name, last_name, email), campaigns!inner(*, academic_year(*)), tags(*), idea_documents(*))",
          { count: "exact" }
        )
        .gte("campaigns.final_closure_date", new Date(Date.now()).toISOString())
        .eq("staff.department_id", departmentId);
      if (campaign !== 0) {
        query = query.eq("campaign_id", campaign);
      }
      if (searchString) {
        query = query.textSearch("title", searchString, { type: "plain" });
      }
      if (filter == "Latest ideas") {
        query = query.order("created_at", { ascending: false });
      }
      if (filter == "Most popular ideas") {
        query = query
          .order("ranking_score", { ascending: false })
          .order("created_at", { ascending: false });
      }
      if (filter == "Most view ideas") {
        query = query
          .order("views", { ascending: false })
          .order("created_at", { ascending: false });
      }

      const { data, error, count } = await query.range(
        pageIndex * 5,
        pageIndex * 5 + 4
      );
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) {
        return {
          data: data,
          count: count,
        };
      }
    }
  );
  return {
    ideas: ideas?.data || [],
    count: ideas?.count || 0,
    ...rest,
  };
};
