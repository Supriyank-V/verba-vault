# 🏛️ VerbaVault

**VerbaVault** is a full-stack, AI-powered document intelligence platform. It leverages Retrieval-Augmented Generation (RAG) to allow users to "talk" to their PDFs, extracting insights using local LLMs (Ollama) and vector search (Supabase).

---

## 🏗️ System Architecture

VerbaVault is organized as a monorepo for synchronized development and deployment:

- **`/frontend`**: High-performance React 19 dashboard built with **Vite**, **Tailwind CSS v4**, and **Shadcn UI**. Features a "Dark-Mode First" responsive design.
- **`/backend`**: A robust **Node.js & Express** engine handling Multer-based document ingestion, PDF parsing, and vector embeddings.

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 + OKLCH Color Space
- **Components:** Shadcn UI + Lucide Icons
- **State/Auth:** Supabase Client

### Backend

- **Framework:** Node.js + Express
- **AI Integration:** LangChain / Ollama SDK
- **Vector DB:** Supabase (pgvector)
- **File Handling:** Multer (PDF Processing)

---

## 🚀 Quick Start

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Ollama](https://ollama.com/) (Running locally)
- [Supabase Project](https://supabase.com/)

### 2. Backend Setup

```bash
cd backend
npm install
# Ensure OLLAMA is running local models
npm start
```
