import { AppShell, Container, Select, Text } from "@mantine/core";
import { useState } from "react";
import { HeaderMegaMenu } from "./Header";

export default function Layout({ children }) {
  const [role, setRole] = useState("staff");
  return (
    <AppShell header={<HeaderMegaMenu role={role} />}>
      <Container size="lg">
        <Select
          data={[
            { value: "admin", label: "Admin" },
            { value: "manager", label: "Manager" },
            { value: "staff", label: "Staff" },
          ]}
          value={role}
          onChange={setRole}
        />
        <Text>Current role: {role}</Text>
        {children}
      </Container>
    </AppShell>
  );
}
