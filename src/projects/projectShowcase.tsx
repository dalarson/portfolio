import React from 'react';
import { Project } from '../types/SanityTypes'; // The interface we created earlier
import { CloudDemo } from './cloudDemo';
import { RepoDemo } from './repoDemo';

interface ProjectShowcaseProps {
    project: Project;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ project }) => {
    // 1. Check if the project is a Cloud-hosted type
    if (project.projectType === 'cloud') {
        return (
            <CloudDemo
                title={project.title}
                description={project.description}
                liveUrl={project.liveUrl}
            />
        );
    }

    // 2. Handle the Repository-only type 
    // (You can swap this with the StackBlitz component later)
    if (project.projectType === 'repo') {
        return (
            <RepoDemo
                title={project.title}
                description={project.description}
                githubUrl={project.githubUrl}
            />
        );
    }

    // 3. Fallback for unexpected data
    return null;
};