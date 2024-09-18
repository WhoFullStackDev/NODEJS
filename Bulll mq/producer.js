const { Queue } = require("bullmq");

const notificationQueue = new Queue("email-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

async function init() {
  const res = await notificationQueue.add("email", {
    email: "kingsuk055@gmail.com",
    subject: "Welcome Mess",
    body: "Welcome everyone",
  });

  console.log("Job added to queue", res.id);
}

init();
