"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ManagementLayout from "../../components/layout/ManagementLayout";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DescriptionIcon from "@mui/icons-material/Description";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { alpha, type Theme } from "@mui/material/styles";
 
 

interface BillingRecord {
  id: string;
  projectName: string;
  clientName: string;
  billingPeriod: string;
  amount: number;
  approvalStatus: "draft" | "pending" | "issued" | "sent" | "paid";
  paymentDueDate: string;
  paymentStatus: "unpaid" | "paid" | "overdue";
  lastAction: string;
  invoiceFileName?: string;
}

const billingRows: BillingRecord[] = [
  {
    id: "BL-2409-0012",
    projectName: "LULLデジタル戦略推進支援",
    clientName: "株式会社アバンス",
    billingPeriod: "2024年9月",
    amount: 2800000,
    approvalStatus: "pending",
    paymentDueDate: "2024-10-31",
    paymentStatus: "unpaid",
    lastAction: "経理承認待ち",
    invoiceFileName: "bl-2409-0012_invoice.pdf",
  },
  {
    id: "BL-2409-0014",
    projectName: "BPO運用最適化支援",
    clientName: "株式会社ユナイト",
    billingPeriod: "2024年9月",
    amount: 2100000,
    approvalStatus: "issued",
    paymentDueDate: "2024-10-28",
    paymentStatus: "unpaid",
    lastAction: "請求書発行済み",
    invoiceFileName: "bl-2409-0014_invoice.pdf",
  },
  {
    id: "BL-2409-0016",
    projectName: "業務システム刷新プロジェクト",
    clientName: "クライアントA",
    billingPeriod: "2024年9月",
    amount: 3500000,
    approvalStatus: "draft",
    paymentDueDate: "2024-11-05",
    paymentStatus: "unpaid",
    lastAction: "勤怠データ突合中",
    invoiceFileName: "pj4633_invoice.xlsx",
  },
  {
    id: "BL-2408-0009",
    projectName: "ナレッジマネジメント導入",
    clientName: "クライアントB",
    billingPeriod: "2024年8月",
    amount: 1800000,
    approvalStatus: "sent",
    paymentDueDate: "2024-09-30",
    paymentStatus: "overdue",
    lastAction: "入金遅延の連絡済み",
    invoiceFileName: "bl-2408-0009_invoice.pdf",
  },
];

const formatter = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", minimumFractionDigits: 0 });

const approvalLabelMap: Record<BillingRecord["approvalStatus"], string> = {
  draft: "ドラフト",
  pending: "承認待ち",
  issued: "発行済み",
  sent: "送付済み",
  paid: "入金済み",
};

const approvalColorMap: Record<BillingRecord["approvalStatus"], "default" | "warning" | "primary" | "success"> = {
  draft: "default",
  pending: "warning",
  issued: "primary",
  sent: "primary",
  paid: "success",
};

const paymentLabelMap: Record<BillingRecord["paymentStatus"], string> = {
  unpaid: "未入金",
  paid: "入金済み",
  overdue: "入金遅延",
};

const paymentColorMap: Record<BillingRecord["paymentStatus"], "default" | "success" | "error"> = {
  unpaid: "default",
  paid: "success",
  overdue: "error",
};

const columns: GridColDef<BillingRecord>[] = [
  { field: "id", headerName: "請求ID", width: 130 },
  { field: "clientName", headerName: "クライアント", flex: 1, minWidth: 160 },
  { field: "projectName", headerName: "案件名", flex: 1.2, minWidth: 220 },
  { field: "billingPeriod", headerName: "請求対象期間", width: 150 },
  {
    field: "amount",
    headerName: "請求金額",
    width: 150,
    type: "number",
    valueFormatter: (value: number | null | undefined) =>
      typeof value === "number" ? formatter.format(value) : "-",
  },
  {
    field: "approvalStatus",
    headerName: "ワークフロー",
    width: 140,
    renderCell: (params: GridRenderCellParams<BillingRecord, BillingRecord["approvalStatus"]>) => (
      <Chip
        size="small"
        label={approvalLabelMap[params.value ?? "draft"]}
        color={approvalColorMap[params.value ?? "draft"]}
        variant={params.value === "draft" ? "outlined" : "filled"}
      />
    ),
  },
  {
    field: "paymentStatus",
    headerName: "入金ステータス",
    width: 150,
    renderCell: (params: GridRenderCellParams<BillingRecord, BillingRecord["paymentStatus"]>) => (
      <Chip
        size="small"
        label={paymentLabelMap[params.value ?? "unpaid"]}
        color={paymentColorMap[params.value ?? "unpaid"]}
        variant={params.value === "unpaid" ? "outlined" : "filled"}
      />
    ),
  },
  { field: "paymentDueDate", headerName: "支払予定日", width: 140 },
  { field: "lastAction", headerName: "最終アクション", flex: 1, minWidth: 200 },
  {
    field: "invoice",
    headerName: "請求書",
    width: 120,
    sortable: false,
    renderCell: (params: GridRenderCellParams<BillingRecord, string | undefined>) => {
      const file = params.row.invoiceFileName;
      return (
        <Button
          size="small"
          variant="outlined"
          startIcon={<DescriptionIcon />}
          component={Link}
          href={file ? `/uploads?file=${encodeURIComponent(file)}` : "/uploads"}
          disabled={!file}
        >
          表示
        </Button>
      );
    },
  },
];

const summary = [
  {
    title: "今月請求予定額",
    value: "9,400,000",
    unit: "円",
    detail: "ドラフト含む 4件",
  },
  {
    title: "承認待ち",
    value: "3件",
    unit: "",
    detail: "経理承認 2件 / 営業承認 1件",
  },
  {
    title: "入金遅延",
    value: "1件",
    unit: "",
    detail: "フォロー期限 2日後",
  },
];

function BillingContent() {
  const searchParams = useSearchParams();
  const approvalParam = searchParams.get("approval");
  const approvals = approvalParam
    ? (approvalParam.split(",").filter(Boolean) as BillingRecord["approvalStatus"][])
    : undefined;
  const rows = approvals && approvals.length > 0 ? billingRows.filter((r) => approvals.includes(r.approvalStatus)) : billingRows;
  return (
      <Stack spacing={4}>
        <Box></Box>

        {/* 請求書アップロード + 請求情報入力 */}
        <Card variant="outlined">
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="stretch">
              {/* アップロードエリア */}
              <Box
                sx={{
                  flex: 1,
                  border: "1px dashed",
                  borderColor: "secondary.main",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  backgroundColor: (theme: Theme) => alpha(theme.palette.secondary.main, 0.04),
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 48, color: "secondary.main", mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  請求書をドラッグ＆ドロップ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PDF / Excel / CSV などの請求関連書類をアップロードしてください。
                </Typography>
                <Button variant="contained" color="secondary" startIcon={<UploadFileIcon />} sx={{ mt: 3 }} component="label">
                  ファイルを選択
                  <input hidden accept=".pdf,.xlsx,.xls,.csv" multiple type="file" />
                </Button>
              </Box>

              {/* 請求情報入力フォーム */}
              <Box sx={{ flex: 1, minWidth: 300 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  収益算出に必要な請求情報を入力してください
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField label="クライアント名" size="small" sx={{ minWidth: 240 }} />
                  <TextField label="案件名" size="small" sx={{ minWidth: 240 }} />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                  <TextField label="請求期間" type="month" size="small" sx={{ minWidth: 180 }} InputLabelProps={{ shrink: true }} />
                  <TextField label="請求金額 (円)" type="number" size="small" sx={{ minWidth: 200 }} inputProps={{ min: 0, step: 1000 }} />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="approval-status-select">承認ステータス</InputLabel>
                    <Select labelId="approval-status-select" label="承認ステータス" defaultValue="draft">
                      <MenuItem value="draft">ドラフト</MenuItem>
                      <MenuItem value="pending">承認待ち</MenuItem>
                      <MenuItem value="issued">発行済み</MenuItem>
                      <MenuItem value="sent">送付済み</MenuItem>
                      <MenuItem value="paid">入金済み</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="payment-status-select">入金ステータス</InputLabel>
                    <Select labelId="payment-status-select" label="入金ステータス" defaultValue="unpaid">
                      <MenuItem value="unpaid">未入金</MenuItem>
                      <MenuItem value="paid">入金済み</MenuItem>
                      <MenuItem value="overdue">入金遅延</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                  <TextField label="支払予定日" type="date" size="small" sx={{ minWidth: 180 }} InputLabelProps={{ shrink: true }} />
                </Stack>
                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />}>
                    新規登録
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {summary.map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.title}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.title}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {item.value}
                    {item.unit && (
                      <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 0.5 }}>
                        {item.unit}
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {item.detail}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Alert severity="warning" icon={<ReceiptLongIcon />} sx={{ borderRadius: 2 }}>
          <Typography variant="body2">
            入金遅延中の案件があります。クライアントとの入金予定確認と経理部への共有をお願いします。
          </Typography>
        </Alert>

        <Card variant="outlined">
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "stretch", md: "center" }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6" color="text.primary">請求案件一覧</Typography>
                <Typography variant="body2" color="text.secondary">
                  承認・送付状況を確認し、CSVやPDFとして出力できます。
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" startIcon={<CloudDownloadIcon />} component={Link} href="#">
                  CSVをエクスポート
                </Button>
              </Stack>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 480 }}>
              <DataGrid<BillingRecord>
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10]}
                initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                sx={(theme) => ({
                  "& .MuiDataGrid-columnHeaders": { fontWeight: 600 },
                  "& .MuiDataGrid-row.Mui-hovered": { backgroundColor: `rgba(${parseInt(theme.palette.secondary.main.slice(1,3),16)}, ${parseInt(theme.palette.secondary.main.slice(3,5),16)}, ${parseInt(theme.palette.secondary.main.slice(5,7),16)}, 0.06)` },
                })}
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>
  );
}

export default function BillingPage() {
  return (
    <ManagementLayout title="請求管理">
      <Suspense fallback={<Typography variant="body2">loading...</Typography>}>
        <BillingContent />
      </Suspense>
    </ManagementLayout>
  );
}
