export const BACKEND_URL = "https://financialai-backend.onrender.com";

export interface BackendStatusResponse {
  message: string;
  [key: string]: unknown;
}

export async function callBackendStatus(): Promise<BackendStatusResponse> {
  const res = await fetch(`${BACKEND_URL}/`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
