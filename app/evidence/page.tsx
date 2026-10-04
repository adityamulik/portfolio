"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EvidenceRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/recognition/");
  }, [router]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <p className="text-ink-muted">
        This page moved to{" "}
        <Link href="/recognition/" className="text-accent underline underline-offset-4">
          Recognition
        </Link>
        .
      </p>
    </div>
  );
}
