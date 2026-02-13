/**
 * Content Collections Configuration for iHousing
 * NEW blogs go here as markdown files
 * OLD blogs (500+ inline HTML) remain in pages/[lang]/blog/
 */

import { defineCollection, z } from 'astro:content';

/**
 * Blog Collection Schema - For NEW posts only
 * Matches Ing Heng pattern for consistency
 */
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic Info
    title: z.string(),
    description: z.string(),
    author: z.string().default('iHousing Melaka'),

    // Dates
    publishDate: z.string().or(z.date()),
    updatedDate: z.string().or(z.date()).optional(),

    // SEO & Social
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    ogImage: z.string().optional(),

    // Organization
    category: z.enum([
      'Airbnb Tips',
      'Property Investment',
      'Melaka Guide',
      'Management Tips',
      'Market Analysis',
      'Owner Stories',
      'Parkland Avenue'
    ]),
    tags: z.array(z.string()).default([]),

    // Content Features
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),

    // Language
    locale: z.enum(['en', 'zh', 'ms']),

    // Reading Info
    readingTime: z.number().optional(),

    // Schema.org
    faqSchema: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })).optional(),
  }),
});

/**
 * Export Collections
 */
export const collections = {
  'blogs': blogCollection,
};
