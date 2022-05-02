import { Dialog, Transition } from "@headlessui/react";
import { Form, Link } from "@remix-run/react";
import { List, PlusCircle, Rss, User as UserIcon, X } from "phosphor-react";
import type { ReactNode } from "react";
import { Fragment, useState } from "react";

import SidebarChannelLink from "./sidebar-channel-link";

import type { getChannelsForUserId } from "~/models/channel.server";
import type { User } from "~/models/user.server";

type Props = {
  channels: Awaited<ReturnType<typeof getChannelsForUserId>>;
  children: ReactNode;
  user: User;
};

function SidebarNavigation({ channels, user }: Omit<Props, "children">) {
  return (
    <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 space-x-2 border-b border-gray-200 pb-4">
          <Rss color="black" size={32} weight="bold" />

          <span className="font-bold text-3xl">RSS Power</span>
        </div>

        <nav className="mt-2 flex-1 px-2 bg-white space-y-1">
          {channels.length === 0 ? (
            <p className="p-4">No channels yet</p>
          ) : (
            <ol>
              {channels.map((channel) => (
                <li key={channel.id}>
                  <SidebarChannelLink
                    channel={channel}
                    itemCount={channel._count.items}
                  />
                </li>
              ))}
            </ol>
          )}
        </nav>

        <div className="px-2">
          <Link
            to="new"
            className="flex items-center space-x-2 px-4 hover:bg-blue-700 py-2 bg-blue-500 text-white rounded-lg"
          >
            <PlusCircle size={16} weight="bold" />

            <span>New channel</span>
          </Link>
        </div>
      </div>

      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex-shrink-0 w-full block">
          <div className="flex items-center">
            <div>
              <UserIcon size={32} />
            </div>

            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.email}</p>

              <div className="text-xs font-medium text-gray-500 hover:text-gray-700">
                <Form action="/logout" method="post">
                  <button type="submit">Logout</button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SidebarLayout({ channels, children, user }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <Transition.Root show={isSidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={setIsSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>

                    <X className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>

              <SidebarNavigation channels={channels} user={user} />
            </div>
          </Transition.Child>

          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}

      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarNavigation channels={channels} user={user} />
      </div>

      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>

            <List className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
