import { useCurrentUserRole } from "@/hooks/currentUser";
import { AppShell, Box, Card, Container, Select, Text } from "@mantine/core";
import { useState } from "react";
import { HeaderMegaMenu } from "./Header";

export default function Layout({ children }) {
  const { role, setRole } = useCurrentUserRole();
  return (
    <AppShell header={<HeaderMegaMenu />}>
      <Container size="lg">{children}</Container>
      <Box className="fixed bottom-10 right-10">
        <Select
          data={[
            { value: "qaManager", label: "QA Manager" },
            { value: "staff", label: "Staff" },
          ]}
          value={role}
          onChange={setRole}
          dropdownPosition="top"
        />
      </Box>
    </AppShell>
  );
}
