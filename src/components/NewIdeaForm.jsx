import {
  Anchor,
  Button,
  Checkbox,
  FileButton,
  FileInput,
  Group,
  List,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  IconCheck,
  IconExternalLink,
  IconInfoCircle,
  IconQuestionCircle,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function NewIdeaForm() {
  const user = useUser();
  const [tag, setTag] = useState([]);
  const [campaign, setCampaign] = useState([]);
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("tags").select("*");
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) {
        setTag(data);
      }
    })();
    (async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .gte("closure_date", new Date(Date.now()).toISOString());
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      if (data) {
        if (data?.length > 0) setCampaign(data);
        else {
          modals.closeAll();
          notifications.show({
            title: "All the campaign are closed.",
            color: "blue",
            icon: <IconInfoCircle />,
          });
        }
      }
    })();
  }, [supabase]);
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      tag_id: "",
      campaign_id: "",
      is_anonymous: false,
      agree: false,
      files: [],
    },
    validate: {
      tag_id: (value) => (value ? null : "Select one tag"),
      campaign_id: (value) => (value ? null : "Select one campaign"),
      agree: (value) =>
        value == false ? "You must agree to the Terms and Condition" : null,
    },
  });
  useEffect(() => {
    if (form.values.files.length > 3) {
      form.setFieldValue("files", form.values.files.slice(-3));
    }
  }, [form.values.files]);
  const handleSubmit = form.onSubmit(async (values) => {
    // if (values.files.length > 0) {
    setLoading(true);
    const uploads = [];
    values.files.forEach((file, index) => {
      const upload = supabase.storage
        .from("idea-documents")
        .upload(`${user?.id}-${Date.now()}-${index}`, file);
      uploads.push(upload);
    });
    Promise.all(uploads).then(
      async (data) => {
        const { data: iData, error: iErr } = await supabase
          .from("ideas")
          .insert({
            title: values.title,
            description: values.description,
            author_id: user?.id,
            is_anonymous: values.is_anonymous,
            tag_id: values.tag_id,
            campaign_id: values.campaign_id,
          })
          .select("id")
          .single();
        if (iErr) {
          console.log(iErr);
          notifications.show({
            title: "An error occurs",
            message: "Could not upload your idea",
            color: "red",
            icon: <IconX />,
          });
        }
        if (iData) {
          if (values.files.length > 0) {
            const documentArrays = data.map((d) => ({
              idea_id: iData.id,
              url: d.data.path,
            }));
            const { data: rs, error: er } = await supabase
              .from("idea_documents")
              .insert(documentArrays);
            if (er) {
              console.log(er);
              notifications.show({
                title: "An error occurs",
                message: "Could not upload your idea",
                color: "red",
                icon: <IconX />,
              });
            } else {
              notifications.show({
                title: "Idea uploaded successfully",
                icon: <IconCheck />,
              });
              modals.closeAll();
            }
          } else {
            notifications.show({
              title: "Idea uploaded successfully",
              icon: <IconCheck />,
            });
            modals.closeAll();
          }
        }
      },
      (error) => {
        console.log(error);
        notifications.show({
          title: "An error occurs",
          message: "Could not upload your documents",
          color: "red",
          icon: <IconX />,
        });
      }
    );
    // }
  });
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={"sm"}>
        <TextInput
          label="Title"
          placeholder="Type idea title"
          required
          {...form.getInputProps("title")}
        />
        <Textarea
          label="Description"
          placeholder="Type idea description"
          required
          autosize
          minRows={4}
          maxRows={4}
          {...form.getInputProps("description")}
        />
        <Group grow>
          <Select
            label="Select tag"
            placeholder="Select tag"
            data={tag.map((t) => ({ label: t.name, value: t.id }))}
            required
            {...form.getInputProps("tag_id")}
          />
          <Select
            label="Select campaign"
            placeholder="Select campaign"
            data={campaign.map((c) => ({ label: c.name, value: c.id }))}
            required
            {...form.getInputProps("campaign_id")}
          />
        </Group>
        <Checkbox
          label="Hide my identity"
          {...form.getInputProps("is_anonymous")}
        />
        <Checkbox
          label={
            <Text>
              I agree to the{" "}
              <Anchor target="_blank" href="/terms">
                Terms and Conditions
              </Anchor>
            </Text>
          }
          {...form.getInputProps("agree")}
        />
        <FileButton
          onChange={(files) => form.setFieldValue("files", files)}
          accept="audio/*,video/*,image/*,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,text/plain, csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          multiple
        >
          {(props) => (
            <Button {...props} variant="subtle" fullWidth>
              Attach files (optional, maximum 3 files)
            </Button>
          )}
        </FileButton>
        {form.values.files.length > 0 && <Text size="sm">Picked files:</Text>}

        <List size="sm" mt={5} withPadding>
          {form.values.files.map((file, index) => (
            <List.Item key={index}>{file.name}</List.Item>
          ))}
        </List>
        <Group mt="sm" position="right">
          <Button variant="light" onClick={() => modals.closeAll()}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
