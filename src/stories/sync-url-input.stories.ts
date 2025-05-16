import { SyncUrlInput } from "../components/sync-url-input.js";

import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof SyncUrlInput> = {
  title: "Components/SyncUrlInput",
  component: SyncUrlInput,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
