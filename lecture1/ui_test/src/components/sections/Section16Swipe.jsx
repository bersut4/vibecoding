import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import {
  Box, Typography, Stack, IconButton, Chip, Paper,
} from '@mui/material'
import {
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  SwipeLeft as SwipeLeftIcon,
  SwipeRight as SwipeRightIcon,
} from '@mui/icons-material'

const SLIDES = [
  {
    id: 1,
    title: 'React 19',
    subtitle: '새로운 훅과 서버 컴포넌트',
    bg: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    emoji: '⚛️',
  },
  {
    id: 2,
    title: 'Material UI v9',
    subtitle: '더 강력해진 디자인 시스템',
    bg: 'linear-gradient(135deg, #7b1fa2 0%, #ce93d8 100%)',
    emoji: '🎨',
  },
  {
    id: 3,
    title: 'Vite 8',
    subtitle: '초고속 번들러로 개발 속도 향상',
    bg: 'linear-gradient(135deg, #f57c00 0%, #ffcc80 100%)',
    emoji: '⚡',
  },
  {
    id: 4,
    title: 'TypeScript 5',
    subtitle: '더 스마트한 타입 추론',
    bg: 'linear-gradient(135deg, #303f9f 0%, #7986cb 100%)',
    emoji: '🔷',
  },
  {
    id: 5,
    title: 'React Router v7',
    subtitle: 'Remix 통합 풀스택 라우팅',
    bg: 'linear-gradient(135deg, #388e3c 0%, #81c784 100%)',
    emoji: '🛣️',
  },
]

const SWIPE_CONFIG = {
  delta: 50,           // 스와이프로 인식하는 최소 이동 거리(px)
  preventScrollOnSwipe: true,
  trackMouse: true,    // 마우스 드래그도 스와이프로 인식
}

const Section16Swipe = () => {
  const [index, setIndex] = useState(0)
  const [swipeDir, setSwipeDir] = useState(null)
  const [animating, setAnimating] = useState(false)

  const goTo = (next) => {
    if (animating) return
    setAnimating(true)
    setIndex((next + SLIDES.length) % SLIDES.length)
    setTimeout(() => setAnimating(false), 350)
  }

  const goPrev = () => { setSwipeDir('right'); goTo(index - 1) }
  const goNext = () => { setSwipeDir('left'); goTo(index + 1) }

  const handlers = useSwipeable({
    onSwipedLeft: () => { setSwipeDir('left'); goTo(index + 1) },
    onSwipedRight: () => { setSwipeDir('right'); goTo(index - 1) },
    onSwiping: ({ dir }) => setSwipeDir(dir === 'Left' ? 'left' : dir === 'Right' ? 'right' : null),
    onSwiped: () => setTimeout(() => setSwipeDir(null), 600),
    ...SWIPE_CONFIG,
  })

  const slide = SLIDES[index]

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        16. Swipe (react-swipeable)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        useSwipeable — 터치/마우스 스와이프 슬라이드, 이전/다음 버튼 제공
      </Typography>

      {/* 슬라이더 */}
      <Box sx={{ position: 'relative', userSelect: 'none' }}>
        <Box
          {...handlers}
          sx={{
            borderRadius: 3,
            background: slide.bg,
            height: 280,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            overflow: 'hidden',
            transition: 'background 0.35s ease',
            '&:active': { cursor: 'grabbing' },
          }}
        >
          {/* 슬라이드 콘텐츠 */}
          <Typography
            sx={{ fontSize: '4rem', mb: 1, lineHeight: 1,
              transition: 'opacity 0.3s, transform 0.3s',
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${swipeDir === 'left' ? '-30px' : '30px'})`
                : 'translateX(0)',
            }}
          >
            {slide.emoji}
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: '#fff', fontWeight: 700, mb: 0.5,
              transition: 'opacity 0.3s, transform 0.3s',
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${swipeDir === 'left' ? '-30px' : '30px'})`
                : 'translateX(0)',
            }}
          >
            {slide.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.85)',
              transition: 'opacity 0.3s, transform 0.3s',
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${swipeDir === 'left' ? '-30px' : '30px'})`
                : 'translateX(0)',
            }}
          >
            {slide.subtitle}
          </Typography>

          {/* 스와이프 방향 피드백 */}
          {swipeDir && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                [swipeDir === 'left' ? 'right' : 'left']: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'rgba(0,0,0,0.3)',
                borderRadius: 10,
                px: 1.5,
                py: 0.5,
              }}
            >
              {swipeDir === 'left'
                ? <SwipeLeftIcon sx={{ color: '#fff', fontSize: 18 }} />
                : <SwipeRightIcon sx={{ color: '#fff', fontSize: 18 }} />
              }
              <Typography variant="caption" sx={{ color: '#fff' }}>
                {swipeDir === 'left' ? '다음' : '이전'}
              </Typography>
            </Box>
          )}

          {/* 슬라이드 번호 */}
          <Chip
            label={`${index + 1} / ${SLIDES.length}`}
            size="small"
            sx={{
              position: 'absolute', bottom: 14,
              bgcolor: 'rgba(0,0,0,0.35)', color: '#fff',
              fontWeight: 600, fontSize: '0.75rem',
            }}
          />
        </Box>

        {/* 이전 버튼 */}
        <IconButton
          onClick={goPrev}
          sx={{
            position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)',
            bgcolor: 'background.paper', boxShadow: 3,
            '&:hover': { bgcolor: 'primary.main', color: '#fff' },
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          <PrevIcon />
        </IconButton>

        {/* 다음 버튼 */}
        <IconButton
          onClick={goNext}
          sx={{
            position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)',
            bgcolor: 'background.paper', boxShadow: 3,
            '&:hover': { bgcolor: 'primary.main', color: '#fff' },
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          <NextIcon />
        </IconButton>
      </Box>

      {/* 도트 인디케이터 */}
      <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 3 }}>
        {SLIDES.map((s, i) => (
          <Box
            key={s.id}
            onClick={() => goTo(i)}
            sx={{
              width: i === index ? 24 : 10,
              height: 10,
              borderRadius: 5,
              bgcolor: i === index ? 'primary.main' : 'action.disabled',
              cursor: 'pointer',
              transition: 'width 0.3s ease, background-color 0.3s ease',
            }}
          />
        ))}
      </Stack>

      {/* 슬라이드 정보 */}
      <Paper variant="outlined" sx={{ mt: 2.5, px: 2.5, py: 1.5 }}>
        <Stack direction="row" spacing={3} flexWrap="wrap">
          <Box>
            <Typography variant="caption" color="text.secondary">현재 슬라이드</Typography>
            <Typography variant="body2" fontWeight={600}>{slide.emoji} {slide.title}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">인덱스</Typography>
            <Typography variant="body2" fontWeight={600}>{index} / {SLIDES.length - 1}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">조작 방법</Typography>
            <Typography variant="body2" color="text.secondary">← 스와이프 / 드래그 / 버튼 →</Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}

export default Section16Swipe
