import crypto from "node:crypto";

export type CaptchaChallenge = {
  question: string;
  payload: string;
  signature: string;
};

type CaptchaValidationInput = {
  answer: string;
  payload: string;
  signature: string;
  maxAgeSeconds?: number;
};

const DEFAULT_CAPTCHA_SECRET =
  "local-dev-captcha-secret-change-this-before-production";

function signPayload(payload: string): string {
  const secret = process.env.CAPTCHA_SECRET ?? DEFAULT_CAPTCHA_SECRET;
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function createCaptchaChallenge(): CaptchaChallenge {
  const left = crypto.randomInt(2, 10);
  const right = crypto.randomInt(2, 10);
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = `${left}:${right}:${issuedAt}`;
  const signature = signPayload(payload);

  return {
    question: `${left} + ${right}`,
    payload,
    signature,
  };
}

export function validateCaptcha({
  answer,
  payload,
  signature,
  maxAgeSeconds = 1800,
}: CaptchaValidationInput): boolean {
  if (!answer || !payload || !signature) {
    return false;
  }

  const expectedSignature = signPayload(payload);
  const leftBuffer = Buffer.from(signature);
  const rightBuffer = Buffer.from(expectedSignature);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(leftBuffer, rightBuffer)) {
    return false;
  }

  const [leftRaw, rightRaw, issuedAtRaw] = payload.split(":");
  const left = Number.parseInt(leftRaw, 10);
  const right = Number.parseInt(rightRaw, 10);
  const issuedAt = Number.parseInt(issuedAtRaw, 10);

  if (
    Number.isNaN(left) ||
    Number.isNaN(right) ||
    Number.isNaN(issuedAt) ||
    issuedAt <= 0
  ) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (now - issuedAt > maxAgeSeconds) {
    return false;
  }

  const expectedAnswer = String(left + right);
  return answer.trim() === expectedAnswer;
}
