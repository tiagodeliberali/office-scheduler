import { useEffect, useState, useReducer } from "react";
import { findIana } from "windows-iana";
import { Event } from "microsoft-graph";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";

import { Stack } from "@fluentui/react/lib/Stack";
import { IconButton, PrimaryButton } from "@fluentui/react/lib/Button";

import { getUserCalendar } from "./CalendarGraphService";
import { useAppContext } from "../common/AppContext";
import NewEvent from "./NewEvent";

import WeekDay from "./WeekDay";
import {
  buildEmptyWeek,
  IWeek,
  mergeEvents,
  dateOnTimeZone,
} from "./CalendarService";
import { format } from "date-fns/esm";

import { Text } from "@fluentui/react/lib/Text";
import { ISlot } from "../slot/BaseSlot";
import { useT } from "talkr";
import { addWeeks } from "date-fns";

export default function Calendar() {
  const app = useAppContext();
  const { T } = useT();

  const [week, setWeek] = useState<IWeek>();
  const [referenceDate, setReferenceDate] = useState<Date>(new Date());
  const [modalState, dispatchModal] = useReducer(
    modalReducer,
    modalInitialState
  );

  useEffect(() => {
    const loadEvents = async () => {
      if (app.user) {
        try {
          const ianaTimeZones = findIana(app.user?.timeZone!);
          const timezone = ianaTimeZones[0].valueOf();

          const emptyWeek = buildEmptyWeek(
            dateOnTimeZone(referenceDate, timezone)
          );
          const events = await getUserCalendar(
            app.authProvider!,
            timezone,
            emptyWeek.startDate!,
            emptyWeek.endDate!
          );
          const mergedWeek = mergeEvents(emptyWeek, events);

          setWeek(mergedWeek);
        } catch (err: any) {
          app.displayError!(err.message);
        }
      }
    };

    loadEvents();
  }, [app.user, referenceDate]);

  const addToReferenceDate = (weeks: number) => {
    setReferenceDate(addWeeks(referenceDate, weeks));
  };

  return (
    <>
      <AuthenticatedTemplate>
        <Stack horizontal>
          <IconButton
            iconProps={{ iconName: "back" }}
            style={{ marginTop: 20, marginRight: 25 }}
            onClick={() => addToReferenceDate(-1)}
          />
          <Text
            variant="xxLarge"
            nowrap
            block
            styles={{ root: { marginTop: 16 } }}
          >
            {week?.startDate && format(week?.startDate, "MMM/yyyy")}
          </Text>
          <IconButton
            iconProps={{ iconName: "forward" }}
            style={{ marginTop: 20, marginLeft: 20 }}
            onClick={() => addToReferenceDate(1)}
          />
        </Stack>

        <Stack horizontal>
          {week?.days.map((day) => (
            <WeekDay
              day={day}
              onSchedule={(slot: ISlot) =>
                dispatchModal({ type: "OPEN_MODAL", slot: slot })
              }
            />
          ))}
        </Stack>

        <NewEvent
          isOpen={modalState.isOpen}
          hideModal={() => dispatchModal({ type: "CLOSE_MODAL" })}
          slot={modalState.slot}
        />
        {/* <pre><code>{JSON.stringify(events, null, 2)}</code></pre> */}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <h1>Office scheduler</h1>
        <p className="lead">{T("welcome.overview")}</p>
        <PrimaryButton
          color="primary"
          onClick={app.signIn!}
          text={T("welcome.signin")?.toString()}
        />
      </UnauthenticatedTemplate>
    </>
  );
}

type IModalData = {
  isOpen: boolean;
  slot?: ISlot;
};

type IAction = {
  type: string;
  slot?: ISlot;
};

const modalInitialState: IModalData = {
  isOpen: false,
};

const modalReducer = (state: IModalData, action: IAction): IModalData => {
  switch (action.type) {
    case "CLOSE_MODAL":
      return {
        isOpen: false,
        slot: undefined,
      };

    case "OPEN_MODAL":
      return {
        isOpen: true,
        slot: action.slot!,
      };

    default:
      return state;
  }
};
