import styles from "@/styles/styles.module.css";
import { Alert, Anchor, Button, Image, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { IconAlertCircle, IconInfoCircle } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function Index() {
  const router = useRouter();
  const myElement = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [err, setErr] = useState([]);
  const [runZoom, setRunZoom] = useState(false);
  const supabase = useSupabaseClient();
  const form = useForm({
    initialValues: {
      uname: "",
      password: "",
    },
    validate: {
      uname: (value) =>
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
          ? null
          : "The email provided appears to be invalid based on formatting criteria.",
      password: (value) =>
        value.length > 0 ? null : "Please don't forget to enter your password.",
    },
  });
  const handleSubmit = form.onSubmit(async (val) => {
    const credential = { username: val.uname, password: val.password };
    setErr([]);
    setProcessing(true);
    if (true) {
      // setErr((value) => [
      //   ...value,
      //   "I'm sorry, I'm unable to log you in at this time. Please check your credentials and try again later. If the issue persists, please contact us for further assistance.",
      // ]);
      // setProcessing(false);
      const { data: signedData, error } =
        await supabase.auth.signInWithPassword({
          email: credential.username,
          password: credential.password,
        });
      if (error) {
        console.log(error);
        setErr((cval) => [...cval, "Password or email is incorrect."]);
        setProcessing(false);
      } else {
        setRunZoom(true);
        setTimeout(() => {
          router.push("/");
        }, 1700);
      }
    }
  });
  return (
    <>
      <div className=" relative flex items-center flex-col justify-center justify-items-center min-h-screen gap-10 overflow-hidden w-[100vw] h-[100vh]">
        <Text
          data-mantine={true}
          className={`text-3xl font-bold mb-12 ${runZoom && "hidden"}`}
        >
          Great to see you!
        </Text>
        <div className={`${runZoom && styles.zoom_logo}`}>
          <Image
            maw={150}
            className={`mb-10 ${runZoom && "hidden"}`}
            radius="50%"
            mx="auto"
            alt="LOGO"
            src={"/NEXT.png"}
          ></Image>
        </div>
        <div className={`${runZoom && "hidden"}`}>
          <form
            onSubmit={handleSubmit}
            className="min-w-[400px] max-w-[400px] flex flex-col"
          >
            <div className={[styles.group]}>
              <TextInput
                test_id="uname"
                className={[styles.text_input]}
                variant={"unstyled"}
                placeholder="Username"
                {...form.getInputProps("uname")}
              ></TextInput>
            </div>
            <div className={styles.group}>
              <TextInput
                test_id="password"
                type={"password"}
                variant={"unstyled"}
                className={styles.text_input}
                placeholder="Password"
                {...form.getInputProps("password")}
              ></TextInput>
            </div>
            {err && err.length > 0 && (
              <div className="p-4 w-full items-center">
                <Alert
                  icon={<IconAlertCircle size="1rem" />}
                  title="Unable to Login!"
                  color="red"
                  radius="md"
                >
                  {err.map((e, index) => (
                    <Text key={index} size={"sm"} test_id="error">
                      {e}
                    </Text>
                  ))}
                </Alert>
              </div>
            )}
            <div className="p-4 w-full items-center">
              <Button
                test_id="login"
                type="submit"
                className="w-full self-center"
                loading={processing}
              >
                Login
              </Button>
              <Text size={"sm "} test_id="reset_pass">
                Forgot password,{" "}
                <Anchor
                  onClick={() =>
                    notifications.show({
                      color: "blue",
                      icon: <IconInfoCircle size={"sx"} />,
                      autoClose: 5000,
                      title: "Action required!",
                      message:
                        "For security, Please contact your administrator to reset your password.",
                    })
                  }
                >
                  reset
                </Anchor>
                ?
              </Text>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
