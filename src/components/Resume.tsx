import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Alert, Button, Group, Loader, Stack, Title } from '@mantine/core'
import { IconDownload, IconAlertCircle } from '@tabler/icons-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const RESUME_URL =
  'https://raw.githubusercontent.com/dalarson/resume/main/resume.pdf'

export default function Resume() {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [error, setError] = useState(false)

  return (
    <div id="resume" style={{ width: '100%' }}>
      <Group justify="space-between" align="center" mb="xs">
        <Title order={3}>Resume</Title>
        <Button
          component="a"
          href={RESUME_URL}
          target="_blank"
          rel="noreferrer"
          variant="light"
          size="xs"
          leftSection={<IconDownload size={14} />}
        >
          Download PDF
        </Button>
      </Group>

      {error ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Failed to load resume"
          color="red"
        >
          Could not fetch the resume. You can{' '}
          <a href={RESUME_URL} target="_blank" rel="noreferrer">
            download it directly
          </a>
          .
        </Alert>
      ) : (
        <Document
          file={RESUME_URL}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          onLoadError={() => setError(true)}
          loading={
            <Stack align="center" py="xl">
              <Loader />
            </Stack>
          }
        >
          {numPages &&
            Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={Math.min(window.innerWidth - 60, 900)}
              />
            ))}
        </Document>
      )}
    </div>
  )
}
