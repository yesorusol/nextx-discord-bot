import fs from "node:fs";
import path from "node:path";

const REQUIRED = [
  "DISCORD_TOKEN",
  "DISCORD_CLIENT_ID",
  "GOOGLE_SERVICE_ACCOUNT_PATH",
];

export function loadConfig() {
  const missing = REQUIRED.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(`.env에 다음 값이 없습니다: ${missing.join(", ")}`);
  }

  const keyPath = path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_PATH);
  if (!fs.existsSync(keyPath)) {
    throw new Error(`서비스 계정 키 파일이 없습니다: ${keyPath}`);
  }

  const rolesPath = path.resolve("config/roles.json");
  const roles = JSON.parse(fs.readFileSync(rolesPath, "utf8"));
  if (!Array.isArray(roles) || roles.some((role) => typeof role !== "string" || !role.trim())) {
    throw new Error("config/roles.json은 예외 직무 이름 문자열 배열이어야 합니다.");
  }

  return {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    spreadsheetId: "",
    logSheetId: null,
    dashboardSheetId: null,
    rosterSpreadsheetId: "",
    rosterSheetId: null,
    taskSpreadsheetId: "",
    taskSheetId: null,
    serviceAccountPath: keyPath,
    roles,
  };
}
