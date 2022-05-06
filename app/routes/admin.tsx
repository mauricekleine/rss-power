import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";

import SectionHeader from "~/components/ui/typography/section-header";

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
            <SectionHeader>{`Channels (${data.channels.length})`}</SectionHeader>

            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                  >
                    Title
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Items
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Users
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data.channels.map((channel) => {
                  return (
                    <tr key={channel.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                        {channel.title}
                      </td>

                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {channel._count.items}
                      </td>

                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {channel._count.users}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div>
            <SectionHeader>{`Users (${data.users.length})`}</SectionHeader>

            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                  >
                    User
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Created at
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Last active at
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Feeds
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Has read
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Read later
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data.users.map((user) => {
                  const hasRead = user.userChannelItems.filter(
                    (item) => item.hasRead
                  );
                  const readLater = user.userChannelItems.filter(
                    (item) => item.isReadLater
                  );

                  return (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                        {user.id}
                      </td>

                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {format(
                          new Date(user.createdAt),
                          "MMM d, yyyy 'at' hh:mmb"
                        )}
                      </td>

                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {user.lastActiveAt
                          ? format(
                              new Date(user.lastActiveAt),
                              "MMM d, yyyy 'at' hh:mmb"
                            )
                          : null}
                      </td>

                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {user._count.feeds}
                      </td>

                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {hasRead.length}
                      </td>

                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {readLater.length}
                      </td>
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
