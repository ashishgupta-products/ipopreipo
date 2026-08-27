import React from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console | ipo preipo.com",
  description: "Administrator command center for managing IPO listings, live GMP rates, market research articles, and registered investors on ipo preipo.com.",
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
