/**
 * Represents the Sanity slug object structure
 */
interface SanitySlug {
    _type: "slug";
    current: string;
}

/**
 * Base properties shared by all project types
 */
interface BaseProject {
    _id: string;
    _type: "project";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    title: string;
    description: string;
    slug: SanitySlug;
    techStack: string[];
    order: number;
    githubUrl: string;
}

/**
 * Project that is deployed to the cloud
 */
interface CloudProject extends BaseProject {
    projectType: "cloud";
    liveUrl: string; // Required for cloud projects
}

/**
 * Project that exists only as a repository
 */
interface RepoProject extends BaseProject {
    projectType: "repo";
    liveUrl?: never; // Ensures liveUrl is not present for repos
}

/**
 * The union type for a Project
 */
export type Project = CloudProject | RepoProject;

/**
 * The top-level wrapper for the Sanity API response
 */
export interface SanityResponse {
    result: Project[];
}