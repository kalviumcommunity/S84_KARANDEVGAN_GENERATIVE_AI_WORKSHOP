require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

app.post("/api/symptom-checker", async (req, res) => {
  const userSymptoms = req.body.symptoms;
  const modelName = "gemini-1.5-flash-latest";

  const prompt = `
You are HealthMate - an AI medical assistant.
Given these symptoms, reply with 2-3 possible conditions, advice, and risk level (Low, Medium, High) in JSON.

Symptoms: "${userSymptoms}"
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          max_output_tokens: 500,
          temperature: 0.7,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const rawResponseText = response.data.candidates[0].content.parts[0].text;

    const cleanedResponse = rawResponseText
      .replace(/```json\n|```/g, "")
      .trim();

    try {
      const botReply = JSON.parse(cleanedResponse);
      res.json(botReply);
      console.log(botReply);
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);
      res
        .status(500)
        .json({ error: "The AI returned an invalid response format." });
    }
  } catch (error) {
    console.error(
      "API call failed:",
      error.response ? error.response.data : error.message
    );
    console.log(error);
    res
      .status(500)
      .json({ error: "Failed to get a valid response from the AI." });
  }
});

app.post("/api/one-shot-symptom-checker", async (req, res) => {
  const userSymptoms = req.body.symptoms;
  const modelName = "gemini-1.5-flash-latest";

  const prompt = `
You are HealthMate - an AI medical assistant.
Given these symptoms, reply with 2-3 possible conditions, advice, and risk level (Low, Medium, High) in JSON.
Example:
Symptoms: "I have a cough and mild fever"
Response: {
  "possible_conditions": ["Common Cold", "Flu", "COVID-19"],
  "advice": "Rest, drink fluids, and monitor symptoms. Consult a doctor if symptoms worsen.",
  "risk_level": "Medium"
}
Now, analyze the following symptoms and provide a similar response:
Symptoms: "${userSymptoms}"
Response:
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          max_output_tokens: 500,
          temperature: 0.7,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const rawResponseText = response.data.candidates[0].content.parts[0].text;

    const cleanedResponse = rawResponseText
      .replace(/```json\n|```/g, "")
      .trim();

    try {
      const botReply = JSON.parse(cleanedResponse);
      res.json(botReply);
      console.log(botReply);
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);
      res
        .status(500)
        .json({ error: "The AI returned an invalid response format." });
    }
  } catch (error) {
    console.error(
      "API call failed:",
      error.response ? error.response.data : error.message
    );
    console.log(error);
    res
      .status(500)
      .json({ error: "Failed to get a valid response from the AI." });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});



