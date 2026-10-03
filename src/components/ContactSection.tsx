"use client";

import { Copy, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/Timeline";
import { useLanguage } from "@/context/LanguageContext";
import { profile } from "@/data/resumeData";

export function ContactSection() {
  const { t } = useLanguage();
  const [copyLabel, setCopyLabel] = useState(t.contact.copy);
  const [pgpNote, setPgpNote] = useState(false);

  useEffect(() => {
    setCopyLabel(t.contact.copy);
  }, [t]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyLabel(t.contact.copied);
    } catch {
      setCopyLabel(t.contact.copyFailed);
    }
    window.setTimeout(() => setCopyLabel(t.contact.copy), 2000);
  }

  return (
    <section className="border-t border-rule py-10" aria-labelledby="contact">
      <SectionHeading id="contact" index={t.contact.index} title={t.contact.title} />
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="font-mono text-xs text-mute">{t.contact.write}</p>
          <a className="mt-2 inline-flex items-center gap-2 text-sm underline decoration-rule underline-offset-4" href={`mailto:${profile.email}`}>
            <Mail size={14} strokeWidth={1.5} aria-hidden />
            {profile.email}
          </a>
          <div className="no-print mt-3">
            <button type="button" onClick={copyEmail} className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/50 px-2 py-1 font-pixel text-sm text-emerald-300">
              <Copy size={14} strokeWidth={1.5} aria-hidden />
              {copyLabel}
            </button>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs text-mute">{t.contact.phone}</p>
          <a className="mt-2 block text-sm" href={profile.phoneHref}>
            {profile.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
