import { DateTimeTimeZone, Event, NullableOption } from "microsoft-graph";
import {
  endOfWeek,
  startOfWeek,
  add,
  startOfHour,
  setHours,
  setMinutes,
  startOfDay,
  isSameDay,
} from "date-fns/esm";
import { toDate } from "date-fns-tz";
import { ISlot } from "../slot/BaseSlot";

export type IWeek = {
  startDate: Date;
  endDate: Date;
  days: IDay[];
};

export type IDay = {
  date: Date;
  slots: ISlot[];
};

const parseEventDate = (
  eventDate: NullableOption<DateTimeTimeZone> | undefined
): Date => {
  if (eventDate?.dateTime) {
    return toDate(eventDate?.dateTime, {
      timeZone: eventDate?.timeZone || "UTC",
    });
  }
  return new Date();
};

export const dateOnTimeZone = (date: Date, timezone: string): Date => {
  return toDate(date.toISOString(), { timeZone: timezone });
};

const createEmptySlots = (referenceDate: Date): ISlot[] => {
  const periods = [
    {
      initialHours: 9,
      initialMinutes: 0,
      duration: 80,
      quantity: 3,
    },
    {
      initialHours: 14,
      initialMinutes: 30,
      duration: 80,
      quantity: 3,
    },
  ];

  const slots = [] as ISlot[];

  periods.forEach((period) => {
    for (let i = 0; i < period.quantity; i++) {
      const timeAtInitialHour = startOfHour(
        setHours(referenceDate, period.initialHours)
      );
      const timeAtInitialMinute = setMinutes(
        timeAtInitialHour,
        period.initialMinutes
      );
      const time = add(timeAtInitialMinute, {
        minutes: period.duration * i,
      });

      slots.push({
        startDate: time,
        endDate: add(time, {
          minutes: period.duration,
        }),
        event: undefined,
      });
    }
  });

  return slots;
};

export const mergeEvents = (emptyWeek: IWeek, events: Event[]): IWeek => {
  events.forEach((event) => {
    emptyWeek.days
      .filter((day) => isSameDay(day.date, parseEventDate(event.start)))
      .forEach((filteredDay) => {
        const filteredSlots = filteredDay.slots.filter(
          (slot) =>
            slot.startDate >= parseEventDate(event.end) ||
            slot.endDate <= parseEventDate(event.start)
        );
        filteredSlots.push({
          startDate: parseEventDate(event.start),
          endDate: parseEventDate(event.end),
          event: event,
        });

        filteredDay.slots = filteredSlots;
      });
  });

  return emptyWeek;
};

export const buildEmptyWeek = (referenceDate: Date): IWeek => {
  const start = startOfDay(startOfWeek(referenceDate));
  const end = startOfDay(endOfWeek(referenceDate));

  const week = {
    startDate: start,
    endDate: end,
    days: [] as IDay[],
  };

  for (let i = 1; i <= 5; i++) {
    const date = add(start, { days: i });
    week.days.push({
      date: date,
      slots: createEmptySlots(date),
    });
  }

  return week;
};
