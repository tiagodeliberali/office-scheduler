import { Event } from "microsoft-graph";

import ScheduledSlot from "./ScheduledSlot";
import EmptySlot from "./EmptySlot";

export type ISlot = {
  startDate: Date;
  endDate: Date;
  event: Event | undefined;
};

type ISlotProps = {
  slot: ISlot;
  onSchedule: any;
};

export default function CalendarRow({ slot, onSchedule }: ISlotProps) {
  return slot.event ? (
    <ScheduledSlot slot={slot} />
  ) : (
    <EmptySlot slot={slot} onSchedule={onSchedule} />
  );
}
