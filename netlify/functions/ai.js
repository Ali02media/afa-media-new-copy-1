import { GoogleGenAI } from "@google/genai";

export const handler = async (event, context) => {
  console.log("AI Function: Request received");

  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // Handle Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  // Only POST allowed
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    // API key must be obtained exclusively from environment variable process.env.API_KEY
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("AI Function: API Key missing");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Server Configuration Error: API_KEY missing in Netlify settings." })
      };
    }

    if (!event.body) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing body" }) };
    }

    const requestBody = JSON.parse(event.body);
    const { endpointType, systemInstruction, prompt, history, message, image } = requestBody;

    // Use gemini-3-flash-preview for general tasks following the coding guidelines
    const modelName = 'gemini-3-flash-preview';
    const ai = new GoogleGenAI({ apiKey });

    let contents = [];

    if (endpointType === 'chat') {
      if (history && Array.isArray(history)) {
        contents = history.map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: msg.parts
        }));
      }

      const newParts = [];
      if (image) {
        newParts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.data
          }
        });
        newParts.push({ text: message || "Analyze this image." });
      } else {
        newParts.push({ text: message || "" });
      }
      contents.push({ role: "user", parts: newParts });
    } else {
      contents = [{
        role: "user",
        parts: [{ text: prompt || "Hello" }]
      }];
    }

    console.log(`Sending request to Google Gemini (${modelName})...`);
    // Using ai.models.generateContent to query GenAI with both model name and prompt/contents
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 1000,
        temperature: 0.7
      }
    });

    // Extracting text output from GenerateContentResponse using the .text property
    const generatedText = response.text || "";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: generatedText })
    };

  } catch (error) {
    console.error("Backend Error:", error);
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: `Backend Error: ${error.message}` })
    };
  }
};