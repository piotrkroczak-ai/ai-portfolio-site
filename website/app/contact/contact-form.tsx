"use client";

import { FormEvent, useState } from "react";

type ContactFormProps = {
  captchaQuestion: string;
  captchaPayload: string;
  captchaSignature: string;
};

type SubmitState = {
  kind: "idle" | "success" | "error";
  message: string;
};

export default function ContactForm({
  captchaQuestion,
  captchaPayload,
  captchaSignature,
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState<SubmitState>({
    kind: "idle",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setState({ kind: "idle", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        setState({
          kind: "error",
          message:
            result.message ??
            "Your message could not be sent. Please check the fields and try again.",
        });
        return;
      }

      form.reset();
      setState({
        kind: "success",
        message:
          result.message ??
          "Message sent successfully. I will get back to you soon.",
      });
    } catch {
      setState({
        kind: "error",
        message:
          "Unexpected connection issue. Please retry in a few moments.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input type="hidden" name="captchaPayload" value={captchaPayload} />
      <input type="hidden" name="captchaSignature" value={captchaSignature} />

      <label className="contact-field">
        <span>Your Email</span>
        <input
          type="email"
          name="senderEmail"
          placeholder="name@domain.com"
          required
          maxLength={160}
          autoComplete="email"
        />
      </label>

      <label className="contact-field">
        <span>Title</span>
        <input
          type="text"
          name="title"
          placeholder="Project idea, collaboration, consulting..."
          required
          maxLength={140}
        />
      </label>

      <label className="contact-field">
        <span>Content</span>
        <textarea
          name="content"
          placeholder="Write your message here..."
          required
          maxLength={5000}
          rows={7}
        />
      </label>

      <label className="contact-field">
        <span>Captcha: solve {captchaQuestion}</span>
        <input
          type="text"
          name="captchaAnswer"
          placeholder="Your answer"
          required
          inputMode="numeric"
          maxLength={4}
        />
      </label>

      <label className="bot-trap" aria-hidden="true">
        <span>Leave this field empty</span>
        <input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </label>

      <button type="submit" className="btn-primary contact-submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Email"}
      </button>

      {state.kind !== "idle" ? (
        <p
          className={
            state.kind === "success" ? "contact-feedback success" : "contact-feedback error"
          }
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
