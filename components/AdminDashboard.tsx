"use client";

import { parsePhotoFilenamesFromText } from "@/lib/photos";
import { Guest } from "@/lib/types";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { FormEvent, useMemo, useState } from "react";

type AdminDashboardProps = {
  initialGuests: Guest[];
  siteUrl: string;
};

type GuestFormValues = {
  slug: string;
  display_name: string;
  greeting: string;
  max_party_size: number;
  photo_filenames_text: string;
  invite_sent: boolean;
};

const emptyGuestForm: GuestFormValues = {
  slug: "",
  display_name: "",
  greeting: "",
  max_party_size: 1,
  photo_filenames_text: "",
  invite_sent: false
};

function stringifyPhotoList(photoFilenames: string[]): string {
  return photoFilenames.join(", ");
}

export function AdminDashboard({ initialGuests, siteUrl }: AdminDashboardProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [createForm, setCreateForm] = useState<GuestFormValues>(emptyGuestForm);
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<GuestFormValues>(emptyGuestForm);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    return guests.reduce(
      (acc, guest) => {
        acc.invitedSeats += guest.max_party_size;
        acc.attendingCount += guest.attending_count;
        if (guest.rsvp_status === "attending") acc.yes += 1;
        if (guest.rsvp_status === "not_attending") acc.no += 1;
        if (guest.rsvp_status === "pending") acc.pending += 1;
        return acc;
      },
      { invitedSeats: 0, attendingCount: 0, yes: 0, no: 0, pending: 0 }
    );
  }, [guests]);

  const clearNotices = () => {
    setFeedback(null);
    setError(null);
  };

  const inviteLinkFor = (slug: string) => `${siteUrl}/${slug}`;

  const copyLink = async (slug: string) => {
    clearNotices();
    try {
      await navigator.clipboard.writeText(inviteLinkFor(slug));
      setFeedback("Invite link copied.");
    } catch {
      setError("Could not copy link.");
    }
  };

  const onCreateGuest = async (event: FormEvent) => {
    event.preventDefault();
    clearNotices();
    try {
      const res = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          photo_filenames: parsePhotoFilenamesFromText(createForm.photo_filenames_text)
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to create guest.");
      }
      setGuests((prev) => [...prev, data.guest as Guest]);
      setCreateForm(emptyGuestForm);
      setFeedback("Guest added.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create guest.");
    }
  };

  const startEdit = (guest: Guest) => {
    setEditingGuestId(guest.id);
    setEditForm({
      slug: guest.slug,
      display_name: guest.display_name,
      greeting: guest.greeting ?? "",
      max_party_size: guest.max_party_size,
      photo_filenames_text: stringifyPhotoList(guest.photo_filenames),
      invite_sent: guest.invite_sent
    });
  };

  const onSaveEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingGuestId) return;
    clearNotices();
    try {
      const res = await fetch(`/api/admin/guests/${editingGuestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          photo_filenames: parsePhotoFilenamesFromText(editForm.photo_filenames_text)
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to update guest.");
      }
      setGuests((prev) => prev.map((g) => (g.id === editingGuestId ? (data.guest as Guest) : g)));
      setEditingGuestId(null);
      setFeedback("Guest updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update guest.");
    }
  };

  const onDeleteGuest = async (guestId: string) => {
    clearNotices();
    const confirmed = window.confirm("Delete this guest? This cannot be undone.");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/admin/guests/${guestId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to delete guest.");
      }
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
      setFeedback("Guest deleted.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete guest.");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Paper elevation={0} sx={{ p: 3, border: "1px solid #efe7db" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
            <Stack spacing={1}>
              <Typography variant="h4">Admin</Typography>
              <Typography color="text.secondary">
                Yes: {totals.yes} | No: {totals.no} | Pending: {totals.pending} | Attending people:{" "}
                {totals.attendingCount} / {totals.invitedSeats}
              </Typography>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button component="a" href="/api/admin/guests.csv" variant="outlined">
                Export CSV
              </Button>
              <Button variant="outlined" color="inherit" onClick={logout}>
                Log out
              </Button>
            </Stack>
          </Stack>
          {feedback ? <Alert sx={{ mt: 2 }} severity="success">{feedback}</Alert> : null}
          {error ? <Alert sx={{ mt: 2 }} severity="error">{error}</Alert> : null}
        </Paper>

        <Paper elevation={0} sx={{ p: 3, border: "1px solid #efe7db" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add guest
          </Typography>
          <Box component="form" onSubmit={onCreateGuest}>
            <Stack spacing={1.5}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                <TextField
                  label="Slug"
                  value={createForm.slug}
                  onChange={(e) => setCreateForm((v) => ({ ...v, slug: e.target.value }))}
                  required
                />
                <TextField
                  label="Display name"
                  value={createForm.display_name}
                  onChange={(e) => setCreateForm((v) => ({ ...v, display_name: e.target.value }))}
                  required
                />
                <TextField
                  label="Greeting"
                  value={createForm.greeting}
                  onChange={(e) => setCreateForm((v) => ({ ...v, greeting: e.target.value }))}
                />
                <TextField
                  label="Max party size"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={createForm.max_party_size}
                  onChange={(e) => setCreateForm((v) => ({ ...v, max_party_size: Number(e.target.value) }))}
                  required
                />
              </Stack>
              <TextField
                label="Photo filenames (comma or newline separated)"
                multiline
                minRows={2}
                value={createForm.photo_filenames_text}
                onChange={(e) => setCreateForm((v) => ({ ...v, photo_filenames_text: e.target.value }))}
                placeholder="mum-dad-1.jpg, mum-dad-2.jpg"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={createForm.invite_sent}
                    onChange={(e) => setCreateForm((v) => ({ ...v, invite_sent: e.target.checked }))}
                  />
                }
                label="Invite sent"
              />
              <Box>
                <Button type="submit" variant="contained">
                  Add
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>

        {editingGuestId ? (
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #efe7db" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Edit guest
            </Typography>
            <Box component="form" onSubmit={onSaveEdit}>
              <Stack spacing={1.5}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                  <TextField
                    label="Slug"
                    value={editForm.slug}
                    onChange={(e) => setEditForm((v) => ({ ...v, slug: e.target.value }))}
                    required
                  />
                  <TextField
                    label="Display name"
                    value={editForm.display_name}
                    onChange={(e) => setEditForm((v) => ({ ...v, display_name: e.target.value }))}
                    required
                  />
                  <TextField
                    label="Greeting"
                    value={editForm.greeting}
                    onChange={(e) => setEditForm((v) => ({ ...v, greeting: e.target.value }))}
                  />
                  <TextField
                    label="Max party size"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={editForm.max_party_size}
                    onChange={(e) => setEditForm((v) => ({ ...v, max_party_size: Number(e.target.value) }))}
                    required
                  />
                </Stack>
                <TextField
                  label="Photo filenames (comma or newline separated)"
                  multiline
                  minRows={2}
                  value={editForm.photo_filenames_text}
                  onChange={(e) => setEditForm((v) => ({ ...v, photo_filenames_text: e.target.value }))}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editForm.invite_sent}
                      onChange={(e) => setEditForm((v) => ({ ...v, invite_sent: e.target.checked }))}
                    />
                  }
                  label="Invite sent"
                />
                <Stack direction="row" spacing={1}>
                  <Button type="submit" variant="contained">
                    Save
                  </Button>
                  <Button variant="outlined" color="inherit" onClick={() => setEditingGuestId(null)}>
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Paper>
        ) : null}

        <Paper elevation={0} sx={{ p: 0, border: "1px solid #efe7db", overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Guest</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Photos</TableCell>
                <TableCell>Invite sent</TableCell>
                <TableCell>RSVP</TableCell>
                <TableCell>Attending</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <Typography fontWeight={700}>{guest.display_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Max party: {guest.max_party_size}
                    </Typography>
                  </TableCell>
                  <TableCell>{guest.slug}</TableCell>
                  <TableCell>{guest.photo_filenames.length}</TableCell>
                  <TableCell>{guest.invite_sent ? "Yes" : "No"}</TableCell>
                  <TableCell>{guest.rsvp_status}</TableCell>
                  <TableCell>{guest.attending_count}</TableCell>
                  <TableCell>
                    <Stack spacing={0.3}>
                      <Typography variant="body2">{guest.email || "-"}</Typography>
                      <Typography variant="body2">{guest.phone || "-"}</Typography>
                      <Typography variant="body2">{guest.mailing_address || "-"}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
                      <Button size="small" onClick={() => copyLink(guest.slug)}>
                        Copy link
                      </Button>
                      <Button size="small" onClick={() => startEdit(guest)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => onDeleteGuest(guest.id)}>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Stack>
    </Container>
  );
}
