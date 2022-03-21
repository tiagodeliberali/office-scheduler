import { format } from 'date-fns/esm';
import { ISlot } from './Slot';

type IScheduledSlotProps = {
    slot: ISlot
}

export default function ScheduledSlot({ slot }: IScheduledSlotProps) {
    return (
        <div>
            scheduled {format(slot.startDate, "HH:mm")}
        </div>
    )
}