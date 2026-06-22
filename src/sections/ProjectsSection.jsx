import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import FolderIcon from '@mui/icons-material/Folder'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate } from 'react-router-dom'

const PLACEHOLDER_PROJECTS = [
  { id: 1, title: '프로젝트 1' },
  { id: 2, title: '프로젝트 2' },
  { id: 3, title: '프로젝트 3' },
]

const ProjectsSection = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ backgroundColor: 'var(--color-bg-primary)', py: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box sx={{ width: 4, height: 28, backgroundColor: 'var(--color-secondary)', borderRadius: 1 }} />
          <Typography variant="overline" sx={{ color: 'var(--color-secondary)', letterSpacing: 3 }}>
            PROJECTS
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
          Projects 섹션
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 4 }}>
          여기는 Projects 섹션입니다. 대표작 썸네일 3-4개와 '더 보기' 버튼이 들어갈 예정입니다.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {PLACEHOLDER_PROJECTS.map((project) => (
            <Grid size={{ xs: 12, sm: 4 }} key={project.id}>
              <Card
                sx={{
                  height: 160,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 1,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    borderColor: 'var(--color-border-gold)',
                    boxShadow: '0 0 16px rgba(200,160,86,0.25)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <FolderIcon sx={{ fontSize: 40, color: 'var(--color-secondary)' }} />
                <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {project.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>
                  썸네일 예정
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/projects')}
            sx={{
              px: 4,
              color: 'var(--color-secondary)',
              borderColor: 'var(--color-secondary)',
              '&:hover': { borderColor: 'var(--color-button-hover)', backgroundColor: 'rgba(200,160,86,0.08)' },
            }}
          >
            더 보기
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default ProjectsSection
