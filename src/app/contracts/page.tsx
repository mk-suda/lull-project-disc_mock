"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ManagementLayout from "../../components/layout/ManagementLayout";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { alpha, type Theme } from "@mui/material/styles";
 

interface ContractRecord {
  id: string;
  clientName: string;
  projectName: string;
  contractType: "準委任" | "常駐" | "受託";
  startDate: string;
  endDate: string;
  monthlyAmount: number;
  status: "active" | "expiring" | "draft";
  manager: string;
  contractFileName?: string;
}

const contractRows: ContractRecord[] = [
  {
    id: "CT-2404-0001",
    clientName: "株式会社アバンス",
    projectName: "LULLデジタル戦略推進支援",
    contractType: "準委任",
    startDate: "2024-04-01",
    endDate: "2025-03-31",
    monthlyAmount: 2800000,
    status: "active",
    manager: "田中 遥",
    contractFileName: "ct-2404-0001_contract.pdf",
  },
  {
    id: "CT-2407-0003",
    clientName: "クライアントA",
    projectName: "業務システム刷新プロジェクト",
    contractType: "受託",
    startDate: "2024-07-01",
    endDate: "2025-06-30",
    monthlyAmount: 3500000,
    status: "expiring",
    manager: "佐藤 健",
    contractFileName: "ct-2407-0003_contract.pdf",
  },
  {
    id: "CT-2409-0006",
    clientName: "株式会社ユナイト",
    projectName: "BPO運用最適化支援",
    contractType: "準委任",
    startDate: "2024-09-01",
    endDate: "2025-08-31",
    monthlyAmount: 2100000,
    status: "active",
    manager: "鈴木 智子",
    contractFileName: "ct-2409-0006_contract.pdf",
  },
  {
    id: "CT-2409-0008",
    clientName: "クライアントB",
    projectName: "ナレッジマネジメント導入",
    contractType: "常駐",
    startDate: "2024-10-01",
    endDate: "2025-09-30",
    monthlyAmount: 1800000,
    status: "draft",
    manager: "山田 樹",
    contractFileName: "ct-2409-0008_contract.docx",
  },
];

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  minimumFractionDigits: 0,
});

const statusLabelMap: Record<ContractRecord["status"], string> = {
  active: "稼働中",
  expiring: "更新期限接近",
  draft: "ドラフト",
};

const statusColorMap: Record<ContractRecord["status"], "default" | "success" | "warning"> = {
  active: "success",
  expiring: "warning",
  draft: "default",
};

const columns: GridColDef<ContractRecord>[] = [
  { field: "id", headerName: "契約ID", width: 130 },
  { field: "clientName", headerName: "クライアント", flex: 1, minWidth: 160 },
  { field: "projectName", headerName: "案件名", flex: 1.2, minWidth: 220 },
  { field: "contractType", headerName: "契約種別", width: 120 },
  { field: "startDate", headerName: "開始日", width: 120 },
  { field: "endDate", headerName: "終了日", width: 120 },
  {
    field: "monthlyAmount",
    headerName: "月額 (税抜)",
    width: 150,
    type: "number",
    valueFormatter: (value: number | null | undefined) =>
      typeof value === "number" ? currencyFormatter.format(value) : "-",
  },
  {
    field: "status",
    headerName: "ステータス",
    width: 150,
    renderCell: (params: GridRenderCellParams<ContractRecord, ContractRecord["status"]>) => (
      <Chip
        size="small"
        label={statusLabelMap[params.value ?? "active"]}
        color={statusColorMap[params.value ?? "active"]}
        variant={params.value === "draft" ? "outlined" : "filled"}
      />
    ),
  },
  {
    field: "document",
    headerName: "契約書",
    width: 120,
    sortable: false,
    renderCell: (params: GridRenderCellParams<ContractRecord, string | undefined>) => {
      const file = params.row.contractFileName;
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
  { field: "manager", headerName: "営業担当", width: 130 },
];

const summaryCards = [
  {
    title: "稼働中の契約",
    value: "26件",
    subText: "総契約金額 5,880万円",
  },
  {
    title: "今月更新対象",
    value: "3件",
    subText: "更新打診中 2件 / 未着手 1件",
  },
  {
    title: "ドラフト契約",
    value: "4件",
    subText: "法務レビュー待ち 1件",
  },
];

function ContractsContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const plannedParam = searchParams.get("planned");
  const statuses = statusParam ? (statusParam.split(",").filter(Boolean) as ContractRecord["status"][]) : undefined;
  const baseRows = statuses && statuses.length > 0 ? contractRows.filter((r) => statuses.includes(r.status)) : contractRows;

  const today = new Date();
  const parseDate = (s: string) => new Date(s);
  const isActiveNow = (r: ContractRecord) => parseDate(r.startDate) <= today && today <= parseDate(r.endDate);
  const isFutureStart = (r: ContractRecord) => parseDate(r.startDate) > today;

  const rows = plannedParam === "future"
    ? baseRows.filter((r) => {
        if (r.status === "draft") return isFutureStart(r);
        if (r.status === "active" || r.status === "expiring") return isActiveNow(r);
        return true;
      })
    : baseRows;
  return (
      <Stack spacing={4}>
        <Box></Box>

        {/* 契約情報入力 */}
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
                  契約書をドラッグ＆ドロップ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PDF / Excel / CSV などの契約関連書類をアップロードしてください。
                </Typography>
                <Button variant="contained" color="secondary" startIcon={<UploadFileIcon />} sx={{ mt: 3 }} component="label">
                  ファイルを選択
                  <input hidden accept=".pdf,.xlsx,.xls,.csv" multiple type="file" />
                </Button>
              </Box>

              {/* 契約情報入力フォーム */}
              <Box sx={{ flex: 1, minWidth: 300 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  収益算出に必要な契約情報を入力してください
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField label="クライアント" size="small" sx={{ minWidth: 240 }} />
                  <TextField label="案件名" size="small" sx={{ minWidth: 240 }} />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="contract-type-select">契約種別</InputLabel>
                    <Select labelId="contract-type-select" label="契約種別" defaultValue="準委任">
                      <MenuItem value="準委任">準委任</MenuItem>
                      <MenuItem value="常駐">常駐</MenuItem>
                      <MenuItem value="受託">受託</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="billing-cycle-select">課金サイクル</InputLabel>
                    <Select labelId="billing-cycle-select" label="課金サイクル" defaultValue="月次">
                      <MenuItem value="月次">月次</MenuItem>
                      <MenuItem value="成果">成果</MenuItem>
                      <MenuItem value="一括">一括</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                  <TextField label="月額 (税抜)" type="number" size="small" sx={{ minWidth: 200 }} inputProps={{ min: 0, step: 1000 }} />
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="payment-terms-select">支払条件</InputLabel>
                    <Select labelId="payment-terms-select" label="支払条件" defaultValue="末締翌月末">
                      <MenuItem value="末締翌月末">末締翌月末</MenuItem>
                      <MenuItem value="末締翌々月末">末締翌々月末</MenuItem>
                      <MenuItem value="検収後30日">検収後30日</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                  <TextField label="契約開始日" type="date" size="small" sx={{ minWidth: 180 }} InputLabelProps={{ shrink: true }} />
                  <TextField label="契約終了日" type="date" size="small" sx={{ minWidth: 180 }} InputLabelProps={{ shrink: true }} />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                  <TextField label="営業担当" size="small" sx={{ minWidth: 200 }} />
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
          {summaryCards.map((card) => (
            <Grid size={{ xs: 12, md: 4 }} key={card.title}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {card.subText}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card variant="outlined">
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6" color="text.primary">契約一覧</Typography>
                <Typography variant="body2" color="text.secondary">
                  契約状況に応じて絞り込み・エクスポートが可能です。
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" color="primary" startIcon={<PictureAsPdfIcon />} component={Link} href="#">
                  契約書を出力
                </Button>
              </Stack>
            </Stack>
            <Box sx={{ height: 480 }}>
              <DataGrid<ContractRecord>
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10]}
                initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                sx={(theme) => ({
                  "& .MuiDataGrid-columnHeaders": { fontWeight: 600 },
                  "& .MuiDataGrid-row.Mui-selected": {
                    backgroundColor: `rgba(${parseInt(theme.palette.secondary.main.slice(1,3),16)}, ${parseInt(theme.palette.secondary.main.slice(3,5),16)}, ${parseInt(theme.palette.secondary.main.slice(5,7),16)}, 0.08)`,
                  },
                })}
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>
  );
}

export default function ContractsPage() {
  return (
    <ManagementLayout title="契約台帳">
      <Suspense fallback={<Typography variant="body2">loading...</Typography>}>
        <ContractsContent />
      </Suspense>
    </ManagementLayout>
  );
}
