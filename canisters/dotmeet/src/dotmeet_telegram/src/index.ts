import {
  Canister,
  ic,
  nat64,
  None,
  Opt,
  Principal,
  query,
  Record,
  Result,
  Some,
  text,
  update,
  Variant,
  Vec,
} from "azle";
import DotmeetBackend from "../../dotmeet_backend/src/index";

const dotmeetBackend = DotmeetBackend(
  Principal.fromText("a4tbr-q4aaa-aaaaa-qaafq-cai")
);
const Event = Record({
  id: Principal,
  createdAt: nat64,
  name: text,
  description: text,
  regLink: text,
  location: text,
  date: text,
  time: text,
});
type Event = typeof Event.tsType;
const EventError = Variant({
  EventDoesNotExist: Principal,
});
type EventError = typeof EventError.tsType;

export default Canister({
  fetchEvents: query([], Vec(Event), async () => {
    return await ic.call(dotmeetBackend.readEvents);
  }),
  fetchUpcomingEvents: query([], Vec(Event), async () => {
    return await ic.call(dotmeetBackend.fetchUpcomingEvents);
  }),
  createEvent: update(
    [text, text, text, text, text, text],
    Result(Event, EventError),
    async (name, description, regLink, location, date, time) => {
      return await ic.call(dotmeetBackend.createEvent, {
        args: [name, description, regLink, location, date, time],
      });
    }
  ),
});
