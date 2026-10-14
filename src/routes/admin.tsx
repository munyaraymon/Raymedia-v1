import { createFileRoute } from "@tanstack/react-router";
import { AdminScreen } from "@/components/raymedia/admin-screen";
import { getDirectory } from "@/lib/raymedia/api";

export const Route = createFileRoute("/admin")({
  loader: () => getDirectory(),
  component: AdminPage,
});

function AdminPage() {
  const directory = Route.useLoaderData();
  return <AdminScreen directory={directory} />;
}
