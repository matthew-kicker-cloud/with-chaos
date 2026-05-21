"use client";

import styles from "@/components/invite/InviteExperience.module.css";
import { Guest } from "@/lib/types";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useMemo, useState } from "react";

type InviteClientProps = {
  guest: Guest;
  mode: "save_the_date" | "rsvp_open";
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventDetailsText: string;
  googleCalendarUrl: string;
  icsUrl: string;
};

const fauxCaptions = [
  "3am chips. terrible idea, perfect memory.",
  "that pub quiz where confidence carried us.",
  "dance floor chaos and no regrets.",
  "long drive playlist, one song on loop.",
  "sunday kitchen scenes, mild panic, big laughs.",
  "proof we can look civilised for at least 4 minutes.",
];

const inviteFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "rgba(255,255,255,0.55)",
    fontFamily: "var(--font-body)",
    "& fieldset": { borderColor: "rgba(11,10,8,0.33)" },
    "&:hover fieldset": { borderColor: "rgba(11,10,8,0.75)" },
    "&.Mui-focused fieldset": { borderColor: "#0b0a08", borderWidth: "2px" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  "& .MuiFormHelperText-root": {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
  },
};

function StarSticker({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M20 2 L22.5 14.5 L34 12 L23.5 20 L34 28 L22.5 25.5 L20 38 L17.5 25.5 L6 28 L16.5 20 L6 12 L17.5 14.5 Z"
        fill="var(--accent)"
      />
    </svg>
  );
}

export function InviteClient({
  guest,
  mode,
  eventTitle,
  eventDate,
  eventLocation,
  eventDetailsText,
  googleCalendarUrl,
  icsUrl,
}: InviteClientProps) {
  const [contact, setContact] = useState({
    email: guest.email ?? "",
    phone: guest.phone ?? "",
    mailingAddress: guest.mailing_address ?? "",
  });
  const [contactSaving, setContactSaving] = useState(false);
  const [contactMessage, setContactMessage] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  const initialAttending =
    guest.rsvp_status === "attending"
      ? "yes"
      : guest.rsvp_status === "not_attending"
        ? "no"
        : "yes";
  const [attending, setAttending] = useState<"yes" | "no">(initialAttending);
  const [attendingCount, setAttendingCount] = useState(
    Math.min(Math.max(guest.attending_count || 1, 1), guest.max_party_size),
  );
  const [dietaryNotes, setDietaryNotes] = useState(guest.dietary_notes ?? "");
  const [songRequest, setSongRequest] = useState(guest.song_request ?? "");
  const [message, setMessage] = useState(guest.message ?? "");
  const [rsvpSaving, setRsvpSaving] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState<string | null>(null);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [failedPhotoUrls, setFailedPhotoUrls] = useState<string[]>([]);

  const countChoices = useMemo(() => {
    return Array.from({ length: guest.max_party_size }, (_, idx) => idx + 1);
  }, [guest.max_party_size]);

  const photoUrls = useMemo(
    () =>
      (guest.photo_filenames ?? []).map(
        (filename) => `/assets/photos/${encodeURIComponent(filename)}`,
      ),
    [guest.photo_filenames],
  );
  const visiblePhotoUrls = useMemo(
    () => photoUrls.filter((url) => !failedPhotoUrls.includes(url)),
    [failedPhotoUrls, photoUrls],
  );

  const rotatePhotos = () => {
    if (visiblePhotoUrls.length <= 1) return;
    setActivePhotoIndex((prev) => (prev + 1) % visiblePhotoUrls.length);
  };

  const handleContactSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setContactSaving(true);
    setContactError(null);
    setContactMessage(null);

    try {
      const res = await fetch("/api/contact-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: guest.slug,
          email: contact.email.trim(),
          phone: contact.phone.trim(),
          mailingAddress: contact.mailingAddress.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Could not save contact details.");
      }
      setContactMessage("Contact details saved.");
    } catch (error) {
      setContactError(
        error instanceof Error
          ? error.message
          : "Could not save contact details.",
      );
    } finally {
      setContactSaving(false);
    }
  };

  const handleRsvpSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setRsvpSaving(true);
    setRsvpError(null);
    setRsvpMessage(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: guest.slug,
          attending,
          attendingCount: attending === "yes" ? attendingCount : 0,
          dietaryNotes: dietaryNotes.trim(),
          songRequest: songRequest.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Could not save RSVP.");
      }
      setRsvpMessage("RSVP saved. You can return any time and update it.");
    } catch (error) {
      setRsvpError(
        error instanceof Error ? error.message : "Could not save RSVP.",
      );
    } finally {
      setRsvpSaving(false);
    }
  };

  return (
    <Box className={styles.inviteRoot}>
      <Box className={styles.sheet}>
        <Box className={styles.inner}>
          <Box className={styles.desktopGrid}>
            <Box>
              <Box className={styles.hero}>
                <Typography
                  className={styles.eyebrow}
                  sx={{ mt: 3, mb: 3, fontSize: 36 }}
                >
                  Oh shit, it's another wedding.
                </Typography>
                <Typography className={styles.greetingName}>
                  {guest.display_name}.
                </Typography>
                <Box
                  sx={{
                    mt: 1.5,
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <Box className={styles.chaosWordWrap}>
                    <Box className={styles.chaosWord} sx={{ width: "100px" }} />

                    <Box className={styles.cross} />
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -28,
                      transform: "rotate(14deg)",
                    }}
                  >
                    <StarSticker />
                  </Box>
                </Box>
                <Typography className={styles.intro}>
                  {guest.greeting ||
                    "Come ready for a joyful amount of chaos."}{" "}
                </Typography>
                <Typography>It's</Typography>
                <Typography
                  sx={{
                    fontFamily: "var(--font-cond)",
                    fontWeight: 900,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    mt: 0.5,
                    fontSize: "20px",
                  }}
                >
                  {eventTitle}
                </Typography>
                <Typography className={styles.intro} sx={{ mt: 2 }}>
                  {mode === "save_the_date"
                    ? "This is your save-the-date. Full details are coming soon."
                    : "RSVP is open. Please let us know your plans below."}
                </Typography>
              </Box>

              <Box className={styles.dateBlock}>
                <Typography className={styles.eyebrow}>The details</Typography>
                <Box className={styles.dateLine}>
                  <span>{eventDate.split(" ")[1] ?? eventDate}</span>
                  <span className={styles.dateDot}>·</span>
                  <span style={{ fontStyle: "italic" }}>
                    {eventDate.split(" ")[2] ?? "Date"}
                  </span>
                  <span className={styles.dateDot}>·</span>
                  <span>{eventDate.split(" ").at(-1)}</span>
                </Box>
                <Box className={styles.metaRow}>
                  <span>
                    {mode === "save_the_date"
                      ? "Save the date"
                      : "RSVP open now"}
                  </span>
                  <span>{eventLocation}</span>
                </Box>
                <Typography
                  sx={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    lineHeight: 1.55,
                    mt: 1.4,
                  }}
                >
                  {eventDetailsText}
                </Typography>
              </Box>

              <Box className={styles.actions}>
                <Button
                  className={styles.btnPrimary}
                  disableElevation
                  component="a"
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  sx={{ px: 3.2 }}
                >
                  Add calendar
                </Button>
                <Button
                  className={styles.btnGhost}
                  component="a"
                  href={icsUrl}
                  disableElevation
                  sx={{ px: 3 }}
                >
                  Download .ics
                </Button>
              </Box>
            </Box>

            <Box className={styles.photoWall}>
              <Typography className={styles.eyebrow}>A few things</Typography>
              <Typography className={styles.photoTitle} sx={{ mb: 5 }}>
                us,{" "}
                <span
                  className={styles.scribble}
                  style={{ fontStyle: "italic" }}
                >
                  at somepoint.
                </span>
                .
              </Typography>
              {visiblePhotoUrls.length > 0 ? (
                <>
                  <Box className={styles.stackStage} onClick={rotatePhotos}>
                    {visiblePhotoUrls.map((url, idx) => {
                      const offset =
                        (idx - activePhotoIndex + visiblePhotoUrls.length) %
                        visiblePhotoUrls.length;
                      if (offset >= 4) return null;
                      const rotations = [-7, 5, -3, 6];
                      const rot = rotations[offset] + offset * 0.55;
                      const ty = offset * 5;
                      const tx = (offset % 2 === 0 ? 1 : -1) * offset * 2;
                      const scale = 1 - offset * 0.04;

                      return (
                        <Box
                          key={url}
                          className={styles.polaroid}
                          sx={{
                            transform: `translateX(calc(-50% + ${tx}px)) translateY(${ty}px) rotate(${rot}deg) scale(${scale})`,
                            zIndex: 10 - offset,
                            opacity: offset === 0 ? 1 : 0.92,
                          }}
                        >
                          <Box className={styles.tape} />
                          <Box
                            component="img"
                            src={url}
                            alt={`Memory ${idx + 1} for ${guest.display_name}`}
                            className={styles.photo}
                            onError={() =>
                              setFailedPhotoUrls((prev) =>
                                prev.includes(url) ? prev : [...prev, url],
                              )
                            }
                          />
                          <Box
                            className={styles.photoTag}
                          >{`NO. ${String(idx + 1).padStart(2, "0")}`}</Box>
                          <Typography className={styles.cap}>
                            {fauxCaptions[idx % fauxCaptions.length]}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                  <Typography className={styles.tapHint}>
                    For old people: click the photo to see more.
                  </Typography>
                </>
              ) : (
                <Typography
                  sx={{
                    fontFamily: "var(--font-hand)",
                    fontSize: "26px",
                    mt: 2,
                  }}
                >
                  add photos in admin to bring this wall to life.
                </Typography>
              )}
            </Box>
          </Box>

          <Box className={styles.formCard}>
            {mode === "save_the_date" ? (
              <Box component="form" onSubmit={handleContactSubmit}>
                <Typography className={styles.formTitle}>
                  Save the date
                </Typography>
                <Typography className={styles.formIntro}>
                  Optional details help us send updates and anything that needs
                  posting.
                </Typography>
                <Stack spacing={1.4} gap={1} mt={2}>
                  <TextField
                    label="Email"
                    type="email"
                    sx={inviteFieldSx}
                    value={contact.email}
                    onChange={(e) =>
                      setContact((v) => ({ ...v, email: e.target.value }))
                    }
                  />
                  <TextField
                    label="Phone"
                    sx={inviteFieldSx}
                    value={contact.phone}
                    onChange={(e) =>
                      setContact((v) => ({ ...v, phone: e.target.value }))
                    }
                  />
                  <TextField
                    label="Mailing address"
                    multiline
                    minRows={2}
                    sx={inviteFieldSx}
                    value={contact.mailingAddress}
                    onChange={(e) =>
                      setContact((v) => ({
                        ...v,
                        mailingAddress: e.target.value,
                      }))
                    }
                  />
                  {contactMessage ? (
                    <Alert severity="success">{contactMessage}</Alert>
                  ) : null}
                  {contactError ? (
                    <Alert severity="error">{contactError}</Alert>
                  ) : null}
                  <Box>
                    <Button
                      className={styles.btnPrimary}
                      type="submit"
                      disableElevation
                      sx={{ px: 3.4 }}
                      disabled={contactSaving}
                    >
                      {contactSaving ? "Saving..." : "Save details"}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleRsvpSubmit}>
                <Typography className={styles.formTitle}>RSVP</Typography>
                <Typography className={styles.formIntro}>
                  Let us know if you&apos;re coming. You can update this any
                  time with the same link.
                </Typography>
                <Stack spacing={1.4}>
                  <TextField
                    select
                    label="Are you attending?"
                    sx={inviteFieldSx}
                    value={attending}
                    onChange={(e) =>
                      setAttending(e.target.value as "yes" | "no")
                    }
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </TextField>
                  <TextField
                    select
                    label="Number attending"
                    sx={inviteFieldSx}
                    value={attending === "yes" ? attendingCount : 0}
                    disabled={attending === "no"}
                    helperText={`Your party size limit is ${guest.max_party_size}.`}
                    onChange={(e) => setAttendingCount(Number(e.target.value))}
                  >
                    {countChoices.map((count) => (
                      <MenuItem key={count} value={count}>
                        {count}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Dietary requirements"
                    multiline
                    minRows={2}
                    sx={inviteFieldSx}
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                  />
                  <TextField
                    label="Song request"
                    sx={inviteFieldSx}
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                  />
                  <TextField
                    label="Message to hosts"
                    multiline
                    minRows={3}
                    sx={inviteFieldSx}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  {rsvpMessage ? (
                    <Alert severity="success">{rsvpMessage}</Alert>
                  ) : null}
                  {rsvpError ? (
                    <Alert severity="error">{rsvpError}</Alert>
                  ) : null}
                  <Box>
                    <Button
                      className={styles.btnPrimary}
                      type="submit"
                      disableElevation
                      sx={{ px: 3.4 }}
                      disabled={rsvpSaving}
                    >
                      {rsvpSaving ? "Saving..." : "Send RSVP"}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            )}
          </Box>

          <Box className={styles.footer}>
            <Box className={styles.meta}>
              <div>WITH-CHAOS · 002</div>
              <div>{guest.slug.toUpperCase()}</div>
              <div>LONDON · MMXXVI</div>
            </Box>
            <Typography className={styles.note}>
              don&apos;t be the friend who flakes. xx
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
