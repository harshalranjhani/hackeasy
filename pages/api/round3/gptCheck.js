// pages/api/analyze-idea.js
import axios from "axios";

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
})

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const { idea } = req.body;

  const prompt = `
I have a hackathon idea, and I need to analyze it. The idea is as follows: 
${idea}.

Based on this idea, please analyze the following:
1. The novelty of the idea: How innovative is it compared to existing solutions?
2. The relevance of the idea: How does it address current needs or problems in the energy sector?
3. The future prospects of the idea: Considering technological advancements and market trends, how viable is this idea in the long term?
`;

  try {
    const completion = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt: prompt,
        max_tokens: 500,
    });

    console.log(completion.choices[0].text);


    res.status(200).json({
      message: "Idea analyzed successfully",
      analysis: completion.choices[0].text,
    });
  } catch (error) {
    console.error("Error calling the ChatGPT API:", error.message);
    res.status(500).json({ error: "Failed to analyze the idea" });
  }
}
