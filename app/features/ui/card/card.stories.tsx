import { faker } from "@faker-js/faker";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Card } from "./index";

export default {
  component: Card,
  title: "UI/Card",
} as ComponentMeta<typeof Card>;

const cardBodyContent = faker.lorem.paragraph();

const DefaultTemplate: ComponentStory<typeof Card> = (args) => (
  <Card {...args}>
    <Card.Header>Header</Card.Header>

    <Card.Body>{cardBodyContent}</Card.Body>

    <Card.Footer>Footer</Card.Footer>
  </Card>
);

const LinkableTemplate: ComponentStory<typeof Card> = (args) => (
  <Card {...args}>
    <Card.Header>Header</Card.Header>

    <Card.LinkableBody href="https://example.com">
      {cardBodyContent}
    </Card.LinkableBody>

    <Card.Footer>Footer</Card.Footer>
  </Card>
);

export const Default = DefaultTemplate.bind({});
Default.args = {
  isInactive: false,
};

export const InactiveDefault = DefaultTemplate.bind({});
InactiveDefault.args = {
  isInactive: true,
};

export const Linkable = LinkableTemplate.bind({});
Linkable.args = {
  isInactive: false,
};

export const InactiveLinkable = LinkableTemplate.bind({});
InactiveLinkable.args = {
  isInactive: true,
};
