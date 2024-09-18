const { Worker } = require("bullmq");

const sendMail = () => {
  return new Promise((res, rej) => setTimeout(() => res(), 5 * 1000));
};

new Worker(
  "email-queue",
  async (job) => {
    console.log(`Message rac id:${job.id} `);
    console.log("Processing Message");
    console.log(`Sending email to: ${job.data.email}`);
    await sendMail();
    console.log("Email send");
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
