import { useEffect, useState } from 'react';
import { client } from '../sanity/client';
import type { Project } from '../types/SanityTypes';
import { ProjectShowcase } from './projectShowcase';
import { UpcomingSection } from '../components/UpcomingSection';
import { Stack } from '@fluentui/react';
import { Tabs } from '@mantine/core';

export const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const query = `*[_type == "project" && hidden != true] | order(order asc)`;
        client.fetch(query).then((data) => setProjects(data));
    }, []);

    return (
        <Tabs defaultValue="projects" pt="md">
            <Tabs.List justify="center">
                <Tabs.Tab value="projects">Projects</Tabs.Tab>
                <Tabs.Tab value="in-progress">Works in progress</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="projects">
                <Stack tokens={{ childrenGap: 40 }} styles={{ root: { padding: '40px 0' } }}>
                    {projects.map((project) => (
                        <ProjectShowcase key={project._id} project={project} />
                    ))}
                </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="in-progress">
                <UpcomingSection />
            </Tabs.Panel>
        </Tabs>
    );
};
