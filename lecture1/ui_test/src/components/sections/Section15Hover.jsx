import { Box, Typography, Grid, Paper } from '@mui/material'

const HOVER_EFFECTS = [
  {
    id: 'scale',
    label: 'Scale Up',
    desc: '크기 확대',
    baseColor: '#1976d2',
    sx: {
      transform: 'scale(1)',
      transition: 'transform 0.25s ease',
      '&:hover': { transform: 'scale(1.12)' },
    },
  },
  {
    id: 'lift',
    label: 'Lift',
    desc: '위로 떠오르기',
    baseColor: '#388e3c',
    sx: {
      transform: 'translateY(0)',
      boxShadow: 2,
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      '&:hover': { transform: 'translateY(-10px)', boxShadow: 10 },
    },
  },
  {
    id: 'shadow',
    label: 'Shadow Glow',
    desc: '빛나는 그림자',
    baseColor: '#7b1fa2',
    sx: {
      transition: 'box-shadow 0.3s ease',
      '&:hover': { boxShadow: '0 0 0 6px rgba(123,31,162,0.25), 0 8px 24px rgba(123,31,162,0.35)' },
    },
  },
  {
    id: 'fill',
    label: 'Color Fill',
    desc: '배경색 슬라이드',
    baseColor: 'transparent',
    textColor: '#f57c00',
    sx: {
      border: '2px solid #f57c00',
      background: 'linear-gradient(to right, #f57c00 50%, transparent 50%)',
      backgroundSize: '200% 100%',
      backgroundPosition: 'right',
      transition: 'background-position 0.35s ease, color 0.35s ease',
      color: '#f57c00',
      '&:hover': { backgroundPosition: 'left', color: '#fff' },
    },
  },
  {
    id: 'rotate',
    label: 'Tilt',
    desc: '살짝 기울기',
    baseColor: '#0288d1',
    sx: {
      transform: 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      '&:hover': { transform: 'rotate(-4deg) scale(1.05)' },
    },
  },
  {
    id: 'border',
    label: 'Border Trace',
    desc: '테두리 그리기',
    baseColor: '#455a64',
    sx: {
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        border: '3px solid #fff',
        opacity: 0,
        transform: 'scale(0.85)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      },
      '&:hover::before': { opacity: 1, transform: 'scale(1)' },
    },
  },
  {
    id: 'brightness',
    label: 'Brightness',
    desc: '밝기 변화',
    baseColor: '#d32f2f',
    sx: {
      filter: 'brightness(1)',
      transition: 'filter 0.25s ease',
      '&:hover': { filter: 'brightness(1.35)' },
    },
  },
  {
    id: 'reveal',
    label: 'Text Reveal',
    desc: '설명 텍스트 등장',
    baseColor: '#00695c',
    isReveal: true,
    sx: {
      overflow: 'hidden',
      '& .hover-sub': {
        opacity: 0,
        transform: 'translateY(12px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      },
      '&:hover .hover-sub': { opacity: 1, transform: 'translateY(0)' },
    },
  },
]

const HoverCard = ({ label, desc, baseColor, textColor, sx, isReveal }) => (
  <Box
    sx={{
      height: 140,
      borderRadius: 2,
      bgcolor: baseColor === 'transparent' ? 'transparent' : baseColor,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      ...sx,
    }}
  >
    <Typography
      variant="body1"
      fontWeight={700}
      sx={{ color: textColor ?? '#fff', letterSpacing: 0.5 }}
    >
      {label}
    </Typography>
    {isReveal ? (
      <Typography className="hover-sub" variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>
        {desc}
      </Typography>
    ) : (
      <Typography variant="caption" sx={{ color: textColor ? 'inherit' : 'rgba(255,255,255,0.75)', mt: 0.5 }}>
        {desc}
      </Typography>
    )}
  </Box>
)

const Section15Hover = () => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h2" sx={{ mb: 1 }}>
      15. Hover Effects
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      CSS transition + sx &:hover — 8가지 호버 효과 (마우스를 카드 위에 올려보세요)
    </Typography>

    <Grid container spacing={2}>
      {HOVER_EFFECTS.map((effect) => (
        <Grid key={effect.id} size={{ xs: 12, sm: 6, md: 3 }}>
          <HoverCard {...effect} />
        </Grid>
      ))}
    </Grid>
  </Box>
)

export default Section15Hover
