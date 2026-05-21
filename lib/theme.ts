import { createTheme } from "@mui/material/styles";
import type { CSSProperties } from "react";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    inviteHeroKicker: CSSProperties;
    inviteEyebrow: CSSProperties;
    inviteGreetingName: CSSProperties;
    inviteIntro: CSSProperties;
    inviteEventLabel: CSSProperties;
    inviteDetailsBody: CSSProperties;
    invitePhotoTitle: CSSProperties;
    invitePhotoCaption: CSSProperties;
    inviteTapHint: CSSProperties;
    invitePhotoFallback: CSSProperties;
    inviteFormTitle: CSSProperties;
    inviteFormIntro: CSSProperties;
    inviteFooterMeta: CSSProperties;
    inviteNote: CSSProperties;
  }

  interface TypographyVariantsOptions {
    inviteHeroKicker?: CSSProperties;
    inviteEyebrow?: CSSProperties;
    inviteGreetingName?: CSSProperties;
    inviteIntro?: CSSProperties;
    inviteEventLabel?: CSSProperties;
    inviteDetailsBody?: CSSProperties;
    invitePhotoTitle?: CSSProperties;
    invitePhotoCaption?: CSSProperties;
    inviteTapHint?: CSSProperties;
    invitePhotoFallback?: CSSProperties;
    inviteFormTitle?: CSSProperties;
    inviteFormIntro?: CSSProperties;
    inviteFooterMeta?: CSSProperties;
    inviteNote?: CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    inviteHeroKicker: true;
    inviteEyebrow: true;
    inviteGreetingName: true;
    inviteIntro: true;
    inviteEventLabel: true;
    inviteDetailsBody: true;
    invitePhotoTitle: true;
    invitePhotoCaption: true;
    inviteTapHint: true;
    invitePhotoFallback: true;
    inviteFormTitle: true;
    inviteFormIntro: true;
    inviteFooterMeta: true;
    inviteNote: true;
  }
}

export const appTheme = createTheme({
  palette: {
    primary: {
      main: "#8a4f2b",
    },
    secondary: {
      main: "#2f6f63",
    },
    background: {
      default: "#fffdf8",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "var(--font-body), system-ui, sans-serif",
    h3: {
      fontWeight: 800,
    },
    h4: {
      fontWeight: 800,
    },
    inviteHeroKicker: {
      fontFamily: "var(--font-mono), monospace",
      fontSize: "36px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "rgba(11, 10, 8, 0.62)",
      lineHeight: 1.2,
    },
    inviteEyebrow: {
      fontFamily: "var(--font-mono), monospace",
      fontSize: "11px",
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "rgba(11, 10, 8, 0.62)",
    },
    inviteGreetingName: {
      fontFamily: "var(--font-hand), cursive",
      fontSize: "clamp(40px, 11vw, 54px)",
      lineHeight: 0.95,
      marginTop: "2px",
      color: "#0b0a08",
    },
    inviteIntro: {
      fontFamily: "var(--font-body), system-ui, sans-serif",
      fontSize: "15px",
      lineHeight: 1.45,
      marginTop: "16px",
      maxWidth: "620px",
    },
    inviteEventLabel: {
      fontFamily: "var(--font-cond), sans-serif",
      fontWeight: 900,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontSize: "20px",
    },
    inviteDetailsBody: {
      fontFamily: "var(--font-body), system-ui, sans-serif",
      fontSize: "14px",
      lineHeight: 1.55,
    },
    invitePhotoTitle: {
      fontFamily: "var(--font-display), serif",
      fontSize: "clamp(38px, 10vw, 56px)",
      lineHeight: 0.95,
      letterSpacing: "-0.03em",
    },
    invitePhotoCaption: {
      fontFamily: "var(--font-hand), cursive",
      fontSize: "19px",
      lineHeight: 1.15,
      color: "#1a1714",
    },
    inviteTapHint: {
      textAlign: "center",
      fontFamily: "var(--font-hand), cursive",
      fontSize: "18px",
      color: "rgba(11, 10, 8, 0.62)",
    },
    invitePhotoFallback: {
      fontFamily: "var(--font-hand), cursive",
      fontSize: "26px",
    },
    inviteFormTitle: {
      fontFamily: "var(--font-display), serif",
      fontSize: "clamp(34px, 9vw, 48px)",
      lineHeight: 0.96,
      letterSpacing: "-0.03em",
      marginBottom: "8px",
    },
    inviteFormIntro: {
      fontFamily: "var(--font-body), system-ui, sans-serif",
      fontSize: "14px",
      lineHeight: 1.5,
      color: "rgba(11, 10, 8, 0.62)",
      marginBottom: "14px",
    },
    inviteFooterMeta: {
      fontFamily: "var(--font-mono), monospace",
      fontSize: "10px",
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "rgba(11, 10, 8, 0.62)",
      lineHeight: 1.6,
    },
    inviteNote: {
      fontFamily: "var(--font-hand), cursive",
      fontSize: "22px",
      lineHeight: 1.12,
      textAlign: "right",
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          inviteHeroKicker: "p",
          inviteEyebrow: "p",
          inviteGreetingName: "h2",
          inviteIntro: "p",
          inviteEventLabel: "p",
          inviteDetailsBody: "p",
          invitePhotoTitle: "h3",
          invitePhotoCaption: "p",
          inviteTapHint: "p",
          invitePhotoFallback: "p",
          inviteFormTitle: "h3",
          inviteFormIntro: "p",
          inviteFooterMeta: "p",
          inviteNote: "p",
        },
      },
    },
  },
});
