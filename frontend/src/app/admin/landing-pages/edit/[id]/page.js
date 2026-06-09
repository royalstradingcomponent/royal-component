"use client";

import { useParams } from "next/navigation";
import LandingPageForm from "@/components/admin/LandingPageForm";

export default function EditLandingPage() {
  const params = useParams();

  return (
    <LandingPageForm
      mode="edit"
      pageId={params.id}
    />
  );
}