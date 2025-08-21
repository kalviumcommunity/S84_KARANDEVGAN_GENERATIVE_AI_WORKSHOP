
## What is Zero-Shot Prompting?

**Zero-shot prompting** is an AI technique where you give the model only an instruction about what you want it to do—**without providing any examples or demonstrations** of the expected answer.  
The model relies entirely on its pre-trained general knowledge to understand your instruction and perform the task.[1][2][4]

- **Why is it called "zero-shot"?**  
  The “zero” means you give the model zero examples (“shots”) of the output.  
  You just tell it what you want—in plain language—and it guesses the solution based on its understanding.

***

## Example of a Zero-Shot Prompt (for your symptom checker)

**Prompt:**
```text
You are HealthMate, an AI-powered medical assistant.
Given the user's described symptoms, provide:
1. 2–3 possible medical conditions related to their symptoms.
2. Clear, simple advice in everyday language.
3. Risk level: "Low", "Medium", or "High".

Symptoms: "I have a sore throat and mild fever for two days."

Return the output strictly as JSON:
{
  "conditions": [/* list 2-3 conditions */],
  "advice": "/* health advice in one sentence */",
  "riskLevel": "Low/Medium/High"
}
```

**What’s special?**  
- There is **no training example** in this prompt.
- The AI determines the format and the answer based only on the instructions you provide—**that’s zero-shot prompting**.[2][4][5]

***

## More Everyday Examples

- **Sentiment analysis:**  
  Prompt: “Classify the sentiment of this sentence as positive, negative, or neutral: ‘I think the vacation was okay.’”  
  (Output: “Neutral”)

- **Text summarization:**  
  Prompt: “Summarize this sentence: ‘The quick brown fox jumps over the lazy dog to reach the other side of the hill.’”  
  (Output: “A fox jumps over a dog to get to the hill.”)[4][5][1]

***

**In summary:**  
Zero-shot prompting lets you request AI to perform new tasks—without showing any examples—by writing clear, direct instructions.  
This makes your HealthMate bot flexible, efficient, and easy to extend for new uses.
