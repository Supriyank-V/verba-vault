import dotenv from "dotenv";
dotenv.config();
import { Ollama, OllamaEmbeddings } from "@langchain/ollama";

export const embeddings = new OllamaEmbeddings({
  model: process.env.MODEL,
  baseUrl: process.env.MAC_IP,
});

export const model = new Ollama({
  baseUrl: process.env.MAC_IP,
  model: process.env.MODEL,
});
