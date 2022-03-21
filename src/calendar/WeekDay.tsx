import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { format } from 'date-fns/esm';

import { IDay } from "./CalendarService";
import Slot from '../Slot/Slot'

type IWeekDayProps = {
    day: IDay
}

const dayGapStackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 10,
};

export default function WeekDay({ day }: IWeekDayProps) {
    return (
        <Stack tokens={dayGapStackTokens}>
            {day?.slots.map(event => <Slot slot={event} />)}
        </Stack>
    )
}