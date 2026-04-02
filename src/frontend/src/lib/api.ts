export const BACKEND_URL = "https://financialai-backend.onrender.com";

export interface BackendStatusResponse {
  message: string;
  [key: string]: unknown;
}

const RETRY_COUNT = 3;
const RETRY_DELAY_MS = 3000;
const FETCH_TIMEOUT_MS = 60000;

async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function callBackendStatus(
  onWakingUp?: () => void,
): Promise<BackendStatusResponse> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= RETRY_COUNT; attempt++) {
    try {
      if (attempt === 1 && onWakingUp) {
        onWakingUp();
      }
      console.log(
        `[FinHealth API] Attempt ${attempt}/${RETRY_COUNT} → ${BACKEND_URL}/`,
      );
      const res = await fetchWithTimeout(`${BACKEND_URL}/`, FETCH_TIMEOUT_MS);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log(`[FinHealth API] Success on attempt ${attempt}:`, data);
      return data;
    } catch (err) {
      lastError = err;
      console.error(`[FinHealth API] Attempt ${attempt} failed:`, err);
      if (attempt < RETRY_COUNT) {
        console.log(`[FinHealth API] Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  console.error(
    `[FinHealth API] All ${RETRY_COUNT} attempts failed. Last error:`,
    lastError,
  );
  throw lastError;
}
