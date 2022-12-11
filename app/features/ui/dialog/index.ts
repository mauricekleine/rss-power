import DialogContent from "./dailog-content";
import DialogBody from "./dialog-body";
import DialogFooter from "./dialog-footer";
import DialogHeader from "./dialog-header";
import DialogRoot from "./dialog-root";
import DialogTrigger from "./dialog-trigger";

const Dialog = Object.assign(DialogRoot, {
  Body: DialogBody,
  Content: DialogContent,
  Footer: DialogFooter,
  Header: DialogHeader,
  Trigger: DialogTrigger,
});

export { Dialog };
