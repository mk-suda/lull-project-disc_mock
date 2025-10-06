"use client";

import React from "react";
import ManagementLayout from "../../components/layout/ManagementLayout";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import GroupsIcon from "@mui/icons-material/Groups";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

type CustomerStatus = "prospect" | "active" | "inactive";

interface CustomerRecord {
  id: string;
  name: string;
  industry: string;
  department: string;
  segment: "Enterprise" | "SMB" | "Mid";
  status: CustomerStatus;
  owner: string;
  projects: number;
  mrr: number;
  lastActivity: string; // YYYY-MM-DD
}

const customers: CustomerRecord[] = [
  { id: "CUST-1001", name: "株式会社アバンス", industry: "製造", department: "テックフラッグ事業部", segment: "Enterprise", status: "active", owner: "田中 遥", projects: 3, mrr: 820000, lastActivity: "2025-09-29" },
  { id: "CUST-1002", name: "クライアントA", industry: "金融", department: "管理事業部", segment: "Mid", status: "prospect", owner: "佐藤 健", projects: 1, mrr: 0, lastActivity: "2025-09-25" },
  { id: "CUST-1003", name: "株式会社ユナイト", industry: "通信・インフラ", department: "DC事業部", segment: "Enterprise", status: "active", owner: "鈴木 智子", projects: 2, mrr: 680000, lastActivity: "2025-09-27" },
  { id: "CUST-1004", name: "クライアントB", industry: "流通・小売", department: "管理事業部", segment: "SMB", status: "inactive", owner: "山田 樹", projects: 0, mrr: 0, lastActivity: "2025-08-30" },
];

const statusLabel: Record<CustomerStatus, string> = { prospect: "見込み", active: "取引中", inactive: "非取引" };
const statusColor: Record<CustomerStatus, "default" | "primary" | "success" | "warning"> = {
  prospect: "primary",
  active: "success",
  inactive: "warning",
};

const columns: GridColDef<CustomerRecord>[] = [
  { field: "id", headerName: "顧客ID", width: 140 },
  { field: "name", headerName: "顧客名", flex: 1.2, minWidth: 200 },
  { field: "industry", headerName: "業種", width: 120 },
  { field: "department", headerName: "部署", width: 140 },
  { field: "segment", headerName: "セグメント", width: 120 },
  {
    field: "status",
    headerName: "ステータス",
    width: 130,
    renderCell: (params: GridRenderCellParams<CustomerRecord, CustomerStatus>) => (
      <Chip size="small" label={statusLabel[params.value ?? "prospect"]} color={statusColor[params.value ?? "prospect"]} />
    ),
  },
  { field: "owner", headerName: "担当", width: 120 },
  { field: "projects", headerName: "案件数", width: 100, type: "number" },
  {
    field: "mrr",
    headerName: "月次売上 (MRR)",
    width: 160,
    type: "number",
    valueFormatter: (value: number | string | undefined) =>
      typeof value === "number"
        ? value.toLocaleString("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 })
        : value ?? "-",
  },
  { field: "lastActivity", headerName: "最終活動", width: 120 },
];

export default function CustomersPage() {
  const [text, setText] = React.useState("");
  const [status, setStatus] = React.useState<"all" | CustomerStatus>("all");
  const [industry, setIndustry] = React.useState<string>("all");
  const [dept, setDept] = React.useState<string>("all");

  const industryOptions = React.useMemo(() => {
    const set = new Set<string>();
    customers.forEach((c) => set.add(c.industry));
    return Array.from(set);
  }, []);

  const filtered = React.useMemo(() => {
    return customers.filter((c) => {
      const okText = text ? (c.name.includes(text) || c.id.includes(text)) : true;
      const okStatus = status === "all" ? true : c.status === status;
      const okIndustry = industry === "all" ? true : c.industry === industry;
      const okDept = dept === "all" ? true : c.department === dept;
      return okText && okStatus && okIndustry && okDept;
    });
  }, [text, status, industry, dept]);

  const summary = React.useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === "active").length;
    const prospect = customers.filter((c) => c.status === "prospect").length;
    const atRisk = customers.filter((c) => c.status === "inactive").length;
    return { total, active, prospect, atRisk };
  }, []);

  return (
    <ManagementLayout title="顧客管理">
      <Stack spacing={4}>
        {/* サマリーカード */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <GroupsIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">総顧客数</Typography>
                    <Typography variant="h5">{summary.total}社</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">取引中</Typography>
                <Typography variant="h5" color="success.main">{summary.active}社</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">見込み</Typography>
                <Typography variant="h5" color="primary.main">{summary.prospect}社</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">非取引</Typography>
                <Typography variant="h5" color="warning.main">{summary.atRisk}社</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* フィルタ＆アクション */}
        <Card variant="outlined">
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }} justifyContent="space-between">
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
                <TextField size="small" label="顧客名/ID 検索" value={text} onChange={(e) => setText(e.target.value)} sx={{ minWidth: 240 }} />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="status-select-label">ステータス</InputLabel>
                  <Select labelId="status-select-label" label="ステータス" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                    <MenuItem value="all">全て</MenuItem>
                    <MenuItem value="prospect">見込み</MenuItem>
                    <MenuItem value="active">取引中</MenuItem>
                    <MenuItem value="inactive">非取引</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="industry-select-label">業種</InputLabel>
                  <Select labelId="industry-select-label" label="業種" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                    <MenuItem value="all">全て</MenuItem>
                    {industryOptions.map((opt) => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="dept-select-label">部署</InputLabel>
                  <Select labelId="dept-select-label" label="部署" value={dept} onChange={(e) => setDept(e.target.value)}>
                    <MenuItem value="all">全て</MenuItem>
                    {Array.from(new Set(customers.map((c) => c.department))).map((opt) => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" startIcon={<CloudDownloadIcon />}>CSVをエクスポート</Button>
                <Button variant="contained" color="secondary" startIcon={<UploadFileIcon />}>新規顧客を追加</Button>
              </Stack>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ height: 500 }}>
              <DataGrid
                rows={filtered}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10]}
                initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </ManagementLayout>
  );
}
