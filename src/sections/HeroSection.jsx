import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

const HeroSection = () => (
  <Box
    sx={{
      minHeight: 480,
      background: 'linear-gradient(135deg, #0A0A14 0%, #1A1428 50%, #0A0A14 100%)',
      borderBottom: '1px solid var(--color-border-gold)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 60%, rgba(200,160,86,0.08) 0%, transparent 70%)',
      },
    }}
  >
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 8, position: 'relative', zIndex: 1 }}>
      <Typography
        variant="overline"
        sx={{ color: 'var(--color-secondary)', letterSpacing: 6, fontSize: '0.8rem' }}
      >
        HERO SECTION
      </Typography>
      <Typography
        variant="h2"
        sx={{ color: 'var(--color-text-primary)', mt: 1, mb: 3, fontWeight: 700, letterSpacing: 1 }}
      >
        여기는 Hero 섹션입니다.
      </Typography>
      <Box sx={{ width: 60, height: 2, backgroundColor: 'var(--color-secondary)', mx: 'auto', mb: 3 }} />
      <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', lineHeight: 1.9 }}>
        메인 비주얼, 이름, 간단 소개가 들어갈 예정입니다.
      </Typography>
    </Container>
  </Box>
)

export default HeroSection
