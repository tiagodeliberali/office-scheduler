import { useEffect, useState } from 'react';
import { NavLink as RouterNavLink, Navigate } from 'react-router-dom';
import { Attendee, Event } from 'microsoft-graph';
import { createEvent } from '../common/GraphService';
import { useAppContext } from '../common/AppContext';

import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';

export default function NewEvent() {
    const app = useAppContext();

    const [subject, setSubject] = useState('');
    const [attendees, setAttendees] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [body, setBody] = useState('');
    const [formDisabled, setFormDisabled] = useState(true);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        setFormDisabled(
            subject.length === 0 ||
            start.length === 0 ||
            end.length === 0);
    }, [subject, start, end]);

    const doCreate = async () => {
        const attendeeEmails = attendees.split(';');
        const attendeeArray: Attendee[] = [];

        attendeeEmails.forEach((email) => {
            if (email.length > 0) {
                attendeeArray.push({
                    emailAddress: {
                        address: email
                    }
                });
            }
        });

        const newEvent: Event = {
            subject: subject,
            // Only add if there are attendees
            attendees: attendeeArray.length > 0 ? attendeeArray : undefined,
            // Specify the user's time zone so
            // the start and end are set correctly
            start: {
                dateTime: start,
                timeZone: app.user?.timeZone
            },
            end: {
                dateTime: end,
                timeZone: app.user?.timeZone
            },
            // Only add if a body was given
            body: body.length > 0 ? {
                contentType: 'text',
                content: body
            } : undefined
        };

        try {
            await createEvent(app.authProvider!, newEvent);
            setRedirect(true);
        } catch (err) {
            app.displayError!('Error creating event', JSON.stringify(err));
        }
    };

    if (redirect) {
        return <Navigate to="/calendar" />
    }

    return (
        <>
            <br />Subject
            <TextField
                name="subject"
                id="subject"
                value={subject}
                onChange={(_, value) => setSubject(value || '')} />

            <br />Attendees
            <TextField
                name="attendees"
                id="attendees"
                placeholder="Enter a list of email addresses, seperated by a semi-colon"
                value={attendees}
                onChange={(_, value) => setAttendees(value || '')} />

            <br />Start
            <TextField
                name="start"
                id="start"
                value={start}
                onChange={(_, value) => setStart(value || '')} />

            <br />End
            <TextField
                name="end"
                id="end"
                value={end}
                onChange={(_, value) => setEnd(value || '')} />

            <br />Body
            <TextField
                name="body"
                id="body"
                className="mb-3"
                value={body}
                onChange={(_, value) => setBody(value || '')} />

            <PrimaryButton
                disabled={formDisabled}
                onClick={() => doCreate()}>Create</PrimaryButton>
            <RouterNavLink to="/calendar"
                className="btn btn-secondary">Cancel</RouterNavLink>
        </>
    );
}