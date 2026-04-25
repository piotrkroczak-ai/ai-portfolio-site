import Link from "next/link";
import { createCaptchaChallenge } from "@/lib/captcha";
import ContactForm from "./contact-form";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const captcha = createCaptchaChallenge();

  return (
    <main className="contact-page-shell">
      <div className="ambient-layer" aria-hidden="true" />

      <section className="contact-modal reveal">
        <div className="contact-modal-head">
          <p className="contact-kicker">Message Form</p>
          <h1>Send an email</h1>
          <p>
            Fill out the form and your message will be sent directly to
            <strong> kroczak.piotr@gmail.com</strong>.
          </p>
        </div>

        <ContactForm
          captchaQuestion={captcha.question}
          captchaPayload={captcha.payload}
          captchaSignature={captcha.signature}
        />

        <Link href="/" className="btn-secondary back-home">
          Back to homepage
        </Link>
      </section>
    </main>
  );
}
