import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getChannels } from "~/models/channel.server";
import { getUsers } from "~/models/user.server";
import { requireUser } from "~/session.server";

type LoaderData = {
  channels: Awaited<ReturnType<typeof getChannels>>;
  users: Awaited<ReturnType<typeof getUsers>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  if (user.email !== "test@rsspower.com") {
    return redirect("/feeds");
  }

  const [channels, users] = await Promise.all([getChannels(), getUsers()]);

  return json<LoaderData>({ channels, users });
};

export default function AdminPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <main className="flex-1">
      <div className="py-6">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Channels
            </p>

            <table className="text-left">
              <thead>
                <tr>
                  <th className="w-64 truncate">Title</th>

                  <th className="w-24">Items</th>

                  <th className="w-24">Users</th>
                </tr>
              </thead>

              <tbody>
                {data.channels.map((channel) => {
                  return (
                    <tr key={channel.id}>
                      <td>{channel.title}</td>

                      <td>{channel.items.length}</td>

                      <td>{channel.users.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Users
            </p>

            <table className="text-left">
              <thead>
                <tr>
                  <th className="w-64 truncate">User</th>

                  <th className="w-24">Feeds</th>

                  <th className="w-24">Has read</th>

                  <th className="w-24">Read later</th>
                </tr>
              </thead>

              <tbody>
                {data.users.map((user, index) => {
                  const hasRead = user.userChannelItems.filter(
                    (item) => item.hasRead
                  );
                  const readLater = user.userChannelItems.filter(
                    (item) => item.isReadLater
                  );

                  return (
                    <tr key={user.id}>
                      <td>{user.id}</td>

                      <td>{user._count.feeds}</td>

                      <td>{hasRead.length}</td>

                      <td>{readLater.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
