import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, List, ListItem, ListItemButton, ListItemText,
  ListItemAvatar, Avatar, Chip, Paper, Button, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, Divider, Skeleton,
} from '@mui/material'
import { Add as AddIcon, Chat as ChatIcon } from '@mui/icons-material'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const formatTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return '방금'
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { fetchChannels() }, [])

  const fetchChannels = async () => {
    const { data } = await supabase
      .from('channels')
      .select(`
        id, name, description, created_at,
        messages(content, created_at, profiles:author_id(username))
      `)
      .order('created_at', { ascending: true })
    const enriched = (data ?? []).map((ch) => {
      const msgs = (ch.messages ?? []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      return { ...ch, lastMessage: msgs[0] ?? null, memberCount: ch.messages?.length ?? 0 }
    })
    setChannels(enriched)
    setLoading(false)
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    await supabase.from('channels').insert({ name: newName.trim(), description: newDesc.trim(), created_by: user.id })
    setNewName('')
    setNewDesc('')
    setCreateOpen(false)
    fetchChannels()
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>실시간 채팅</Typography>
          <Typography variant="body2" color="text.secondary">채널을 선택하여 채팅에 참여하세요</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          채널 만들기
        </Button>
      </Box>

      <Paper>
        <List disablePadding>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <ListItem key={i}><Skeleton width="100%" height={60} /></ListItem>
            ))
          ) : channels.map((ch, idx) => (
            <Box key={ch.id}>
              {idx > 0 && <Divider />}
              <ListItemButton onClick={() => navigate(`/chat/${ch.id}`)} sx={{ py: 2 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.dark' }}>
                    <ChatIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography fontWeight={600}># {ch.name}</Typography>
                    </Box>
                  }
                  secondary={
                    ch.lastMessage
                      ? `${ch.lastMessage.profiles?.username}: ${ch.lastMessage.content}`
                      : ch.description || '아직 메시지가 없습니다.'
                  }
                  secondaryTypographyProps={{ noWrap: true, sx: { maxWidth: 400 } }}
                />
                {ch.lastMessage && (
                  <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                    {formatTime(ch.lastMessage.created_at)}
                  </Typography>
                )}
              </ListItemButton>
            </Box>
          ))}
        </List>
      </Paper>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>새 채널 만들기</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="채널 이름" value={newName} onChange={(e) => setNewName(e.target.value)} sx={{ mb: 2, mt: 1 }} />
          <TextField fullWidth label="채널 설명 (선택)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleCreate}>만들기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
