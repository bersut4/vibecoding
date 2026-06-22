import { useState } from 'react'
import {
  Box, Typography, Grid,
  Card, CardMedia, CardContent, CardActions,
  Button, IconButton, Chip,
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material'

const CARDS = [
  {
    id: 1,
    title: 'React 완전 정복',
    description: 'React 19의 새로운 기능과 훅 패턴을 실전 프로젝트로 배웁니다. useState부터 커스텀 훅까지.',
    category: '프론트엔드',
    mediaColor: '#1976d2',
    mediaLabel: 'React',
  },
  {
    id: 2,
    title: 'MUI 디자인 시스템',
    description: 'Material UI로 일관된 UI를 빠르게 구축하는 방법을 학습합니다. 테마 커스터마이징 포함.',
    category: 'UI/UX',
    mediaColor: '#0288d1',
    mediaLabel: 'MUI',
  },
  {
    id: 3,
    title: 'TypeScript 실전',
    description: '자바스크립트 개발자를 위한 TypeScript 입문. 타입 시스템부터 제네릭까지 단계별 학습.',
    category: '언어',
    mediaColor: '#303f9f',
    mediaLabel: 'TS',
  },
  {
    id: 4,
    title: 'Node.js 백엔드',
    description: 'Express와 Prisma로 REST API 서버를 구축합니다. 인증, 데이터베이스 연동 실습 포함.',
    category: '백엔드',
    mediaColor: '#388e3c',
    mediaLabel: 'Node',
  },
]

const Section09Cards = () => {
  const [liked, setLiked] = useState([])
  const [saved, setSaved] = useState([])

  const toggleLike = (id) => setLiked((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id])
  const toggleSave = (id) => setSaved((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id])

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        09. Card
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        CardMedia + CardContent + CardActions — Grid 배치, 호버 elevation 효과
      </Typography>

      <Grid container spacing={3}>
        {CARDS.map(({ id, title, description, category, mediaColor, mediaLabel }) => {
          const isLiked = liked.includes(id)
          const isSaved = saved.includes(id)

          return (
            <Grid key={id} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                  '&:hover': {
                    boxShadow: 8,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* CardMedia: 이미지 영역 (색상 플레이스홀더) */}
                <CardMedia
                  sx={{
                    height: 140,
                    bgcolor: mediaColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: 2 }}
                  >
                    {mediaLabel}
                  </Typography>
                </CardMedia>

                {/* CardContent */}
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Chip label={category} size="small" sx={{ mb: 1 }} />
                  <Typography variant="h3" gutterBottom>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </CardContent>

                {/* CardActions */}
                <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
                  <Button size="small" variant="contained">
                    자세히 보기
                  </Button>
                  <Box>
                    <IconButton size="small" onClick={() => toggleLike(id)} color={isLiked ? 'error' : 'default'}>
                      <FavoriteIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => toggleSave(id)} color={isSaved ? 'primary' : 'default'}>
                      <BookmarkIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <ShareIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default Section09Cards
