import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { format } from 'date-fns/esm';
import { Text, ITextProps } from '@fluentui/react/lib/Text';

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
            <Text variant='xxLarge' nowrap block>
                {format(day.date, "dd")}
            </Text>
            <Text variant='large' nowrap block>
                {format(day.date, "EEE")}
            </Text>
            {day?.slots.sort((a, b) => (a.startDate < b.startDate) ? -1 : 1).map(event => <Slot slot={event} />)}
        </Stack>
    )
}