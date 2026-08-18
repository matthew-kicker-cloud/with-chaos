"use client";

import styles from "@/components/invite/InviteExperience.module.css";
import { Guest } from "@/lib/types";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Modal,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type InviteClientProps = {
  guest: Guest;
  mode: "save_the_date" | "rsvp_open";
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventMapsUrl: string;
  eventDetailsText: string;
  eventDressCode: string;
  eventStartTime: string;
  eventEndTime: string;
  eventRsvpDeadline: string;
  googleCalendarUrl: string;
  icsUrl: string;
};

function getPhotoCaptionFromUrl(url: string) {
  const filename = decodeURIComponent(url.split("/").pop() ?? url);
  return filename.replace(/\.[^/.]+$/, "");
}

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

function GoogleBadge({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" fill="white" />
      <path
        d="M12 4.2c2.2 0 4 .8 5.4 2.2l-2.2 2.2C14.4 7.8 13.3 7.4 12 7.4c-2.3 0-4.3 1.6-5 3.8l-2.7-2.1C5.6 6.2 8.6 4.2 12 4.2z"
        fill="#EA4335"
      />
      <path
        d="M19.8 12.2c0-.6-.1-1.1-.2-1.7H12v3.2h4.4c-.2 1-.8 1.9-1.6 2.5l2.6 2c1.5-1.4 2.4-3.5 2.4-6z"
        fill="#4285F4"
      />
      <path
        d="M7 11.2c.2-.7.6-1.4 1.1-2L5.4 7.1C4.5 8.5 4 10.2 4 12c0 1.7.4 3.3 1.3 4.7l2.7-2.1c-.6-.6-.9-1.4-1-2.4z"
        fill="#FBBC05"
      />
      <path
        d="M12 19.8c3.2 0 5.9-1 7.8-2.8l-2.6-2c-.7.5-1.9 1.5-5.2 1.5-2.3 0-4.3-1.6-5-3.8l-2.7 2.1c1.3 3 4.3 5 7.7 5z"
        fill="#34A853"
      />
    </svg>
  );
}

function CalendarFileBadge({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <rect x="4" y="3.5" width="16" height="17" rx="2.6" fill="white" />
      <rect x="4" y="3.5" width="16" height="5.2" rx="2.2" fill="#0B0A08" />
      <rect x="7.2" y="12.2" width="4.2" height="4.2" rx="1" fill="#E2421F" />
      <rect
        x="12.7"
        y="12.2"
        width="4.2"
        height="1.8"
        rx="0.9"
        fill="#0B0A08"
      />
      <rect
        x="12.7"
        y="14.8"
        width="4.2"
        height="1.8"
        rx="0.9"
        fill="#0B0A08"
      />
      <rect
        x="4.7"
        y="4.2"
        width="14.6"
        height="15.6"
        rx="2"
        stroke="#0B0A08"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function SadFaceStreak({ onDone }: { onDone: () => void }) {
  return (
    <Box
      className={styles.sadFaceStreak}
      aria-hidden
      onAnimationEnd={onDone}
    >
      :(
    </Box>
  );
}

export function InviteClient({
  guest,
  mode,
  eventTitle,
  eventDate,
  eventLocation,
  eventMapsUrl,
  eventDetailsText,
  eventDressCode,
  eventStartTime,
  eventEndTime,
  eventRsvpDeadline,
  googleCalendarUrl,
  icsUrl,
}: InviteClientProps) {
  const [contact, setContact] = useState({
    email: guest.email ?? "",
  });
  const [contactSaving, setContactSaving] = useState(false);
  const [declineSaving, setDeclineSaving] = useState(false);
  const [contactMessage, setContactMessage] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  const initialAttending =
    guest.rsvp_status === "attending"
      ? "yes"
      : guest.rsvp_status === "not_attending"
        ? "no"
        : "yes";
  const [attending, setAttending] = useState<"yes" | "no">(initialAttending);
  const prevAttendingRef = useRef(attending);
  const [sadFaceKey, setSadFaceKey] = useState<number | null>(null);

  useEffect(() => {
    if (attending === "no" && prevAttendingRef.current !== "no") {
      setSadFaceKey((key) => (key ?? 0) + 1);
    }
    prevAttendingRef.current = attending;
  }, [attending]);

  const [attendingCount, setAttendingCount] = useState(
    Math.min(Math.max(guest.attending_count || 1, 1), guest.max_party_size),
  );
  const [dietaryNotes, setDietaryNotes] = useState(guest.dietary_notes ?? "");
  const [boozyLevel, setBoozyLevel] = useState(guest.boozy_level ?? 5);
  const [message, setMessage] = useState(guest.message ?? "");
  const [rsvpSaving, setRsvpSaving] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState<string | null>(null);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [failedPhotoUrls, setFailedPhotoUrls] = useState<string[]>([]);
  const [mosaicOpen, setMosaicOpen] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

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

  const handleSaveTheDateDecline = async () => {
    setDeclineSaving(true);
    setContactError(null);
    setContactMessage(null);

    try {
      const res = await fetch("/api/save-the-date-decline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: guest.slug,
          email: contact.email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Could not save decline response.");
      }
      setContactMessage(
        "You've been marked as declined. Thanks for letting us know.",
      );
    } catch (error) {
      setContactError(
        error instanceof Error
          ? error.message
          : "Could not save decline response.",
      );
    } finally {
      setDeclineSaving(false);
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
          boozyLevel,
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
      {sadFaceKey !== null ? (
        <SadFaceStreak
          key={sadFaceKey}
          onDone={() => setSadFaceKey(null)}
        />
      ) : null}
      <Box className={styles.sheet}>
        <Box className={styles.inner}>
          <Box className={styles.desktopGrid}>
            <Box>
              <Box className={styles.hero}>
                <Typography variant="inviteGreetingName">
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
                <Typography variant="inviteIntro">
                  {guest.greeting || ""}{" "}
                </Typography>
                <Typography variant="inviteEventLabel" sx={{ mt: 1 }}>
                  It&apos;s {eventTitle}
                </Typography>
                <Typography variant="inviteIntro" sx={{ mt: 2 }}>
                  {mode === "save_the_date"
                    ? "This is your (updated) save-the-date. More details will keep coming chaotically through."
                    : `Please RSVP by ${eventRsvpDeadline}.`}
                </Typography>
              </Box>

              <Box className={styles.dateBlock}>
                <Typography variant="inviteEyebrow">The details</Typography>
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
                  <span>
                    {eventStartTime} &ndash; {eventEndTime}
                  </span>
                  <span>
                    <a
                      href={eventMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.mapLink}
                    >
                      📍 {eventLocation} ↗
                    </a>
                  </span>
                </Box>
                {mode === "rsvp_open" ? (
                  <a href="#rsvp-form" className={styles.rsvpJump}>
                    RSVP ↓
                  </a>
                ) : null}
                <Box className={styles.detailsCard}>
                  <Typography
                    variant="inviteDetailsBody"
                    sx={{ whiteSpace: "pre-line" }}
                  >
                    {eventDetailsText}
                  </Typography>
                </Box>
                {mode === "rsvp_open" ? (
                  <>
                    <Typography variant="inviteEyebrow" sx={{ mt: 2 }}>
                      Dress Code
                    </Typography>
                    <Typography variant="inviteDetailsBody" sx={{ mt: 1.4 }}>
                      {eventDressCode}
                    </Typography>
                  </>
                ) : null}
                <Box className={styles.calendarRow}>
                  <span>Add to calendar:</span>
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.calendarLink}
                  >
                    <GoogleBadge size={12} />
                    Google
                  </a>
                  <span className={styles.calendarSep}>·</span>
                  <a href={icsUrl} className={styles.calendarLink}>
                    <CalendarFileBadge size={12} />
                    Apple/Outlook
                  </a>
                </Box>
              </Box>
            </Box>

            <Box className={styles.photoWall}>
              <Typography className={styles.photoTitle} sx={{ mb: 5 }}>
                <span
                  className={styles.scribble}
                  style={{ fontStyle: "italic" }}
                >
                  In case you have forgotten what we look like...
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
                            {getPhotoCaptionFromUrl(url)}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                  <Typography className={styles.tapHint}>
                    Top tip: click a photo.
                  </Typography>
                  <button
                    type="button"
                    className={styles.mosaicTrigger}
                    onClick={() => setMosaicOpen(true)}
                  >
                    View all photos ⤢
                  </button>
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

          <Modal
            open={mosaicOpen}
            onClose={() => {
              setMosaicOpen(false);
              setLightboxUrl(null);
            }}
            disablePortal
          >
            <Box className={styles.mosaicRoot}>
              <Box className={styles.mosaicBackdrop} />
              <Box className={styles.mosaicOverlay}>
                <button
                  type="button"
                  className={styles.mosaicClose}
                  aria-label="Close photo wall"
                  onClick={() => {
                    setMosaicOpen(false);
                    setLightboxUrl(null);
                  }}
                >
                  ✕
                </button>
                <Box className={styles.mosaicGrid}>
                  {visiblePhotoUrls.map((url, idx) => (
                    <Box
                      key={url}
                      className={styles.mosaicItem}
                      onClick={() => setLightboxUrl(url)}
                    >
                      <Box
                        component="img"
                        src={url}
                        alt={`Memory ${idx + 1} for ${guest.display_name}`}
                        className={styles.mosaicImg}
                      />
                    </Box>
                  ))}
                </Box>
                <Typography className={styles.mosaicFootnote} sx={{ mt: 1 }}>
                  This page exists due to numerous complaints concerning the
                  ease of navigation of the photos. Feedback is{" "}
                  <span style={{ textDecoration: "underline" }}>not</span>{" "}
                  welcome.
                </Typography>
              </Box>
              {lightboxUrl ? (
                <Box
                  className={styles.lightbox}
                  onClick={() => setLightboxUrl(null)}
                >
                  <Box className={styles.lightboxContent}>
                    <Box
                      component="img"
                      src={lightboxUrl}
                      alt={`Memory for ${guest.display_name}, enlarged`}
                      className={styles.lightboxImg}
                    />
                    <Typography className={styles.lightboxCaption}>
                      {getPhotoCaptionFromUrl(lightboxUrl)}
                    </Typography>
                  </Box>
                </Box>
              ) : null}
            </Box>
          </Modal>

          <Box id="rsvp-form" className={styles.formCard}>
            {mode === "save_the_date" ? (
              <Box component="form" onSubmit={handleContactSubmit}>
                <Typography className={styles.formTitle}>
                  Save the date
                </Typography>
                {guest.max_party_size === 1 ? (
                  <Typography className={styles.formIntro}>
                    Plus ones encouraged!
                  </Typography>
                ) : null}
                <Typography className={styles.formIntro} sx={{ mt: 1 }}>
                  Drop your email for updates.
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
                  {contactMessage ? (
                    <Alert severity="success">{contactMessage}</Alert>
                  ) : null}
                  {contactError ? (
                    <Alert severity="error">{contactError}</Alert>
                  ) : null}
                  <Box className={styles.formButtons}>
                    <Button
                      className={styles.btnPrimary}
                      type="submit"
                      disableElevation
                      sx={{ px: 3.4 }}
                      disabled={contactSaving || declineSaving}
                    >
                      {contactSaving ? "Saving..." : "Save details"}
                    </Button>
                    <Button
                      className={styles.btnGhost}
                      type="button"
                      disableElevation
                      sx={{ px: 3.2 }}
                      onClick={handleSaveTheDateDecline}
                      disabled={contactSaving || declineSaving}
                    >
                      {declineSaving
                        ? "Saving..."
                        : "Sorry - I'm washing my hair."}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleRsvpSubmit}>
                <Typography className={styles.formTitle}>RSVP</Typography>
                <Typography className={styles.formIntro} sx={{ mb: 2 }}>
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
                  {attending === "yes" ? (
                    <TextField
                      select
                      label="Number attending"
                      sx={inviteFieldSx}
                      value={attendingCount}
                      helperText={`Your invitation allows up to ${guest.max_party_size} guests.`}
                      onChange={(e) =>
                        setAttendingCount(Number(e.target.value))
                      }
                    >
                      {countChoices.map((count) => (
                        <MenuItem key={count} value={count}>
                          {count}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : null}
                  {attending === "yes" ? (
                    <TextField
                      label="Dietary requirements"
                      multiline
                      minRows={2}
                      sx={inviteFieldSx}
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                    />
                  ) : null}
                  {attending === "yes" ? (
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "12px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        How boozy are you feeling? {boozyLevel}/10
                      </Typography>
                      <Slider
                        value={boozyLevel}
                        min={0}
                        max={10}
                        step={1}
                        marks
                        onChange={(_e, value) =>
                          setBoozyLevel(value as number)
                        }
                        sx={{ mt: 1, color: "var(--ink)" }}
                      />
                      {boozyLevel === 0 ? (
                        <Typography
                          sx={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                            color: "var(--accent, #e2421f)",
                            mt: -0.5,
                          }}
                        >
                          Oh come on... at least 1 surely.
                        </Typography>
                      ) : null}
                    </Box>
                  ) : null}
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
              don&apos;t be boring.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
