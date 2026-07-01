import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import EmailIcon from '@mui/icons-material/Email'
import GitHubIcon from '@mui/icons-material/GitHub'
import SendIcon from '@mui/icons-material/Send'

const ContactSection = () => (
  <Box sx={{ backgroundColor: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border-gold)', py: 8 }}>
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ width: 4, height: 28, backgroundColor: 'var(--color-secondary)', borderRadius: 1 }} />
        <Typography variant="overline" sx={{ color: 'var(--color-secondary)', letterSpacing: 3 }}>
          CONTACT
        </Typography>
      </Box>
      <Typography variant="h3" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
        Contact 섹션
      </Typography>
      <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 4 }}>
        여기는 Contact 섹션입니다. 연락처, SNS, 간단한 메시지 폼이 들어갈 예정입니다.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmailIcon sx={{ color: 'var(--color-secondary)' }} />
              <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                이메일 주소가 들어갈 예정입니다.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <GitHubIcon sx={{ color: 'var(--color-secondary)' }} />
              <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                GitHub 링크가 들어갈 예정입니다.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
            메시지 보내기
          </Typography>
          <Stack spacing={2}>
            <TextField label="이름" variant="outlined" size="small" fullWidth />
            <TextField label="이메일" variant="outlined" size="small" fullWidth />
            <TextField label="메시지" variant="outlined" multiline rows={3} fullWidth />
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              sx={{ alignSelf: 'flex-end', px: 4 }}
            >
              보내기
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  </Box>
)

export default ContactSection
