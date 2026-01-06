"use client";

import React, { useEffect, useRef, useState } from "react";
import "./Footer.css";
import { TechLogos } from "../techlogo/TechLogos";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Regex email

const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{2,255}\.[a-zA-Z]{2,}$/;

const MAX_EMAIL_LENGTH = 60;

const FORMSPREE_URL = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT!;

const Footer = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidEmail = EMAIL_REGEX.test(email);

  // Fonction pour valider et retourner un message d'erreur spécifique
  const getEmailError = (value: string): string => {
    if (value.length === 0) return "";
    if (!value.includes("@")) return "Email must contain @";
    if (value.startsWith("@")) return "Email cannot start with @";
    if (value.endsWith("@")) return "Email is incomplete";
    if (!value.includes(".")) return "Email must contain a domain (.com, .fr, etc.)";
    if (value.split("@").length > 2) return "Email can only have one @";
    const [local, domain] = value.split("@");
    if (local.length === 0) return "Email must have characters before @";
    if (domain.length === 0) return "Email must have a domain after @";
    if (!domain.includes(".")) return "Domain must contain a dot (e.g., gmail.com)";
    if (domain.endsWith(".")) return "Email cannot end with a dot";
    if (domain.split(".").pop()!.length < 2) return "Domain extension too short";
    if (!isValidEmail) return "Please enter a valid email";
    return "";
  };

  /*GSAP*/
  useEffect(() => {
  if (!svgRef.current || !sectionRef.current) return;

  const path = svgRef.current.querySelector("path");
  const circles = svgRef.current.querySelectorAll("circle");

  if (!path) return;

  const length = path.getTotalLength();

  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  gsap.set(circles, {
    scale: 0,
    opacity: 0,
    transformOrigin: "50% 50%",
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top 10%",
      once: true,
    },
  });

  tl.to(path, {
    strokeDashoffset: 0,
    duration: 1.8,
    ease: "power2.out",
  });

  tl.to(
    circles,
    {
      scale: 1,
      opacity: 1,
      duration: 0.25,
      stagger: 0.2,
      ease: "back.out(2)",
    },
    "-=0.2"
  );

  return () => {
    tl.kill(); // clean & suffisant
  };
}, []);
// Tableau de dépendances vide pour exécuter une seule fois

  /*formulaire */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail) {
      setStatus("error");
      return;
    }

    try {
      setLoading(true);
      setStatus("idle");

      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to send email");

      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Mise à jour du message d'erreur en temps réel
    const error = getEmailError(value);
    setErrorMessage(error);
    
    if (status !== "idle") {
      setStatus("idle");
    }
  };

  return (
    <div className="say-hello"  ref={sectionRef}>
      <h1 className="say-hello-title" >Say Hello!</h1>

      <div className="message">
        <p>Let&apos;s build something great together!</p>

        <div style={{ position: "relative" }}>
          <form className="email-container" onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              maxLength={MAX_EMAIL_LENGTH}
              onChange={handleEmailChange}
              aria-invalid={!isValidEmail && email.length > 0}
              aria-describedby={status === "error" ? "email-error" : undefined}
              required
            />

            <button
              className="send"
              type="submit"
              disabled={!isValidEmail || loading}
              aria-busy={loading}
            >
              {loading ? "Sending…" : "Send"}
            </button>
          </form>

          <div style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: "0.5rem",
            whiteSpace: "nowrap",
            minHeight: "1.5rem"
          }}>
            {status === "error" && (
              <p id="email-error" className="form-error" role="alert" style={{ margin: 0 }}>
                Failed to send. Please try again.
              </p>
            )}

            {errorMessage && status === "idle" && (
              <p className="form-error" role="alert" style={{ margin: 0 }}>
                {errorMessage}
              </p>
            )}

            {status === "success" && (
              <p className="form-success" role="status" style={{ margin: 0 }}>
                Thanks! I&apos;ll get back to you soon 😉.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="say-hello-contact">
        <div className="social-contact">
          <TechLogos.GitHub />
          <TechLogos.LinkedIn />
          <TechLogos.Whatsapp />
        </div>

        <div className="my-contact">
          <p>gouombanassir@gmail.com</p>
          <p>+242 06 876 59 39</p>
        </div>
      </div>

      <div className="say-name">
        <div className="copyright-container">
          <div className="copyright">
            <TechLogos.nash />
            <p>© Nassir | 2025</p>
          </div>
          <div className="designed-by">
            <p>designed & developed by me</p>
          </div>
        </div>

        <div className="name-mask" id="say-hello!">
          <h1>
            NAS
            <svg
              className="sign"
              viewBox="0 0 297 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              ref={svgRef}
              aria-hidden="true"
              style={{ willChange: 'transform' }}
            >
              <path
                d="M1.5 70.5203H296.5C296.5 70.5203 -24.5774 145.666 36.5 64.5203C64.9354 26.7418 140.5 2.52029 140.5 2.52029L69.5 143.52C69.5 143.52 138.854 1.30253 147.5 48.5203C149.54 59.6603 142.5 77.5203 142.5 77.5203C142.5 77.5203 154.175 39.5382 165.5 48.5203C174.373 55.5577 164.5 77.5203 164.5 77.5203C164.5 77.5203 180.175 37.9761 191.5 48.5203C199.789 56.2375 179.5 77.5203 179.5 77.5203"
                stroke="#d7fb61"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="212" cy="38.0203" r="2.5" fill="#d7fb61" />
              <circle cx="237" cy="26.0203" r="2.5" fill="#d7fb61" />
              <circle cx="263" cy="15.0203" r="2.5" fill="#d7fb61" />
            </svg>
            SIR
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Footer;