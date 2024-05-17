import {
  Canister,
  Err,
  ic,
  nat64,
  Ok,
  Opt,
  Principal,
  query,
  Record,
  Result,
  StableBTreeMap,
  text,
  update,
  Variant,
  Vec,
} from "azle";

const Event = Record({
  id: Principal,
  createdAt: nat64,
  name: text,
  description: text,
  location: text,
  date: text,
  time: text,
});
type Event = typeof Event.tsType;
const EventError = Variant({
  EventDoesNotExist: Principal,
});
type EventError = typeof EventError.tsType;

let events = StableBTreeMap<Principal, Event>(1);

export default Canister({
  createEvent: update(
    [text, text, text, text, text],
    Result(Event, EventError),
    (name, description, location, date, time) => {
      const id = generateId();
      const event: Event = {
        id,
        createdAt: ic.time(),
        name,
        description,
        location,
        date,
        time,
      };

      events.insert(event.id, event);

      return Ok(event);
    }
  ),
  readEvents: query([], Vec(Event), () => {
    return events.values();
  }),
  readEventById: query([Principal], Opt(Event), (id) => {
    return events.get(id);
  }),
  deleteEvent: update([Principal], Result(Event, EventError), (id) => {
    const eventOpt = events.get(id);

    if ("None" in eventOpt) {
      return Err({ EventDoesNotExist: id });
    }

    const event = eventOpt.Some;

    events.remove(id);

    return Ok(event);
  }),

  fetchUpcomingEvents: query([], Vec(Event), () => {
    const currentTimeStamp: BigInt = BigInt(Date.now());

    const upcomingEvents: Event[] = [];

    events.values().forEach((event) => {
      const eventTimeStamp = parseTimestamp(event.date, event.time);
      if (eventTimeStamp !== -1n && eventTimeStamp > currentTimeStamp) {
        upcomingEvents.push(event);
      }
    });

    return upcomingEvents;
  }),
});

function generateId(): Principal {
  const randomBytes = new Array(29)
    .fill(0)
    .map((_) => Math.floor(Math.random() * 256));

  return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}

function parseTimestamp(date: string, time: string): BigInt {
  const dateTimeString = `${date}T${time}`;
  const timestamp = Date.parse(dateTimeString);
  if (!isNaN(timestamp)) {
    return BigInt(timestamp);
  } else {
    return -1n;
  }
}
