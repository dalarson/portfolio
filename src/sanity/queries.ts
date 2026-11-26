import { blogClient } from './image'
import type { Category, Post, PostSummary, UpcomingPage, UpcomingProject } from './types'

export const PAGE_SIZE = 9

// Published = not a draft, has a slug, and publish date is not in the future.
const PUBLISHED = `_type == "post" && !(_id in path("drafts.**")) && defined(slug.current) && publishedAt <= now()`

const SUMMARY = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  updatedAt,
  coverImage,
  "categories": categories[]->{ _id, title, "slug": slug.current, displayOrder } | order(coalesce(displayOrder, 99999) asc, title asc),
  "readingMinutes": math::max([1, round(length(string::split(pt::text(body), " ")) / 220)])
}`

const ORDER = `order(publishedAt desc, _id desc)`

const CATEGORY_FILTER = `($category == "" || $category in categories[]->slug.current)`

const QUERIES = {
    posts: `*[${PUBLISHED} && ${CATEGORY_FILTER}] | ${ORDER} [$start...$end] ${SUMMARY}`,
    postCount: `count(*[${PUBLISHED} && ${CATEGORY_FILTER}])`,
    featured: `*[${PUBLISHED} && featured == true] | ${ORDER} [0] ${SUMMARY}`,
    categories: `*[_type == "category" && !(_id in path("drafts.**")) && defined(slug.current)]
      | order(coalesce(displayOrder, 99999) asc, title asc) { _id, title, "slug": slug.current, description }`,
    post: `*[${PUBLISHED} && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      updatedAt,
      coverImage,
      author,
      tags,
      seoTitle,
      seoDescription,
      body,
      "categories": categories[]->{ _id, title, "slug": slug.current, displayOrder } | order(coalesce(displayOrder, 99999) asc, title asc),
      "readingMinutes": math::max([1, round(length(string::split(pt::text(body), " ")) / 220)]),
      "previous": *[${PUBLISHED} && (publishedAt < ^.publishedAt || (publishedAt == ^.publishedAt && _id < ^._id))]
        | ${ORDER} [0] { title, "slug": slug.current },
      "next": *[${PUBLISHED} && (publishedAt > ^.publishedAt || (publishedAt == ^.publishedAt && _id > ^._id))]
        | order(publishedAt asc, _id asc) [0] { title, "slug": slug.current }
    }`,
    related: `*[${PUBLISHED} && _id != $id && (
        count(categories[]._ref[@ in $categoryIds]) > 0 || count(tags[@ in $tags]) > 0
      )] | ${ORDER} [0...$limit] ${SUMMARY}`,
}

type Opts = { signal?: AbortSignal }

export async function fetchCategories(opts: Opts = {}): Promise<Category[]> {
    return blogClient.fetch(QUERIES.categories, {}, { signal: opts.signal })
}

export async function fetchFeaturedPost(opts: Opts = {}): Promise<PostSummary | null> {
    return blogClient.fetch(QUERIES.featured, {}, { signal: opts.signal })
}

export async function fetchPosts(
    category: string,
    page: number,
    opts: Opts = {},
): Promise<{ posts: PostSummary[]; total: number }> {
    const params = { category, start: page * PAGE_SIZE, end: (page + 1) * PAGE_SIZE }
    const [posts, total] = await Promise.all([
        blogClient.fetch<PostSummary[]>(QUERIES.posts, params, { signal: opts.signal }),
        blogClient.fetch<number>(QUERIES.postCount, { category }, { signal: opts.signal }),
    ])
    return { posts, total }
}

export async function fetchPostBySlug(slug: string, opts: Opts = {}): Promise<Post | null> {
    return blogClient.fetch(QUERIES.post, { slug }, { signal: opts.signal })
}

export async function fetchRelatedPosts(post: Post, limit = 3, opts: Opts = {}): Promise<PostSummary[]> {
    return blogClient.fetch(
        QUERIES.related,
        {
            id: post._id,
            categoryIds: post.categories.map((c) => c._id),
            tags: post.tags ?? [],
            limit,
        },
        { signal: opts.signal },
    )
}

export async function fetchUpcoming(page: UpcomingPage, opts: Opts = {}): Promise<UpcomingProject[]> {
    const query = `*[_type == "upcomingProject" && !(_id in path("drafts.**")) && hidden != true && $page in pages]
      | order(coalesce(order, 99999) asc, _createdAt asc) { _id, title, description, image }`
    return blogClient.fetch(query, { page }, { signal: opts.signal })
}
