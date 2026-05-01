Backend API Documentation
Overview
A  Next.js API backend for a developer portfolio system, featuring AI-powered chat with RAG (Retrieval-Augmented Generation), contact form handling with file uploads, project management, and CV distribution.

Table of Contents
Architecture

Tech Stack

API Endpoints

Environment Variables

Database Schema

Features

Error Handling

Development

Deployment

Architecture
text
┌─────────────────────────────────────────────────────────────┐
│                      Next.js API Routes                     │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  /api/chat   │ /api/contact │ /api/projects│  /api/cv       │
└──────┬───────┴──────┬───────┴──────┬───────┴───────┬────────┘
       │              │              │               │
       ▼              ▼              ▼               ▼
┌──────────────┐ ┌────────────┐ ┌──────────┐ ┌──────────────┐
│   RAG (PG)   │ │  Supabase  │ │ Supabase │ │   Supabase   │
│   Vector     │ │   Storage  │ │   DB     │ │   Storage    │
└──────────────┘ └────────────┘ └──────────┘ └──────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI Provider Router                       │
├────────────┬────────────┬────────────┬──────────────────────┤
│ OpenRouter │ DeepSeek   │ Gemini     │ (Extensible)         │
│   (Free)   │  (Paid)    │  (Paid)    │                      │
└────────────┴────────────┴────────────┴──────────────────────┘
Tech Stack
Category	Technology
Runtime	Next.js 14+ (API Routes)
Database	PostgreSQL + pgvector, Supabase
AI/LLM	OpenRouter, DeepSeek, Gemini
Vector Search	pgvector with MMR reranking
Storage	Supabase Storage
Validation	Inline with regex patterns
Rate Limiting	In-memory per-IP (20 req/min)
API Endpoints
POST /api/chat
Streaming AI chat with RAG context.

Request Body:

json
{
  "message": "string (max 1000 chars)",
  "conversationHistory": [
    { "role": "user|assistant", "content": "string" }
  ],
  "source": "hero|terminal|app"  // defaults to "app"
}
Response: Server-Sent Events (SSE) stream

Rate Limit: 20 requests per IP per minute

Persona Behaviors:

hero: Punchy, 1-2 sentences, confident

terminal: Technical, plain text, max 5 lines

app: Detailed, paragraph format, project references

Metadata Format: AI responses append __METADATA__ for client routing:

text
__METADATA__ {"action": "OPEN_PROJECT", "payload": {"projectId": "..."}}
POST /api/contact
Submit contact form with optional file attachment.

Request: multipart/form-data

Field	Type	Required	Constraints
name	string	Yes	2-100 chars
email	string	Yes	Valid email format
message	string	Yes	10-5000 chars
service	string	No	Frontend, Web Systems, Backend, Full-Stack, DB DESIGN
budget	string	No	$5k+, $10k+, $25k+, $50k+, Enterprise, TBD
file	file	No	PDF/DOC/DOCX, max 5MB
Response:

json
{ "success": true, "message": "Message stored successfully." }
Error Statuses:

400: Validation failure

409: Duplicate submission

503: Database/storage unavailable

500: Internal error

GET /api/projects
Retrieve all projects.

Response:

json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "techStack": ["string"],
    "features": ["string"],
    "role": "string",
    "duration": "string",
    "highlights": "string",
    "heroMediaType": "video|image"
  }
]
GET /api/cv
Download CV PDF from Supabase Storage.

Response: PDF file attachment (Content-Disposition: attachment)

Error Statuses:

500: File not found or storage error

Environment Variables
env
# Required
DATABASE_URL=postgresql://...                    # PostgreSQL with pgvector
SUPABASE_URL=your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# AI Providers (at least one)
OPENROUTER_API_KEY=sk-or-v1-...
DEEPSEEK_API_KEY=sk-...
GEMINI_API_KEY=AIza...

# Optional
AI_PROVIDER_TIMEOUT_MS=15000                     # Default: 15000
NEXT_PUBLIC_SITE_URL=http://localhost:3000       # OpenRouter referer
Database Schema
ai_context (pgvector)
sql
CREATE TABLE ai_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB,
  embedding vector(1536)  -- OpenAI embedding dimension
);

CREATE INDEX idx_embedding ON ai_context USING ivfflat (embedding vector_cosine_ops);
contact_messages
sql
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  service VARCHAR(50),
  budget VARCHAR(20),
  message TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name, email, message)  -- Duplicate protection
);
projects
sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  features TEXT[],
  role VARCHAR(255),
  duration VARCHAR(100),
  highlights TEXT,
  hero_media_type VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);
Features
RAG Pipeline (libs/ai/rag.ts)
Embedding Generation: OpenAI text-embedding-3-small via OpenRouter

Vector Search: Cosine similarity with pgvector (<=> operator)

MMR Reranking: Balances relevance and diversity (λ=0.7, topN=9)

Fallback: Graceful degradation if vector search fails

AI Provider Router (libs/ai/router.ts)
Priority Chain: Free providers → Paid fallbacks

Timeout: Configurable per request (default 15s)

Error Aggregation: Tracks failures across providers

Security & Validation
Rate limiting (in-memory, per IP)

File type validation (MIME + extension)

Input sanitization and length limits

CORS with allowed origins whitelist

Error Handling
Scenario	HTTP Status	Response
Rate limit exceeded	429	{ "message": "Too many requests" }
Invalid input	400	{ "error": "Description" }
Duplicate submission	409	{ "error": "Duplicate message" }
DB/storage unavailable	503	Friendly retry message
All AI providers fail	500	{ "error": "All AI providers failed" }
Connectivity Detection: Identifies Supabase paused projects and returns appropriate 503.

Development
Setup
bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run database migrations (if using Prisma/Knex)
# Configure pgvector in Supabase:
# CREATE EXTENSION vector;
Local Development
bash
pnpm dev
# API available at http://localhost:3000/api/*
Testing CORS
bash
curl -X OPTIONS http://localhost:3000/api/chat -v
Deployment
Vercel (Recommended)
Set all environment variables in Vercel Dashboard

Functions default to 10s timeout (increase for AI responses)

Use Edge Runtime for /api/chat if lower latency needed

Supabase Setup
Enable pgvector extension

Create buckets: contact_attachment, CV

Set bucket policies for authenticated uploads

Configure Row Level Security (RLS) as needed

Database Migrations
sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Create ai_context table with vector dimension 1536
CREATE TABLE ai_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB,
  embedding vector(1536)
);
Maintenance
Adding a New AI Provider
Create providers/new-provider.ts implementing AIProvider

Add to PROVIDER_CHAIN in router.ts

Adding Context Documents
typescript
import { addToContext } from "@/libs/ai/rag";

await addToContext(
  "Document content here",
  { source: "resume", section: "experience" }
);
Monitoring
Check [RAG Context] logs for vector search debugging

Monitor [AI Router] logs for provider fallback patterns

Watch [contact/route] for file upload failures

License
Proprietary — All rights reserved.

Contact
Developer: Olujimi Erioluwa Elijah
Email: elijaholujimi060@gmail.com
GitHub: @Etmae

make it pastable into an actual readme fil
markdown
# Backend API Documentation

## Overview

A production-grade Next.js API backend for a developer portfolio system, featuring AI-powered chat with RAG (Retrieval-Augmented Generation), contact form handling with file uploads, project management, and CV distribution.

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Features](#features)
- [Error Handling](#error-handling)
- [Development](#development)
- [Deployment](#deployment)

---

## Architecture
┌─────────────────────────────────────────────────────────────┐
│ Next.js API Routes │
├──────────────┬──────────────┬──────────────┬────────────────┤
│ /api/chat │ /api/contact │ /api/projects│ /api/cv │
└──────┬───────┴──────┬───────┴──────┬───────┴───────┬────────┘
│ │ │ │
▼ ▼ ▼ ▼
┌──────────────┐ ┌────────────┐ ┌──────────┐ ┌──────────────┐
│ RAG (PG) │ │ Supabase │ │ Supabase │ │ Supabase │
│ Vector │ │ Storage │ │ DB │ │ Storage │
└──────────────┘ └────────────┘ └──────────┘ └──────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ AI Provider Router │
├────────────┬────────────┬────────────┬──────────────────────┤
│ OpenRouter │ DeepSeek │ Gemini │ (Extensible) │
│ (Free) │ (Paid) │ (Paid) │ │
└────────────┴────────────┴────────────┴──────────────────────┘

text

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Next.js 14+ (API Routes) |
| **Database** | PostgreSQL + pgvector, Supabase |
| **AI/LLM** | OpenRouter, DeepSeek, Gemini |
| **Vector Search** | pgvector with MMR reranking |
| **Storage** | Supabase Storage |
| **Validation** | Inline with regex patterns |
| **Rate Limiting** | In-memory per-IP (20 req/min) |

---

## API Endpoints

### `POST /api/chat`

Streaming AI chat with RAG context.

**Request Body:**
```json
{
  "message": "string (max 1000 chars)",
  "conversationHistory": [
    { "role": "user|assistant", "content": "string" }
  ],
  "source": "hero|terminal|app"
}
Response: Server-Sent Events (SSE) stream

Rate Limit: 20 requests per IP per minute

Persona Behaviors:

hero: Punchy, 1-2 sentences, confident

terminal: Technical, plain text, max 5 lines

app: Detailed, paragraph format, project references

Metadata Format: AI responses append __METADATA__ for client routing:

text
__METADATA__ {"action": "OPEN_PROJECT", "payload": {"projectId": "..."}}
POST /api/contact
Submit contact form with optional file attachment.

Request: multipart/form-data

Field	Type	Required	Constraints
name	string	Yes	2-100 chars
email	string	Yes	Valid email format
message	string	Yes	10-5000 chars
service	string	No	Frontend, Web Systems, Backend, Full-Stack, DB DESIGN
budget	string	No	$5k+, $10k+, $25k+, $50k+, Enterprise, TBD
file	file	No	PDF/DOC/DOCX, max 5MB
Response:

json
{ "success": true, "message": "Message stored successfully." }
Error Statuses:

400: Validation failure

409: Duplicate submission

503: Database/storage unavailable

500: Internal error

GET /api/projects
Retrieve all projects.

Response:

json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "techStack": ["string"],
    "features": ["string"],
    "role": "string",
    "duration": "string",
    "highlights": "string",
    "heroMediaType": "video|image"
  }
]
GET /api/cv
Download CV PDF from Supabase Storage.

Response: PDF file attachment (Content-Disposition: attachment)

Error Statuses:

500: File not found or storage error

Environment Variables
env
# Required
DATABASE_URL=postgresql://...
SUPABASE_URL=your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# AI Providers (at least one)
OPENROUTER_API_KEY=sk-or-v1-...
DEEPSEEK_API_KEY=sk-...
GEMINI_API_KEY=AIza...

# Optional
AI_PROVIDER_TIMEOUT_MS=15000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
Database Schema
ai_context (pgvector)
sql
CREATE TABLE ai_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB,
  embedding vector(1536)
);

CREATE INDEX idx_embedding ON ai_context USING ivfflat (embedding vector_cosine_ops);
contact_messages
sql
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  service VARCHAR(50),
  budget VARCHAR(20),
  message TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name, email, message)
);
projects
sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  features TEXT[],
  role VARCHAR(255),
  duration VARCHAR(100),
  highlights TEXT,
  hero_media_type VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);
Features
RAG Pipeline (libs/ai/rag.ts)
Embedding Generation: OpenAI text-embedding-3-small via OpenRouter

Vector Search: Cosine similarity with pgvector (<=> operator)

MMR Reranking: Balances relevance and diversity (λ=0.7, topN=9)

Fallback: Graceful degradation if vector search fails

AI Provider Router (libs/ai/router.ts)
Priority Chain: Free providers → Paid fallbacks

Timeout: Configurable per request (default 15s)

Error Aggregation: Tracks failures across providers

Security & Validation
Rate limiting (in-memory, per IP)

File type validation (MIME + extension)

Input sanitization and length limits

CORS with allowed origins whitelist

Error Handling
Scenario	HTTP Status	Response
Rate limit exceeded	429	{ "message": "Too many requests" }
Invalid input	400	{ "error": "Description" }
Duplicate submission	409	{ "error": "Duplicate message" }
DB/storage unavailable	503	Friendly retry message
All AI providers fail	500	{ "error": "All AI providers failed" }
Development
Setup
bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Enable pgvector in Supabase
# CREATE EXTENSION vector;
Local Development
bash
pnpm dev
# API available at http://localhost:3000/api/*
Testing CORS
bash
curl -X OPTIONS http://localhost:3000/api/chat -v
Deployment
Vercel (Recommended)
Set all environment variables in Vercel Dashboard

Functions default to 10s timeout (increase for AI responses)

Use Edge Runtime for /api/chat if lower latency needed

Supabase Setup
Enable pgvector extension

Create buckets: contact_attachment, CV

Set bucket policies for authenticated uploads

Configure Row Level Security (RLS) as needed

Maintenance
Adding a New AI Provider
Create providers/new-provider.ts implementing AIProvider

Add to PROVIDER_CHAIN in router.ts

Adding Context Documents
typescript
import { addToContext } from "@/libs/ai/rag";

await addToContext(
  "Document content here",
  { source: "resume", section: "experience" }
);
Monitoring
Check [RAG Context] logs for vector search debugging

Monitor [AI Router] logs for provider fallback patterns

Watch [contact/route] for file upload failures

License
Proprietary — All rights reserved.

Contact
Developer: Olujimi Erioluwa Elijah
Email: elijaholujimi060@gmail.com
GitHub: @Etmae