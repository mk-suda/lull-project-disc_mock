"use client";

import React from "react";
import ManagementLayout from "../../components/layout/ManagementLayout";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
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
  },
  {
    label: "契約更新期限",
    value: "5件",
    helper: "今週中に対応",
    chipLabel: "要確認",
    chipColor: "warning" as const,
    icon: ChecklistIcon,
  },
  {
    label: "勤怠未承認",
    value: "8件",
    helper: "最終承認待ち",
    chipLabel: "差戻し 2件",
    chipColor: "default" as const,
    icon: AccessTimeFilledIcon,
  },
  {
    label: "請求書発行予定",
    value: "12件",
    helper: "来週発行",
    chipLabel: "総額 960万円",
    chipColor: "secondary" as const,
    icon: TrendingUpIcon,
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

const approvalsQueue = [
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
  },
  {
    title: "勤怠乖離が検知されました",
    detail: "EMP-1112 の請求見込み額が契約単価から大きく乖離しています。マスタ情報の再確認が必要です。",
    severity: "medium" as const,
  },
];

const progressByDepartment = [
  { department: "コンサルティング部", completion: 76 },
  { department: "BPO推進課", completion: 64 },
  { department: "開発ソリューション部", completion: 82 },
  { department: "人事シェアード", completion: 58 },
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

  return (
    <ManagementLayout title="ダッシュボード">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            ダッシュボード
          </Typography>
          <Typography variant="body1" color="text.secondary">
            LULLの営業・勤怠・請求状況を俯瞰し、リスクを早期に把握するためのハブ画面です。
          </Typography>
        </Box>

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
                      <Chip label={card.chipLabel} color={card.chipColor} variant={card.chipColor === "default" ? "outlined" : "filled"} />
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
                  <Typography variant="h6" display="flex" alignItems="center" gap={1}>
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
                    <polygon points={chartAreaPoints} fill="rgba(0, 169, 224, 0.2)" />
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
                <Typography variant="h6" display="flex" alignItems="center" gap={1} gutterBottom>
                  <InsightsIcon fontSize="small" /> 進捗状況サマリー
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  売上創出に向けた営業ステージごとの進捗を可視化しています。
                </Typography>
                <Stack spacing={2}>
                  {pipelineOverview.map((stage) => (
                    <Box key={stage.stage}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2">{stage.stage}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stage.ratio}%
                        </Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={stage.ratio} sx={{ mt: 1, height: 8, borderRadius: 4 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {stage.helper}
                      </Typography>
                    </Box>
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
                <Typography variant="h6" display="flex" alignItems="center" gap={1} gutterBottom>
                  <TimelineIcon fontSize="small" /> 事業部別収益トレンド
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  管理事業部・テックフラッグ事業部・DC事業部の月次収益を比較し、収益源の偏りや伸びを把握します。
                </Typography>
                <Box
                  component="svg"
                  viewBox="0 0 100 100"
                  role="img"
                  aria-label="事業部別の収益推移グラフ"
                  sx={{ width: "100%", height: { xs: 260, md: 280 }, overflow: "visible" }}
                >
                  {[20, 40, 60, 80].map((y) => (
                    <line key={y} x1={0} x2={100} y1={y} y2={y} stroke="rgba(0,0,0,0.08)" strokeWidth={0.4} />
                  ))}
                  {divisionConfig.map((division) => (
                    <React.Fragment key={division.key}>
                      <polyline
                        points={divisionPolylinePoints[division.key]}
                        fill="none"
                        stroke={division.color}
                        strokeWidth={1.6}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                      {divisionRevenueTrend.map((item, index) => {
                        const x = (index / (divisionRevenueTrend.length - 1)) * 100;
                        const y = 90 - (item[division.key] / divisionMaxRevenue) * 80;
                        return <circle key={`${division.key}-${item.month}`} cx={x} cy={y} r={1.4} fill={division.color} />;
                      })}
                    </React.Fragment>
                  ))}
                  {divisionRevenueTrend.map((item, index) => {
                    const x = (index / (divisionRevenueTrend.length - 1)) * 100;
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
                <Typography variant="h6" display="flex" alignItems="center" gap={1} gutterBottom>
                  <BarChartIcon fontSize="small" /> 半期収益サマリー
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  3事業部の数値を統合し、半期単位での収益達成状況とギャップを確認できます。
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
                <Typography variant="h6" gutterBottom>
                  対応が必要な承認ワークフロー
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List disablePadding>
                  {approvalsQueue.map((item, index) => (
                    <React.Fragment key={item.member}>
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
                  <Typography variant="h6" gutterBottom>
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
                  <Typography variant="h6" gutterBottom>
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

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    リスクアラート
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
                      </Stack>
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
