import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: "1px solid #efe7db" }}>
        <Stack spacing={2.5}>
          <Typography variant="h4">with-chaos</Typography>
          <Typography color="text.secondary">
            This app is invite-link based. Open your personal link to view details and RSVP.
          </Typography>
          <Box>
            <Button component={Link} href="/admin" variant="contained">
              Admin
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
