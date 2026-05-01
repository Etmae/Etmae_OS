// backend/libs/rag.ts
import { db } from "./db";

interface ContextDocument {
  id?: string;
  content: string;
  metadata: any;
  embedding: number[] | string; // Handle potential string returns from pgvector
  similarity: number;
  rerankScore?: number;
}

/**
 * Converts a text string into a 1536-dimensional vector array.
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "http://localhost:3000", // Ensure http:// is included
      "X-Title": "Etmae Portfolio AI", 
    },
    body: JSON.stringify({
      input: text.replace(/\n/g, " "),
      model: "openai/text-embedding-3-small", 
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to generate embedding: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

/**
 * Calculates the cosine similarity between two vectors.
 */
function cosineSim(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Max Marginal Relevance (MMR)
 * Balances relevance (similarity to query) with diversity (difference from other chunks).
 */
function mmr(queryEmbedding: number[], candidates: ContextDocument[], lambda = 0.7, topN = 9) {
  const selected: ContextDocument[] = [];
  const candidatesCopy = [...candidates];

  while (selected.length < topN && candidatesCopy.length > 0) {
    let bestScore = -Infinity;
    let bestIndex = 0;

    for (let i = 0; i < candidatesCopy.length; i++) {
      const candidate = candidatesCopy[i];
      const candidateEmb = typeof candidate.embedding === 'string' 
        ? JSON.parse(candidate.embedding) 
        : candidate.embedding;

      const relevance = candidate.similarity; // Base score from pgvector

      let diversity = 0;
      for (const chosen of selected) {
        const chosenEmb = typeof chosen.embedding === 'string' 
          ? JSON.parse(chosen.embedding) 
          : chosen.embedding;
        const sim = cosineSim(candidateEmb, chosenEmb);
        diversity = Math.max(diversity, sim);
      }

      // Lambda controls the tradeoff: 1.0 = Max Relevance, 0.0 = Max Diversity
      const score = lambda * relevance - (1 - lambda) * diversity;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    selected.push(candidatesCopy[bestIndex]);
    candidatesCopy.splice(bestIndex, 1);
  }

  return selected;
}

/**
 * Executes a vector search against the Supabase pgvector table,
 * applies MMR for diversity, and formats for the LLM.
 */
export async function getRelevantContext(userQuery: string): Promise<string> {
  try {
    // 1. Embed user query
    const queryEmbedding = await generateEmbedding(userQuery);
    const embeddingString = JSON.stringify(queryEmbedding);

    // Retrieve top 20 candidate matches from the embedding index using similarity search.
    // The index is optimized for retrieval efficiency; no similarity threshold filtering is applied.
    const results = await db.query(
      `
      SELECT 
        content, 
        metadata, 
        embedding,
        1 - (embedding <=> $1) AS similarity
      FROM ai_context
      ORDER BY embedding <=> $1
      LIMIT 20;
      `,
      [embeddingString]
    );

    if (!results || results.length === 0) {
      return "No relevant context found. Fall back to general knowledge.";
    }

    // 3. Apply MMR to filter down to the 9 most relevant AND diverse chunks
    // Lambda 0.7 heavily favors relevance but still filters out pure duplicates.
    const diverseDocs = mmr(queryEmbedding, results, 0.7, 9);

    // 4. Re-rank final set purely on vector similarity (optional but good for strict ordering)
    const rerankedDocs = diverseDocs
      .map(doc => {
        const docEmb = typeof doc.embedding === 'string' ? JSON.parse(doc.embedding) : doc.embedding;
        const score = cosineSim(queryEmbedding, docEmb);
        return { ...doc, rerankScore: score };
      })
      .sort((a, b) => (b.rerankScore || 0) - (a.rerankScore || 0));

    // 5. Build clean context (Removing similarity scores to prevent confusing the LLM)
    const contextStrings = rerankedDocs.map((doc, index) => {
      return `[Context ${index + 1}]\n${doc.content}`;
    });

    return contextStrings.join("\n\n");

  } catch (error) {
    console.error("[RAG Pipeline Error]", error);
    return "Vector search temporarily offline. Provide a generic but polite response.";
  }
}

export async function addToContext(content: string, metadata: Record<string, any>) {
  try {
    const embedding = await generateEmbedding(content);
    const embeddingString = JSON.stringify(embedding);
    await db.query(
      `
      INSERT INTO ai_context (content, metadata, embedding)
      VALUES ($1, $2, $3);
      `,
      [content, metadata, embeddingString]
    );
  } catch (error) {
    console.error("[Add to Context Error]", error);
  }
}