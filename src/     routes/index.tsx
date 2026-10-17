import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { HomeScreen } from "@/components/raymedia/home-screen";
import { getDirectory } from "@/lib/raymedia/api";

const defaultSearch = { cat: "" };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    cat: typeof search.cat === "string" ? search.cat : "",
  }),
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
  loader: () => getDirectory(),
  component: Home,
});

function Home() {
  const directory = Route.useLoaderData();
  const { cat } = Route.useSearch();
  return <HomeScreen directory={directory} category={cat} />;
}
