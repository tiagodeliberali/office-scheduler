import { useEffect, useState } from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { useAppContext } from "../common/AppContext";
import { parseISO, isSameDay, format } from "date-fns/esm";
import { useT } from "talkr";
import { Contact } from "microsoft-graph";
import {
  initializeContactSection,
  addContactSession,
} from "./OneNoteGraphService";
import { DefaultButton } from "@fluentui/react";
import { ISlot } from "../slot/BaseSlot";
import SessionsOverview from "./SessionsOverview";

type ISessionFlowOverviewProps = {
  contact: Contact | undefined;
  slot: ISlot;
};

const containsTodaySession = (sessions: string[], slot: ISlot): boolean => {
  return (
    sessions && sessions.some((x) => isSameDay(slot.startDate, parseISO(x)))
  );
};

export default function SessionFlowOverview({
  contact,
  slot,
}: ISessionFlowOverviewProps) {
  const app = useAppContext();
  const { T } = useT();

  const [sessions, setSessions] = useState<string[] | undefined>();
  const [savingContent, setSavingContent] = useState<boolean>(false);

  const updateSessions = (c: Contact | undefined) =>
    setSessions(
      (c?.multiValueExtendedProperties &&
        c?.multiValueExtendedProperties.length > 0 &&
        c?.multiValueExtendedProperties[0].value) ||
        undefined
    );

  useEffect(() => {
    const loadSessions = async () => {
      updateSessions(contact);
    };

    loadSessions();
  }, [contact]);

  const initializeAnamnesis = async () => {
    setSavingContent(true);
    const updatedContact = await initializeContactSection(
      app.authProvider!,
      contact!,
      T("sessionFlowOverview.anamnesis")?.toString() || "<not defined>"
    );
    updateSessions(updatedContact);
    setSavingContent(false);
  };

  const confirmSession = async () => {
    setSavingContent(true);
    const updatedContact = await addContactSession(
      app.authProvider!,
      contact!,
      slot.startDate.toISOString(),
      T("sessionFlowOverview.newsession", {
        date: format(slot.startDate, "dd/MM/yyyy"),
        startTime: format(slot.startDate, "HH:mm"),
        endTime: format(slot.endDate, "HH:mm"),
      })?.toString() || "<not defined>"
    );
    updateSessions(updatedContact);
    setSavingContent(false);
  };

  const initialContentButtonValue = savingContent
    ? T("sessionFlowOverview.savingInitialContent")?.toString()
    : T("sessionFlowOverview.createInitialContent")?.toString();

  const confirmSSessionButtonValue = savingContent
    ? T("sessionFlowOverview.savingSession")?.toString()
    : T("sessionFlowOverview.confirmSession")?.toString();

  return (
    <Stack>
      <Stack.Item styles={{ root: { paddingBottom: 16 } }}>
        <SessionsOverview sessions={sessions || []} />
      </Stack.Item>
      {!sessions && (
        <DefaultButton
          text={initialContentButtonValue}
          disabled={savingContent}
          onClick={initializeAnamnesis}
        />
      )}
      {sessions && !containsTodaySession(sessions, slot) && (
        <DefaultButton
          text={confirmSSessionButtonValue}
          disabled={savingContent}
          onClick={confirmSession}
        />
      )}
      {sessions && containsTodaySession(sessions, slot) && (
        <DefaultButton
          text={T("sessionFlowOverview.sessionConfirmed")?.toString()}
          disabled={true}
        />
      )}
    </Stack>
  );
}
