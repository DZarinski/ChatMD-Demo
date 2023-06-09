require("dotenv").config();
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const port = process.env.PORT || 3000;

app.post("/chat", async (req, res) => {
  // headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // messages
  const messages = req.body.messeges;

  // optional logs
  //console.log("Client connected");

  // handle close
  res.on("close", () => {
    //console.log("Connection closed");
  });

  try {
    // openai chat completion
    const completion = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: generateMessages(messages),
        temperature: 0.6,
        max_tokens: 300,
        stream: true,
      },
      {
        responseType: "stream",
      }
    );

    for await (const chunk of completion.data) {
      const lines = chunk
        .toString("utf8")
        .split("\n")
        .filter((line) => line.trim().startsWith("data: "));

      for (const line of lines) {
        const message = line.replace(/^data: /, "");
        if (message === "[DONE]") {
          res.end(`data: [DONE]\n\n`);
          return;
        }

        const json = JSON.parse(message);
        const token = json.choices[0].delta.content;
        if (token) {
          res.write(`data: ${JSON.stringify({ content: token })}\n\n`);
        }
      }
    }
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
});

//testing stream
app.get("/", (req, res) => {
  console.log("Client connected");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const intervalId = setInterval(() => {
    const date = new Date().toLocaleString();
    res.write(`data: ${JSON.stringify({ content: "hi! my " })}\n\n`);
    res.end(`data: [DONE]\n\n`);
  }, 1000);

  res.on("close", () => {
    console.log("Connection closed");
    clearInterval(intervalId);
    res.end();
  });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));

function generateMessages(messages) {
  return [
    {
      role: "system",
      content:
        "You are ChatMD, a large language model focused on answering users' medical questions in an easy to understand and friendly way. Prioritize providing accurate and helpful information to users while keeping their safety and well-being in mind. Advise users to visit a walk-in clinic instead of an emergency room when appropriate. Answer as concisely as possible.",
    },
    ...messages,
  ];
}
