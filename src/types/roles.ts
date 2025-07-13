
export type UserRole = 'parent' | 'admin' | 'teacher' | 'student';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface RolePermissions {
  canManageUsers: boolean;
  canManageStudents: boolean;
  canManagePayments: boolean;
  canViewReports: boolean;
  canManageClasses: boolean;
  canGradeStudents: boolean;
  canViewOwnGrades: boolean;
  canMessageTeachers: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    canManageUsers: true,
    canManageStudents: true,
    canManagePayments: true,
    canViewReports: true,
    canManageClasses: true,
    canGradeStudents: true,
    canViewOwnGrades: true,
    canMessageTeachers: true,
  },
  teacher: {
    canManageUsers: false,
    canManageStudents: false,
    canManagePayments: false,
    canViewReports: false,
    canManageClasses: true,
    canGradeStudents: true,
    canViewOwnGrades: false,
    canMessageTeachers: true,
  },
  student: {
    canManageUsers: false,
    canManageStudents: false,
    canManagePayments: false,
    canViewReports: false,
    canManageClasses: false,
    canGradeStudents: false,
    canViewOwnGrades: true,
    canMessageTeachers: true,
  },
  parent: {
    canManageUsers: false,
    canManageStudents: false,
    canManagePayments: true,
    canViewReports: false,
    canManageClasses: false,
    canGradeStudents: false,
    canViewOwnGrades: false,
    canMessageTeachers: true,
  },
};
