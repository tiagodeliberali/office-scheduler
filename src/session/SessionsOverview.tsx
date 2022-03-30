import { DocumentCardStatus } from "@fluentui/react";
import { Stack } from "@fluentui/react/lib/Stack";
import { parseISO, format } from "date-fns/esm";
import { useT } from "talkr";

type ISessionsOverviewProps = {
  sessions: string[];
};

export default function SessionsOverview({ sessions }: ISessionsOverviewProps) {
  const { T } = useT();

  let message = "";
  if (sessions.length === 0) {
    message = T("sessionsOverview.noAnamnesis")?.toString() || "<not defined>";
  } else if (sessions.length === 1) {
    message = T("sessionsOverview.noSession")?.toString() || "<not defined>";
  } else if (sessions.length === 2) {
    message =
      T("sessionsOverview.firstSession", {
        date: format(parseISO(sessions[1]), "dd/MM/yyyy"),
      })?.toString() || "<not defined>";
  } else {
    message =
      T("sessionsOverview.sessions", {
        date: format(parseISO(sessions[sessions.length - 1]), "dd/MM/yyyy"),
        qtd: sessions.length - 1,
      })?.toString() || "<not defined>";
  }

  return (
    <Stack>
      <DocumentCardStatus
        styles={{ root: { margin: 0 } }}
        statusIcon="info"
        status={message}
      />
    </Stack>
  );
}
