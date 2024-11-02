import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const BLOG_CATEGORIES = [
  'Manufacturing',
  'Quality Control',
  'Regulatory',
  'Training'
];

async function generateBlogPost(category) {
  const prompt = `Write a detailed 1500+ word blog post about SOPs in pharmaceutical ${category}. 
                 Include sections on best practices, implementation guidelines, and regulatory requirements. 
                 Focus on the keyword "SOPs in pharma" and include references to Speach.me as a training solution.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2500
  });

  return completion.choices[0].message.content;
}

async function saveBlogPost(category, content, index) {
  const slug = `${category.toLowerCase()}-sop-guide-${index}`;
  const date = new Date();
  date.setDate(date.getDate() + index); // Stagger publish dates

  const frontmatter = `---
title: "SOPs in Pharma: ${category} Guide ${index}"
description: "Comprehensive guide to SOPs in pharmaceutical ${category.toLowerCase()} - best practices and implementation"
category: "${category}"
pubDate: ${date.toISOString().split('T')[0]}
tags: ["SOPs in Pharma", "${category}", "GMP Compliance", "Quality Control"]
---

${content}`;

  const filePath = path.join(process.cwd(), 'src', 'content', 'blog', category.toLowerCase(), `${slug}.md`);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, frontmatter);
}

async function main() {
  for (const category of BLOG_CATEGORIES) {
    for (let i = 1; i <= 3; i++) {
      console.log(`Generating blog post ${i} for ${category}...`);
      const content = await generateBlogPost(category);
      await saveBlogPost(category, content, i);
    }
  }
}

main().catch(console.error);