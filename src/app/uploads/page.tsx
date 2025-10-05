"use client";

import React from "react";
import ManagementLayout from "../../components/layout/ManagementLayout";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

interface UploadHistoryItem {
  id: string;
  fileName: string;
  uploadedAt: string;
  uploader: string;
  status: "processing" | "completed" | "error";
  message?: string;
}

const uploadHistory: UploadHistoryItem[] = [
  {
    id: "UP-2409-010",
    fileName: "attendance_report_sep.pdf",
    uploadedAt: "2024-09-30 18:42",
    uploader: "山田 太郎",
    status: "completed",
    message: "勤怠データに自動反映されました",
  },
  {
    id: "UP-2409-011",
    fileName: "pj4633_invoice.xlsx",
    uploadedAt: "2024-09-30 17:05",
    uploader: "佐藤 花子",
    status: "processing",
    message: "OCR解析中 (残り30秒)",
  },
  {
    id: "UP-2409-009",
    fileName: "hanako_timesheet_sep.pdf",
    uploadedAt: "2024-09-28 09:12",
    uploader: "佐藤 花子",
    status: "error",
    message: "勤怠項目の読み取りに失敗しました。CSVテンプレートで再アップロードしてください。",
  },
];

const statusMap: Record<UploadHistoryItem["status"], { label: string; color: "default" | "success" | "warning" | "error"; icon: React.ReactElement }> = {
  processing: { label: "解析中", color: "warning", icon: <HourglassBottomIcon fontSize="small" /> },
  completed: { label: "完了", color: "success", icon: <CheckCircleIcon fontSize="small" /> },
  error: { label: "エラー", color: "error", icon: <ErrorOutlineIcon fontSize="small" /> },
};

export default function UploadsPage() {
  return (
    <ManagementLayout title="帳票アップロード">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            帳票アップロード
          </Typography>
          <Typography variant="body1" color="text.secondary">
            勤怠報告書や請求書テンプレートをアップロードし、OCR解析から各モジュールへの連携までを自動で実行します。
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Stack spacing={3} alignItems="center" textAlign="center">
                  <CloudUploadIcon sx={{ fontSize: 56, color: "secondary.main" }} />
                  <Box>
                    <Typography variant="h6">PDF / Excel をドラッグ＆ドロップ</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      対応形式: PDF, XLSX, CSV (最大20MB)。アップロード後、自動的に勤務実績・請求データへ反映されます。
                    </Typography>
                  </Box>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button variant="contained" color="secondary" component="label">
                      ファイルを選択
                      <input hidden multiple type="file" accept=".pdf,.xlsx,.xls,.csv" />
                    </Button>
                    <Button variant="outlined" startIcon={<DescriptionIcon />}>
                      テンプレートをダウンロード
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", py: 2, px: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  アップロードされたファイルはバージョン管理され、3年間保管されます。
                </Typography>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  エラーが発生した場合は、テンプレートを利用してレイアウトを整えてから再アップロードしてください。サポートが必要な場合は経理チームまでご連絡ください。
                </Typography>
              </Alert>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    アップロード履歴
                  </Typography>
                  <List disablePadding>
                    {uploadHistory.map((history) => {
                      const status = statusMap[history.status];
                      return (
                        <ListItem key={history.id} alignItems="flex-start" sx={{ py: 2 }}>
                          <ListItemAvatar>
                            <Chip icon={status.icon} label={status.label} color={status.color} variant="filled" size="small" sx={{ minWidth: 88 }} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={history.fileName}
                            secondary={
                              <Stack spacing={1} sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  アップロード時刻: {history.uploadedAt} / 担当者: {history.uploader}
                                </Typography>
                                {history.message && (
                                  <Typography variant="body2" color={history.status === "error" ? "error.main" : "text.secondary"}>
                                    {history.message}
                                  </Typography>
                                )}
                              </Stack>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </ManagementLayout>
  );
}
