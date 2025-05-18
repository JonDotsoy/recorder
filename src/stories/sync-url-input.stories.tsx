import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { SyncUrlInputControl } from "./sync-url-input.control.js";

const meta: Meta<typeof SyncUrlInputControl> = {
  title: "Components/SyncUrlInput",
  component: SyncUrlInputControl,
  argTypes: {},
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Connected: Story = {
  args: {
    connected: true,
  },
};

export const Disconnected: Story = {
  args: {
    connected: true,
    syncing: false,
    urlSync: "http://localhost:3000/sync",
  },
};
