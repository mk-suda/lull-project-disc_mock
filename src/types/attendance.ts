export type AttendanceMatchingStatus = "unverified" | "matched" | "mismatch";

export type AttendanceApprovalStatus = "draft" | "pending" | "approved" | "rejected";

export interface AttendanceValidationIssue {
  field: keyof AttendanceRecord;
  severity: "error" | "warning";
  message: string;
}

export interface AttendanceRecord {
  id: string;
  projectId: string;
  projectName: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  workPeriod: string;
  totalWorkHours: number;
  overtimeHours: number;
  midnightHours: number;
  holidayHours: number;
  approvalStatus: AttendanceApprovalStatus;
  matchingStatus: AttendanceMatchingStatus;
  billingUnitPrice: number;
  expectedBillingAmount: number;
  reconciliationNotes?: string;
  evidenceFileName?: string;
  uploadedAt?: string;
  validationIssues?: AttendanceValidationIssue[];
}
