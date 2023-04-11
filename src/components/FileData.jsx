import { Anchor, Button, UnstyledButton } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconPaperclip } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

export default function FileData({ url, index, fileName }) {
  const supabase = useSupabaseClient();
  const [data, setData] = useState();
  useEffect(() => {
    (async () => {
      const { data } = supabase.storage
        .from("idea-documents")
        .getPublicUrl(url, { download: fileName });
      if (data) setData(data.publicUrl);
    })();
  }, [index, supabase.storage, url, fileName]);
  return (
    <Anchor component="a" href={data} target="_blank">
      <IconPaperclip size={14} /> {fileName}
    </Anchor>
  );
}
