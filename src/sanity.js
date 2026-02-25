import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// =====================================================
// SANITY CMS CONFIGURATION
// =====================================================
// Replace these with your actual Sanity project values.
// You'll get these when you create your Sanity project.
// See the SETUP-GUIDE.md for step-by-step instructions.
// =====================================================

export const client = createClient({
  projectId: 'a9vovusz',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

const builder = imageUrlBuilder(client)

// This helper generates image URLs from Sanity
// It automatically handles sizing, cropping, and format
export function urlFor(source) {
  return builder.image(source)
}
