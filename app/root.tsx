import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";

import { getUser } from "~/session.server";

import tailwindStylesheetUrl from "~/styles/tailwind.css";

import ConditionalScrollRestoration from "./features/conditional-scroll-restoration";

export const links: LinksFunction = () => {
  return [
    { href: tailwindStylesheetUrl, rel: "stylesheet" },
    {
      href: "https://rsms.me/inter/inter.css",
      rel: "stylesheet",
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "RSS Power",
  viewport: "width=device-width,initial-scale=1",
});

export const loader = async ({ request }: LoaderArgs) => {
  return json({
    user: await getUser(request),
  });
};

export default function App() {
  return (
    <html className="h-full bg-gray-100 text-gray-900" lang="en">
      <head>
        <Meta />

        <Links />
      </head>

      <body className="h-full">
        <Outlet />

        <ConditionalScrollRestoration />

        <Scripts />

        <LiveReload />
      </body>
    </html>
  );
}
