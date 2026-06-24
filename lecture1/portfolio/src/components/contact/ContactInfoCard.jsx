import {
  Box, Typography, Card, CardContent, Grid,
  IconButton, Tooltip, Chip,
} from '@mui/material'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  GitHub as GitHubIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Language as WebIcon,
} from '@mui/icons-material'

const SNS_LINKS = [
  {
    label: 'GitHub',
    icon: <GitHubIcon />,
    href: 'https://github.com/bersut4',
    color: '#24292e',
    bg: '#f0f0f0',
  },
  {
    label: 'Instagram',
    icon: <InstagramIcon />,
    href: '#',
    color: '#E1306C',
    bg: '#fce4ec',
  },
  {
    label: 'LinkedIn',
    icon: <LinkedInIcon />,
    href: '#',
    color: '#0A66C2',
    bg: '#e3f2fd',
  },
  {
    label: '포트폴리오 사이트',
    icon: <WebIcon />,
    href: '#',
    color: '#F97316',
    bg: '#FFF3E0',
  },
]

const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
    <Box
      sx={{
        width: 36, height: 36, borderRadius: '50%',
        bgcolor: 'primary.main', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} color="text.primary">
        {value}
      </Typography>
    </Box>
  </Box>
)

export default function ContactInfoCard() {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* 연락처 카드 */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card
          elevation={0}
          sx={{
            border: '2px solid',
            borderColor: 'primary.light',
            borderRadius: 3,
            height: '100%',
            bgcolor: 'background.paper',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 700 }}>
                📬 연락처
              </Typography>
              <Chip
                label="Always Open"
                size="small"
                sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600, fontSize: 10 }}
              />
            </Box>

            <InfoItem
              icon={<EmailIcon sx={{ color: 'white', fontSize: 18 }} />}
              label="이메일"
              value="bersut5@gmail.com"
            />
            <InfoItem
              icon={<PhoneIcon sx={{ color: 'white', fontSize: 18 }} />}
              label="전화번호"
              value="문의 주시면 안내 드립니다"
            />

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic', fontSize: '0.8rem' }}>
              💌 메일로 연락 주시면 빠르게 답변드립니다!
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* SNS 카드 */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card
          elevation={0}
          sx={{
            border: '2px solid',
            borderColor: 'secondary.main',
            borderRadius: 3,
            height: '100%',
            bgcolor: 'background.paper',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 700 }}>
                🔗 SNS & 링크
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {SNS_LINKS.map((sns) => (
                <Tooltip key={sns.label} title={sns.label} arrow>
                  <IconButton
                    component="a"
                    href={sns.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      width: 52, height: 52,
                      bgcolor: sns.bg,
                      color: sns.color,
                      borderRadius: '50%',
                      border: `2px solid ${sns.bg}`,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: sns.color,
                        color: 'white',
                        transform: 'scale(1.15)',
                        boxShadow: `0 4px 12px ${sns.color}44`,
                      },
                    }}
                  >
                    {sns.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic', fontSize: '0.8rem' }}>
              🌟 팔로우하고 소식을 받아보세요!
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
