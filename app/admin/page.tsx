import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { siteUrl } from "@/lib/config";
import { getAllGuests } from "@/lib/guests";
import { Container, Stack, Typography } from "@mui/material";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={2}>
          <Typography variant="h4">with-chaos admin</Typography>
          <AdminLoginForm />
        </Stack>
      </Container>
    );
  }

  const guests = await getAllGuests();
  return <AdminDashboard initialGuests={guests} siteUrl={siteUrl} />;
}
