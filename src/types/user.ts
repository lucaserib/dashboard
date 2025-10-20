// Tipos baseados no schema do Prisma do backend
export interface User {
  id: string;
  name?: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  birthDate?: string;
  clerkId: string;
  firstName?: string;
  imageUrl?: string;
  lastName?: string;
  gender?: string;
  cnpjData?: CNPJData;
  contractors?: Contractor[];
  deviceTokens?: DeviceToken[];
  locations?: Location[];
  notificationConfig?: NotificationConfig;
  plantoes?: Plantao[];
  shiftTemplates?: ShiftTemplate[];
}

export interface CNPJData {
  id: string;
  companyName?: string;
  cnpjNumber?: string;
  accountingFirmName?: string;
  monthlyFee?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Contractor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  plantoes?: Plantao[];
  shiftTemplates?: ShiftTemplate[];
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  plantoes?: Plantao[];
  shiftTemplates?: ShiftTemplate[];
}

export interface Plantao {
  id: string;
  date: string;
  value: number;
  isFixed: boolean;
  paymentType: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  locationId?: string;
  contractorId?: string;
  endTime: string;
  startTime: string;
  payments?: Payment[];
  contractor?: Contractor;
  location?: Location;
  user?: User;
}

export interface Payment {
  id: string;
  paid: boolean;
  notes?: string;
  method?: string;
  createdAt: string;
  updatedAt: string;
  plantaoId: string;
  paymentDate?: string;
  plantao?: Plantao;
}

export interface DeviceToken {
  id: string;
  userId: string;
  token: string;
  deviceName?: string;
  deviceType?: string;
  appVersion?: string;
  isActive: boolean;
  lastUsedAt: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface NotificationConfig {
  id: string;
  userId: string;
  dailyReminder: boolean;
  dailyReminderTime: string;
  beforeShiftReminder: boolean;
  beforeShiftMinutes: number;
  weeklyReport: boolean;
  weeklyReportDay: number;
  weeklyReportTime: string;
  monthlyReport: boolean;
  monthlyReportDay: number;
  monthlyReportTime: string;
  shiftConfirmation: boolean;
  paymentReminder: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  value: number;
  paymentType: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  locationId?: string;
  contractorId?: string;
  user?: User;
  location?: Location;
  contractor?: Contractor;
}

// Tipos para estatísticas e relatórios
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersWithCNPJ: number;
  usersWithLocations: number;
  usersWithContractors: number;
  totalShifts: number;
  totalRevenue: number;
  averageShiftsPerUser: number;
  platformDistribution: {
    ios: number;
    android: number;
    web: number;
  };
  genderDistribution: {
    masculino: number;
    feminino: number;
    outro: number;
    naoInformado: number;
  };
}

export interface UserFilters {
  searchTerm?: string;
  gender?: string;
  hasCNPJ?: boolean;
  hasLocations?: boolean;
  hasContractors?: boolean;
  platform?: 'ios' | 'android' | 'web';
  dateFrom?: string;
  dateTo?: string;
}
