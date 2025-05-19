import { TranscriptionButton } from "@/components/transcription-button";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof TranscriptionButton> = {
  title: "Components/TranscriptionButton",
  component: TranscriptionButton,
  argTypes: {
    onOpen: { action: "onOpen" },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onOpen: fn(),
  },
};
