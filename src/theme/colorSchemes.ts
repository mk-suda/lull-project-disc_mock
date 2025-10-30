/**
 * LULL 業務受発注管理システム
 * カラースキーム定義
 *
 * 新しい4種類のカラーパレット:
 * 1. lull - LULLカラー (企業コーポレートカラーベース)
 * 2. dark - ダークカラー (LULLカラーのダークモード)
 * 3. feminine - フェミニンカラー (女性的・知的・都会的)
 * 4. green - グリーンカラー (ナチュラル・クリーン・落ち着き・安心感)
 */

export type SchemeKey = "lull" | "dark" | "feminine" | "green";

/**
 * カスタムパレット拡張定義
 * MUIの標準パレットに加えて、LULL固有のカラー要素を追加
 */
export type CustomPalette = {
  /** アクセントカラー */
  accent?: string;
  /** アクセントカラー2 (フェミニンカラーで使用) */
  accent2?: string;
  /** ボーダーカラー (フェミニンカラーで使用) */
  border?: string;
  /** サブ背景色 */
  bgGray?: string;
  /** ライトグレー背景色 */
  bgLightGray?: string;
  /** ライトグリーン背景色 (グリーンカラーで使用) */
  bgLightGreen?: string;
  /** 黒背景色 */
  bgBlack?: string;
  /** 白背景色 */
  bgWhite?: string;
  /** 黒テキスト色 */
  textBlack?: string;
  /** 白テキスト色 */
  textWhite?: string;
  /** 茶色テキスト色 (フェミニンカラーで使用) */
  textBrown?: string;
  /** ボタンメインカラー */
  buttonMain?: string;
  /** ボタンセカンダリカラー */
  buttonSecond?: string;
  /** ボタン破壊的カラー */
  buttonDestructive?: string;
  /** ボタン無効化カラー */
  buttonDisable?: string;
  /** ステータス無効化カラー */
  statusDisable?: string;
  /** グレースケール - ライト */
  grayLight?: string;
  /** グレースケール - ミドルライト */
  grayMiddleLight?: string;
  /** グレースケール - ソフト */
  graySoft?: string;
  /** グレースケール - ダル */
  grayDull?: string;
  /** グレースケール - ダーク */
  grayDark?: string;
  /** Primary色の薄いバージョン (ナビゲーション用) */
  primaryLight?: string;
};

export type Scheme = {
  name: string;
  palette: {
    primary: { main: string; contrastText: string };
    secondary: { main: string; contrastText: string };
    success: { main: string; contrastText?: string };
    warning: { main: string; contrastText?: string };
    error: { main: string; contrastText?: string };
    info: { main: string; contrastText?: string };
    background: { default: string; paper: string };
    mode?: 'light' | 'dark';
    text?: { primary: string; secondary: string };
  } & CustomPalette;
};

export const colorSchemes: Record<SchemeKey, Scheme> = {
  lull: {
    name: "LULL",
    palette: {
      // Primary
      primary: { main: "#329BBD", contrastText: "#FFFFFF" },
      secondary: { main: "#0D2236", contrastText: "#FFFFFF" },
      accent: "#E9B81D",
      primaryLight: "#6BB8D1",

      // Background
      background: { default: "#DDEEF4", paper: "#FFFFFF" },
      bgWhite: "#FFFFFF",
      bgBlack: "#0D2236",

      // Text
      text: { primary: "#1C1C1C", secondary: "#1C1C1C" },
      textBlack: "#1C1C1C",
      textWhite: "#FFFFFF",

      // Button
      buttonMain: "#329BBD",
      buttonSecond: "#0D2236",
      buttonDestructive: "#C03000",
      buttonDisable: "#EAEBEB",

      // Status
      success: { main: "#51AF2F", contrastText: "#FFFFFF" },
      error: { main: "#C03000", contrastText: "#FFFFFF" },
      warning: { main: "#E9B81D", contrastText: "#FFFFFF" },
      info: { main: "#0D2236", contrastText: "#FFFFFF" },
      statusDisable: "#EAEBEB",

      // Gray scale
      grayLight: "#F4F5F6",
      grayMiddleLight: "#EBEEEF",
      graySoft: "#DDE2E4",
      grayDull: "#ACBABE",
      grayDark: "#63777E",

      mode: 'light',
    },
  },

  dark: {
    name: "Dark",
    palette: {
      // Primary
      primary: { main: "#44A5D7", contrastText: "#FFFFFF" },
      secondary: { main: "#27405A", contrastText: "#FFFFFF" },
      accent: "#E9B81D",
      primaryLight: "#6EBDD5",

      // Background
      background: { default: "#10151A", paper: "#1C2228" },
      bgGray: "#1C2228",
      bgLightGray: "#0D2236",

      // Text
      text: { primary: "#FFFFFF", secondary: "#7C838A" },
      textBlack: "#7C838A",
      textWhite: "#FFFFFF",

      // Button
      buttonMain: "#44A5C7",
      buttonSecond: "#27405A",
      buttonDestructive: "#C03000",
      buttonDisable: "#3B444C",

      // Status
      success: { main: "#3DC86E", contrastText: "#FFFFFF" },
      error: { main: "#E54D2E", contrastText: "#FFFFFF" },
      warning: { main: "#E9B81D", contrastText: "#FFFFFF" },
      info: { main: "#3298BD", contrastText: "#FFFFFF" },
      statusDisable: "#3B444C",

      // Gray scale
      grayLight: "#ACBABE",
      grayMiddleLight: "#A3A9AF",
      graySoft: "#4E5861",
      grayDull: "#3C464F",
      grayDark: "#2A3138",

      mode: 'dark',
    },
  },

  feminine: {
    name: "フェミニン",
    palette: {
      // Primary
      primary: { main: "#5B6B7C", contrastText: "#FFFFFF" },
      secondary: { main: "#968A7A", contrastText: "#FFFFFF" },
      accent: "#E5C5BA",
      accent2: "#CC6875",
      border: "#E6DED2",
      primaryLight: "#8A9DAD",

      // Background
      background: { default: "#F7F5F0", paper: "#FFFFFF" },
      bgWhite: "#FFFFFF",
      bgGray: "#FBF9F8",

      // Text
      text: { primary: "#333333", secondary: "#615243" },
      textBlack: "#333333",
      textWhite: "#FFFFFF",
      textBrown: "#615243",

      // Button
      buttonMain: "#5B6B7C",
      buttonSecond: "#968A7A",
      buttonDestructive: "#E16A76",
      buttonDisable: "#E6E4E0",

      // Status
      success: { main: "#4FB381", contrastText: "#FFFFFF" },
      error: { main: "#E16A76", contrastText: "#FFFFFF" },
      warning: { main: "#F4C542", contrastText: "#FFFFFF" },
      info: { main: "#5B6B7C", contrastText: "#FFFFFF" },
      statusDisable: "#E6E4E0",

      // Gray scale
      grayLight: "#FBF9F8",
      grayMiddleLight: "#E8E8E8",
      graySoft: "#D0CBC6",
      grayDull: "#9C958E",
      grayDark: "#5C5550",

      mode: 'light',
    },
  },

  green: {
    name: "グリーン",
    palette: {
      // Primary
      primary: { main: "#56AF79", contrastText: "#FFFFFF" },
      secondary: { main: "#60AAA7", contrastText: "#FFFFFF" },
      accent: "#226C3F",
      primaryLight: "#7FC89A",

      // Background
      background: { default: "#F2F6F4", paper: "#FFFFFF" },
      bgLightGreen: "#F5FAF7",
      bgWhite: "#FFFFFF",

      // Text
      text: { primary: "#7C838A", secondary: "#7C838A" },
      textBlack: "#7C838A",
      textWhite: "#FFFFFF",

      // Button
      buttonMain: "#56AF79",
      buttonSecond: "#60AAA7",
      buttonDestructive: "#C5383A",
      buttonDisable: "#D5D7D8",

      // Status
      success: { main: "#3DC86E", contrastText: "#FFFFFF" },
      error: { main: "#C5383A", contrastText: "#FFFFFF" },
      warning: { main: "#E9B81D", contrastText: "#FFFFFF" },
      info: { main: "#226C3F", contrastText: "#FFFFFF" },
      statusDisable: "#D5D7D8",

      // Gray scale
      grayLight: "#F4F6F5",
      grayMiddleLight: "#DDE4E0",
      graySoft: "#CED9D3",
      grayDull: "#98AEA1",
      grayDark: "#708F7C",

      mode: 'light',
    },
  },
};
