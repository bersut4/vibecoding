import { useState } from 'react'
import {
  Box, Typography, Stack, Button, Paper, Divider,
  Fade, Grow, Slide, Chip, ToggleButton, ToggleButtonGroup,
} from '@mui/material'
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
} from '@mui/icons-material'

// CSS 애니메이션 키프레임
const keyframes = {
  pulse: {
    '@keyframes pulse': {
      '0%, 100%': { transform: 'scale(1)', opacity: 1 },
      '50%': { transform: 'scale(1.2)', opacity: 0.7 },
    },
    animation: 'pulse 1s ease-in-out infinite',
  },
  bounce: {
    '@keyframes bounce': {
      '0%, 100%': { transform: 'translateY(0)' },
      '40%': { transform: 'translateY(-20px)' },
      '60%': { transform: 'translateY(-10px)' },
    },
    animation: 'bounce 0.8s ease infinite',
  },
  spin: {
    '@keyframes spin': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    animation: 'spin 1s linear infinite',
  },
  shake: {
    '@keyframes shake': {
      '0%, 100%': { transform: 'translateX(0)' },
      '20%': { transform: 'translateX(-8px)' },
      '40%': { transform: 'translateX(8px)' },
      '60%': { transform: 'translateX(-5px)' },
      '80%': { transform: 'translateX(5px)' },
    },
    animation: 'shake 0.5s ease',
    animationIterationCount: 'infinite',
  },
}

const CSS_DEMOS = [
  { id: 'pulse', label: 'Pulse', color: '#1976d2', description: '크기 맥박' },
  { id: 'bounce', label: 'Bounce', color: '#388e3c', description: '위아래 반동' },
  { id: 'spin', label: 'Spin', color: '#f57c00', description: '360° 회전' },
  { id: 'shake', label: 'Shake', color: '#d32f2f', description: '좌우 진동' },
]

const DemoBox = ({ color, label }) => (
  <Paper
    elevation={3}
    sx={{
      width: 72,
      height: 72,
      bgcolor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 2,
    }}
  >
    <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.65rem', textAlign: 'center' }}>
      {label}
    </Typography>
  </Paper>
)

const Section12Animation = () => {
  // MUI 트랜지션 상태
  const [fadeIn, setFadeIn] = useState(true)
  const [growIn, setGrowIn] = useState(true)
  const [slideIn, setSlideIn] = useState(true)
  const [slideDir, setSlideDir] = useState('up')

  // CSS 애니메이션 상태
  const [cssPlaying, setCssPlaying] = useState({})

  const toggleCss = (id) => setCssPlaying((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        12. Animation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        MUI 트랜지션 (Fade / Grow / Slide) + CSS @keyframes 애니메이션 조합
      </Typography>

      {/* ── MUI 트랜지션 ── */}
      <Typography variant="h3" sx={{ mb: 2 }}>MUI 트랜지션</Typography>
      <Stack spacing={3} divider={<Divider flexItem />} sx={{ mb: 4 }}>

        {/* Fade */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
            <Chip label="Fade" color="primary" size="small" />
            <Typography variant="caption" color="text.secondary">투명도로 나타나기/사라지기</Typography>
            <Button size="small" variant="outlined" onClick={() => setFadeIn((v) => !v)}
              startIcon={fadeIn ? <PauseIcon /> : <PlayIcon />}>
              {fadeIn ? '숨기기' : '보이기'}
            </Button>
          </Stack>
          <Box sx={{ height: 80, display: 'flex', alignItems: 'center' }}>
            <Fade in={fadeIn} timeout={600}>
              <Box><DemoBox color="#1976d2" label="Fade" /></Box>
            </Fade>
          </Box>
        </Box>

        {/* Grow */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
            <Chip label="Grow" color="success" size="small" />
            <Typography variant="caption" color="text.secondary">중심에서 크기가 커지며 등장</Typography>
            <Button size="small" variant="outlined" color="success" onClick={() => setGrowIn((v) => !v)}
              startIcon={growIn ? <PauseIcon /> : <PlayIcon />}>
              {growIn ? '숨기기' : '보이기'}
            </Button>
          </Stack>
          <Box sx={{ height: 80, display: 'flex', alignItems: 'center' }}>
            <Grow in={growIn} timeout={500}>
              <Box><DemoBox color="#388e3c" label="Grow" /></Box>
            </Grow>
          </Box>
        </Box>

        {/* Slide */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }} flexWrap="wrap">
            <Chip label="Slide" color="warning" size="small" />
            <Typography variant="caption" color="text.secondary">방향 선택:</Typography>
            <ToggleButtonGroup
              value={slideDir}
              exclusive
              onChange={(_, v) => v && setSlideDir(v)}
              size="small"
            >
              {['up', 'down', 'left', 'right'].map((dir) => (
                <ToggleButton key={dir} value={dir} sx={{ px: 1.5 }}>
                  {{ up: '↑', down: '↓', left: '←', right: '→' }[dir]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Button size="small" variant="outlined" color="warning" onClick={() => setSlideIn((v) => !v)}
              startIcon={slideIn ? <PauseIcon /> : <PlayIcon />}>
              {slideIn ? '숨기기' : '보이기'}
            </Button>
          </Stack>
          <Box sx={{ height: 80, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <Slide in={slideIn} direction={slideDir} timeout={400}>
              <Box><DemoBox color="#f57c00" label="Slide" /></Box>
            </Slide>
          </Box>
        </Box>
      </Stack>

      {/* ── CSS 애니메이션 ── */}
      <Typography variant="h3" sx={{ mb: 2 }}>CSS @keyframes 애니메이션</Typography>
      <Stack direction="row" spacing={3} flexWrap="wrap">
        {CSS_DEMOS.map(({ id, label, color, description }) => (
          <Box key={id} sx={{ textAlign: 'center' }}>
            <Box sx={{ height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <Box sx={cssPlaying[id] ? keyframes[id] : {}}>
                <DemoBox color={color} label={label} />
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              {description}
            </Typography>
            <Button
              size="small"
              variant={cssPlaying[id] ? 'contained' : 'outlined'}
              onClick={() => toggleCss(id)}
              startIcon={cssPlaying[id] ? <PauseIcon /> : <PlayIcon />}
              sx={{ minWidth: 90 }}
            >
              {cssPlaying[id] ? '정지' : '재생'}
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

export default Section12Animation
