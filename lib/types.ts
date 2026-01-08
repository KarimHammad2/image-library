import type { JWTPayload } from "jose";

export type UserRole = "ADMIN" | "MEMBER";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  isPremium: boolean;
  createdAt: string;
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  relevance: string;
  notifiableStatus: "NOTIFIABLE" | "NON_NOTIFIABLE" | "EAD";
  species: string[];
  geographicalIncidence?: string;
}

export type Severity = "NORMAL" | "MILD" | "MODERATE" | "SEVERE";

export interface ImageMetadata {
  id: string;
  fileName: string;
  title: string;
  description: string;
  species: string;
  organ: string;
  severity: Severity;
  conditionDiseaseId: string;
  usageRights: string;
  source: string;
  geographicalIncidence?: string;
  notifiableStatus?: "NOTIFIABLE" | "NON_NOTIFIABLE" | "EAD";
  isApproved: boolean;
  createdByUserId: string;
  createdAt: string;
}

export type AnalyticsEventType =
  | "LOGIN"
  | "IMAGE_VIEW"
  | "SEARCH"
  | "FILTER_USE"
  | "IMAGE_COMPARE"
  | "QUIZ_START"
  | "QUIZ_COMPLETE"
  | "PREMIUM_CONTENT_VIEW";

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  type: AnalyticsEventType;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export type QuestionType = "MCQ" | "IMAGE_RECOGNITION";

export interface QuizQuestion {
  id: string;
  questionType: QuestionType;
  questionText: string;
  imageId?: string;
  options?: string[];
  correctOptionIndex?: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export type AnatomyContentType = "VIDEO" | "PDF" | "ARTICLE";

export interface AnatomyContent {
  id: string;
  title: string;
  description: string;
  type: AnatomyContentType;
  videoUrl?: string;
  pdfUrl?: string;
  isPremium: boolean;
}

export interface SessionPayload extends JWTPayload {
  userId: string;
  role: UserRole;
  isPremium: boolean;
  exp?: number;
}

