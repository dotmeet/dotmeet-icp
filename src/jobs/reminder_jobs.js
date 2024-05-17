// import node schedule
const schedule = require("node-schedule");
// import moment
const moment = require("moment-timezone");

// Services
const {
  generateDotmeetReminderMessage,
} = require("../services/message/event_message_services");

// import firestore
const {
  fetchAllEventsTomorrow,
  fetchAllEventsAfter4Days,
} = require("../services/firestore/event_services");
const { getCronsByRegion } = require("../services/date_services");

// now we need actually one function that will schedule the job

const scheduleTheJobs = () => {
  // cronJobLondon();
  cronJobDubai();
  cronJobJapan();

  // cronJobSingapore();
  // cronJobMiami();
  // cronJobParis();
  // cronJobSanFrancisco();
  // cronJobNewYork();
  // cronJobLisbon();
};

// cron for Dubai
const cronJobDubai = () => {
  const { cronTime10AM, cronTime930PM, crontTime2PM } =
    getCronsByRegion("Dubai");
  // schedule the job
  // schedule.scheduleJob(cronTime10AM, async () => {
  //   await fetchAllEventsToday("Dubai").then((events) => {
  //     events.forEach((event) => {
  //       generateDotmeetReminderMessage(
  //         event,
  //         `from 👉 Today at ${event.eventTiming}`
  //       );
  //     });
  //   });
  // });

  schedule.scheduleJob(crontTime2PM, async () => {
    await fetchAllEventsAfter4Days("Dubai").then((events) => {
      events.forEach((event) => {
        generateDotmeetReminderMessage(
          event,
          `In 👉 4 days from ${event.eventTiming}`
        );
      });
    });
  });

  schedule.scheduleJob(cronTime930PM, async () => {
    await fetchAllEventsTomorrow("Dubai").then((events) => {
      events.forEach((event) => {
        generateDotmeetReminderMessage(
          event,
          `from 👉 Tomorrow at ${event.eventTiming}`
        );
      });
    });
  });
};

// cron for Japan
const cronJobJapan = () => {
  const { cronTime10AM, cronTime930PM, crontTime2PM } =
    getCronsByRegion("Japan");
  // schedule the job
  // schedule.scheduleJob(cronTime10AM, async () => {
  //   await fetchAllEventsToday("Dubai").then((events) => {
  //     events.forEach((event) => {
  //       generateDotmeetReminderMessage(
  //         event,
  //         `from 👉 Today at ${event.eventTiming}`
  //       );
  //     });
  //   });
  // });

  schedule.scheduleJob(crontTime2PM, async () => {
    await fetchAllEventsAfter4Days("Japan").then((events) => {
      events.forEach((event) => {
        generateDotmeetReminderMessage(
          event,
          `In 👉 4 days from ${event.eventTiming}`
        );
      });
    });
  });

  schedule.scheduleJob(cronTime930PM, async () => {
    await fetchAllEventsTomorrow("Japan").then((events) => {
      events.forEach((event) => {
        generateDotmeetReminderMessage(
          event,
          `from 👉 Tomorrow at ${event.eventTiming}`
        );
      });
    });
  });
};

// cron for London
const cronJobLondon = () => {
  const { cronTime10AM, cronTime930PM, crontTime2PM } = getCronsByRegion("LDN");
  // schedule the job
  // schedule.scheduleJob(cronTime10AM, async () => {
  //   await fetchAllEventsToday("London").then((events) => {
  //     events.forEach((event) => {
  //       generateDotmeetReminderMessage(
  //         event,
  //         `from 👉 Today at ${event.eventTiming}`
  //       );
  //     });
  //   });
  // });

  schedule.scheduleJob(crontTime2PM, async () => {
    await fetchAllEventsAfter4Days("LDN").then((events) => {
      events.forEach((event) => {
        generateDotmeetReminderMessage(
          event,
          `In 👉 4 days from ${event.eventTiming}`
        );
      });
    });
  });

  schedule.scheduleJob(cronTime930PM, async () => {
    await fetchAllEventsTomorrow("LDN").then((events) => {
      events.forEach((event) => {
        generateDotmeetReminderMessage(
          event,
          `from 👉 Tomorrow at ${event.eventTiming}`
        );
      });
    });
  });
};

// cron for Singapore
const cronJobSingapore = () => {
  const { cronTime10AM, cronTime930PM, crontTime2PM } = getCronsByRegion("SG");
  // schedule the job
  // schedule.scheduleJob(cronTime10AM, async () => {
  //   await fetchAllEventsToday("SG").then((events) => {
  //     events.forEach((event) => {
  //       generateDotmeetReminderMessage(
  //         event,
  //         `from 👉 Today at ${event.eventTiming}`
  //       );
  //     });
  //   });
  // });

  schedule.scheduleJob(crontTime2PM, async () => {
    await fetchAllEventsAfter4Days("SG").then((events) => {
      events.forEach((event) => {
        generateDotmeetReminderMessage(
          event,
          `In 👉 4 days from ${event.eventTiming}`
        );
      });
    });
  });

  schedule.scheduleJob(cronTime930PM, async () => {
    await fetchAllEventsTomorrow("SG").then((events) => {
      events.forEach((event) => {
        generateDotmeetReminderMessage(
          event,
          `from 👉 Tomorrow at ${event.eventTiming}`
        );
      });
    });
  });
};

// cron to Miami
const cronJobMiami = () => {
  const { cronTime10AM, cronTime930PM, crontTime2PM } = getCronsByRegion("MIA");
  // schedule the job
  // schedule.scheduleJob(cronTime10AM, async () => {
  //   await fetchAllEventsToday("MIA").then((events) => {
  //     events.forEach((event) => {
  //       generateDotmeetReminderMessage(
  //         event,
  //         `from 👉 Today at ${event.eventTiming}`
  //       );
  //     });
  //   });
  // });

  schedule.scheduleJob(crontTime2PM, async () => {
    await fetchAllEventsAfter4Days("MIA").then((events) => {
      events.forEach((event) => {
        generateDotmeetReminderMessage(
          event,
          `In 👉 4 days from ${event.eventTiming}`
        );
      });
    });
  });

  schedule.scheduleJob(cronTime930PM, async () => {
    await fetchAllEventsTomorrow("MIA").then((events) => {
      events.forEach((event) => {
        generateDotmeetReminderMessage(
          event,
          `from 👉 Tomorrow at ${event.eventTiming}`
        );
      });
    });
  });
};

// Cron for Paris
const cronJobParis = () => {
  const { cronTime10AM, cronTime930PM, crontTime2PM } =
    getCronsByRegion("Paris");
  // schedule the job
  // schedule.scheduleJob(cronTime10AM, async () => {
  //   await fetchAllEventsToday("Paris").then((events) => {
  //     events.forEach((event) => {
  //       generateDotmeetReminderMessage(
  //         event,
  //         `from 👉 Today at ${event.eventTiming}`
  //       );
  //     });
  //   });
  // });

  schedule.scheduleJob(crontTime2PM, async () => {
    await fetchAllEventsAfter4Days("Paris").then((events) => {
      events.forEach((event) => {
        generateDotmeetReminderMessage(
          event,
          `In 👉 4 days from ${event.eventTiming}`
        );
      });
    });
  });

  schedule.scheduleJob(cronTime930PM, async () => {
    await fetchAllEventsTomorrow("Paris").then((events) => {
      events.forEach((event) => {
        generateDotmeetReminderMessage(
          event,
          `from 👉 Tomorrow at ${event.eventTiming}`
        );
      });
    });
  });
};

// // crone for San Francisco
// const cronJobSanFrancisco = () => {
//   const { cronTime10AM, cronTime930PM, crontTime2PM } = getCronsByRegion("SF");
//   // schedule the job
//   // schedule.scheduleJob(cronTime10AM, async () => {
//   //   await fetchAllEventsToday("SF").then((events) => {
//   //     events.forEach((event) => {
//   //       generateDotmeetReminderMessage(
//   //         event,
//   //         `from 👉 Today at ${event.eventTiming}`
//   //       );
//   //     });
//   //   });
//   // });

//   schedule.scheduleJob(crontTime2PM, async () => {
//     await fetchAllEventsAfter4Days("SF").then((events) => {
//       events.forEach((event) => {
//         generateDotmeetReminderMessage(
//           event,
//           `In 👉 4 days from ${event.eventTiming}`
//         );
//       });
//     });
//   });

//   schedule.scheduleJob(cronTime930PM, async () => {
//     await fetchAllEventsTomorrow("SF").then((events) => {
//       events.forEach((event) => {
//         generateDotmeetReminderMessage(
//           event,
//           `from 👉 Tomorrow at ${event.eventTiming}`
//         );
//       });
//     });
//   });
// };

// crone for New York
// const cronJobNewYork = () => {
//   const { cronTime10AM, cronTime930PM, crontTime2PM } = getCronsByRegion("NY");
//   // schedule the job
//   // schedule.scheduleJob(cronTime10AM, async () => {
//   //   await fetchAllEventsToday("NY").then((events) => {
//   //     events.forEach((event) => {
//   //       generateDotmeetReminderMessage(
//   //         event,
//   //         `from 👉 Today at ${event.eventTiming}`
//   //       );
//   //     });
//   //   });
//   // });

//   schedule.scheduleJob(crontTime2PM, async () => {
//     await fetchAllEventsAfter4Days("NY").then((events) => {
//       events.forEach((event) => {
//         generateDotmeetReminderMessage(
//           event,
//           `In 👉 4 days from ${event.eventTiming}`
//         );
//       });
//     });
//   });

//   schedule.scheduleJob(cronTime930PM, async () => {
//     await fetchAllEventsTomorrow("NY").then((events) => {
//       events.forEach((event) => {
//         generateDotmeetReminderMessage(
//           event,
//           `from 👉 Tomorrow at ${event.eventTiming}`
//         );
//       });
//     });
//   });
// };

// crone for Lisbon
// const cronJobLisbon = () => {
//   const { cronTime10AM, cronTime930PM, crontTime2PM } = getCronsByRegion("LIS");
//   // schedule the job
//   // schedule.scheduleJob(cronTime10AM, async () => {
//   //   await fetchAllEventsToday("LIS").then((events) => {
//   //     events.forEach((event) => {
//   //       generateDotmeetReminderMessage(
//   //         event,
//   //         `from 👉 Today at ${event.eventTiming}`
//   //       );
//   //     });
//   //   });
//   // });

//   schedule.scheduleJob(crontTime2PM, async () => {
//     await fetchAllEventsAfter4Days("LIS").then((events) => {
//       events.forEach((event) => {
//         generateDotmeetReminderMessage(
//           event,
//           `In 👉 4 days from ${event.eventTiming}`
//         );
//       });
//     });
//   });

//   schedule.scheduleJob(cronTime930PM, async () => {
//     await fetchAllEventsTomorrow("LIS").then((events) => {
//       events.forEach((event) => {
//         generateDotmeetReminderMessage(
//           event,
//           `from 👉 Tomorrow at ${event.eventTiming}`
//         );
//       });
//     });
//   });
// };

module.exports = {
  scheduleTheJobs,
};
