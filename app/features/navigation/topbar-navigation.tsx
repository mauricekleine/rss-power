import { useSubmit } from "@remix-run/react";

import { DropdownMenu } from "~/features/ui/dropdown-menu";
import { Rss, User as UserIcon } from "~/features/ui/icon";

import type { User } from "~/models/user.server";

type Props = {
  user: User;
};

export default function TopbarNavigation({ user }: Props) {
  const submit = useSubmit();

  const handleLogoutClick = () => {
    submit(null, { action: "/logout", method: "post" });
  };
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-3xl px-6 md:max-w-6xl lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center space-x-2">
              <Rss size={20} weight="bold" />

              <span className="font-bold uppercase">Rss power</span>
            </div>
          </div>

          <div className="flex max-w-xs items-center rounded-full bg-white text-sm">
            <DropdownMenu>
              <DropdownMenu.Trigger>
                <button
                  className="group rounded-full bg-gray-200 p-1.5 hover:bg-gray-300"
                  data-testid="user-menu"
                >
                  <UserIcon
                    className="text-gray-500 group-hover:text-gray-600"
                    size={24}
                  />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content>
                <DropdownMenu.Label>
                  <p className="text-sm">Signed in as</p>

                  <p className="truncate text-sm font-medium text-gray-900">
                    {user.email}
                  </p>
                </DropdownMenu.Label>

                <DropdownMenu.Item>
                  <button onClick={handleLogoutClick}>Logout</button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
