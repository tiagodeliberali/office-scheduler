import { Event } from 'microsoft-graph';
import { endOfWeek, startOfWeek, add, startOfHour, setHours, setMinutes, startOfDay } from 'date-fns/esm';
import { zonedTimeToUtc } from 'date-fns-tz';
import { ISlot } from '../Slot/Slot';

export type IWeek = {
    startDate: Date,
    endDate: Date,
    days: IDay[],
}

export type IDay = {
    date: Date,
    slots: ISlot[],
}

const createEmptySlots = (referenceDate: Date): ISlot[] => {
    const periods = [{
        initialHours: 9,
        initialMinutes: 0,
        duration: 80,
        quantity: 3
    }, {
        initialHours: 14,
        initialMinutes: 30,
        duration: 80,
        quantity: 3
    }];

    const slots = [] as ISlot[];

    periods.forEach(period => {
        for (let i = 0; i < period.quantity; i++) {
            const timeAtInitialHour = startOfHour(setHours(referenceDate, period.initialHours));
            const timeAtInitialMinute = setMinutes(timeAtInitialHour, period.initialMinutes)
            const time = add(timeAtInitialMinute, {
                minutes: period.duration * i
            });

            slots.push({
                startDate: time,
                endDate: add(time, {
                    minutes: period.duration
                }),
                event: undefined
            })
        }
    });

    return slots;
}

export const mergeEvents = (emptyWeek: IWeek, events: Event[]): IWeek => {
    events.forEach(event => {
        emptyWeek.days.filter(day => day.date == new Date(event.start?.dateTime!)).forEach(filteredDay => {
            const toBeRemoved = filteredDay.slots.forEach((slot, index) => {
                if (slot.startDate < new Date(event.end?.dateTime!) && slot.endDate > new Date(event.start?.dateTime!)) {
                    filteredDay.slots.splice(index, 1);
                }
            });
            filteredDay.slots.push({
                startDate: new Date(event.start?.dateTime!),
                endDate: new Date(event.end?.dateTime!),
                event: event
            })
        })
    })

    return emptyWeek;
}


export const buildEmptyWeek = (referenceDate: Date, timezone: string): IWeek => {
    const start = startOfDay(zonedTimeToUtc(startOfWeek(referenceDate), timezone));
    const end = startOfDay(zonedTimeToUtc(endOfWeek(referenceDate), timezone));

    const week = {
        startDate: start,
        endDate: end,
        days: [] as IDay[],
    }

    for (let i = 1; i <= 5; i++) {
        const date = add(start, { days: i })
        week.days.push({
            date: date,
            slots: createEmptySlots(date),
        })
    }

    return week;
}