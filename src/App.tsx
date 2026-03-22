import { useEffect, useState } from 'react'
import TopBar from './components/TopBar'
import Resume from './components/Resume'
import { ActionIcon, Anchor, Box, Container, Stack, Title, Text, Button, Group, Avatar, Tooltip } from '@mantine/core'
import { IconMail, IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react'
import './App.css'

type Tab = 'home' | 'projects' | 'resume'

function hashToTab(hash: string): Tab {
  const key = hash.replace('#', '')
  if (key === 'projects' || key === 'resume') return key
  return 'home'
}

function useHashTab(): Tab {
  const [tab, setTab] = useState<Tab>(() => hashToTab(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setTab(hashToTab(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return tab
}

export default function App() {
  const tab = useHashTab()

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />

      <Box style={{ flex: 1, paddingBottom: 60 }}>
        <Container size={tab === 'resume' ? 'lg' : 'sm'} style={{ paddingTop: tab === 'resume' ? 90 : 110 }}>
          {tab === 'home' && (
            <Stack align="center" gap="xl">
              <Avatar size={120} radius={120} src="/res/5645233821521316972.JPG" />
              <Title order={1}>David Larson</Title>
              <Text c="dimmed" ta="center" size="lg">
                Software Engineer at Microsoft — building beautiful, accessible interfaces with React
                and TypeScript.
              </Text>

              <Group>
                <Button component="a" href="#projects">Projects</Button>
                <Button variant="outline" component="a" href="#resume">Resume</Button>
              </Group>
            </Stack>
          )}

          {tab === 'projects' && (
            <div style={{ width: '100%' }}>
              <Title order={3}>Featured project</Title>
              <Text>
                A short description of a project with a link to the live demo and the
                repository.
              </Text>
            </div>
          )}

          {tab === 'resume' && (
            <Container size="lg">
              <Resume />
            </Container>
          )}
        </Container>
      </Box>

      <Box
        component="footer"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 -1px 8px rgba(0, 0, 0, 0.06)',
          zIndex: 100,
        }}
        py="xs"
        px="md"
      >
        <Group justify="center" gap="lg">
          <Tooltip label="larson.david46@gmail.com">
            <ActionIcon
              component="a"
              href="mailto:larson.david46@gmail.com"
              variant="subtle"
              size="lg"
            >
              <IconMail size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="GitHub">
            <ActionIcon
              component="a"
              href="https://github.com/dalarson"
              target="_blank"
              rel="noreferrer"
              variant="subtle"
              size="lg"
              color="dark"
            >
              <IconBrandGithub size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="LinkedIn">
            <ActionIcon
              component="a"
              href="https://www.linkedin.com/in/larsondavid46"
              target="_blank"
              rel="noreferrer"
              variant="subtle"
              size="lg"
              color="blue"
            >
              <IconBrandLinkedin size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Box>
    </Box>
  )
}
