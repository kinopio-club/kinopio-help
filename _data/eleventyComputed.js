// Auto-generate JSON-LD schema based on page tags
const schemaByTag = {
  'How to Use': 'HowTo',
  'Advanced Use': 'HowTo',
  'Collaboration': 'HowTo',
  'User Settings': 'HowTo',
  'Importing and Exporting': 'HowTo',
  'Getting Around': 'TechArticle',
  'Troubleshooting': 'TechArticle',
  'About Kinopio': 'WebPage',
  'Community': 'WebPage',
  'Policies and Privacy': 'WebPage',
  'Press': 'WebPage'
}

const publisher = {
  '@type': 'Organization',
  name: 'Kinopio',
  url: 'https://kinopio.club',
  logo: {
    '@type': 'ImageObject',
    url: 'https://kinopio.club/favicon-32x32.png'
  }
}

export default {
  schema: (data) => {
    // Skip if no title (index pages, etc.)
    if (!data.title) return null

    const pageUrl = `https://kinopio.club/help${data.page?.url || ''}`

    // Get schema type from first tag
    const tag = data.tags?.[0]
    const schemaType = schemaByTag[tag] || 'WebPage'

    // Build main content schema
    let mainSchema = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: data.title,
      headline: data.title,
      url: pageUrl,
      publisher
    }

    // Add type-specific properties
    if (schemaType === 'HowTo') {
      mainSchema.description = `Learn how to ${data.title.toLowerCase()} in Kinopio`
    } else if (schemaType === 'TechArticle') {
      mainSchema.description = `Technical documentation for ${data.title} in Kinopio`
      mainSchema.proficiencyLevel = 'Beginner'
    } else {
      mainSchema.description = `${data.title} - Kinopio Help`
    }

    // Build breadcrumb schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Kinopio',
          item: 'https://kinopio.club'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Help',
          item: 'https://kinopio.club/help/'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: data.title,
          item: pageUrl
        }
      ]
    }

    // Return array of schemas
    return [mainSchema, breadcrumbSchema]
  }
}
