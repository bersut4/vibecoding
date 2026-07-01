import { Box, Container, Typography, Button, Chip, Divider, Avatar } from '@mui/material'
import { KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material'
import ContactSection from '../components/contact/ContactSection'

const scrollToContact = () => {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

export default function HomePage() {
  return (
    <Box>
      {/* 히어로 섹션 */}
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #FFFBF5 0%, #FFF3E0 50%, #FFFBF5 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute', top: -100, right: -100,
            width: 400, height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute', bottom: -80, left: -80,
            width: 300, height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: 640 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label="웹 디자이너" size="small" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }} />
              <Chip label="UI/UX" size="small" variant="outlined" sx={{ borderColor: 'primary.main', color: 'primary.main', fontWeight: 600 }} />
              <Chip label="React" size="small" variant="outlined" sx={{ borderColor: 'secondary.dark', color: 'secondary.dark', fontWeight: 600 }} />
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                lineHeight: 1.2,
                mb: 2,
                background: 'linear-gradient(135deg, #EA580C, #D97706)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              안녕하세요! 👋
              <br />
              권은별입니다
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8, fontSize: '1.1rem' }}>
              감각적인 디자인과 사용자 경험을 중심으로 작업합니다.
              <br />
              협업과 소통을 즐기며, 항상 새로운 도전을 환영해요!
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowDownIcon />}
              onClick={scrollToContact}
              sx={{ borderRadius: 3, px: 4, fontSize: '1rem' }}
            >
              연락하기
            </Button>
          </Box>
        </Container>
      </Box>

      <Divider sx={{ borderColor: 'primary.light', opacity: 0.4 }} />

      {/* Contact 섹션 */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <ContactSection />
      </Container>

      {/* 푸터 */}
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2026 권은별 · Made with ❤️ &amp; React + MUI
        </Typography>
      </Box>
    </Box>
  )
}
