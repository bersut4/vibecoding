import { useState } from 'react'
import {
  Box, Typography, Stack, Divider,
  FormGroup, FormControlLabel, Checkbox,
  Paper, Chip,
} from '@mui/material'

const ITEMS = [
  { id: 'react', label: 'React' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'mui', label: 'Material UI' },
  { id: 'vite', label: 'Vite' },
  { id: 'router', label: 'React Router' },
]

const Section05Checkboxes = () => {
  const [checked, setChecked] = useState([])

  const isAllChecked = checked.length === ITEMS.length
  const isIndeterminate = checked.length > 0 && checked.length < ITEMS.length

  const handleAll = () => {
    setChecked(isAllChecked ? [] : ITEMS.map((item) => item.id))
  }

  const handleItem = (id) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        05. Checkbox
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        전체 선택(indeterminate) + 개별 선택 — 선택 개수 실시간 표시
      </Typography>

      <Stack direction="row" spacing={3} flexWrap="wrap" alignItems="flex-start">
        <Paper variant="outlined" sx={{ px: 3, py: 2, minWidth: 220 }}>
          {/* 전체 선택 */}
          <FormControlLabel
            label={
              <Typography variant="body1" fontWeight={600}>
                전체 선택
              </Typography>
            }
            control={
              <Checkbox
                checked={isAllChecked}
                indeterminate={isIndeterminate}
                onChange={handleAll}
                color="primary"
              />
            }
          />

          <Divider sx={{ my: 1 }} />

          {/* 개별 항목 */}
          <FormGroup>
            {ITEMS.map(({ id, label }) => (
              <FormControlLabel
                key={id}
                label={label}
                control={
                  <Checkbox
                    checked={checked.includes(id)}
                    onChange={() => handleItem(id)}
                    color="primary"
                  />
                }
              />
            ))}
          </FormGroup>
        </Paper>

        {/* 선택 결과 표시 */}
        <Paper
          variant="outlined"
          sx={{ px: 3, py: 2, minWidth: 200, bgcolor: 'background.paper' }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            선택된 항목
          </Typography>
          <Typography variant="h3" color="primary" sx={{ mb: 2 }}>
            {checked.length}
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              / {ITEMS.length}개
            </Typography>
          </Typography>

          <Stack spacing={0.5}>
            {checked.length === 0
              ? <Typography variant="body2" color="text.disabled">선택 없음</Typography>
              : ITEMS.filter((item) => checked.includes(item.id)).map(({ id, label }) => (
                  <Chip key={id} label={label} size="small" color="primary" variant="outlined" />
                ))
            }
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}

export default Section05Checkboxes
