import { useState } from 'react'
import {
  Box, Typography, Stack, Divider, Paper, Slider, Chip,
} from '@mui/material'

const BASIC_MARKS = [
  { value: 0, label: '0' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 75, label: '75' },
  { value: 100, label: '100' },
]

const STEP_MARKS = [
  { value: 0, label: '매우 불만' },
  { value: 25, label: '불만' },
  { value: 50, label: '보통' },
  { value: 75, label: '만족' },
  { value: 100, label: '매우 만족' },
]

const Section07Slider = () => {
  const [basic, setBasic] = useState(40)
  const [range, setRange] = useState([20, 70])
  const [step, setStep] = useState(50)

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        07. Slider
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        기본 / 범위(range) / 단계(step) 슬라이더 — 값 실시간 표시
      </Typography>

      <Stack spacing={4} divider={<Divider flexItem />}>

        {/* 기본 슬라이더 */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            기본 슬라이더 (0~100, marks)
          </Typography>
          <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap">
            <Box sx={{ minWidth: 300, px: 1 }}>
              <Slider
                value={basic}
                min={0}
                max={100}
                marks={BASIC_MARKS}
                valueLabelDisplay="auto"
                onChange={(_, v) => setBasic(v)}
                color="primary"
              />
            </Box>
            <Paper variant="outlined" sx={{ px: 2.5, py: 1.5, minWidth: 120, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" display="block">현재 값</Typography>
              <Typography variant="h3" color="primary">{basic}</Typography>
            </Paper>
          </Stack>
        </Box>

        {/* 범위 슬라이더 */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            범위 슬라이더 (range — 두 핸들)
          </Typography>
          <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap">
            <Box sx={{ minWidth: 300, px: 1 }}>
              <Slider
                value={range}
                min={0}
                max={100}
                marks={BASIC_MARKS}
                valueLabelDisplay="auto"
                onChange={(_, v) => setRange(v)}
                color="secondary"
              />
            </Box>
            <Paper variant="outlined" sx={{ px: 2.5, py: 1.5, minWidth: 160, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                선택 구간
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Chip label={range[0]} size="small" color="secondary" variant="outlined" />
                <Typography variant="body2" alignSelf="center">~</Typography>
                <Chip label={range[1]} size="small" color="secondary" />
              </Stack>
            </Paper>
          </Stack>
        </Box>

        {/* 단계 슬라이더 */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            단계 슬라이더 (step=25, 만족도 설문)
          </Typography>
          <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap">
            <Box sx={{ minWidth: 300, px: 1 }}>
              <Slider
                value={step}
                min={0}
                max={100}
                step={25}
                marks={STEP_MARKS}
                valueLabelDisplay="off"
                onChange={(_, v) => setStep(v)}
                color="primary"
              />
            </Box>
            <Paper variant="outlined" sx={{ px: 2.5, py: 1.5, minWidth: 140, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                만족도
              </Typography>
              <Chip
                label={STEP_MARKS.find((m) => m.value === step)?.label ?? '-'}
                color="primary"
                size="small"
              />
            </Paper>
          </Stack>
        </Box>

      </Stack>
    </Box>
  )
}

export default Section07Slider
