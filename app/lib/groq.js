import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY, });

export async function analyzeWithGroq(emailData) {
    const prompt = `
Analyze the following email for cybersecurity threats.

Email:
Subject: ${emailData.subject}
Sender: ${emailData.sender}

Body:
${emailData.body}

URLs:
${JSON.stringify(emailData.urls)}

Domains:
${JSON.stringify(emailData.domains)}

Authentication:
${JSON.stringify(emailData.authentication)}

Identify possible:
- phishing
- impersonation
- social engineering
- urgency or threats
- credential requests
- financial fraud
- suspicious URLs or domains

Return ONLY valid JSON in this format:

{
  "classification": "safe",
  "confidence": 0,
  "summary": "",
  "indicators": [
    {
      "type": "",
      "severity": "low",
      "explanation": ""
    }
  ]
}

Classification must be one of:
safe, suspicious, phishing

Confidence must be a number between 0 and 1.
`;

    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
            {
                role: "system",
                content:
                    "You are an email cybersecurity analysis assistant. Analyze evidence carefully and do not claim certainty when evidence is insufficient.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.2,
        response_format: {
            type: "json_object",
        },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
        throw new Error("Groq returned an empty response");
    }

    return JSON.parse(content);
}