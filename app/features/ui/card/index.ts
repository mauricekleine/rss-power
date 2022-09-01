import CardBody from "./card-body";
import CardFooter from "./card-footer";
import CardHeader from "./card-header";
import CardLinkableBody from "./card-linkable-body";
import CardRoot from "./card-root";

const Card = Object.assign(CardRoot, {
  Body: CardBody,
  Footer: CardFooter,
  Header: CardHeader,
  LinkableBody: CardLinkableBody,
});

export { Card };
