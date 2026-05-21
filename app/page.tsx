import styles from "@/components/invite/InviteExperience.module.css";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
  return (
    <Box className={styles.inviteRoot}>
      <Box className={styles.sheet}>
        <Box className={styles.inner}>
          <Box className={styles.hero}>
            <Typography variant="inviteHeroKicker" sx={{ mt: 3, mb: 3 }}>
              Wrong door.
            </Typography>
            <Typography variant="inviteGreetingName">
              Bet you wish you were invited.
            </Typography>
            <Typography variant="inviteIntro">
              This event page is invite-link based. If you have a personal link,
              open it directly to view details and RSVP.
            </Typography>
          </Box>

          <Box className={styles.dateBlock}>
            <Box className={styles.metaRow}>
              <span>Invite only</span>
            </Box>
          </Box>

          <Box className={styles.footer}>
            <Box className={styles.meta}>
              <div>WITH-CHAOS . 000</div>
              <div>INVITE LINK REQUIRED</div>
              <div>LONDON . MMXXVI</div>
            </Box>
            <Typography className={styles.note}>
              bring your own link. xx
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
