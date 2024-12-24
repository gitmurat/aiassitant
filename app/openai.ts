
import { AzureOpenAI } from "openai";
console.log("process.env.AZURE_OPENAI_API_KEY", process.env.AZURE_OPENAI_API_KEY);
export const openai = new AzureOpenAI({ apiKey: process.env.AZURE_OPENAI_API_KEY, endpoint: process.env.AZURE_OPENAI_ENDPOINT, apiVersion: "2024-05-01-preview" });
