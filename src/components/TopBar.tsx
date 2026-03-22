import { Box, Container, Group, Avatar, Text, Anchor } from '@mantine/core'

export default function TopBar() {
  return (
    <Box
      component="header"
      h={70}
      px="md"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 1px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      <Container size="lg" style={{ height: '100%' }}>
        <Group justify="space-between" align="center" style={{ height: '100%' }}>
          <Group>
            <Anchor href="#" underline="never" c="inherit">
              <Group>
                <Avatar src="/res/5645233821521316972.JPG" size="md" radius="xl" />
                <div>
                  <Text fw={700}>David Larson</Text>
                  <Text size="xs" c="dimmed">Software Engineer at Microsoft</Text>
                </div>
              </Group>
            </Anchor>
          </Group>

          <Group gap="md">
            <Anchor href="#projects">Projects</Anchor>
            <Anchor href="#resume">Resume</Anchor>
            <Anchor href="https://github.com/dalarson" target="_blank" rel="noreferrer">GitHub</Anchor>
            <Anchor href="https://www.linkedin.com/in/larsondavid46" target="_blank" rel="noreferrer">LinkedIn</Anchor>
          </Group>
        </Group>
      </Container>
    </Box>
  )
}
