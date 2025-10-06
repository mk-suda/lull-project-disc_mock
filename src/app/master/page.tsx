"use client";

import React from "react";
import Link from "next/link";
import ManagementLayout from "../../components/layout/ManagementLayout";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

interface MasterMetric {
  label: string;
  value: string;
  helper?: string;
}

interface MasterRecord {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
}

interface MasterCategory {
  key: string;
  label: string;
  description: string;
  metrics: MasterMetric[];
  records: MasterRecord[];
  actions: { label: string; href?: string; variant?: "contained" | "outlined" }[];
}

const masterCategories: MasterCategory[] = [
  {
    key: "employees",
    label: "社員マスタ",
    description: "稼働中メンバーのスキル・単価・配属情報を管理します。月次更新を徹底し、請求金額の算出精度を高めます。",
    metrics: [
      { label: "稼働メンバー", value: "132名", helper: "先月比 +4名" },
      { label: "平均単価", value: "¥6,200", helper: "標準偏差 ¥1,050" },
      { label: "要更新プロフィール", value: "9件", helper: "最終更新 90日超" },
    ],
    records: [
      { id: "EMP-1021", name: "山田 太郎", status: "常駐", updatedAt: "2024-09-28" },
      { id: "EMP-1088", name: "佐藤 花子", status: "リモート", updatedAt: "2024-09-25" },
      { id: "EMP-1112", name: "藤井 亮", status: "BPO", updatedAt: "2024-09-18" },
      { id: "EMP-1155", name: "吉田 京子", status: "常駐", updatedAt: "2024-09-16" },
    ],
    actions: [
      { label: "社員を新規登録", href: "#", variant: "contained" },
      { label: "CSVでインポート", href: "#", variant: "outlined" },
    ],
  },
  {
    key: "projects",
    label: "案件マスタ",
    description: "契約条件と工数枠、請求先の担当者情報を一元管理。更新前のアラートを自動で受け取れます。",
    metrics: [
      { label: "稼働案件", value: "32件", helper: "上流 14 / BPO 18" },
      { label: "更新期限 30日以内", value: "6件" },
      { label: "請求停止中", value: "1件", helper: "未着手フォロー" },
    ],
    records: [
      { id: "PJ-4589", name: "LULL戦略支援PJ", status: "稼働中", updatedAt: "2024-09-30" },
      { id: "PJ-4633", name: "業務刷新PJ", status: "更新協議中", updatedAt: "2024-09-29" },
      { id: "PJ-4710", name: "ナレッジ導入PJ", status: "新規立ち上げ", updatedAt: "2024-09-22" },
    ],
    actions: [
      { label: "案件を登録", href: "#", variant: "contained" },
      { label: "契約書フォーマット", href: "#", variant: "outlined" },
    ],
  },
  {
    key: "rateCards",
    label: "単価マスタ",
    description: "メンバーごとの単価・コスト情報を管理し、勤怠データとの突合精度を担保します。",
    metrics: [
      { label: "最新改訂日", value: "2024-09-27" },
      { label: "改訂待ち", value: "3件" },
      { label: "単価未設定", value: "0件", helper: "全員登録済み" },
    ],
    records: [
      { id: "RC-2409-001", name: "シニアコンサルタント", status: "¥8,500", updatedAt: "2024-09-27" },
      { id: "RC-2409-002", name: "PMO", status: "¥7,200", updatedAt: "2024-09-20" },
      { id: "RC-2409-003", name: "BPOオペレーター", status: "¥4,200", updatedAt: "2024-09-15" },
    ],
    actions: [
      { label: "単価を更新", href: "#", variant: "contained" },
      { label: "履歴をダウンロード", href: "#", variant: "outlined" },
    ],
  },
];

export default function MasterPage() {
  const [currentTab, setCurrentTab] = React.useState(0);

  return (
    <ManagementLayout title="マスタ管理">
      <Stack spacing={4}>
        <Box></Box>

        <Card variant="outlined">
          <Tabs
            value={currentTab}
            onChange={(_, value) => setCurrentTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            {masterCategories.map((category) => (
              <Tab key={category.key} label={category.label} />
            ))}
          </Tabs>

          {masterCategories.map((category, index) => (
            <Box key={category.key} role="tabpanel" hidden={currentTab !== index} sx={{ p: 3 }}>
              {currentTab === index && (
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h6" gutterBottom color="text.primary">
                      {category.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    {category.metrics.map((metric) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={metric.label}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">
                              {metric.label}
                            </Typography>
                            <Typography variant="h5" sx={{ mt: 1 }}>
                              {metric.value}
                            </Typography>
                            {metric.helper && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {metric.helper}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        直近更新されたレコード
                      </Typography>
                      <List disablePadding>
                        {category.records.map((record, recordIndex) => (
                          <React.Fragment key={record.id}>
                            <ListItem disablePadding>
                              <ListItemButton sx={{ py: 1.5 }}>
                                <ListItemText
                                  primary={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Typography variant="subtitle2">{record.name}</Typography>
                                      <Chip size="small" label={record.status} />
                                    </Stack>
                                  }
                                  secondary={`最終更新日: ${record.updatedAt}`}
                                />
                              </ListItemButton>
                            </ListItem>
                            {recordIndex < category.records.length - 1 && <Box component="span" sx={{ px: 2, display: "block", borderBottom: 1, borderColor: "divider" }} />}
                          </React.Fragment>
                        ))}
                      </List>
                    </CardContent>
                  </Card>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {category.actions.map((action) => (
                      <Button
                        key={action.label}
                        component={Link}
                        href={action.href ?? "#"}
                        variant={action.variant ?? "contained"}
                        startIcon={action.variant === "outlined" ? <SystemUpdateAltIcon /> : <PlaylistAddIcon />}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Box>
          ))}
        </Card>
      </Stack>
    </ManagementLayout>
  );
}
