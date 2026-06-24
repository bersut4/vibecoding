import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Paper, TextField, IconButton, Avatar, Chip,
  Divider, CircularProgress, Tooltip, Menu, MenuItem,
} from '@mui/material'
import {
  ArrowBack, Send as SendIcon, Edit as EditIcon, Delete as DeleteIcon,
} from '@mui/icons-material'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥']

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

export default function ChatRoomPage() {
  const { channelId } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [channel, setChannel] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [emojiMenuAnchor, setEmojiMenuAnchor] = useState(null)
  const [emojiTargetId, setEmojiTargetId] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetchChannel()
    fetchMessages()

    const channel_sub = supabase
      .channel(`room:${channelId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` },
        () => fetchMessages())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'message_reactions' },
        () => fetchMessages())
      .subscribe()

    return () => supabase.removeChannel(channel_sub)
  }, [channelId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchChannel = async () => {
    const { data } = await supabase.from('channels').select('*').eq('id', channelId).single()
    setChannel(data)
  }

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, profiles:author_id(username), message_reactions(*)')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
    setMessages(data ?? [])
    setLoading(false)
  }

  const handleSend = async () => {
    if (!text.trim() || !user) return
    await supabase.from('messages').insert({ content: text.trim(), author_id: user.id, channel_id: Number(channelId) })
    setText('')
  }

  const handleDelete = async (msgId) => {
    await supabase.from('messages').delete().eq('id', msgId).eq('author_id', user.id)
  }

  const handleEdit = async (msgId) => {
    if (!editText.trim()) return
    await supabase.from('messages').update({ content: editText.trim(), is_edited: true }).eq('id', msgId)
    setEditingId(null)
    setEditText('')
  }

  const handleReaction = async (msgId, emoji) => {
    setEmojiMenuAnchor(null)
    if (!user) return
    const msg = messages.find((m) => m.id === msgId)
    const existing = msg?.message_reactions?.find((r) => r.emoji === emoji && r.user_id === user.id)
    if (existing) {
      await supabase.from('message_reactions').delete().eq('id', existing.id)
    } else {
      await supabase.from('message_reactions').insert({ message_id: msgId, user_id: user.id, emoji })
    }
  }

  const getReactionGroups = (reactions) =>
    EMOJIS.map((e) => ({ emoji: e, users: reactions.filter((r) => r.emoji === e).map((r) => r.user_id) })).filter((g) => g.users.length > 0)

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => navigate('/chat')}><ArrowBack /></IconButton>
        <Typography variant="h6" fontWeight={700}># {channel?.name}</Typography>
        {channel?.description && (
          <Typography variant="body2" color="text.secondary">— {channel.description}</Typography>
        )}
      </Box>

      <Paper sx={{ flexGrow: 1, overflow: 'auto', p: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {loading && <CircularProgress sx={{ m: 'auto' }} />}
        {messages.map((msg) => {
          const isMe = msg.author_id === user?.id
          const reactions = getReactionGroups(msg.message_reactions ?? [])
          return (
            <Box key={msg.id} sx={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: 1, alignItems: 'flex-end' }}>
              {!isMe && (
                <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.dark', fontSize: 12 }}>
                  {msg.profiles?.username?.[0]?.toUpperCase()}
                </Avatar>
              )}
              <Box sx={{ maxWidth: '70%' }}>
                {!isMe && (
                  <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
                    {msg.profiles?.username}
                  </Typography>
                )}
                <Box sx={{ position: 'relative' }}>
                  {editingId === msg.id ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField size="small" value={editText} onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleEdit(msg.id) }} autoFocus />
                      <IconButton size="small" color="primary" onClick={() => handleEdit(msg.id)}><SendIcon /></IconButton>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        px: 2, py: 1, borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        bgcolor: isMe ? 'primary.dark' : 'rgba(255,255,255,0.05)',
                        border: isMe ? 'none' : '1px solid rgba(255,255,255,0.08)',
                        cursor: 'pointer',
                      }}
                      onContextMenu={(e) => { e.preventDefault(); setEmojiTargetId(msg.id); setEmojiMenuAnchor(e.currentTarget) }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                      {msg.is_edited && <Typography variant="caption" color="text.secondary"> (수정됨)</Typography>}
                    </Box>
                  )}
                  {isMe && editingId !== msg.id && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 0.25 }}>
                      <IconButton size="small" onClick={() => { setEditingId(msg.id); setEditText(msg.content) }}>
                        <EditIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(msg.id)}>
                        <DeleteIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                {reactions.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    {reactions.map(({ emoji, users }) => (
                      <Chip key={emoji} size="small" label={`${emoji} ${users.length}`}
                        onClick={() => handleReaction(msg.id, emoji)}
                        sx={{ height: 20, fontSize: 11, cursor: 'pointer',
                          bgcolor: users.includes(user?.id) ? 'rgba(156,100,247,0.25)' : 'rgba(255,255,255,0.05)',
                          border: users.includes(user?.id) ? '1px solid #9c64f7' : '1px solid transparent',
                        }}
                      />
                    ))}
                  </Box>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: isMe ? 'right' : 'left', mt: 0.25, px: 0.5 }}>
                  {formatTime(msg.created_at)}
                </Typography>
              </Box>
            </Box>
          )
        })}
        <div ref={bottomRef} />
      </Paper>

      <Menu anchorEl={emojiMenuAnchor} open={Boolean(emojiMenuAnchor)} onClose={() => setEmojiMenuAnchor(null)}>
        <Box sx={{ display: 'flex', p: 1, gap: 0.5 }}>
          {EMOJIS.map((emoji) => (
            <IconButton key={emoji} size="small" onClick={() => handleReaction(emojiTargetId, emoji)} sx={{ fontSize: 20 }}>
              {emoji}
            </IconButton>
          ))}
        </Box>
      </Menu>

      <Paper sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: 13 }}>
            {profile?.username?.[0]?.toUpperCase()}
          </Avatar>
          <TextField
            fullWidth size="small" placeholder={`# ${channel?.name ?? ''}에 메시지 보내기`}
            value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          />
          <IconButton color="primary" onClick={handleSend} disabled={!text.trim()}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  )
}
