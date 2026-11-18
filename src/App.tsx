import { Link, Route, Routes, useLocation } from 'react-router-dom'
import TopBar from './components/TopBar'
import Resume from './components/Resume'
import { ActionIcon, Box, Container, Stack, Title, Text, Button, Group, Avatar, Tooltip } from '@mantine/core'
import { IconMail, IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react'
import './App.css'
import { Projects } from './projects/projects'
import BlogIndex from './blog/BlogIndex'
import BlogPost from './blog/BlogPost'

type Tab = 'home' | 'projects' | 'resume'

function hashToTab(hash: string): Tab {
  const key = hash.replace('#', '')
  if (key === 'projects' || key === 'resume') return key
  return 'home'
}

function useHashTab(): Tab {
  return hashToTab(useLocation().hash)
}

function Home() {
  const tab = useHashTab()

  return (
    <Container size={tab === 'resume' ? 'lg' : 'sm'} style={{ paddingTop: tab === 'resume' ? 90 : 110 }}>
          {tab === 'home' && (
            <Stack align="center" gap="xl">
              <Avatar size={120} radius={120} src="/profile.jpg" />
              <Title order={1}>David Larson</Title>
              <Text c="dimmed" ta="center" size="lg">
                Software Engineer at Microsoft — building beautiful, accessible interfaces with React
                and TypeScript.
              </Text>

              <Group>
                <Button component={Link} to="/#projects">Projects</Button>
                <Button variant="outline" component={Link} to="/#resume">Resume</Button>
              </Group>
            </Stack>
          )}

          {tab === 'projects' && (
            <Projects />
          )}

          {tab === 'resume' && (
            <Container size="lg">
              <Resume />
            </Container>
          )}
    </Container>
  )
}

export default function App() {
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />

      <Box style={{ flex: 1, paddingBottom: 60 }}>
        <Routes>
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<Home />} />
        </Routes>
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
