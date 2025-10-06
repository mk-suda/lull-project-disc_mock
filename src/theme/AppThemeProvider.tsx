"use client";

import * as React from "react";
import { PropsWithChildren } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

function createEmotionCache() {
  const cache = createCache({ key: "mui", prepend: true });
  cache.compat = true;
  return cache;
}

export default function AppThemeProvider({ children }: PropsWithChildren) {
  const [{ cache }] = React.useState(() => {
    const cacheInstance = createEmotionCache();
    return { cache: cacheInstance };
  });

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            },
            // Scope heading color to main content so AppBar/Drawer titles keep contrastText (white)
            "main .MuiTypography-h1, main .MuiTypography-h2, main .MuiTypography-h3, main .MuiTypography-h4, main .MuiTypography-h5, main .MuiTypography-h6": {
              color: theme.palette.text.primary,
            },
          }}
        />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
