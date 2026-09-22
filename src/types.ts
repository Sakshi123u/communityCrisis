/**
 * Community Crisis Intelligence Platform - Type Definitions
 */

export type UserRole = 'CITIZEN' | 'AUTHORITY' | 'ADMIN';
export type Language = 'en' | 'hi' | 'mr';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  departmentId?: string;
  departmentName?: string;
  employeeId?: string;
  preferredLanguage: 'en' | 'hi' | 'mr';
  photoURL?: string;
  createdAt: string;
  isActive: boolean;
}

export type IncidentCategory =
  | 'Flood'
  | 'Road Damage'
  | 'Garbage'
  | 'Water Leakage'
  | 'Fire'
  | 'Traffic Accident'
  | 'Streetlight'
  | 'Drainage'
  | 'Electricity'
  | 'Public Safety'
  | 'Pollution'
  | 'Other';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'RESOLVED'
  | 'REJECTED';

export interface PriorityFactors {
  severity: number;          // 35%
  populationImpact: number;  // 25%
  locationRisk: number;      // 20%
  urgency: number;           // 10%
  evidenceConfidence: number;// 10%
}

export interface AIAnalysisResult {
  category: IncidentCategory;
  severity: IncidentSeverity;
  confidence: number; // 0 - 100
  summary: string;
  detectedEvidence: string[];
  potentialImpact: string;
  recommendedDepartment: string;
  recommendedActions: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  priorityScore: number; // 0 - 100
  priorityFactors: PriorityFactors;
  reasoning: string;
  modelUsed?: string;
  analyzedAt: string;
}

export interface IncidentLocation {
  address: string;
  latitude: number;
  longitude: number;
  district?: string;
  landmark?: string;
}

export interface IncidentMedia {
  id: string;
  incidentId: string;
  fileName: string;
  fileType: string; // e.g. image/jpeg, audio/mp3, application/pdf
  fileSize: number;
  downloadURL: string;
  mediaType: 'image' | 'video' | 'pdf' | 'audio';
  extractedText?: string;
  transcription?: string;
  createdAt: string;
}

export interface IncidentTimelineEvent {
  id: string;
  incidentId: string;
  status: IncidentStatus;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  description: string;
  isInternalNote?: boolean;
  timestamp: string;
}

export interface Incident {
  id: string;
  incidentNumber: string; // e.g. INC-2026-000123
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  priorityScore: number;
  priorityFactors: PriorityFactors;
  priorityOverride?: {
    score: number;
    reason: string;
    overriddenBy: string;
    timestamp: string;
  };
  citizenId: string;
  citizenName: string;
  citizenEmail?: string;
  citizenPhone?: string;
  location: IncidentLocation;
  media: IncidentMedia[];
  aiAnalysis?: AIAnalysisResult;
  assignedDepartmentId?: string;
  assignedDepartmentName?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionNotification?: {
    notified: boolean;
    emailSent?: boolean;
    smsSent?: boolean;
    sentAt?: string;
    error?: string;
    channelsUsed?: string[];
  };
  internalNotes?: { id: string; author: string; text: string; createdAt: string }[];
  publicUpdates?: { id: string; author: string; text: string; createdAt: string }[];
  translations?: {
    hi?: {
      title?: string;
      description?: string;
      address?: string;
      summary?: string;
    };
    mr?: {
      title?: string;
      description?: string;
      address?: string;
      summary?: string;
    };
  };
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  officerCount: number;
  activeIncidentsCount: number;
  resolvedCount: number;
  contactEmail: string;
  contactPhone: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  summary: string;
  source: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'CRITICAL';
  read: boolean;
  incidentId?: string;
  createdAt: string;
}
