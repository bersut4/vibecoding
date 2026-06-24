import { useState } from 'react'
import { Box, Typography, Chip } from '@mui/material'
import ContactInfoCard from './ContactInfoCard'
import GuestbookForm from '../guestbook/GuestbookForm'
import GuestbookList from '../guestbook/GuestbookList'

export default function ContactSection() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <Box id="contact" component="section">
      {/* 섹션 헤더 */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Chip
          label="Contact"
          size="small"
          sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700, mb: 1.5, letterSpacing: 1 }}
        />
        <Typography variant="h1" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 700, mb: 1 }}>
          연락하기 & 방명록 🗺️
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto' }}>
          편하게 연락 주세요! 협업, 제안, 피드백 모두 환영합니다.
          방명록에 한마디 남겨주시면 더욱 감사해요 😊
        </Typography>
      </Box>

      {/* 연락처 카드 */}
      <ContactInfoCard />

      {/* 방명록 구분선 */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', gap: 2, mb: 3,
          '&::before, &::after': { content: '""', flex: 1, borderBottom: '2px dashed', borderColor: 'primary.light', opacity: 0.5 },
        }}
      >
        <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap', color: 'primary.main' }}>
          📖 방명록
        </Typography>
      </Box>

      {/* 방명록 작성 폼 */}
      <GuestbookForm onSubmitted={() => setRefreshKey((k) => k + 1)} />

      {/* 방명록 목록 */}
      <GuestbookList refreshTrigger={refreshKey} />
    </Box>
  )
}
