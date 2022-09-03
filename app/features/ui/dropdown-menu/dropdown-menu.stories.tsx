import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { DropdownMenu } from "./index";

export default {
  component: DropdownMenu,
  title: "UI/Dropdown Menu",
} as ComponentMeta<typeof DropdownMenu>;

const Template: ComponentStory<typeof DropdownMenu> = (args) => (
  <DropdownMenu {...args}>
    <DropdownMenu.Trigger>
      <button>Click me!</button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content>
      <DropdownMenu.Label>Label</DropdownMenu.Label>

      <DropdownMenu.Item>
        <button>Item 1</button>
      </DropdownMenu.Item>

      <DropdownMenu.Item>
        <button>Item 2</button>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu>
);

export const Default = Template.bind({});
Default.args = {};
