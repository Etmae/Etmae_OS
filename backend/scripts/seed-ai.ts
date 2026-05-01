// scripts/seed-ai.ts
import 'dotenv/config'; // Make sure to install dotenv
import { db } from '../src/libs/ai/db'; // Path updated based on your tree
import { projects } from '@/libs/context/project'; // Path to your context file
import { skills } from '@/libs/context/skills';
import { experience } from '@/libs/context/experience';
import path from 'path';
import { config } from 'dotenv';


config({ path: path.resolve(process.cwd(), '.env.local') });
/**
 * Helper to generate embeddings using OpenAI
 */
async function getEmbedding(text: string) {
    try {
      // OpenRouter uses the /embeddings endpoint for this specific task
      const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000', // OpenRouter sometimes requires these
          'X-Title': 'Portfolio AI Seeding',
        },
        body: JSON.stringify({
          model: 'openai/text-embedding-3-small', // OpenRouter usually prefixes with provider
          input: text,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error('OpenRouter Error:', result);
        throw new Error(`OpenRouter API failed: ${result.error?.message || 'Unknown error'}`);
      }
  
      // OpenRouter follows the OpenAI response format for embeddings
      return result.data[0].embedding;
    } catch (error) {
      console.error('Embedding failed for text:', text.substring(0, 50));
      throw error;
    }
  }

async function seed() {
  console.log(" Starting AI Seeding...");


 
  // 1. Prepare Data Chunks
  const chunks = [
    // Experience Chunk
    {
      content: `Developer: ${experience.name}. Role: ${experience.title}. Summary: ${experience.summary}. Availability: ${experience.available}. Contact: ${experience.contact.email}`,
      metadata: { type: 'experience' }
    },
    // Project Chunks
    ...projects.map(p => ({
      content: `Project: ${p.title}. Description: ${p.description}. Tech: ${p.techStack.join(', ')}. Role: ${p.role}. Highlights: ${p.highlights}`,
      metadata: { type: 'project', id: p.id }
    })),
    // Skills Chunk
    {
      content: `Technical Skills. Frontend: ${skills.frontend.join(', ')}. Backend: ${skills.backend.join(', ')}. Databases: ${skills.databases.join(', ')}. Soft Skills: ${skills.softSkills.join(', ')}`,
      metadata: { type: 'skills' }
    }
  ];

  // 2. Process and Insert
  for (const chunk of chunks) {
    try {
      console.log(`- Vectorizing: ${chunk.metadata.type}...`);
      const embedding = await getEmbedding(chunk.content);
      
      await db.query(
        `INSERT INTO ai_context (content, metadata, embedding) VALUES ($1, $2, $3)`,
        [chunk.content, JSON.stringify(chunk.metadata), JSON.stringify(embedding)]
      );
    } catch (err) {
      console.error(` Failed to seed ${chunk.metadata.type}:`, err);
    }
  }

  console.log("Seeding Complete!");
  process.exit(0);
}

seed();



