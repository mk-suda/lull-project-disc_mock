"use client";

import React from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuIcon from "@mui/icons-material/Menu";
import PunchClockIcon from "@mui/icons-material/PunchClock";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { ThemeSchemeContext } from "../../theme/AppThemeProvider";
import type { SchemeKey } from "../../theme/colorSchemes";

const drawerWidth = 260;

// TODO: Implement role-based visibility for navigation items when permissions are wired up.
const navigationItems = [
  { label: "ダッシュボード", icon: <DashboardIcon fontSize="small" />, href: "/dashboard" },
  { label: "顧客管理", icon: <GroupsIcon fontSize="small" />, href: "/customers" },
  { label: "契約管理", icon: <GroupsIcon fontSize="small" />, href: "/contracts" },
  { label: "勤務情報登録", icon: <PunchClockIcon fontSize="small" />, href: "/attendance" },
  { label: "請求管理", icon: <ReceiptLongIcon fontSize="small" />, href: "/billing" },
  { label: "マスタ管理", icon: <SettingsApplicationsIcon fontSize="small" />, href: "/master" },
  // 原本アップロードはサイドバー表示から除外
];

export interface ManagementLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function ManagementLayout({
  title = "LULL 業務受発注管理",
  children,
}: ManagementLayoutProps) {
  const [isMobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const themeContext = React.useContext(ThemeSchemeContext);
  const isDark = themeContext?.scheme === "dark";

  const handleDrawerToggle = () => {
    setMobileDrawerOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "background.default" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: (theme) => {
            if (isDark) {
              return (theme.palette as unknown as Record<string, unknown>).bgLightGray as string || "#0D2236";
            }
            return (theme.palette as unknown as Record<string, unknown>).primaryLight as string || theme.palette.primary.main;
          },
          color: "#FFFFFF",
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="メニューを開く"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
        )}
        <Typography variant="h6" noWrap component="div">
          {title}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <ThemeSchemeContext.Consumer>
          {(ctx) => (
            <Select
              size="small"
              value={(ctx?.scheme ?? "lull") as SchemeKey}
              onChange={(e) => ctx?.setScheme(e.target.value as SchemeKey)}
              variant="outlined"
              sx={{
                ml: 2,
                minWidth: 150,
                color: "inherit",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.8)" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,1)" },
                "& .MuiSelect-icon": { color: "inherit" },
                bgcolor: "rgba(255,255,255,0.15)",
              }}
              aria-label="カラーパターンを選択"
            >
              <MenuItem value="lull">LULLカラー</MenuItem>
              <MenuItem value="dark">ダークカラー</MenuItem>
              <MenuItem value="feminine">フェミニンカラー</MenuItem>
              <MenuItem value="green">グリーンカラー</MenuItem>
            </Select>
          )}
        </ThemeSchemeContext.Consumer>
      </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="サイドバー">
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? isMobileDrawerOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: (theme) => {
                if (isDark) {
                  return (theme.palette as unknown as Record<string, unknown>).bgLightGray as string || "#0D2236";
                }
                return (theme.palette as unknown as Record<string, unknown>).primaryLight as string || theme.palette.primary.main;
              },
              color: "#FFFFFF",
            },
          }}
        >
          <Toolbar sx={{ px: 3 }}>
            <Typography variant="h6" component="div" noWrap>
              LULL.inc
            </Typography>
          </Toolbar>
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.12)" }} />
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton component={Link} href={item.href} sx={{ color: "inherit" }}>
                  <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
