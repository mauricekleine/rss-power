import DrawerContent from "./drawer-content";
import DrawerRoot from "./drawer-root";
import DrawerTrigger from "./drawer-trigger";

const Drawer = Object.assign(DrawerRoot, {
  Content: DrawerContent,
  Trigger: DrawerTrigger,
});

export { Drawer };
