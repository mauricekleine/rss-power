import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Tooltip } from "./index";

export default {
  component: Tooltip,
  title: "UI/Tooltip",
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <Tooltip {...args}>
    <button>Hover me!</button>
  </Tooltip>
);

export const Default = Template.bind({});
Default.args = {
  content: "Tooltip content",
};
