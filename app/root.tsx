import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { getUser } from "~/session.server";
import tailwindStylesheetUrl from "~/styles/tailwind.css";

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

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

export default function App() {
  return (
    <html className="h-full bg-gray-100" lang="en">
      <head>
        <Meta />

        <Links />
      </head>

      <body className="h-full">
        <Outlet />

        <ScrollRestoration />

        <Scripts />

        <LiveReload />
      </body>
    </html>
  );
}
