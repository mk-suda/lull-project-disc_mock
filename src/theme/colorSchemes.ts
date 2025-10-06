export type SchemeKey = "default" | "teal" | "royal" | "dark" | "blossom";

export type Scheme = {
  name: string;
  palette: {
    primary: { main: string; contrastText: string };
    secondary: { main: string; contrastText: string };
    success: { main: string; contrastText?: string };
    warning: { main: string; contrastText?: string };
    error: { main: string; contrastText?: string };
    background: { default: string; paper: string };
    mode?: 'light' | 'dark';
    text?: { primary: string; secondary: string };
  };
};

export const colorSchemes: Record<SchemeKey, Scheme> = {
  default: {
    name: "Default",
    palette: {
      primary: { main: "#003366", contrastText: "#FFFFFF" },
      secondary: { main: "#00A9E0", contrastText: "#FFFFFF" },
      success: { main: "#4CAF50", contrastText: "#FFFFFF" },
      warning: { main: "#FF7043", contrastText: "#FFFFFF" },
      error: { main: "#D32F2F" },
      background: { default: "#F9FAFC", paper: "#FFFFFF" },
      text: { primary: "#111111", secondary: "rgba(0,0,0,0.6)" },
    },
  },
  teal: {
    name: "Teal",
    palette: {
      primary: { main: "#0F3B3A", contrastText: "#FFFFFF" },
      secondary: { main: "#2F6D67", contrastText: "#FFFFFF" },
      success: { main: "#2E7D6E" },
      warning: { main: "#B3832F" },
      error: { main: "#C44536" },
      background: { default: "#F6F8F8", paper: "#FFFFFF" },
      text: { primary: "#111111", secondary: "rgba(0,0,0,0.6)" },
    },
  },
  royal: {
    name: "Apricot",
    palette: {
      // 目に優しいパステル系（アプリコット基調・少し落ち着いたトーン）
      primary: { main: "#F6A97A", contrastText: "#1F2A37" }, // 落ち着いたアプリコット
      secondary: { main: "#7BBDEB", contrastText: "#1F2A37" }, // 穏やかなスカイブルー
      success: { main: "#2E7D6E" },
      warning: { main: "#B3832F" },
      error: { main: "#C44536" },
      background: { default: "#FFF3E9", paper: "#FFFFFF" },
      text: { primary: "#111111", secondary: "rgba(0,0,0,0.6)" },
    },
  },
  dark: {
    name: "Dark",
    palette: {
      // ダークモードベース（黒色ベース）+ グレー系アクセント
      primary: { main: "#121314", contrastText: "#FFFFFF" },
      secondary: { main: "#8A939B", contrastText: "#FFFFFF" },
      success: { main: "#58C59A", contrastText: "#FFFFFF" },
      warning: { main: "#E0B050", contrastText: "#FFFFFF" },
      error: { main: "#FF6B6B", contrastText: "#FFFFFF" },
      background: { default: "#0F1113", paper: "#17191C" },
      mode: 'dark',
      // すべての文字色を白基調に
      text: { primary: "#FFFFFF", secondary: "#FFFFFF" },
    },
  },
  blossom: {
    name: "Blossom Pink",
    palette: {
      // 若い女性向けのやわらかいパステルピンク
      primary: { main: "#FFB6C8", contrastText: "#1F2A37" }, // サクラピンク
      // アクセントをさらにパステル寄りに調整
      secondary: { main: "#FFD3E0", contrastText: "#1F2A37" },
      success: { main: "#A8E6CF", contrastText: "#1F2A37" },
      warning: { main: "#FFE8A3", contrastText: "#1F2A37" },
      error: { main: "#FFC1C1", contrastText: "#1F2A37" },
      background: { default: "#FFF7FA", paper: "#FFFFFF" },
      text: { primary: "#111111", secondary: "rgba(0,0,0,0.6)" },
    },
  },
};
