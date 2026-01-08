import fs from "fs/promises";
import path from "path";
import type {
  AnalyticsEvent,
  AnatomyContent,
  Disease,
  ImageMetadata,
  Quiz,
  User,
} from "./types";

const dataDir = path.join(process.cwd(), "data");

async function readJson<T>(fileName: string): Promise<T> {
  const filePath = path.join(dataDir, fileName);
  const file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file) as T;
}

async function writeJson<T>(fileName: string, data: T) {
  const filePath = path.join(dataDir, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function getUsers() {
  return readJson<User[]>("users.json");
}

export async function saveUsers(users: User[]) {
  return writeJson("users.json", users);
}

export async function getDiseases() {
  return readJson<Disease[]>("diseases.json");
}

export async function saveDiseases(diseases: Disease[]) {
  return writeJson("diseases.json", diseases);
}

export async function getImages() {
  return readJson<ImageMetadata[]>("images.json");
}

export async function saveImages(images: ImageMetadata[]) {
  return writeJson("images.json", images);
}

export async function getAnalytics() {
  return readJson<AnalyticsEvent[]>("analytics.json");
}

export async function saveAnalytics(events: AnalyticsEvent[]) {
  return writeJson("analytics.json", events);
}

export async function getQuizzes() {
  return readJson<Quiz[]>("quizzes.json");
}

export async function saveQuizzes(quizzes: Quiz[]) {
  return writeJson("quizzes.json", quizzes);
}

export async function getAnatomyContent() {
  return readJson<AnatomyContent[]>("anatomy_content.json");
}

export async function saveAnatomyContent(items: AnatomyContent[]) {
  return writeJson("anatomy_content.json", items);
}

