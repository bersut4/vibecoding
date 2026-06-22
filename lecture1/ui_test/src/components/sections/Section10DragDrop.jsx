import { useState, useRef } from 'react'
import { Box, Typography, Paper, Stack, Chip, Button, Divider } from '@mui/material'
import { DragIndicator as DragIcon, RestartAlt as ResetIcon } from '@mui/icons-material'

const INITIAL_ITEMS = [
  { id: 1, label: 'React 컴포넌트 설계', color: '#1976d2' },
  { id: 2, label: 'MUI 테마 설정', color: '#0288d1' },
  { id: 3, label: 'API 연동 로직', color: '#388e3c' },
  { id: 4, label: '로그인 기능 구현', color: '#f57c00' },
  { id: 5, label: '배포 환경 구성', color: '#7b1fa2' },
]

const DropZone = ({ title, items, zoneId, isOver, onDragOver, onDragLeave, onDrop, onDragStart, onDragEnd, draggingId }) => (
  <Paper
    variant="outlined"
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    sx={{
      flex: 1,
      minWidth: 240,
      minHeight: 280,
      p: 2,
      transition: 'background-color 0.2s, border-color 0.2s',
      bgcolor: isOver ? 'primary.50' : 'background.paper',
      borderColor: isOver ? 'primary.main' : 'divider',
      borderWidth: isOver ? 2 : 1,
      borderStyle: 'dashed',
    }}
  >
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
      <Typography variant="h3">{title}</Typography>
      <Chip label={items.length} size="small" color={zoneId === 'done' ? 'success' : 'default'} />
    </Stack>

    <Divider sx={{ mb: 1.5 }} />

    {items.length === 0 && (
      <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', mt: 4 }}>
        여기에 드롭하세요
      </Typography>
    )}

    <Stack spacing={1}>
      {items.map(({ id, label, color }) => (
        <Paper
          key={id}
          draggable
          onDragStart={(e) => onDragStart(e, id, zoneId)}
          onDragEnd={onDragEnd}
          elevation={draggingId === id ? 0 : 1}
          sx={{
            px: 1.5,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'grab',
            userSelect: 'none',
            opacity: draggingId === id ? 0.35 : 1,
            transform: draggingId === id ? 'scale(0.97)' : 'scale(1)',
            transition: 'opacity 0.15s, transform 0.15s, box-shadow 0.15s',
            borderLeft: `4px solid ${color}`,
            '&:hover': { boxShadow: 3 },
            '&:active': { cursor: 'grabbing' },
          }}
        >
          <DragIcon fontSize="small" sx={{ color: 'text.disabled', flexShrink: 0 }} />
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {label}
          </Typography>
        </Paper>
      ))}
    </Stack>
  </Paper>
)

const Section10DragDrop = () => {
  const [todo, setTodo] = useState(INITIAL_ITEMS)
  const [done, setDone] = useState([])
  const [draggingId, setDraggingId] = useState(null)
  const [overZone, setOverZone] = useState(null)
  const dragFrom = useRef(null)

  const handleDragStart = (e, id, fromZone) => {
    setDraggingId(id)
    dragFrom.current = fromZone
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setOverZone(null)
    dragFrom.current = null
  }

  const handleDragOver = (e, zoneId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOverZone(zoneId)
  }

  const handleDragLeave = () => setOverZone(null)

  const handleDrop = (e, toZone) => {
    e.preventDefault()
    setOverZone(null)

    const fromZone = dragFrom.current
    if (!draggingId || fromZone === toZone) return

    const fromList = fromZone === 'todo' ? todo : done
    const toList = toZone === 'todo' ? todo : done
    const setFrom = fromZone === 'todo' ? setTodo : setDone
    const setTo = toZone === 'todo' ? setTodo : setDone

    const item = fromList.find((i) => i.id === draggingId)
    if (!item) return

    setFrom(fromList.filter((i) => i.id !== draggingId))
    setTo([...toList, item])
  }

  const handleReset = () => {
    setTodo(INITIAL_ITEMS)
    setDone([])
    setDraggingId(null)
    setOverZone(null)
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        10. Drag & Drop
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        HTML5 Drag & Drop API — 두 영역 간 아이템 이동, 드래그 중 시각적 피드백
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap">
        <DropZone
          title="📋 할 일"
          items={todo}
          zoneId="todo"
          isOver={overZone === 'todo'}
          draggingId={draggingId}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, 'todo')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'todo')}
        />
        <DropZone
          title="✅ 완료"
          items={done}
          zoneId="done"
          isOver={overZone === 'done'}
          draggingId={draggingId}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, 'done')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'done')}
        />
      </Stack>

      <Button
        startIcon={<ResetIcon />}
        variant="outlined"
        size="small"
        onClick={handleReset}
        sx={{ mt: 2 }}
      >
        초기화
      </Button>
    </Box>
  )
}

export default Section10DragDrop
