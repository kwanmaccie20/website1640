import Logo from "@/components/layout/Logo";
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  rem,
  Center,
  Stack,
} from "@mantine/core";
import Link from "next/link";
import bg from "../../../public/signin-illustration.jpg";

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: "100vh",
    backgroundSize: "cover",
    backgroundImage: `url(${bg.src})`,
    // backgroundImage: "linear-gradient(15deg, #13547a 0%, #80d0c7 100%)",
    position: "relative",
  },

  form: {
    position: "absolute",
    width: rem(450),
    height: "75vh",
    top: "50%",
    transform: "translateY(-50%)",
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    borderRadius: "10px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 50px",
    paddingTop: rem(80),
    marginLeft: rem(100),

    [theme.fn.smallerThan("sm")]: {
      width: "100vw",
      marginLeft: 0,
      height: "100vh",
      borderRadius: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
}));

export default function AuthenticationImage() {
  const { classes } = useStyles();
  return (
    // Photo by <a href="https://unsplash.com/@rgaleriacom?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ricardo Gomez Angel</a> on <a href="https://unsplash.com/s/photos/university-stair?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
    <div
      className={classes.wrapper}
      title="https://unsplash.com/photos/ne1RzOHLtas?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink"
    >
      <Paper className={classes.form} radius={0} p={30} component="form">
        <Stack align="center" mb="xl">
          <Title order={2} className={classes.title} ta="center" mt="md">
            Welcome back to
          </Title>
          <Logo />
        </Stack>
        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
          type="email"
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
        />
        <Button fullWidth mt="xl" size="md" type="submit">
          Sign In
        </Button>
      </Paper>
    </div>
  );
}
