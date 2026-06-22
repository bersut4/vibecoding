import { useState } from 'react'
import { Box, Typography, Stack, TextField, Paper, Divider } from '@mui/material'

const VARIANTS = [
  { value: 'standard', label: 'Standard' },
  { value: 'outlined', label: 'Outlined' },
  { value: 'filled', label: 'Filled' },
]

const Section02Inputs = () => {
  const [values, setValues] = useState({
    standard: '',
    outlined: '',
    filled: '',
  })

  const handleChange = (variant) => (e) => {
    setValues((prev) => ({ ...prev, [variant]: e.target.value }))
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        02. Input (TextField)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        variant (standard / outlined / filled) — 입력값 실시간 표시
      </Typography>

      <Stack spacing={3} divider={<Divider flexItem />}>
        {VARIANTS.map(({ value, label }) => (
          <Box key={value}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              variant="{value}"
            </Typography>
            <Stack direction="row" spacing={3} alignItems="flex-start" flexWrap="wrap">
              <TextField
                variant={value}
                label={`${label} 입력`}
                placeholder="여기에 입력하세요"
                value={values[value]}
                onChange={handleChange(value)}
                sx={{ minWidth: 240 }}
              />
              <Paper
                variant="outlined"
                sx={{ px: 2, py: 1, minWidth: 200, bgcolor: 'background.paper', alignSelf: 'center' }}
              >
                <Typography variant="caption" color="text.secondary">
                  입력값:
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, wordBreak: 'break-all' }}>
                  {values[value] || <span style={{ color: '#bbb' }}>없음</span>}
                </Typography>
              </Paper>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

export default Section02Inputs
