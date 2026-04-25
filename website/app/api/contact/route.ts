import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { validateCaptcha } from "@/lib/captcha";

const TARGET_EMAIL = "kroczak.piotr@gmail.com";

function getSmtpTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number.parseInt(process.env.SMTP_PORT ?? "", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE !== "false";

  if (!host || Number.isNaN(port) || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function readValue(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const senderEmail = readValue(formData.get("senderEmail"));
  const title = readValue(formData.get("title"));
  const content = readValue(formData.get("content"));
  const captchaAnswer = readValue(formData.get("captchaAnswer"));
  const captchaPayload = readValue(formData.get("captchaPayload"));
  const captchaSignature = readValue(formData.get("captchaSignature"));
  const honeypot = readValue(formData.get("companyWebsite"));

  if (honeypot) {
    return NextResponse.json({
      message: "Message sent successfully.",
    });
  }

  if (!senderEmail || !title || !content) {
    return NextResponse.json(
      { message: "Please fill in email, title, and content." },
      { status: 400 },
    );
  }

  if (!isValidEmail(senderEmail)) {
    return NextResponse.json(
      { message: "Please enter a valid sender email address." },
      { status: 400 },
    );
  }

  if (title.length > 140 || content.length > 5000) {
    return NextResponse.json(
      { message: "Message is too long. Please shorten and retry." },
      { status: 400 },
    );
  }

  const captchaIsValid = validateCaptcha({
    answer: captchaAnswer,
    payload: captchaPayload,
    signature: captchaSignature,
  });

  if (!captchaIsValid) {
    return NextResponse.json(
      { message: "Captcha verification failed. Please refresh and try again." },
      { status: 400 },
    );
  }

  const transport = getSmtpTransport();
  if (!transport) {
    return NextResponse.json(
      {
        message:
          "SMTP is not configured yet. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_SECURE in .env.local.",
      },
      { status: 503 },
    );
  }

  const fromAddress =
    process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "website@localhost";

  try {
    await transport.sendMail({
      from: fromAddress,
      to: TARGET_EMAIL,
      replyTo: senderEmail,
      subject: `[Website Contact] ${title}`,
      text: `New website message\n\nFrom: ${senderEmail}\nTitle: ${title}\n\nContent:\n${content}`,
      html: `
        <h2>New website message</h2>
        <p><strong>From:</strong> ${senderEmail}</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Content:</strong></p>
        <p>${content.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({
      message: "Message sent successfully. Thank you for reaching out.",
    });
  } catch (error) {
    console.error("Email send failed", error);
    return NextResponse.json(
      {
        message:
          "Could not send the email right now. Please try again in a few minutes.",
      },
      { status: 500 },
    );
  }
}
