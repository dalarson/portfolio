import React from 'react';
import { Stack, Text, PrimaryButton, Icon, MessageBar, MessageBarType, FontWeights } from '@fluentui/react';
import type { IStackStyles, IStackTokens } from '@fluentui/react';
import sdk from '@stackblitz/sdk';

interface RepoDemoProps {
    title: string;
    description: string;
    githubUrl: string;
}

const containerStyles: IStackStyles = {
    root: {
        padding: '40px',
        border: '2px dashed #edebe9',
        borderRadius: '8px',
        backgroundColor: '#faf9f8',
        textAlign: 'center'
    }
};

const stackTokens: IStackTokens = { childrenGap: 20 };

export const RepoDemo: React.FC<RepoDemoProps> = ({ title, description, githubUrl }) => {

    const launchStackBlitz = () => {
        // Extracts "username/repo" from "https://github.com/username/repo"
        const repoPath = githubUrl.split('github.com/')[1];
        console.log(repoPath);
        sdk.openGithubProject(repoPath, {
            view: 'preview', // Open the browser preview immediately
            terminalHeight: 45,
        });
    };

    return (
        <Stack tokens={stackTokens} styles={{ root: { width: '100%', maxWidth: '1000px', margin: '0 auto' } }}>

            {/* Header */}
            <Stack>
                <Text variant="xxLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                    {title}
                </Text>
                <Text variant="mediumPlus" styles={{ root: { color: '#605e5c', marginTop: '4px' } }}>
                    {description}
                </Text>
            </Stack>

            {/* Launch Area */}
            <Stack styles={containerStyles} verticalAlign="center" tokens={{ childrenGap: 15 }}>
                <Icon iconName="Code" styles={{ root: { fontSize: '48px', color: '#0078d4' } }} />

                <Stack horizontalAlign="center">
                    <Text variant="large" styles={{ root: { fontWeight: FontWeights.semibold } }}>
                        Code-Only Project
                    </Text>
                    <Text variant="medium">
                        This project is hosted on GitHub. You can launch a live development environment below to see it in action.
                    </Text>
                </Stack>

                <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 10 }}>
                    <PrimaryButton
                        text="Launch Live Preview"
                        onClick={launchStackBlitz}
                        iconProps={{ iconName: 'Rocket' }}
                    />
                    <PrimaryButton
                        text="View on GitHub"
                        href={githubUrl}
                        target="_blank"
                        styles={{ root: { backgroundColor: '#333', borderColor: '#333' } }}
                        iconProps={{ iconName: 'GitGraph' }}
                    />
                </Stack>

                <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
                    Note: This will open a virtual container via StackBlitz.
                </MessageBar>
            </Stack>
        </Stack>
    );
};