import React from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console | IPOPreIPO",
  description: "Administrator command center for managing IPO listings, live GMP rates, market research articles, and registered investors.",
  robots: "noindex, nofollow"
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGate>
      <AdminLayout>{children}</AdminLayout>
    </AdminGate>
  );
}
