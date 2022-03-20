import { Event } from "microsoft-graph"
import { add, format, getDay, parseISO } from 'date-fns';

type CalendarRowProps = {
    event: Event
}

export default function CalendarRow({ event }: CalendarRowProps) {
    const date = parseISO(event.start?.dateTime!);

    return (
        <div>
            {format(date, "dd/MM/yyyy - HH:mm")} < br />
            {event.subject} < br />
            {event.attendees?.map(person => <span>{person.emailAddress?.name}({person.emailAddress?.address})</span>)}
        </div >
    );
}
