# Adrian DeVera — Portfolio

Personal portfolio and blog built with Next.js and Notion as a CMS.

🔗 **Live:** [adriandevera.vercel.app](https://adriandevera.vercel.app)

---

## Overview

This portfolio uses Notion as a headless CMS — content is written in Notion and published instantly to the site via `react-notion-x`. Next.js handles static site generation for fast load times and SEO.

## Tech Stack

- **Framework:** Next.js
- **CMS:** Notion (via react-notion-x)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Features

- ⚡ Statically generated pages for speed and SEO
- 📝 Notion as CMS — write in Notion, publish instantly
- 🌙 Dark mode support
- 🌐 SEO optimized — Open Graph tags, sitemap, semantic HTML

## Getting Started

```bash
git clone https://github.com/Adrian-stuff/portfolio.git
cd portfolio
bun install
```

Copy `.env.example` to `.env` and fill in your Notion config, then:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

MIT
