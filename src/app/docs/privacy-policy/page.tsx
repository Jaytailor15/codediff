import { redirect } from "next/navigation";

export default function PrivacyPolicyPage() {
  redirect("/docs?section=privacy-policy");
}
