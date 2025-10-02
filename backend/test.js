// test.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    // Choose model (1.5-flash is free, 1.5-pro is slower but smarter)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Ask Gemini something
    const prompt = "Write a short motivational quote about coding.";

    // Send request
    const result = await model.generateContent(prompt);

    // Print response
    console.log("Gemini says:");
    console.log(result.response.text());
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

// Run script
run();