"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import ManagementLayout from "../../components/layout/ManagementLayout";
import {
  AttendanceApprovalStatus,
  AttendanceMatchingStatus,
  AttendanceRecord,
} from "../../types/attendance";

const mockRecords: AttendanceRecord[] = [
  {
    id: "AR-2409-0001",
    projectId: "PJ-4589",
    projectName: "LULL販売管理刷新プロジェクト",
    employeeId: "EMP-1021",
    employeeName: "田中 太郎",
    department: "テックフラッグ事業部",
    workPeriod: "2025-09",
    totalWorkHours: 152,
    overtimeHours: 12,
    midnightHours: 0,
    holidayHours: 4,
    approvalStatus: "pending",
    matchingStatus: "unverified",
    billingUnitPrice: 6200,
    expectedBillingAmount: 941_600,
    reconciliationNotes: "申請中：顧客側承認待ち",
    evidenceFileName: "attendance_report_sep.pdf",
    uploadedAt: "2025-09-30T18:42:00+09:00",
    validationIssues: [
      {
        field: "totalWorkHours",
        severity: "warning",
        message: "36協定の残業上限目前です。確認してください。",
      },
    ],
  },
  {
    id: "AR-2409-0002",
    projectId: "PJ-4633",
    projectName: "クラウド請求高度化PJT",
    employeeId: "EMP-1088",
    employeeName: "佐藤 花子",
    department: "管理事業部",
    workPeriod: "2025-09",
    totalWorkHours: 160,
    overtimeHours: 20,
    midnightHours: 2,
    holidayHours: 0,
    approvalStatus: "approved",
    matchingStatus: "matched",
    billingUnitPrice: 6800,
    expectedBillingAmount: 1_088_000,
    reconciliationNotes: "フロントレビュー済み",
    evidenceFileName: "hanako_timesheet_sep.pdf",
    uploadedAt: "2025-09-28T09:12:00+09:00",
  },
  {
    id: "AR-2409-0003",
    projectId: "PJ-4710",
    projectName: "労務DX基盤構築",
    employeeId: "EMP-1112",
    employeeName: "高橋 健",
    department: "DC事業部",
    workPeriod: "2025-09",
    totalWorkHours: 140,
    overtimeHours: 4,
    midnightHours: 0,
    holidayHours: 0,
    approvalStatus: "rejected",
    matchingStatus: "mismatch",
    billingUnitPrice: 5900,
    expectedBillingAmount: 826_000,
    reconciliationNotes: "交通費未反映のため差戻し",
    validationIssues: [
      {
        field: "expectedBillingAmount",
        severity: "error",
        message: "計算結果が案件単価と一致しません。マスタを確認してください。",
      },
    ],
  },
];

const statusColorMap: Record<AttendanceMatchingStatus, "default" | "success" | "warning" | "error"> = {
  unverified: "warning",
  matched: "success",
  mismatch: "error",
};

const approvalLabelMap: Record<AttendanceApprovalStatus, string> = {
  draft: "下書き",
  pending: "承認待ち",
  approved: "承認済み",
  rejected: "差戻し",
};

const matchingLabelMap: Record<AttendanceMatchingStatus, string> = {
  unverified: "未照合",
  matched: "照合済み",
  mismatch: "不一致",
};

const columns: GridColDef<AttendanceRecord>[] = [
  { field: "projectId", headerName: "案件ID", width: 110, sortable: false },
  { field: "projectName", headerName: "案件名", flex: 1.2, minWidth: 220 },
  { field: "employeeName", headerName: "従業員", flex: 1, minWidth: 160 },
  {
    field: "workPeriod",
    headerName: "対象月",
    width: 120,
    type: "string",
    valueFormatter: (value: string) => (value ? `${value.replace("-", "年")}月` : "-"),
  },
  {
    field: "totalWorkHours",
    headerName: "総勤務時間(h)",
    type: "number",
    width: 150,
    editable: true,
    align: "right",
    headerAlign: "right",
    valueFormatter: (value: number | string | undefined) =>
      typeof value === "number" ? value.toFixed(1) : value ?? "-",
    preProcessEditCellProps: (params) => {
      const value = Number(params.props.value);
      const hasError = Number.isNaN(value) || value < 0 || value > 200;
      return { ...params.props, error: hasError };
    },
  },
  {
    field: "overtimeHours",
    headerName: "残業(h)",
    type: "number",
    width: 120,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "expectedBillingAmount",
    headerName: "想定請求額",
    type: "number",
    width: 160,
    align: "right",
    headerAlign: "right",
    valueFormatter: (value: number | string | undefined) =>
      typeof value === "number"
        ? value.toLocaleString("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 })
        : (value as string | undefined) ?? "",
    cellClassName: (params) =>
      params.row.validationIssues?.some((issue) => issue.field === "expectedBillingAmount")
        ? "cell-error"
        : "",
  },
  {
    field: "approvalStatus",
    headerName: "承認ステータス",
    width: 150,
    renderCell: (params: GridRenderCellParams<AttendanceRecord, AttendanceApprovalStatus>) => (
      <Chip
        size="small"
        label={approvalLabelMap[params.value ?? "pending"]}
        color={params.value === "approved" ? "success" : params.value === "rejected" ? "error" : "default"}
        variant={params.value === "approved" || params.value === "rejected" ? "filled" : "outlined"}
      />
    ),
  },
  {
    field: "matchingStatus",
    headerName: "照合ステータス",
    width: 150,
    renderCell: (params: GridRenderCellParams<AttendanceRecord, AttendanceMatchingStatus>) => (
      <Chip size="small" label={matchingLabelMap[params.value ?? "unverified"]} color={statusColorMap[params.value ?? "unverified"]} />
    ),
  },
  {
    field: "reconciliationNotes",
    headerName: "特記事項",
    flex: 1,
    minWidth: 220,
  },
];

const gridSx = {
  "& .cell-error": {
    color: (theme: Theme) => (theme.palette.error.contrastText ?? theme.palette.error.main),
    fontWeight: 600,
  },
  "& .MuiDataGrid-row": {
    transition: "background-color 0.2s ease",
  },
  "& .MuiDataGrid-row.Mui-hovered": {
    backgroundColor: (theme: Theme) => alpha(theme.palette.secondary.main, 0.06),
  },
};

function AttendanceContent() {
  const searchParams = useSearchParams();
  const approvalParam = searchParams.get("approval");
  const approvals = approvalParam
    ? (approvalParam.split(",").filter(Boolean) as AttendanceApprovalStatus[])
    : undefined;
  const rows = approvals && approvals.length > 0 ? mockRecords.filter((r) => approvals.includes(r.approvalStatus)) : mockRecords;
  return (
    <Stack spacing={4}>
      <Box></Box>

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={3} alignItems="center">
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
                PDF勤務表をドラッグ＆ドロップ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                PDF形式の勤務管理表原本をアップロードしてください。複数ファイルの一括登録に対応予定です。
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<UploadFileIcon />}
                sx={{ mt: 3 }}
                component="label"
              >
                ファイルを選択
                <input hidden accept="application/pdf" multiple type="file" />
              </Button>
            </Box>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Alert icon={<InfoOutlinedIcon fontSize="small" />} severity="info" sx={{ flex: 1, mr: 2 }}>
            処理中のファイルは自動でOCR解析され、照合ステータスに反映されます。
          </Alert>
          <Button variant="outlined" color="secondary" component={Link} href="/uploads">
            直近のアップロード履歴を見る
          </Button>
        </CardActions>
      </Card>

      <Stack spacing={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" component="h2" color="text.primary">
            勤務実績データ
          </Typography>
          <Button variant="contained" color="primary">
            新規レコードを追加
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          編集後は自動的にドラフト保存されます。照合結果が不一致の場合はアラート表示で案内します。
        </Typography>
        <Box sx={{ height: 480, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
          <DataGrid<AttendanceRecord>
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            checkboxSelection
            pageSizeOptions={[5, 10]}
            initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
            sx={gridSx}
          />
        </Box>
      </Stack>
    </Stack>
  );
}

export default function AttendancePage() {
  return (
    <ManagementLayout title="勤務情報登録 / アップロード">
      <Suspense fallback={<Typography variant="body2">loading...</Typography>}>
        <AttendanceContent />
      </Suspense>
    </ManagementLayout>
  );
}
