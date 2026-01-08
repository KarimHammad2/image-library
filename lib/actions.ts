"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuid } from "uuid";
import {
  clearSessionCookie,
  createSessionToken,
  getCurrentUser,
  hashPassword,
  setSessionCookie,
  verifyPassword,
} from "./auth";
import { logAnalyticsEvent } from "./analytics";
import {
  getAnatomyContent,
  getDiseases,
  getImages,
  getQuizzes,
  getUsers,
  saveAnatomyContent,
  saveDiseases,
  saveImages,
  saveQuizzes,
  saveUsers,
} from "./db";
import type {
  AnatomyContent,
  AnalyticsEventType,
  Disease,
  ImageMetadata,
  Quiz,
  UserRole,
} from "./types";

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const email = String(formData.get("email") || "").toLowerCase();
  const password = String(formData.get("password") || "");

  const users = await getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password" };
  }

  const token = await createSessionToken(user);
  await setSessionCookie(token);
  await logAnalyticsEvent("LOGIN", { userId: user.id });
  redirect("/library");
}

export async function signupAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const email = String(formData.get("email") || "").toLowerCase();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "New Member");

  const users = await getUsers();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    return { error: "Email already registered" };
  }

  const newUser = {
    id: uuid(),
    email,
    passwordHash: await hashPassword(password),
    name,
    role: "MEMBER" as const,
    isPremium: false,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await saveUsers(users);

  const token = await createSessionToken(newUser);
  await setSessionCookie(token);
  await logAnalyticsEvent("LOGIN", { userId: newUser.id, metadata: { signup: true } });
  redirect("/library");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}

type ImageFormState = { error?: string; success?: boolean };

export async function upsertImageAction(
  _prev: ImageFormState | undefined,
  formData: FormData,
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const id = String(formData.get("id") || "") || uuid();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const species = String(formData.get("species") || "").trim();
  const organ = String(formData.get("organ") || "").trim();
  const severity = String(formData.get("severity") || "MILD") as ImageMetadata["severity"];
  const conditionDiseaseId = String(formData.get("conditionDiseaseId") || "").trim();
  const usageRights = String(formData.get("usageRights") || "").trim();
  const source = String(formData.get("source") || "").trim();
  const fileName = String(formData.get("fileName") || "").trim();
  const geographicalIncidence = String(formData.get("geographicalIncidence") || "").trim();
  const notifiableStatus = formData.get("notifiableStatus")
    ? (String(formData.get("notifiableStatus")) as ImageMetadata["notifiableStatus"])
    : undefined;

  if (!title || !description || !species || !organ || !conditionDiseaseId || !usageRights || !source || !fileName) {
    return { error: "All core metadata fields are required." };
  }

  const images = await getImages();
  const existingIndex = images.findIndex((img) => img.id === id);
  const payload: ImageMetadata = {
    id,
    title,
    description,
    species,
    organ,
    severity,
    conditionDiseaseId,
    usageRights,
    source,
    fileName,
    geographicalIncidence: geographicalIncidence || undefined,
    notifiableStatus,
    isApproved: existingIndex !== -1 ? images[existingIndex].isApproved : false,
    createdByUserId: existingIndex !== -1 ? images[existingIndex].createdByUserId : user.id,
    createdAt: existingIndex !== -1 ? images[existingIndex].createdAt : new Date().toISOString(),
  };

  if (existingIndex !== -1) {
    images[existingIndex] = payload;
  } else {
    images.push(payload);
  }

  await saveImages(images);
  revalidatePath("/admin/images");
  revalidatePath("/library");
  return { success: true };
}

export async function approveImageAction(imageId: string, isApproved: boolean) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  const images = await getImages();
  const image = images.find((img) => img.id === imageId);
  if (!image) return { error: "Image not found" };

  image.isApproved = isApproved;
  await saveImages(images);
  revalidatePath("/admin/images");
  revalidatePath("/library");
  return { success: true };
}

type DiseaseFormState = { error?: string; success?: boolean };

export async function upsertDiseaseAction(
  _prev: DiseaseFormState | undefined,
  formData: FormData,
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const id = String(formData.get("id") || "") || uuid();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const relevance = String(formData.get("relevance") || "").trim();
  const notifiableStatus = String(formData.get("notifiableStatus") || "NON_NOTIFIABLE") as Disease["notifiableStatus"];
  const species = String(formData.get("species") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const geographicalIncidence = String(formData.get("geographicalIncidence") || "").trim();

  if (!name || !description || !relevance || species.length === 0) {
    return { error: "Name, description, relevance, and at least one species are required." };
  }

  const diseases = await getDiseases();
  const existingIndex = diseases.findIndex((d) => d.id === id);
  const payload: Disease = {
    id,
    name,
    description,
    relevance,
    notifiableStatus,
    species,
    geographicalIncidence: geographicalIncidence || undefined,
  };

  if (existingIndex !== -1) diseases[existingIndex] = payload;
  else diseases.push(payload);

  await saveDiseases(diseases);
  revalidatePath("/admin/diseases");
  revalidatePath("/library");
  return { success: true };
}

export async function updateUserAccessAction(params: {
  userId: string;
  role?: UserRole;
  isPremium?: boolean;
}) {
  const current = await getCurrentUser();
  if (!current || current.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  const users = await getUsers();
  const target = users.find((u) => u.id === params.userId);
  if (!target) return { error: "User not found" };
  if (target.id === current.id && params.role && params.role !== "ADMIN") {
    return { error: "You cannot downgrade your own admin role." };
  }

  if (params.role) target.role = params.role;
  if (typeof params.isPremium === "boolean") target.isPremium = params.isPremium;
  await saveUsers(users);
  revalidatePath("/admin/users");
  return { success: true };
}

export async function upsertQuizAction(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  const quizzes = await getQuizzes();
  const id = String(formData.get("id") || "") || uuid();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!title || !description) {
    return { error: "Title and description are required." };
  }
  const existingIndex = quizzes.findIndex((q) => q.id === id);
  const payload: Quiz = {
    id,
    title,
    description,
    questions: existingIndex !== -1 ? quizzes[existingIndex].questions : [],
  };
  if (existingIndex !== -1) quizzes[existingIndex] = payload;
  else quizzes.push(payload);

  await saveQuizzes(quizzes);
  revalidatePath("/admin/premium");
  return { success: true };
}

export async function upsertAnatomyContentAction(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  const items = await getAnatomyContent();
  const id = String(formData.get("id") || "") || uuid();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const type = String(formData.get("type") || "ARTICLE") as AnatomyContent["type"];
  const videoUrl = String(formData.get("videoUrl") || "").trim();
  const pdfUrl = String(formData.get("pdfUrl") || "").trim();
  const isPremium = String(formData.get("isPremium") || "false") === "true";

  if (!title || !description) return { error: "Title and description are required." };

  const payload: AnatomyContent = {
    id,
    title,
    description,
    type,
    videoUrl: videoUrl || undefined,
    pdfUrl: pdfUrl || undefined,
    isPremium,
  };

  const existingIndex = items.findIndex((i) => i.id === id);
  if (existingIndex !== -1) items[existingIndex] = payload;
  else items.push(payload);

  await saveAnatomyContent(items);
  revalidatePath("/admin/premium");
  revalidatePath("/premium/anatomy");
  return { success: true };
}

export async function logEventAction(
  type: AnalyticsEventType,
  metadata?: Record<string, unknown>,
) {
  const user = await getCurrentUser();
  await logAnalyticsEvent(type, { userId: user?.id, metadata });
}

