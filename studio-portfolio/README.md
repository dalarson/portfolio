# Portfolio Studio (Sanity)

Content management for the portfolio blog.

- Project ID: `8g7v6a0i`
- Dataset: `production` (must be **public-read** so the site can fetch posts without a token)

## Run the Studio locally

```bash
cd studio-portfolio
npm install        # first time only
npm run dev        # http://localhost:3333
```

Log in with the Sanity account that owns the project.

## Deploy a new schema

Schemas live in `schemaTypes/` (`postType.ts`, `categoryType.ts`, `blogBlocks.ts`) and are registered in `schemaTypes/index.ts`.

1. Edit or add a type, and register it in `schemaTypes/index.ts`.
2. Check it locally with `npm run dev`.
3. Deploy the schema so the dataset knows about it:
   ```bash
   npx sanity schema deploy
   ```
4. (Optional) Publish the hosted Studio so you can edit from anywhere:
   ```bash
   npm run deploy     # sanity deploy
   ```

Notes:
- Adding fields is safe. Renaming or removing a field leaves old data in existing documents; migrate it first.
- The site reads fields by name (see `../src/sanity/queries.ts`). If you rename a field, update the queries and `../src/sanity/types.ts` too.

## Create a blog post

First-time setup: create the categories (**Category** → Create new) with a title, a slug (click *Generate*), and an optional display order. Each post needs at least one.

Then:

1. Open the Studio and choose **Post** → **Create new**.
2. Fill in **Content**:
   - **Title** and **Slug** (click *Generate*; the URL becomes `/blog/<slug>`).
   - **Excerpt** (max 300 chars, shown on cards).
   - **Cover image** with **Alt text**.
   - **Body**: headings (H2/H3 feed the table of contents), lists, quotes, links, and the custom blocks: code block, image, callout, YouTube, table, separator.
3. Fill in **Metadata**: **Published at** (posts with a future date stay hidden until then), optional **Updated at**, **Featured** (shown at the top of `/blog`), **Categories**, **Tags**, **Author**.
4. Fill in **SEO**: SEO title (max 60) and description (max 160). The title is used as the browser tab title.
5. Click **Publish**. Drafts are never shown on the site.

The post appears on `/blog` shortly after publishing (the site reads through the Sanity CDN, so changes can take a moment).
