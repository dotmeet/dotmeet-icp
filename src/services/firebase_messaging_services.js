const { admin } = require("../firebase/firebase-admin");

// send new event message

const sendNewEventMessage = async (event) => {
  console.log(event.region);
  const message = {
    notification: {
      title: `New event: ` + event.name,
      body: `${event.description.substring(0, 20)}...`,
    },
    data: {
      id: event.id,
    },
    topic: event.region,
    apns: {
      headers: {
        "apns-priority": "10", // Set the priority to 10 for high priority
      },
      payload: {
        aps: {
          "mutable-content": 1,
        },
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
        },
      },
    },
    android: {
      notification: {
        sound: "default",
      },
    },
  };

  // send message
  await admin.messaging().send(message);
};

const sendWelcomeTestMessage = async (ctx) => {
  ctx.reply(
    "This is an test message for checking the notification system. sorry for the inconvenience.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🗺️ Explore Full Events Calendar",
              url: "https://event.dotmeet.app/calendar",
            },
          ],
        ],
      },
    }
  );
  // /
  // //
  // const message = {
  //   notification: {
  //     title: "Wecome to dotmeet!",
  //     body: `This is an test message for checking the notification system. sorry for the inconvenience.`,
  //   },

  //   topic: "Dubai",
  //   apns: {
  //     headers: {
  //       "apns-priority": "10", // Set the priority to 10 for high priority
  //     },
  //     payload: {
  //       aps: {
  //         "mutable-content": 1,
  //       },
  //     },
  //   },
  //   apns: {
  //     payload: {
  //       aps: {
  //         sound: "default",
  //       },
  //     },
  //   },
  //   android: {
  //     notification: {
  //       sound: "default",
  //     },
  //   },
  // };

  // await admin.messaging().send(message);
};

module.exports = {
  sendNewEventMessage,
  sendWelcomeTestMessage,
};
