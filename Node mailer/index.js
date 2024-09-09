const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Make sure to have 'views' folder

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "kingsuk055@gmail.com",
    pass: "xpbb wdtc uuxb tmwo",
  },
});

async function main(email) {
  if (!email) {
    throw new Error("No recipient email provided"); // Error if email is missing
  }

  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
    to: email, // Email recipient
    subject: "Hello ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>",
  });

  console.log("Message sent: %s", info.messageId);
}

app.get("/", (req, res) => {
  res.render("email");
});

app.post("/sendmail", async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).send("No email provided!");
    }
    await main(email);
    res.send("Email sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending email");
  }
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
