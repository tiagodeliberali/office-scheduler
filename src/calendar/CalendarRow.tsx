import { Event } from "microsoft-graph"
import { add, format, getDay, parseISO } from 'date-fns';
import {
    DocumentCard,
    DocumentCardActivity,
    DocumentCardTitle,
    DocumentCardLogo,
    DocumentCardStatus,
    IDocumentCardLogoProps,
    IDocumentCardActivityPerson,
    IDocumentCardStyles,
} from '@fluentui/react/lib/DocumentCard';

type CalendarRowProps = {
    event: Event
}

export default function CalendarRow({ event }: CalendarRowProps) {
    const date = parseISO(event.start?.dateTime!);

    const logoProps: IDocumentCardLogoProps = {
        logoIcon: 'calendar',
    };

    const cardStyles: IDocumentCardStyles = {
        root: { display: 'inline-block', marginRight: 20, width: 320 },
    };

    let attendees: string = '';

    event.attendees?.forEach(person => {
        attendees = attendees + person.emailAddress?.name
        //  + "(" + person.emailAddress?.address + ")";
    });

    return (
        <DocumentCard
            styles={cardStyles}
        >
            <DocumentCardLogo {...logoProps} />
            <div>
                <DocumentCardTitle title={format(date, "dd/MM/yyyy - HH:mm")} />
                <DocumentCardTitle title={event.subject || ''} showAsSecondaryTitle />
                <DocumentCardStatus statusIcon="people" status={attendees} />

            </div>
            <DocumentCardActivity activity="Sent March 13, 2018" people={[]} />
        </DocumentCard>
    );
}
