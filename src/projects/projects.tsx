import { useEffect, useState } from 'react';
import { client } from '../sanity/client';
import type { Project } from '../types/SanityTypes';
import { ProjectShowcase } from './projectShowcase';
import { Stack } from '@fluentui/react';

export const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const query = `*[_type == "project"] | order(order asc)`;
        client.fetch(query).then((data) => setProjects(data));
    }, []);

    return (
        <Stack tokens={{ childrenGap: 40 }} styles={{ root: { padding: '40px 0' } }}>
            {projects.map((project) => (
                <ProjectShowcase key={project._id} project={project} />
            ))}
        </Stack>
    );
};
