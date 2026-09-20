import { GoogleGenAI } from "@google/genai";

export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
export const GEMINI_MODEL = process.env.GEMINI_MODEL;
export const GEMINI_EMBED_MODEL = process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";