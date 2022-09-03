import type { ComponentMeta, ComponentStory } from "@storybook/react";

import Avatar, { AvatarSize } from "./avatar";

export default {
  argTypes: {
    size: {
      control: {
        options: Object.values(AvatarSize),
        type: "radio",
      },
    },
  },
  component: Avatar,
  title: "UI/Avatar",
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: "md",
  title: "Default",
};

export const WithImage = Template.bind({});
WithImage.args = {
  size: "md",
  src: "https://placekitten.com/128/128",
  title: "Kitten",
};
