import { faker } from "@faker-js/faker";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { FeedCard } from "./index";

export default {
  component: FeedCard,
  title: "Feeds/Feed card",
} as ComponentMeta<typeof FeedCard>;

const Template: ComponentStory<typeof FeedCard> = (args) => (
  <FeedCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  feed: {
    _count: { userFeeds: 3 },
    createdAt: faker.date.past().toISOString(),
    description: faker.lorem.paragraph(),
    id: faker.datatype.uuid(),
    image: null,
    imageId: faker.datatype.uuid(),
    link: "https://example.com",
    origin: "https://example.com/rss",
    publisherId: faker.datatype.uuid(),
    title: faker.lorem.sentence(3),
    updatedAt: faker.date.past().toISOString(),
  },
};
