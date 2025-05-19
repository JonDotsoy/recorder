import type { RecordDTO } from "@/components/dtos/record-dto";
import { RecordCard } from "@/components/records-list/record-card";
import { TranscriptionButton } from "@/components/transcription-button";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof RecordCard> = {
  title: "Components/RecordCard",
  component: RecordCard,
  argTypes: {
    onDownloadRecord: { action: "onDownloadRecord" },
    onPlayRecord: { action: "onPlayRecord" },
    onDeleteRecord: { action: "onDeleteRecord" },
    onOpenTranscription: { action: "onOpenTranscription" },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    record: {
      key: "record-key",
      data: new Blob([new Uint8Array(12)], { type: "audio/wav" }),
      timestamp: Date.now(),
    },
  },
};
