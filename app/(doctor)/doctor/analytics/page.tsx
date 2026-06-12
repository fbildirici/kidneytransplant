import { redirect } from "next/navigation";
import PageTitle from "@/components/PageTitle";

export default function AnalyticsRedirectPage() {
  redirect("/doctor/labs");
}
