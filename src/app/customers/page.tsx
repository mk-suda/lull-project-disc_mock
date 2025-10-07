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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import GroupsIcon from "@mui/icons-material/Groups";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import type { SelectChangeEvent } from "@mui/material/Select";

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

const initialCustomers: CustomerRecord[] = [
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
  const [data, setData] = React.useState<CustomerRecord[]>(initialCustomers);
  const [text, setText] = React.useState("");
  const [status, setStatus] = React.useState<"all" | CustomerStatus>("all");
  const [industry, setIndustry] = React.useState<string>("all");
  const [dept, setDept] = React.useState<string>("all");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newCustomer, setNewCustomer] = React.useState<Pick<CustomerRecord, "name" | "industry" | "department" | "segment" | "status" | "owner" | "projects" | "mrr" | "lastActivity">>({
    name: "",
    industry: "",
    department: "",
    segment: "SMB",
    status: "prospect",
    owner: "",
    projects: 0,
    mrr: 0,
    lastActivity: new Date().toISOString().slice(0, 10),
  });

  const industryOptions = React.useMemo(() => {
    const set = new Set<string>();
    data.forEach((c) => set.add(c.industry));
    return Array.from(set);
  }, [data]);

  const filtered = React.useMemo(() => {
    return data.filter((c) => {
      const okText = text ? (c.name.includes(text) || c.id.includes(text)) : true;
      const okStatus = status === "all" ? true : c.status === status;
      const okIndustry = industry === "all" ? true : c.industry === industry;
      const okDept = dept === "all" ? true : c.department === dept;
      return okText && okStatus && okIndustry && okDept;
    });
  }, [data, text, status, industry, dept]);

  const summary = React.useMemo(() => {
    const total = data.length;
    const active = data.filter((c) => c.status === "active").length;
    const prospect = data.filter((c) => c.status === "prospect").length;
    const atRisk = data.filter((c) => c.status === "inactive").length;
    return { total, active, prospect, atRisk };
  }, [data]);

  const nextId = React.useMemo(() => {
    const max = data.reduce((m, c) => {
      const n = parseInt(c.id.replace(/\D/g, ""), 10);
      return Number.isFinite(n) ? Math.max(m, n) : m;
    }, 0);
    return `CUST-${String(max + 1).padStart(4, "0")}`;
  }, [data]);

  const handleCreate = () => {
    const rec: CustomerRecord = {
      id: nextId,
      name: newCustomer.name.trim() || "未命名顧客",
      industry: newCustomer.industry.trim() || "未設定",
      department: newCustomer.department.trim() || "未設定",
      segment: newCustomer.segment,
      status: newCustomer.status,
      owner: newCustomer.owner.trim() || "未割当",
      projects: Number(newCustomer.projects) || 0,
      mrr: Number(newCustomer.mrr) || 0,
      lastActivity: newCustomer.lastActivity,
    };
    setData((prev) => [...prev, rec]);
    setDialogOpen(false);
    setNewCustomer({
      name: "",
      industry: "",
      department: "",
      segment: "SMB",
      status: "prospect",
      owner: "",
      projects: 0,
      mrr: 0,
      lastActivity: new Date().toISOString().slice(0, 10),
    });
  };

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
                  <Select labelId="status-select-label" label="ステータス" value={status} onChange={(e: SelectChangeEvent) => setStatus(e.target.value as ("all" | CustomerStatus))}>
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
                    {Array.from(new Set(data.map((c) => c.department))).map((opt) => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" startIcon={<CloudDownloadIcon />}>CSVをエクスポート</Button>
                <Button variant="contained" color="secondary" startIcon={<UploadFileIcon />} onClick={() => setDialogOpen(true)}>新規顧客を追加</Button>
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

        {/* 新規顧客 追加モーダル */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>新規顧客を追加</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="顧客名" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} fullWidth size="small" />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="業種" value={newCustomer.industry} onChange={(e) => setNewCustomer({ ...newCustomer, industry: e.target.value })} size="small" sx={{ minWidth: 200 }} />
                <TextField label="部署" value={newCustomer.department} onChange={(e) => setNewCustomer({ ...newCustomer, department: e.target.value })} size="small" sx={{ minWidth: 200 }} />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="segment-new-label">セグメント</InputLabel>
                  <Select
                    labelId="segment-new-label"
                    label="セグメント"
                    value={newCustomer.segment}
                    onChange={(e: SelectChangeEvent) => setNewCustomer({ ...newCustomer, segment: e.target.value as CustomerRecord["segment"] })}
                  >
                    <MenuItem value="Enterprise">Enterprise</MenuItem>
                    <MenuItem value="Mid">Mid</MenuItem>
                    <MenuItem value="SMB">SMB</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="status-new-label">ステータス</InputLabel>
                  <Select
                    labelId="status-new-label"
                    label="ステータス"
                    value={newCustomer.status}
                    onChange={(e: SelectChangeEvent) => setNewCustomer({ ...newCustomer, status: e.target.value as CustomerStatus })}
                  >
                    <MenuItem value="prospect">見込み</MenuItem>
                    <MenuItem value="active">取引中</MenuItem>
                    <MenuItem value="inactive">非取引</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="担当者" value={newCustomer.owner} onChange={(e) => setNewCustomer({ ...newCustomer, owner: e.target.value })} size="small" sx={{ minWidth: 200 }} />
                <TextField label="案件数" type="number" value={newCustomer.projects} onChange={(e) => setNewCustomer({ ...newCustomer, projects: Number(e.target.value) })} size="small" sx={{ minWidth: 140 }} inputProps={{ min: 0 }} />
                <TextField label="月次売上 (MRR)" type="number" value={newCustomer.mrr} onChange={(e) => setNewCustomer({ ...newCustomer, mrr: Number(e.target.value) })} size="small" sx={{ minWidth: 180 }} inputProps={{ min: 0, step: 1000 }} />
              </Stack>
              <TextField label="最終活動日" type="date" value={newCustomer.lastActivity} onChange={(e) => setNewCustomer({ ...newCustomer, lastActivity: e.target.value })} size="small" InputLabelProps={{ shrink: true }} sx={{ minWidth: 200 }} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>キャンセル</Button>
            <Button variant="contained" onClick={handleCreate}>登録</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </ManagementLayout>
  );
}
