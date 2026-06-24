import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box, Typography, TextField, Button, Select, MenuItem, FormControl,
  InputLabel, Paper, IconButton, Chip, LinearProgress,
} from '@mui/material'
import { AttachFile as AttachIcon, Close as CloseIcon } from '@mui/icons-material'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { uploadMedia, isVideo } from '../utils/uploadMedia'

export default function PostCreatePage() {
  const [searchParams] = useSearchParams()
  const defaultBoard = Number(searchParams.get('boardId')) || 1
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [boardId, setBoardId] = useState(defaultBoard)
  const [boards, setBoards] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [mediaFiles, setMediaFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('boards').select('id, name').order('id').then(({ data }) => setBoards(data ?? []))
  }, [])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map((file) => ({ file, url: URL.createObjectURL(file), name: file.name }))
    setMediaFiles((prev) => [...prev, ...previews])
    e.target.value = ''
  }

  const removeMedia = (idx) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx))
  }

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

    let media_urls = []
    if (mediaFiles.length > 0) {
      setUploading(true)
      try {
        media_urls = await Promise.all(mediaFiles.map(({ file }) => uploadMedia(file, user.id)))
      } catch {
        setLoading(false)
        setUploading(false)
        return
      }
      setUploading(false)
    }

    const { data, error } = await supabase.from('posts').insert({
      title: title.trim(),
      content: content.trim(),
      author_id: user.id,
      board_id: boardId,
      media_urls,
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
              {boards.map((b) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="제목" value={title} onChange={(e) => setTitle(e.target.value)}
            error={Boolean(errors.title)} helperText={errors.title} sx={{ mb: 2 }} />
          <TextField fullWidth label="내용" multiline rows={10} value={content} onChange={(e) => setContent(e.target.value)}
            error={Boolean(errors.content)} helperText={errors.content} sx={{ mb: 2 }} />

          {/* 미디어 첨부 */}
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined" size="small" startIcon={<AttachIcon />}
              onClick={() => fileRef.current.click()}
              sx={{ mb: 1.5 }}
            >
              사진 / 동영상 첨부
            </Button>
            <input ref={fileRef} type="file" accept="image/*,video/*" multiple hidden onChange={handleFileChange} />

            {mediaFiles.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {mediaFiles.map((m, idx) => (
                  <Box key={idx} sx={{ position: 'relative' }}>
                    {isVideo(m.name) ? (
                      <video src={m.url} style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <Box component="img" src={m.url} sx={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 1 }} />
                    )}
                    <IconButton
                      size="small"
                      onClick={() => removeMedia(idx)}
                      sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'background.paper', width: 20, height: 20 }}
                    >
                      <CloseIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
            {uploading && <LinearProgress sx={{ mt: 1 }} />}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>취소</Button>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? '등록 중...' : '등록'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
