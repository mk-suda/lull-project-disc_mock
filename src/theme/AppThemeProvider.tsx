"use client";

import * as React from "react";
import { PropsWithChildren, useMemo } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import { colorSchemes, type SchemeKey } from "./colorSchemes";

function createEmotionCache() {
  const cache = createCache({ key: "mui", prepend: true });
  cache.compat = true;
  return cache;
}

type ThemeSchemeContextType = {
  scheme: SchemeKey;
  setScheme: (s: SchemeKey) => void;
  cycle: () => void;
};

export const ThemeSchemeContext = React.createContext<ThemeSchemeContextType | undefined>(undefined);

export function useThemeScheme() {
  const ctx = React.useContext(ThemeSchemeContext);
  if (!ctx) throw new Error("useThemeScheme must be used within AppThemeProvider");
  return ctx;
}

function buildTheme(scheme: SchemeKey) {
  const base = colorSchemes[scheme].palette;
  const t = createTheme({
    palette: {
      ...base,
      mode: base.mode ?? 'light',
    },
    typography: {
      fontFamily: [
        "var(--font-roboto)",
        "var(--font-noto-sans-jp)",
        "Roboto",
        "Open Sans",
        "Noto Sans JP",
        "Hiragino Kaku Gothic ProN",
        "Arial",
        "sans-serif",
      ].join(","),
      button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.02em" },
    },
    shape: { borderRadius: 10 },
  });
  return responsiveFontSizes(t);
}

export default function AppThemeProvider({ children, initialScheme }: PropsWithChildren & { initialScheme?: SchemeKey }) {
  const [{ cache }] = React.useState(() => {
    const cacheInstance = createEmotionCache();
    return { cache: cacheInstance };
  });
  const [scheme, setScheme] = React.useState<SchemeKey>(() => {
    // SSR: use server-provided initialScheme
    if (typeof window === "undefined") return initialScheme ?? "default";
    // CSR: prefer data-scheme set on <html>, then cookie/localStorage value baked during SSR
    const dataScheme = document.documentElement.dataset.scheme as SchemeKey | undefined;
    const stored = window.localStorage.getItem("theme-scheme") as SchemeKey | "plum" | "charcoal" | null;
    const normalizedStored = stored === 'plum' || stored === 'charcoal' ? 'dark' : stored ?? undefined;
    const initial = (dataScheme || initialScheme || normalizedStored || 'default') as SchemeKey;
    const keys: SchemeKey[] = ["default", "teal", "royal", "dark", "blossom"];
    return keys.includes(initial) ? initial : "default";
  });
  const theme = useMemo(() => buildTheme(scheme), [scheme]);
  const setSchemePersist = React.useCallback((s: SchemeKey) => {
    setScheme(s);
    if (typeof window !== "undefined") window.localStorage.setItem("theme-scheme", s);
    if (typeof document !== "undefined") document.documentElement.dataset.scheme = s;
    try {
      document.cookie = `theme-scheme=${s}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
  }, []);
  const cycle = React.useCallback(() => {
    const keys: SchemeKey[] = ["default", "teal", "royal", "dark", "blossom"];
    const idx = keys.indexOf(scheme);
    const next = keys[(idx + 1) % keys.length];
    setSchemePersist(next);
  }, [scheme]);

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) {
      return null;
    }

    let styles = "";
    names.forEach((name) => {
      if (name === "mui") {
        return;
      }
      const style = cache.inserted[name];
      if (typeof style === "string") {
        styles += style;
      }
    });

    cache.inserted = {} as typeof cache.inserted;

    if (!styles) {
      return null;
    }

    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeSchemeContext.Provider value={{ scheme, setScheme: setSchemePersist, cycle }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles
            styles={
              {
                body: {
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                },
                // Hide half of x-axis ticks on very small screens to increase spacing
                "@media (max-width:600px)": {
                  ".x-tick.odd": { display: "none" },
                },
              // Headings in main inherit text color
                "main .MuiTypography-h1, main .MuiTypography-h2, main .MuiTypography-h3, main .MuiTypography-h4, main .MuiTypography-h5, main .MuiTypography-h6": {
                  color: theme.palette.text.primary,
                },
                // Dark-only: ensure主要テキスト系を白（他テーマへは影響なし）
                'html[data-scheme="dark"] .MuiTypography-root, html[data-scheme="dark"] h1, html[data-scheme="dark"] h2, html[data-scheme=\"dark\"] h3, html[data-scheme=\"dark\"] h4, html[data-scheme=\"dark\"] h5, html[data-scheme=\"dark\"] h6': {
                  color: '#FFFFFF !important',
                },
                'html[data-scheme="dark"] .MuiListItemText-primary, html[data-scheme="dark"] .MuiListItemText-secondary': {
                  color: '#FFFFFF !important',
                },
                'html[data-scheme="dark"] .MuiDataGrid-root, html[data-scheme="dark"] .MuiDataGrid-cell, html[data-scheme="dark"] .MuiDataGrid-columnHeaderTitle': {
                  color: '#FFFFFF !important',
                },
                
              }
            }
          />
          {children}
        </ThemeProvider>
      </ThemeSchemeContext.Provider>
    </CacheProvider>
  );
}
