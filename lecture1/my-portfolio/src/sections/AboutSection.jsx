import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import PersonIcon from '@mui/icons-material/Person'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate } from 'react-router-dom'

const AboutSection = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ backgroundColor: 'var(--color-bg-primary)', py: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box sx={{ width: 4, height: 28, backgroundColor: 'var(--color-secondary)', borderRadius: 1 }} />
          <Typography variant="overline" sx={{ color: 'var(--color-secondary)', letterSpacing: 3 }}>
            ABOUT ME
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ mb: 4, color: 'var(--color-text-primary)' }}>
          About Me 섹션
        </Typography>

        <Card
          sx={{
            '&:hover': {
              borderColor: 'var(--color-border-gold)',
              boxShadow: '0 0 20px rgba(200,160,86,0.15)',
            },
            transition: 'all 0.25s ease',
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 64, color: 'var(--color-secondary)', mb: 2 }} />
            <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)', mb: 3, lineHeight: 1.9 }}>
              여기는 About Me 섹션입니다.
              <br />
              간단한 자기소개와 '더 알아보기' 버튼이 들어갈 예정입니다.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/about')}
              sx={{ px: 4 }}
            >
              더 알아보기
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default AboutSection
