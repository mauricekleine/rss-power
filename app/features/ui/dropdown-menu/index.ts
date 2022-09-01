import DropdownMenuContent from "./dropdown-menu-content";
import DropdownMenuItem from "./dropdown-menu-item";
import DropdownMenuLabel from "./dropdown-menu-label";
import DropdownMenuRoot from "./dropdown-menu-root";
import DropdownMenuTrigger from "./dropdown-menu-trigger";

const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Label: DropdownMenuLabel,
  Trigger: DropdownMenuTrigger,
});

export { DropdownMenu };
