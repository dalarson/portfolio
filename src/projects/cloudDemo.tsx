import React from 'react';
import { Stack, Text, Link, FontWeights } from '@fluentui/react';
import type { IStackStyles, IStackTokens } from '@fluentui/react';

interface CloudDemoProps {
    title: string;
    description: string;
    liveUrl: string;
}

// Styling for the iframe container to give it a "browser" look
const containerStyles: IStackStyles = {
    root: {
        border: '1px solid #edebe9',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        backgroundColor: '#fff'
    }
};

const stackTokens: IStackTokens = { childrenGap: 15 };

export const CloudDemo: React.FC<CloudDemoProps> = ({ title, description, liveUrl }) => {
    return (
        <Stack tokens={stackTokens} styles={{ root: { width: '100%', maxWidth: '1000px', margin: '0 auto' } }}>

            {/* Header Section */}
            <Stack horizontal horizontalAlign="space-between" verticalAlign="end">
                <Stack>
                    <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                        {title}
                    </Text>
                    <Text variant="mediumPlus" styles={{ root: { color: '#605e5c', marginTop: '4px' } }}>
                        {description}
                    </Text>
                </Stack>

                <Link
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    styles={{ root: { fontSize: '14px', fontWeight: FontWeights.bold } }}
                >
                    Open in New Tab ↗
                </Link>
            </Stack>

            {/* Interactive iFrame Area */}
            <Stack styles={containerStyles}>
                {/* Simple "Browser Bar" UI */}
                <Stack horizontal verticalAlign="center" styles={{ root: { height: '32px', background: '#f3f2f1', padding: '0 12px', borderBottom: '1px solid #edebe9' } }}>
                    <Stack horizontal tokens={{ childrenGap: 6 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                    </Stack>
                </Stack>

                <iframe
                    src={liveUrl}
                    title={`Live demo of ${title}`}
                    width="100%"
                    height="600px"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    style={{ border: 'none' }}
                />
            </Stack>
        </Stack>
    );
};