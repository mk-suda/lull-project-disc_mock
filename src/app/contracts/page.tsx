"use client";

import Link from "next/link";
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
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

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

export default function ContractsPage() {
  return (
    <ManagementLayout title="契約台帳">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            契約台帳 / 管理
          </Typography>
          <Typography variant="body1" color="text.secondary">
            クライアント契約の最新状況と更新期限を確認し、リスクのある案件へのフォローを促します。
          </Typography>
        </Box>

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
                <Typography variant="h6">契約一覧</Typography>
                <Typography variant="body2" color="text.secondary">
                  契約状況に応じて絞り込み・エクスポートが可能です。
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" color="primary" startIcon={<PictureAsPdfIcon />} component={Link} href="#">
                  契約書を出力
                </Button>
                <Button variant="contained" color="secondary" startIcon={<AddCircleOutlineIcon />}>
                  契約を新規登録
                </Button>
              </Stack>
            </Stack>
            <Box sx={{ height: 480 }}>
              <DataGrid<ContractRecord>
                rows={contractRows}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10]}
                initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                sx={{
                  "& .MuiDataGrid-columnHeaders": { fontWeight: 600 },
                  "& .MuiDataGrid-row.Mui-selected": { backgroundColor: "rgba(0, 169, 224, 0.08)" },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </ManagementLayout>
  );
}
