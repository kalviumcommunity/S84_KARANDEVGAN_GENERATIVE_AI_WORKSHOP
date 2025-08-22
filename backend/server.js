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


// dynamic prompting
app.post("/api/dynamic-symptom-checker", async (req, res) => {
  const { symptoms, age, gender } = req.body; // extra context from user
  const modelName = "gemini-1.5-flash-latest";

  let prompt = `
You are HealthMate - an AI medical assistant.
Given these symptoms,age and gender if mentioned, reply with 2-3 possible conditions, advice, and risk level (Low, Medium, High) in JSON.
`;

  if (age) {
    prompt += `\nPatient Age: ${age}`;
  }
  if (gender) {
    prompt += `\nPatient Gender: ${gender}`;
  }

  const urgentKeywords = [
    "chest pain",
    "shortness of breath",
    "severe bleeding",
    "loss of consciousness",
  ];
  if (urgentKeywords.some((word) => symptoms.toLowerCase().includes(word))) {
    prompt += `\n⚠️ Important: If symptoms are life-threatening, always advise seeking immediate emergency care.`;
  }

  // Add the actual symptoms
  prompt += `\n\nSymptoms: "${symptoms}"\nResponse:`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          max_output_tokens: 500,
          temperature: 0.7,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
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
    res
      .status(500)
      .json({ error: "Failed to get a valid response from the AI." });
  }
});


app.post("/api/multi-shot-symptom-checker", async (req, res) => {
  const userSymptoms = req.body.symptoms;
  const modelName = "gemini-1.5-flash-latest";

  const prompt = `
You are HealthMate - an AI medical assistant.
Given these symptoms, reply with 2-3 possible conditions, advice, and risk level (Low, Medium, High) in JSON.

Examples:

Symptoms: "I have a cough and mild fever"
Response: {
  "possible_conditions": ["Common Cold", "Flu", "COVID-19"],
  "advice": "Rest, drink fluids, and monitor symptoms. Consult a doctor if symptoms worsen.",
  "risk_level": "Medium"
}

Symptoms: "I have a severe headache and sensitivity to light"
Response: {
  "possible_conditions": ["Migraine", "Tension Headache", "Cluster Headache"],
  "advice": "Rest in a dark room, stay hydrated, and avoid loud noises. See a doctor if pain persists or worsens.",
  "risk_level": "Medium"
}

Symptoms: "I have chest pain and shortness of breath"
Response: {
  "possible_conditions": ["Heart Attack", "Angina", "Pneumonia"],
  "advice": "Seek immediate emergency medical help. Do not ignore these symptoms.",
  "risk_level": "High"
}

Now analyze the following symptoms and provide a similar JSON response:
Symptoms: "${userSymptoms}"
Response:
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { max_output_tokens: 500, temperature: 0.7 },
      },
      { headers: { "Content-Type": "application/json" } }
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
    res
      .status(500)
      .json({ error: "Failed to get a valid response from the AI." });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});



