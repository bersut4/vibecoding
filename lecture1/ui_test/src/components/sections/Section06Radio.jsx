import { useState } from 'react'
import {
  Box, Typography, Stack, Divider, Paper,
  Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Chip,
} from '@mui/material'

const GROUPS = [
  {
    id: 'delivery',
    label: '배송 방법',
    options: [
      { value: 'standard', label: '일반 배송 (3~5일)' },
      { value: 'express', label: '빠른 배송 (1~2일)' },
      { value: 'same', label: '당일 배송' },
      { value: 'pickup', label: '직접 수령' },
    ],
  },
  {
    id: 'payment',
    label: '결제 수단',
    options: [
      { value: 'card', label: '신용카드' },
      { value: 'bank', label: '계좌이체' },
      { value: 'kakao', label: '카카오페이' },
      { value: 'naver', label: '네이버페이' },
      { value: 'phone', label: '휴대폰 결제' },
    ],
  },
  {
    id: 'level',
    label: '개발 경력',
    options: [
      { value: 'junior', label: '주니어 (0~2년)' },
      { value: 'mid', label: '미드레벨 (3~5년)' },
      { value: 'senior', label: '시니어 (6년 이상)' },
    ],
  },
]

const Section06Radio = () => {
  const [selected, setSelected] = useState({ delivery: '', payment: '', level: '' })

  const handleChange = (id) => (e) => {
    setSelected((prev) => ({ ...prev, [id]: e.target.value }))
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        06. Radio
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        RadioGroup + FormControlLabel — 단일 선택, 선택값 실시간 표시
      </Typography>

      <Stack spacing={3} divider={<Divider flexItem />}>
        {GROUPS.map(({ id, label, options }) => {
          const selectedOption = options.find((o) => o.value === selected[id])

          return (
            <Box key={id}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                {label}
              </Typography>

              <Stack direction="row" spacing={3} flexWrap="wrap" alignItems="flex-start">
                <Paper variant="outlined" sx={{ px: 3, py: 2 }}>
                  <FormControl>
                    <FormLabel sx={{ mb: 1, fontWeight: 600 }}>{label}</FormLabel>
                    <RadioGroup value={selected[id]} onChange={handleChange(id)}>
                      {options.map(({ value, label: optLabel }) => (
                        <FormControlLabel
                          key={value}
                          value={value}
                          label={optLabel}
                          control={<Radio color="primary" />}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{ px: 3, py: 2, minWidth: 180, bgcolor: 'background.paper', alignSelf: 'center' }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    선택값:
                  </Typography>
                  {selectedOption
                    ? <Chip label={selectedOption.label} color="primary" size="small" />
                    : <Typography variant="body2" color="text.disabled">미선택</Typography>
                  }
                </Paper>
              </Stack>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}

export default Section06Radio
