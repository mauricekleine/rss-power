import type { ComponentMeta, ComponentStory } from "@storybook/react";

import Stack, {
  StackAlignItems,
  StackDirection,
  StackGap,
  StackJustifyContent,
} from "./stack";

export default {
  argTypes: {
    alignItems: {
      control: {
        options: Object.values(StackAlignItems),
        type: "radio",
      },
    },
    direction: {
      control: {
        options: Object.values(StackDirection),
        type: "radio",
      },
    },
    gap: {
      control: {
        options: Object.values(StackGap),
        type: "radio",
      },
    },
    hasDivider: {
      control: { type: "boolean" },
    },
    justifyContent: {
      control: {
        options: Object.values(StackJustifyContent),
        type: "radio",
      },
    },
  },
  component: Stack,
  title: "Layout/Stack",
} as ComponentMeta<typeof Stack>;

const Template: ComponentStory<typeof Stack> = (args) => (
  <Stack {...args}>
    <div>One</div>

    <div>Two</div>

    <div>Three</div>
  </Stack>
);

export const Default = Template.bind({});
Default.args = {
  direction: StackDirection.HORIZONTAL,
  hasDivider: false,
};
