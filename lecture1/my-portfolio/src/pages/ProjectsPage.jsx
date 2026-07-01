import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

const ProjectsPage = () => (
  <Box sx={{ backgroundColor: 'var(--color-bg-primary)', minHeight: 'calc(100vh - 64px)', py: 8 }}>
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ width: 4, height: 28, backgroundColor: 'var(--color-secondary)', borderRadius: 1 }} />
        <Typography variant="overline" sx={{ color: 'var(--color-secondary)', letterSpacing: 3 }}>
          PROJECTS
        </Typography>
      </Box>
      <Typography variant="h2" sx={{ mb: 4, color: 'var(--color-text-primary)' }}>
        Projects
      </Typography>

      <Card
        sx={{
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': { borderColor: 'var(--color-border-gold)', boxShadow: '0 0 20px rgba(200,160,86,0.15)' },
          transition: 'all 0.25s ease',
        }}
      >
        <CardContent sx={{ textAlign: 'center', p: 6 }}>
          <FolderOpenIcon sx={{ fontSize: 80, color: 'var(--color-secondary)', mb: 3, opacity: 0.5 }} />
          <Typography variant="h5" sx={{ color: 'var(--color-text-primary)', mb: 2 }}>
            Projects 페이지가 개발될 공간입니다.
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.9 }}>
            포트폴리오 작품들이 들어갈 예정입니다.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  </Box>
)

export default ProjectsPage
