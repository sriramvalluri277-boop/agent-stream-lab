console.log("branch test second after three also last as well ");
require("dotenv").config();
console.log("KEY:", process.env.OPENAI_API_KEY);
const OpenAI = require("openai");
const Client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

console.log("✅ WebSocket server running at ws://localhost:8080");

wss.on("connection", (ws) => {
  console.log("✅ Client connected");

  let count = 0;

  const timer = setInterval(async () => {
  count++;

  const completion = await Client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a transaction monitoring agent." },
      { role: "user", content: `Generate alert message #${count}` }
    ]
  });

  const msg = {
    text: completion.choices[0].message.content,
    time: new Date().toISOString()
  };

  ws.send(JSON.stringify(msg));

  if (count === 5) {
    clearInterval(timer);
  }

}, 2000);

  ws.on("close", () => {
    clearInterval(timer);
    console.log("❌ Client disconnected");
  });
});
