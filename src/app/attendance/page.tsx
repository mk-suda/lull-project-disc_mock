"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tabs,
  Tab,
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

type AlertType = "absent" | "work_error" | "pto_pending" | "ot_pending";
interface AlertItem {
  id: string;
  type: AlertType;
  name: string;
  department: string;
  date: string;
  detail?: string;
}

const alertItems: AlertItem[] = [
  { id: "AL-1", type: "absent", name: "山田 太郎", department: "テックフラッグ事業部", date: "2025-09-15" },
  { id: "AL-2", type: "absent", name: "佐藤 花子", department: "管理事業部", date: "2025-09-16" },
  { id: "AL-3", type: "work_error", name: "高橋 健", department: "DC事業部", date: "2025-09-10", detail: "打刻重複" },
  { id: "AL-4", type: "pto_pending", name: "山田 太郎", department: "テックフラッグ事業部", date: "2025-09-20", detail: "有給: 終日" },
  { id: "AL-5", type: "ot_pending", name: "佐藤 花子", department: "管理事業部", date: "2025-09-18", detail: "残業: +2.0h" },
];

const alertMeta: Record<AlertType, { label: string; color: "primary" | "secondary" | "warning" | "error"; icon: React.ElementType; status: string }> = {
  absent: { label: "未出勤", color: "warning", icon: WarningAmberIcon, status: "要確認" },
  work_error: { label: "勤務登録エラー", color: "error", icon: ErrorOutlineIcon, status: "差戻し" },
  pto_pending: { label: "有給申請 未承認", color: "primary", icon: WatchLaterIcon, status: "承認待ち" },
  ot_pending: { label: "残業申請 未承認", color: "secondary", icon: WatchLaterIcon, status: "承認待ち" },
};

type RequestStatus = "pending" | "approved" | "rejected";
interface PTORequest { id: string; name: string; department: string; date: string; kind: "終日" | "午前" | "午後"; status: RequestStatus }
interface OTRequest { id: string; name: string; department: string; date: string; hours: number; reason?: string; status: RequestStatus }

const ptoRequests: PTORequest[] = [
  { id: "PTO-1", name: "山田 太郎", department: "テックフラッグ事業部", date: "2025-09-20", kind: "終日", status: "pending" },
  { id: "PTO-2", name: "佐藤 花子", department: "管理事業部", date: "2025-09-22", kind: "午後", status: "approved" },
];

const otRequests: OTRequest[] = [
  { id: "OT-1", name: "佐藤 花子", department: "管理事業部", date: "2025-09-18", hours: 2.0, reason: "月次対応", status: "pending" },
  { id: "OT-2", name: "高橋 健", department: "DC事業部", date: "2025-09-12", hours: 1.5, status: "approved" },
];

export default function AttendancePage() {
  const searchParams = useSearchParams();
  const approvalParam = searchParams.get("approval");
  const approvals = approvalParam
    ? (approvalParam.split(",").filter(Boolean) as AttendanceApprovalStatus[])
    : undefined;
  const rows = approvals && approvals.length > 0 ? mockRecords.filter((r) => approvals.includes(r.approvalStatus)) : mockRecords;
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const [projectFilter, setProjectFilter] = React.useState<string>("all");
  const [alertTypeFilter, setAlertTypeFilter] = React.useState<"all" | "absent" | "work_error">("all");
  const projectOptions = React.useMemo(() => {
    const set = new Map<string, string>();
    rows.forEach((r) => set.set(r.projectId, r.projectName));
    return Array.from(set.entries());
  }, [rows]);
  const currentMonth = React.useMemo(() => (rows[0]?.workPeriod ?? new Date().toISOString().slice(0, 7)), [rows]);
  const namesInScope = React.useMemo(() => new Set(rows.map((r) => r.employeeName)), [rows]);
  const alertInScope = React.useMemo(
    () =>
      alertItems.filter(
        (a) => a.date.startsWith(currentMonth) && namesInScope.has(a.name)
      ),
    [currentMonth, namesInScope]
  );

  const filteredRows = React.useMemo(() => {
    let base = rows.filter((r) => (projectFilter === "all" ? true : r.projectId === projectFilter));
    if (alertTypeFilter !== "all") {
      const names = new Set(alertInScope.filter((a) => a.type === alertTypeFilter).map((a) => a.name));
      base = base.filter((r) => names.has(r.employeeName));
    }
    return base;
  }, [rows, projectFilter, alertTypeFilter, alertInScope]);

  const countByType = React.useMemo(() => {
    const map: Record<AlertType, number> = { absent: 0, work_error: 0, pto_pending: 0, ot_pending: 0 };
    for (const a of alertInScope) map[a.type] += 1;
    return map;
  }, [alertInScope]);

  const [ptoStatusFilter, setPtoStatusFilter] = React.useState<RequestStatus[]>([]);
  const [otStatusFilter, setOtStatusFilter] = React.useState<RequestStatus[]>([]);
  const ptoFiltered = React.useMemo(() =>
    ptoRequests.filter((r) => r.date.startsWith(currentMonth) && (ptoStatusFilter.length ? ptoStatusFilter.includes(r.status) : true)),
    [currentMonth, ptoStatusFilter]
  );
  const otFiltered = React.useMemo(() =>
    otRequests.filter((r) => r.date.startsWith(currentMonth) && (otStatusFilter.length ? otStatusFilter.includes(r.status) : true)),
    [currentMonth, otStatusFilter]
  );
  return (
    <ManagementLayout title="勤務情報登録">
      <Stack spacing={4}>
        <Box></Box>

        <Card variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
              {/* サマリー4件 */}
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {(["absent","work_error","pto_pending","ot_pending"] as AlertType[]).map((t) => {
                  const meta = alertMeta[t];
                  return (
                    <Chip
                      key={t}
                      icon={React.createElement(meta.icon, { fontSize: 'small' })}
                      label={`${meta.label} ${countByType[t]}件`}
                      color={meta.color}
                      onClick={() => {
                        if (t === 'absent' || t === 'work_error') {
                          setActiveTab(0);
                          setAlertTypeFilter(t);
                        } else if (t === 'pto_pending') {
                          setActiveTab(1);
                          setPtoStatusFilter(['pending']);
                        } else {
                          setActiveTab(2);
                          setOtStatusFilter(['pending']);
                        }
                      }}
                      clickable
                      variant="filled"
                      sx={{ mr: 0.5 }}
                    />
                  );
                })}
              </Stack>
            </Stack>
          </CardContent>
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
          {/* タブ */}
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} aria-label="勤怠メニュー">
            <Tab label="勤務実績" />
            <Tab label="有給申請一覧" />
            <Tab label="残業申請一覧" />
          </Tabs>

          {/* タブ: 勤務実績 */}
          {activeTab === 0 && (
            <>
              <Box display="flex" gap={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel id="project-filter-label">案件で絞り込み</InputLabel>
                  <Select
                    labelId="project-filter-label"
                    label="案件で絞り込み"
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                  >
                    <MenuItem value="all">すべての案件</MenuItem>
                    {projectOptions.map(([id, name]) => (
                      <MenuItem key={id} value={id}>{`${id} / ${name}`}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel id="alert-type-filter-label">種別で絞り込み</InputLabel>
                  <Select
                    labelId="alert-type-filter-label"
                    label="種別で絞り込み"
                    value={alertTypeFilter}
                    onChange={(e) => setAlertTypeFilter(e.target.value as any)}
                  >
                    <MenuItem value="all">すべて</MenuItem>
                    <MenuItem value="absent">未出勤</MenuItem>
                    <MenuItem value="work_error">勤務登録エラー</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Typography variant="body2" color="text.secondary">
                編集後は自動的にドラフト保存されます。照合結果が不一致の場合はアラート表示で案内します。
              </Typography>
              <Box sx={{ height: 480, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
                <DataGrid<AttendanceRecord>
                  rows={filteredRows}
                  columns={columns}
                  disableRowSelectionOnClick
                  checkboxSelection
                  pageSizeOptions={[5, 10]}
                  initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                  sx={gridSx}
                />
              </Box>
            </>
          )}

          {/* タブ: 有給申請一覧 */}
          {activeTab === 1 && (
            <>
              <FormControl size="small" sx={{ minWidth: 280 }}>
                <InputLabel id="pto-status-filter">ステータス（複数選択可）</InputLabel>
                <Select
                  labelId="pto-status-filter"
                  label="ステータス（複数選択可）"
                  multiple
                  value={ptoStatusFilter}
                  onChange={(e) => {
                    const v = e.target.value as string[];
                    const all: RequestStatus[] = ['pending','approved','rejected'];
                    if (v.includes('all')) {
                      setPtoStatusFilter(all);
                    } else {
                      setPtoStatusFilter(v as RequestStatus[]);
                    }
                  }}
                  renderValue={(selected) => {
                    const arr = selected as string[];
                    const all: string[] = ['pending','approved','rejected'];
                    if (arr.length === all.length) return '全て';
                    return arr.map((s) => (({ pending: '未承認', approved: '承認', rejected: '差戻し' } as Record<string,string>)[s] || s)).join(', ');
                  }}
                >
                  <MenuItem value="all">全て</MenuItem>
                  <MenuItem value="pending">未承認</MenuItem>
                  <MenuItem value="approved">承認</MenuItem>
                  <MenuItem value="rejected">差戻し</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ height: 420, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
                <DataGrid
                  rows={ptoFiltered.map((r, i) => ({ id: r.id, name: r.name, department: r.department, date: r.date, kind: r.kind, status: r.status }))}
                  columns={[
                    { field: 'name', headerName: '社員名', flex: 1, minWidth: 140 },
                    { field: 'department', headerName: '部門', flex: 1, minWidth: 160 },
                    { field: 'date', headerName: '申請日', width: 120 },
                    { field: 'kind', headerName: '区分', width: 100 },
                    { field: 'status', headerName: 'ステータス', width: 140, renderCell: (p: any) => (
                      <Chip size="small" label={(p.value === 'pending' ? '未承認' : p.value === 'approved' ? '承認' : '差戻し')} color={p.value === 'pending' ? 'primary' : p.value === 'approved' ? 'success' : 'error'} />
                    ) },
                  ]}
                  disableRowSelectionOnClick
                  pageSizeOptions={[5, 10]}
                  initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                />
              </Box>
            </>
          )}

          {/* タブ: 残業申請一覧 */}
          {activeTab === 2 && (
            <>
              <FormControl size="small" sx={{ minWidth: 280 }}>
                <InputLabel id="ot-status-filter">ステータス（複数選択可）</InputLabel>
                <Select
                  labelId="ot-status-filter"
                  label="ステータス（複数選択可）"
                  multiple
                  value={otStatusFilter}
                  onChange={(e) => {
                    const v = e.target.value as string[];
                    const all: RequestStatus[] = ['pending','approved','rejected'];
                    if (v.includes('all')) {
                      setOtStatusFilter(all);
                    } else {
                      setOtStatusFilter(v as RequestStatus[]);
                    }
                  }}
                  renderValue={(selected) => {
                    const arr = selected as string[];
                    const all: string[] = ['pending','approved','rejected'];
                    if (arr.length === all.length) return '全て';
                    return arr.map((s) => (({ pending: '未承認', approved: '承認', rejected: '差戻し' } as Record<string,string>)[s] || s)).join(', ');
                  }}
                >
                  <MenuItem value="all">全て</MenuItem>
                  <MenuItem value="pending">未承認</MenuItem>
                  <MenuItem value="approved">承認</MenuItem>
                  <MenuItem value="rejected">差戻し</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ height: 420, bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
                <DataGrid
                  rows={otFiltered.map((r) => ({ id: r.id, name: r.name, department: r.department, date: r.date, hours: r.hours, reason: r.reason ?? '', status: r.status }))}
                  columns={[
                    { field: 'name', headerName: '社員名', flex: 1, minWidth: 140 },
                    { field: 'department', headerName: '部門', flex: 1, minWidth: 160 },
                    { field: 'date', headerName: '申請日', width: 120 },
                    { field: 'hours', headerName: '時間 (h)', width: 120, type: 'number' },
                    { field: 'reason', headerName: '理由', flex: 1, minWidth: 180 },
                    { field: 'status', headerName: 'ステータス', width: 140, renderCell: (p: any) => (
                      <Chip size="small" label={(p.value === 'pending' ? '未承認' : p.value === 'approved' ? '承認' : '差戻し')} color={p.value === 'pending' ? 'secondary' : p.value === 'approved' ? 'success' : 'error'} />
                    ) },
                  ]}
                  disableRowSelectionOnClick
                  pageSizeOptions={[5, 10]}
                  initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                />
              </Box>
            </>
          )}
          
        </Stack>
      </Stack>
    </ManagementLayout>
  );
}
