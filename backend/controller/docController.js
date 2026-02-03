import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embeddings, model } from "../config/ollama.js";
import { supabase } from "../config/supabase.js";
import fs from "fs";

export const processUpload = async (req, res) => {
  try {
    const loader = new PDFLoader(req.file.path);
    const docs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150,
    });

    const chunks = await splitter.splitDocuments(docs);
    const enhancedDocs = chunks.map((doc) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        fileName: originalName,
        user_id: req.user.id,
      },
    }));

    await SupabaseVectorStore.fromDocuments(enhancedDocs, embeddings, {
      client: supabase,
      tableName: "documents",
      queryName: "match_documents",
    });
    fs.unlinkSync(req.file.path);
    res
      .status(200)
      .json({ message: `Securely processed: ${req.file.originalname}` });
  } catch (err) {
    res.status(500).json({ error: "PDF Processing failed." });
  }
};

export const askQuestion = async (req, res) => {
  const { question, fileName, mode } = req.body;

  try {
    const filter =
      mode === "document"
        ? { fileName, user_id: req.user.id }
        : { user_id: req.user.id };

    const { data: chunks } = await supabase.rpc("match_documents", {
      query_embedding: await embeddings.embedQuery(question),
      match_count: 5,
      filter: filter,
      match_threshold: 0.2,
    });

    if (!chunks || chunks.length === 0) {
      return res.json({
        answer:
          "I couldn't find any information on that topic in the uploaded files.",
      });
    }

    const context = chunks
      .map((c) => `[From: ${c.metadata.fileName}]: ${c.content}`)
      .join("\n\n");

    const prompt = `You are a Technical AI for the user ${req.user.email}.
    Use the following context to answer. Always mention which document you are referencing.
    
    Context:
    ${context}
    
    Question: ${question}`;

    const response = await model.invoke(prompt);
    res.json({
      answer: response,
      references: [...new Set(chunks.map((c) => c.metadata.fileName))],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
