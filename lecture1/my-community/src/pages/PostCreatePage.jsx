import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Paper } from '@mui/material'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const BOARDS = [
  { id: 1, name: '자유게시판' },
  { id: 2, name: '공략 & 팁' },
  { id: 3, name: '모집 & 파티' },
]

export default function PostCreatePage() {
  const [searchParams] = useSearchParams()
  const defaultBoard = Number(searchParams.get('boardId')) || 1
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [boardId, setBoardId] = useState(defaultBoard)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!title.trim()) errs.title = '제목을 입력해주세요.'
    if (!content.trim()) errs.content = '내용을 입력해주세요.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const { data, error } = await supabase.from('posts').insert({
      title: title.trim(),
      content: content.trim(),
      author_id: user.id,
      board_id: boardId,
    }).select('id').single()
    setLoading(false)
    if (!error && data) navigate(`/posts/${data.id}`)
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} mb={3}>새 게시글 작성</Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>게시판</InputLabel>
            <Select value={boardId} label="게시판" onChange={(e) => setBoardId(e.target.value)}>
              {BOARDS.map((b) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="제목" value={title} onChange={(e) => setTitle(e.target.value)}
            error={Boolean(errors.title)} helperText={errors.title} sx={{ mb: 2 }} />
          <TextField fullWidth label="내용" multiline rows={12} value={content} onChange={(e) => setContent(e.target.value)}
            error={Boolean(errors.content)} helperText={errors.content} sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>취소</Button>
            <Button variant="contained" type="submit" disabled={loading}>{loading ? '등록 중...' : '등록'}</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
