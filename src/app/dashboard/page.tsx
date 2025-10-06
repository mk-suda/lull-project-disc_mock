"use client";

import React from "react";
import Link from "next/link";
import ManagementLayout from "../../components/layout/ManagementLayout";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useTheme } from "@mui/material/styles";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InsightsIcon from "@mui/icons-material/Insights";
import TimelineIcon from "@mui/icons-material/Timeline";
import BarChartIcon from "@mui/icons-material/BarChart";

type DivisionKey = "management" | "techFlag" | "dc";

interface DivisionRevenuePoint {
  month: string;
  management: number;
  techFlag: number;
  dc: number;
}

const kpiCards = [
  {
    label: "稼働中プロジェクト",
    value: "18件",
    helper: "先月比 +2件",
    chipLabel: "安定稼働",
    chipColor: "success" as const,
    icon: TrendingUpIcon,
    chipHref: "/contracts?status=active,expiring,draft&planned=future",
  },
  {
    label: "契約更新期限",
    value: "5件",
    helper: "今週中に対応",
    chipLabel: "要確認",
    chipColor: "warning" as const,
    icon: ChecklistIcon,
    chipHref: "/contracts?status=expiring",
  },
  {
    label: "勤怠未承認",
    value: "8件",
    helper: "最終承認待ち",
    chipLabel: "差戻し 2件",
    chipColor: "default" as const,
    icon: AccessTimeFilledIcon,
    chipHref: "/attendance?approval=pending,rejected",
  },
  {
    label: "請求書発行予定",
    value: "12件",
    helper: "来週発行",
    chipLabel: "総額 960万円",
    chipColor: "secondary" as const,
    icon: TrendingUpIcon,
    chipHref: "/billing?approval=draft,pending",
  },
];

const monthlyRevenueTrend = [
  { month: "4月", amount: 8_200_000 },
  { month: "5月", amount: 8_600_000 },
  { month: "6月", amount: 9_100_000 },
  { month: "7月", amount: 8_700_000 },
  { month: "8月", amount: 9_200_000 },
  { month: "9月", amount: 9_500_000 },
  { month: "10月", amount: 9_800_000 },
];

const divisionRevenueTrend: DivisionRevenuePoint[] = [
  { month: "4月", management: 2_600_000, techFlag: 3_600_000, dc: 2_000_000 },
  { month: "5月", management: 2_700_000, techFlag: 3_800_000, dc: 2_100_000 },
  { month: "6月", management: 2_800_000, techFlag: 3_900_000, dc: 2_400_000 },
  { month: "7月", management: 2_650_000, techFlag: 3_700_000, dc: 2_350_000 },
  { month: "8月", management: 2_850_000, techFlag: 4_000_000, dc: 2_350_000 },
  { month: "9月", management: 2_950_000, techFlag: 4_150_000, dc: 2_400_000 },
  { month: "10月", management: 3_000_000, techFlag: 4_350_000, dc: 2_450_000 },
];

const divisionConfig: { key: DivisionKey; label: string; color: string }[] = [
  { key: "management", label: "管理事業部", color: "#003366" },
  { key: "techFlag", label: "テックフラッグ事業部", color: "#00A9E0" },
  { key: "dc", label: "DC事業部", color: "#FF7043" },
];

const pipelineOverview = [
  { stage: "商談中", ratio: 68, helper: "成約確度 35%" },
  { stage: "見積提示", ratio: 54, helper: "平均単価 6,100円" },
  { stage: "契約ドラフト", ratio: 41, helper: "法務レビュー中 3件" },
  { stage: "契約締結", ratio: 28, helper: "平均リードタイム 12日" },
];

type ApprovalItem = {
  project: string;
  member: string;
  deadline: string;
  status: string;
};

const approvalsQueue: ApprovalItem[] = [
  {
    project: "LULLデジタル戦略PJ",
    member: "山田 太郎",
    deadline: "本日 18:00 締切",
    status: "マネージャー承認待ち",
  },
  {
    project: "BPO運用最適化",
    member: "佐藤 花子",
    deadline: "明日 12:00 締切",
    status: "部長承認待ち",
  },
  {
    project: "業務システム刷新",
    member: "鈴木 次郎",
    deadline: "3日後 締切",
    status: "一次承認済み",
  },
];

const riskAlerts = [
  {
    title: "契約更新期限が迫っています",
    detail: "PJ-4633 (クライアントA) の契約が7日後に終了します。先方責任者との調整を進めてください。",
    severity: "high" as const,
    href: "/contracts?status=expiring",
    linkLabel: "契約一覧へ",
  },
  {
    title: "勤怠乖離が検知されました",
    detail: "EMP-1112 の請求見込み額が契約単価から大きく乖離しています。マスタ情報の再確認が必要です。",
    severity: "medium" as const,
    href: "/attendance?approval=pending,rejected",
    linkLabel: "勤怠一覧へ",
  },
];

const progressByDepartment = [
  { department: "管理事業部", completion: 76 },
  { department: "テックフラッグ事業部", completion: 82 },
  { department: "DC事業部", completion: 64 },
];

const milestoneProgress = [
  { project: "LULL戦略支援PJ", progress: 72, status: "順調" },
  { project: "業務刷新プロジェクト", progress: 48, status: "要調整" },
  { project: "BPO運用最適化", progress: 64, status: "追い込み" },
];

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  minimumFractionDigits: 0,
});

export default function DashboardPage() {
  const theme = useTheme();
  const sec = theme.palette.secondary.main;
  const secR = parseInt(sec.slice(1, 3), 16);
  const secG = parseInt(sec.slice(3, 5), 16);
  const secB = parseInt(sec.slice(5, 7), 16);
  const secRgba = (a: number) => `rgba(${secR}, ${secG}, ${secB}, ${a})`;
  const maxRevenue = Math.max(...monthlyRevenueTrend.map((item) => item.amount));
  const latestRevenue = monthlyRevenueTrend[monthlyRevenueTrend.length - 1];
  const previousRevenue = monthlyRevenueTrend[monthlyRevenueTrend.length - 2];
  const revenueGrowthRate = ((latestRevenue.amount - previousRevenue.amount) / previousRevenue.amount) * 100;

  const chartPolylinePoints = monthlyRevenueTrend
    .map((item, index) => {
      const x = (index / (monthlyRevenueTrend.length - 1)) * 100;
      const y = 90 - (item.amount / maxRevenue) * 80;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const chartAreaPoints = `0,90 ${chartPolylinePoints} 100,90`;

  const divisionMaxRevenue = Math.max(
    ...divisionRevenueTrend.flatMap((item) => [item.management, item.techFlag, item.dc])
  );

  const divisionPolylinePoints = divisionConfig.reduce<Record<DivisionKey, string>>((acc, division) => {
    acc[division.key] = divisionRevenueTrend
      .map((item, index) => {
        const x = (index / (divisionRevenueTrend.length - 1)) * 100;
        const y = 90 - (item[division.key] / divisionMaxRevenue) * 80;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
    return acc;
  }, { management: "", techFlag: "", dc: "" });

  const firstHalfTotal = divisionRevenueTrend
    .slice(0, 6)
    .reduce((total, item) => total + item.management + item.techFlag + item.dc, 0);

  const secondHalfForecastTotal = 58_800_000;

  const halfYearPerformance = [
    { label: "上期 (4-9月)", actual: firstHalfTotal, target: 52_000_000, type: "actual" as const },
    { label: "下期計画 (10-3月)", actual: secondHalfForecastTotal, target: 60_000_000, type: "forecast" as const },
  ];

  const [divisionChartMode, setDivisionChartMode] = React.useState<"line" | "bar">("line");

  return (
    <ManagementLayout title="ダッシュボード">
      <Stack spacing={4}>
        <Box></Box>

        <Grid container spacing={3}>
          {kpiCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.label}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}>
                          <IconComponent fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="overline" color="text.secondary">
                            {card.label}
                          </Typography>
                          <Typography variant="h4">{card.value}</Typography>
                        </Box>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {card.helper}
                      </Typography>
                      <Chip
                        label={card.chipLabel}
                        color={card.chipColor}
                        variant={card.chipColor === "default" ? "outlined" : "filled"}
                        component={Link}
                        href={card.chipHref}
                        clickable
                        aria-label={`${card.label}の詳細へ`}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
                  <Typography variant="h6" display="flex" alignItems="center" gap={1} color="text.primary">
                    <TimelineIcon fontSize="small" /> 月次売上トレンド
                  </Typography>
                  <Stack direction="row" spacing={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        今月見込み
                      </Typography>
                      <Typography variant="h6">
                        {currencyFormatter.format(latestRevenue.amount)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        前月比
                      </Typography>
                      <Typography variant="h6" color={revenueGrowthRate >= 0 ? "success.main" : "error.main"}>
                        {revenueGrowthRate >= 0 ? "+" : ""}
                        {revenueGrowthRate.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Box sx={{ mt: 3 }}>
                  <Box
                    component="svg"
                    viewBox="0 0 100 100"
                    role="img"
                    aria-label="月次売上推移の折れ線グラフ"
                    sx={{ width: "100%", height: 240, overflow: "visible" }}
                  >
                    {[20, 40, 60, 80].map((y) => (
                      <line key={y} x1={0} x2={100} y1={y} y2={y} stroke="rgba(0,0,0,0.08)" strokeWidth={0.4} />
                    ))}
                    <polygon points={chartAreaPoints} fill={secRgba(0.2)} />
                    <polyline points={chartPolylinePoints} fill="none" stroke="#003366" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
                    {monthlyRevenueTrend.map((item, index) => {
                      const x = (index / (monthlyRevenueTrend.length - 1)) * 100;
                      const y = 90 - (item.amount / maxRevenue) * 80;
                      return <circle key={item.month} cx={x} cy={y} r={1.4} fill="#003366" />;
                    })}
                    {monthlyRevenueTrend.map((item, index) => {
                      const x = (index / (monthlyRevenueTrend.length - 1)) * 100;
                      return (
                        <text key={`${item.month}-label`} x={x} y={96} textAnchor="middle" fontSize={5} fill="rgba(0,0,0,0.54)">
                          {item.month}
                        </text>
                      );
                    })}
                  </Box>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mt: 3 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      売上目標達成率
                    </Typography>
                    <Typography variant="h6">92%</Typography>
                    <LinearProgress variant="determinate" value={92} sx={{ height: 8, borderRadius: 4, width: { xs: "100%", sm: 220 } }} />
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      パイプライン充足率 (来月)
                    </Typography>
                    <Typography variant="h6">84%</Typography>
                    <LinearProgress color="secondary" variant="determinate" value={84} sx={{ height: 8, borderRadius: 4, width: { xs: "100%", sm: 220 } }} />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" display="flex" alignItems="center" gap={1} gutterBottom color="text.primary">
                  <ReportProblemIcon fontSize="small" /> リスクアラート
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  {riskAlerts.map((alert) => (
                    <Stack
                      key={alert.title}
                      spacing={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor:
                          alert.severity === "high"
                            ? "rgba(255, 112, 67, 0.12)"
                            : "rgba(255, 193, 7, 0.12)",
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ReportProblemIcon fontSize="small" color={alert.severity === "high" ? "error" : "warning"} />
                        <Typography variant="subtitle1">{alert.title}</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {alert.detail}
                      </Typography>
                      {alert.href && (
                        <Box sx={{ pt: 1 }}>
                          <Button
                            component={Link}
                            href={alert.href}
                            size="small"
                            variant="outlined"
                            color={alert.severity === "high" ? "error" : "warning"}
                          >
                            {alert.linkLabel ?? "詳細へ"}
                          </Button>
                        </Box>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
                  <Typography variant="h6" display="flex" alignItems="center" gap={1} gutterBottom color="text.primary">
                    <TimelineIcon fontSize="small" /> 事業部別収益トレンド
                  </Typography>
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    color="primary"
                    value={divisionChartMode}
                    onChange={(_, val) => val && setDivisionChartMode(val)}
                    aria-label="トレンド表示切替"
                  >
                    <ToggleButton value="line" aria-label="線グラフ">線</ToggleButton>
                    <ToggleButton value="bar" aria-label="棒グラフ">棒</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
                {/* description removed as requested */}
                <Box
                  component="svg"
                  viewBox="0 0 110 100"
                  role="img"
                  aria-label="事業部別の収益推移グラフ"
                  sx={{ width: "100%", height: { xs: 280, md: 300 }, overflow: "visible" }}
                >
                  {/* Axes */}
                  <line x1={8} x2={8} y1={10} y2={90} stroke="rgba(0,0,0,0.38)" strokeWidth={0.5} />
                  <line x1={8} x2={104} y1={90} y2={90} stroke="rgba(0,0,0,0.38)" strokeWidth={0.5} />

                  {/* Horizontal grid lines and Y ticks with labels */}
                  {[20, 40, 60, 80].map((y) => {
                    const ratio = (90 - y) / 80; // 0..1
                    const value = divisionMaxRevenue * ratio;
                    return (
                      <g key={`grid-${y}`}>
                        <line x1={8} x2={104} y1={y} y2={y} stroke="rgba(0,0,0,0.08)" strokeWidth={0.4} />
                        <text x={6} y={y + 2} textAnchor="end" fontSize={4.2} fill="rgba(0,0,0,0.54)">
                          {currencyFormatter.format(Math.round(value / 10000) * 10000)}
                        </text>
                      </g>
                    );
                  })}

                  {divisionChartMode === "line" ? (
                    <g>
                      {divisionConfig.map((division) => (
                        <React.Fragment key={division.key}>
                          <polyline
                            points={divisionRevenueTrend
                              .map((item, index) => {
                                const x = 8 + (index / (divisionRevenueTrend.length - 1)) * (104 - 8);
                                const y = 90 - (item[division.key] / divisionMaxRevenue) * 80;
                                return `${x.toFixed(2)},${y.toFixed(2)}`;
                              })
                              .join(" ")}
                            fill="none"
                            stroke={division.color}
                            strokeWidth={1.6}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                          {divisionRevenueTrend.map((item, index) => {
                            const x = 8 + (index / (divisionRevenueTrend.length - 1)) * (104 - 8);
                            const y = 90 - (item[division.key] / divisionMaxRevenue) * 80;
                            return <circle key={`${division.key}-${item.month}`} cx={x} cy={y} r={1.4} fill={division.color} />;
                          })}
                        </React.Fragment>
                      ))}
                    </g>
                  ) : (
                    <g>
                      {divisionRevenueTrend.map((item, index) => {
                        const groupWidth = (104 - 8) / divisionRevenueTrend.length;
                        const startX = 8 + index * groupWidth + groupWidth * 0.15;
                        const barW = groupWidth * 0.18;
                        return (
                          <g key={`bar-group-${index}`}>
                            {divisionConfig.map((division, di) => {
                              const v = item[division.key];
                              const h = (v / divisionMaxRevenue) * 80;
                              const x = startX + di * (barW + groupWidth * 0.05);
                              const y = 90 - h;
                              return (
                                <rect
                                  key={`${division.key}-bar-${index}`}
                                  x={x}
                                  y={y}
                                  width={barW}
                                  height={h}
                                  fill={division.color}
                                  rx={0.8}
                                />
                              );
                            })}
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* X labels */}
                {divisionRevenueTrend.map((item, index) => {
                    const x = 8 + (index / (divisionRevenueTrend.length - 1)) * (104 - 8);
                    return (
                      <text key={`${item.month}-division-label`} x={x} y={96} textAnchor="middle" fontSize={5} fill="rgba(0,0,0,0.54)">
                        {item.month}
                      </text>
                    );
                  })}
                </Box>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
                  {divisionConfig.map((division) => (
                    <Stack key={division.key} direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: division.color }} />
                      <Typography variant="body2" color="text.secondary">
                        {division.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" display="flex" alignItems="center" gap={1} gutterBottom color="text.primary">
                  <BarChartIcon fontSize="small" /> 半期収益サマリー
                </Typography>
                
                <Stack spacing={3}>
                  {halfYearPerformance.map((period) => {
                    const progress = Math.min(100, (period.actual / period.target) * 100);
                    const diff = period.actual - period.target;
                    const isPositive = diff >= 0;
                    const chipLabel = period.type === "actual" ? "実績" : "予測";
                    const chipColor = period.type === "actual" ? "primary" : "warning";
                    return (
                      <Box key={period.label} sx={{ p: 2, border: 1, borderColor: "rgba(0,0,0,0.06)", borderRadius: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="subtitle1">{period.label}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              目標値 {currencyFormatter.format(period.target)}
                            </Typography>
                          </Box>
                          <Chip size="small" label={chipLabel} color={chipColor} variant={period.type === "actual" ? "filled" : "outlined"} />
                        </Stack>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                          {currencyFormatter.format(period.actual)}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{ mt: 2, height: 10, borderRadius: 5 }}
                          color={isPositive ? "success" : "warning"}
                        />
                        <Typography variant="body2" color={isPositive ? "success.main" : "warning.main"} sx={{ mt: 1 }}>
                          {isPositive ? "達成超過" : "目標差"}: {currencyFormatter.format(Math.abs(diff))}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="text.primary">
                  対応が必要な承認ワークフロー
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List disablePadding>
                  {approvalsQueue.map((item, index) => (
                    <React.Fragment key={`${item.project}-${item.member}`}>
                      <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "secondary.main" }}>
                            <ChecklistIcon fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="subtitle1">{item.project}</Typography>
                              <Chip size="small" label={item.status} color="primary" variant="outlined" />
                            </Stack>
                          }
                          secondary={
                            <Stack spacing={0.5} sx={{ mt: 1 }}>
                              <Typography variant="body2">担当者: {item.member}</Typography>
                              <Typography variant="caption" color="error.main">
                                締切: {item.deadline}
                              </Typography>
                            </Stack>
                          }
                        />
                      </ListItem>
                      {index < approvalsQueue.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="text.primary">
                    部門別 進捗プロファイル
                  </Typography>
                  <Stack spacing={2}>
                    {progressByDepartment.map((item) => (
                      <Box key={item.department}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2">{item.department}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.completion}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={item.completion}
                          sx={{ mt: 1, height: 8, borderRadius: 4 }}
                          color={item.completion >= 75 ? "success" : item.completion >= 60 ? "primary" : "warning"}
                        />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="text.primary">
                    主要案件の進捗
                  </Typography>
                  <Stack spacing={2}>
                    {milestoneProgress.map((milestone) => (
                      <Box key={milestone.project} sx={{ p: 1.5, border: 1, borderColor: "rgba(0,0,0,0.06)", borderRadius: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2">{milestone.project}</Typography>
                          <Chip size="small" label={milestone.status} color={milestone.status === "順調" ? "success" : milestone.status === "要調整" ? "warning" : "primary"} />
                        </Stack>
                        <LinearProgress variant="determinate" value={milestone.progress} sx={{ mt: 1.5, height: 6, borderRadius: 4 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                          完了率 {milestone.progress}% / マイルストーンまであと {100 - milestone.progress}%
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </ManagementLayout>
  );
}
