import { useState } from 'react'
import {
  Box, Typography, Stack, Divider,
  FormControl, InputLabel, Select, MenuItem,
  Paper, Chip,
} from '@mui/material'

const DROPDOWNS = [
  {
    id: 'language',
    label: '프로그래밍 언어',
    options: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'rust', label: 'Rust' },
      { value: 'go', label: 'Go' },
    ],
  },
  {
    id: 'city',
    label: '도시 선택',
    options: [
      { value: 'seoul', label: '서울' },
      { value: 'busan', label: '부산' },
      { value: 'incheon', label: '인천' },
      { value: 'daegu', label: '대구' },
      { value: 'daejeon', label: '대전' },
      { value: 'gwangju', label: '광주' },
    ],
  },
  {
    id: 'size',
    label: '사이즈',
    options: [
      { value: 'xs', label: 'XS — 극소' },
      { value: 's', label: 'S — 소' },
      { value: 'm', label: 'M — 중' },
      { value: 'l', label: 'L — 대' },
      { value: 'xl', label: 'XL — 극대' },
    ],
  },
]

const Section04Dropdown = () => {
  const [selected, setSelected] = useState({ language: '', city: '', size: '' })

  const handleChange = (id) => (e) => {
    setSelected((prev) => ({ ...prev, [id]: e.target.value }))
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        04. Dropdown (Select)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        FormControl + InputLabel + Select + MenuItem — 선택값 실시간 표시
      </Typography>

      <Stack spacing={3} divider={<Divider flexItem />}>
        {DROPDOWNS.map(({ id, label, options }) => (
          <Box key={id}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              {label}
            </Typography>
            <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>{label}</InputLabel>
                <Select
                  value={selected[id]}
                  label={label}
                  onChange={handleChange(id)}
                >
                  {options.map(({ value, label: optLabel }) => (
                    <MenuItem key={value} value={value}>
                      {optLabel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Paper
                variant="outlined"
                sx={{ px: 2, py: 1, minWidth: 180, bgcolor: 'background.paper' }}
              >
                <Typography variant="caption" color="text.secondary">
                  선택값:
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {selected[id]
                    ? <Chip label={options.find(o => o.value === selected[id])?.label} color="primary" size="small" />
                    : <Typography variant="body2" color="text.disabled">미선택</Typography>
                  }
                </Box>
              </Paper>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

export default Section04Dropdown
