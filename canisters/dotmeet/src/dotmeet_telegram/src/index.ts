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
import TokenCanister from "../../dotmeet_backend/src/index";

const tokenCanister = TokenCanister(
  Principal.fromText("a4tbr-q4aaa-aaaaa-qaafq-cai")
);
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
const BotCommand = Record({
  command: text,
  args: Vec(text),
});
type BotCommand = typeof BotCommand.tsType;

const BotResponse = Record({
  success: text,
  error: Opt(text),
});
type BotResponse = typeof BotResponse.tsType;
export default Canister({
  handleBotCommand: update([BotCommand], BotResponse, async (command) => {
    switch (command.command) {
      case "getAllEvents":
        return await getAllEvents();
      default:
        return { success: "", error: Some("Unknown command") };
    }
  }),

  fetchEvents: query([], Vec(Event), async () => {
    return await ic.call(tokenCanister.readEvents);
  }),
  createEvent: update(
    [text, text, text, text, text],
    Result(Event, EventError),
    async (name, description, location, date, time) => {
      return await ic.call(tokenCanister.createEvent, {
        args: [name, description, location, date, time],
      });
    }
  ),
});

async function getAllEvents(): Promise<any> {
  try {
    return await ic.call(tokenCanister.readEvents);
  } catch (error: any) {
    return { success: "", error: Some(error.toString()) };
  }
}
