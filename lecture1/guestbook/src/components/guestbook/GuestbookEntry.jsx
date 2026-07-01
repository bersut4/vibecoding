import { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, Card, CardContent, IconButton, Chip,
  Rating, Collapse, TextField, Button, Divider, Avatar,
  Tooltip, CircularProgress,
} from '@mui/material'
import {
  ThumbUp as LikeIcon,
  ThumbDown as DislikeIcon,
  ChatBubbleOutlineRounded as CommentIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material'
import { supabase } from '../../lib/supabase'
import { useAdmin } from '../../contexts/AdminContext'

const SESSION_KEY = 'portfolio_guestbook_sid'
const getSessionId = () => {
  let sid = sessionStorage.getItem(SESSION_KEY)
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem(SESSION_KEY, sid)
  }
  return sid
}

const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function GuestbookEntry({ entry, onDelete }) {
  const { isAdmin } = useAdmin()
  const sessionId = getSessionId()

  const [reactions, setReactions] = useState({ like: 0, dislike: 0 })
  const [myReaction, setMyReaction] = useState(null)
  const [reactionLoading, setReactionLoading] = useState(false)

  const [comments, setComments] = useState([])
  const [commentOpen, setCommentOpen] = useState(false)
  const [commentName, setCommentName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  const fetchReactions = useCallback(async () => {
    const { data } = await supabase
      .from('guestbook_reactions')
      .select('reaction_type, session_id')
      .eq('entry_id', entry.id)

    if (data) {
      const like = data.filter((r) => r.reaction_type === 'like').length
      const dislike = data.filter((r) => r.reaction_type === 'dislike').length
      setReactions({ like, dislike })
      const mine = data.find((r) => r.session_id === sessionId)
      setMyReaction(mine?.reaction_type ?? null)
    }
  }, [entry.id, sessionId])

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('guestbook_comments')
      .select('*')
      .eq('entry_id', entry.id)
      .order('created_at', { ascending: true })
    setComments(data ?? [])
  }, [entry.id])

  useEffect(() => {
    fetchReactions()
    fetchComments()
  }, [fetchReactions, fetchComments])

  const handleReact = async (type) => {
    if (reactionLoading) return
    setReactionLoading(true)

    if (myReaction === type) {
      // 같은 반응 → 취소
      await supabase
        .from('guestbook_reactions')
        .delete()
        .eq('entry_id', entry.id)
        .eq('session_id', sessionId)
    } else if (myReaction) {
      // 다른 반응으로 교체 (upsert)
      await supabase
        .from('guestbook_reactions')
        .upsert({ entry_id: entry.id, session_id: sessionId, reaction_type: type })
    } else {
      // 새 반응
      await supabase
        .from('guestbook_reactions')
        .insert({ entry_id: entry.id, session_id: sessionId, reaction_type: type })
    }

    await fetchReactions()
    setReactionLoading(false)
  }

  const handleComment = async () => {
    if (!commentName.trim() || !commentText.trim()) return
    setCommentLoading(true)
    await supabase.from('guestbook_comments').insert({
      entry_id: entry.id,
      commenter_name: commentName.trim(),
      content: commentText.trim(),
    })
    setCommentName('')
    setCommentText('')
    await fetchComments()
    setCommentLoading(false)
  }

  const handleDeleteComment = async (commentId) => {
    await supabase.from('guestbook_comments').delete().eq('id', commentId)
    fetchComments()
  }

  const avatarColors = ['#F97316', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#F472B6']
  const avatarColor = avatarColors[entry.id % avatarColors.length]

  return (
    <Card
      elevation={0}
      sx={{
        border: '1.5px solid',
        borderColor: 'divider',
        borderRadius: 3,
        mb: 2,
        bgcolor: 'background.paper',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 20px rgba(249,115,22,0.1)' },
      }}
    >
      <CardContent sx={{ p: 2.5, pb: '12px !important' }}>
        {/* 헤더: 아바타 + 이름 + 날짜 + 삭제 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
          <Avatar
            sx={{ width: 40, height: 40, bgcolor: avatarColor, fontSize: '1.2rem', flexShrink: 0 }}
          >
            {entry.emoji || entry.name[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.8 }}>
              <Typography variant="body1" fontWeight={700} noWrap>
                {entry.name}
              </Typography>
              {entry.occupation && (
                <Chip label={entry.occupation} size="small" sx={{ height: 20, fontSize: 11, bgcolor: 'rgba(249,115,22,0.1)', color: 'primary.dark' }} />
              )}
              {entry.keyword && (
                <Chip label={`"${entry.keyword}"`} size="small" variant="outlined" sx={{ height: 20, fontSize: 11, borderColor: 'secondary.main', color: 'text.secondary' }} />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {formatDate(entry.created_at)}
              {entry.referral_source && ` · ${entry.referral_source}를 통해`}
            </Typography>
          </Box>
          {isAdmin && (
            <Tooltip title="삭제 (관리자)">
              <IconButton
                size="small"
                onClick={() => onDelete(entry.id)}
                sx={{ color: 'error.main', opacity: 0.7, '&:hover': { opacity: 1 } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* 별점 */}
        {entry.star_rating && (
          <Rating value={entry.star_rating} readOnly size="small" sx={{ color: 'secondary.main', mb: 1 }} />
        )}

        {/* 메시지 */}
        <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.primary', mb: 1.5 }}>
          {entry.message}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {/* 반응 버튼 + 댓글 토글 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="좋아요">
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 0.3, cursor: 'pointer', px: 1, py: 0.5, borderRadius: 2, transition: '0.15s',
                bgcolor: myReaction === 'like' ? 'rgba(249,115,22,0.12)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(249,115,22,0.08)' },
              }}
              onClick={() => handleReact('like')}
            >
              <LikeIcon
                fontSize="small"
                sx={{ color: myReaction === 'like' ? 'primary.main' : 'text.secondary', fontSize: 18 }}
              />
              <Typography variant="caption" sx={{ color: myReaction === 'like' ? 'primary.main' : 'text.secondary', fontWeight: 600 }}>
                {reactions.like}
              </Typography>
            </Box>
          </Tooltip>

          <Tooltip title="별로예요">
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 0.3, cursor: 'pointer', px: 1, py: 0.5, borderRadius: 2, transition: '0.15s',
                bgcolor: myReaction === 'dislike' ? 'rgba(99,102,241,0.1)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(99,102,241,0.06)' },
              }}
              onClick={() => handleReact('dislike')}
            >
              <DislikeIcon
                fontSize="small"
                sx={{ color: myReaction === 'dislike' ? '#6366f1' : 'text.secondary', fontSize: 18 }}
              />
              <Typography variant="caption" sx={{ color: myReaction === 'dislike' ? '#6366f1' : 'text.secondary', fontWeight: 600 }}>
                {reactions.dislike}
              </Typography>
            </Box>
          </Tooltip>

          {reactionLoading && <CircularProgress size={14} sx={{ ml: 0.5 }} />}

          <Box sx={{ flexGrow: 1 }} />

          <Button
            size="small"
            startIcon={<CommentIcon sx={{ fontSize: '16px !important' }} />}
            onClick={() => setCommentOpen(!commentOpen)}
            sx={{ color: 'text.secondary', fontSize: 12, py: 0.3 }}
          >
            댓글 {comments.length > 0 ? `(${comments.length})` : ''}
          </Button>
        </Box>

        {/* 댓글 섹션 */}
        <Collapse in={commentOpen}>
          <Box sx={{ mt: 1.5, pl: 1, borderLeft: '3px solid', borderColor: 'primary.light' }}>
            {comments.length > 0 && (
              <Box sx={{ mb: 1.5 }}>
                {comments.map((c) => (
                  <Box key={c.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start' }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'secondary.main', flexShrink: 0 }}>
                      {c.commenter_name[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="caption" fontWeight={700} sx={{ mr: 1 }}>{c.commenter_name}</Typography>
                      <Typography variant="caption" color="text.secondary">{formatDate(c.created_at)}</Typography>
                      <Typography variant="body2" sx={{ mt: 0.3, fontSize: 13 }}>{c.content}</Typography>
                    </Box>
                    {isAdmin && (
                      <IconButton size="small" onClick={() => handleDeleteComment(c.id)} sx={{ color: 'error.main', opacity: 0.6, p: 0.3 }}>
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {/* 댓글 입력 */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                size="small" placeholder="이름" value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                sx={{ width: 90, '& .MuiInputBase-input': { fontSize: 13 } }}
              />
              <TextField
                size="small" placeholder="댓글을 입력하세요" value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleComment()}
                sx={{ flexGrow: 1, '& .MuiInputBase-input': { fontSize: 13 } }}
              />
              <IconButton
                size="small"
                onClick={handleComment}
                disabled={commentLoading}
                sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 1.5, '&:hover': { bgcolor: 'primary.dark' } }}
              >
                {commentLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon fontSize="small" />}
              </IconButton>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}
