import { faker } from "@faker-js/faker";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { ResourceCard } from "./index";

export default {
  component: ResourceCard,
  title: "Resources/Resource card",
} as ComponentMeta<typeof ResourceCard>;

const Template: ComponentStory<typeof ResourceCard> = (args) => (
  <ResourceCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  resource: {
    createdAt: faker.date.past().toISOString(),
    description: faker.lorem.paragraph(),
    feedResource: null,
    id: faker.datatype.uuid(),
    image: null,
    imageId: faker.datatype.uuid(),
    link: "https://example.com",
    publishedAt: faker.date.past().toISOString(),
    publisher: {
      createdAt: faker.date.past().toISOString(),
      description: faker.lorem.paragraph(),
      id: faker.datatype.uuid(),
      image: null,
      imageId: faker.datatype.uuid(),
      link: "https://example.com",
      title: faker.lorem.sentence(3),
      updatedAt: faker.date.past().toISOString(),
    },
    publisherId: faker.datatype.uuid(),
    title: faker.lorem.sentence(3),
    updatedAt: faker.date.past().toISOString(),
    userResources: [],
  },
  showPublisherInformation: false,
};

export const WithPublisherInfo = Template.bind({});
WithPublisherInfo.args = {
  ...Default.args,
  showPublisherInformation: true,
};
