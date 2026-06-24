import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Paper, Button, Divider, TextField, Avatar,
  IconButton, Chip, CircularProgress, Skeleton,
} from '@mui/material'
import { ArrowBack, Delete as DeleteIcon, Send as SendIcon } from '@mui/icons-material'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { isVideo } from '../utils/uploadMedia'

const EMOJIS = ['👍', '👎', '❤️', '😂', '😮', '😢', '🔥']

const formatDate = (iso) =>
  new Date(iso).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

const EmojiReactionBar = ({ reactions, onToggle, userId }) => {
  const grouped = reactions.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || [])
    acc[r.emoji].push(r.user_id)
    return acc
  }, {})
  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
      {EMOJIS.map((emoji) => {
        const users = grouped[emoji] ?? []
        const active = users.includes(userId)
        return (
          <Chip
            key={emoji}
            label={`${emoji} ${users.length || ''}`}
            size="small"
            onClick={() => onToggle(emoji)}
            sx={{
              cursor: 'pointer',
              bgcolor: active ? 'rgba(156,100,247,0.25)' : 'rgba(255,255,255,0.05)',
              border: active ? '1px solid #9c64f7' : '1px solid transparent',
              '&:hover': { bgcolor: 'rgba(156,100,247,0.15)' },
            }}
          />
        )
      })}
    </Box>
  )
}

const CommentItem = ({ comment, allComments, onReply, onDelete, onReaction, userId, isAdmin }) => {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const replies = allComments.filter((c) => c.parent_id === comment.id)

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', gap: 1.5, p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
        <Avatar src={comment.profiles?.avatar_url ?? undefined} sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: 13 }}>
          {comment.profiles?.username?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" fontWeight={600}>{comment.profiles?.username}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary">{formatDate(comment.created_at)}</Typography>
              {(comment.author_id === userId || isAdmin) && (
                <IconButton size="small" onClick={() => onDelete(comment.id)}>
                  <DeleteIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                </IconButton>
              )}
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>{comment.content}</Typography>
          <EmojiReactionBar reactions={comment.comment_reactions ?? []} onToggle={(e) => onReaction(comment.id, e)} userId={userId} />
          <Button size="small" sx={{ mt: 0.5, fontSize: 12, color: 'text.secondary' }} onClick={() => setReplyOpen(!replyOpen)}>
            답글
          </Button>
          {replyOpen && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <TextField size="small" fullWidth placeholder="답글을 입력하세요..." value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onReply(comment.id, replyText); setReplyText(''); setReplyOpen(false) } }}
              />
              <IconButton color="primary" onClick={() => { onReply(comment.id, replyText); setReplyText(''); setReplyOpen(false) }}>
                <SendIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
      {replies.map((reply) => (
        <Box key={reply.id} sx={{ ml: 4, mt: 0.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, p: 1.5, bgcolor: 'rgba(156,100,247,0.04)', borderRadius: 2, borderLeft: '2px solid rgba(156,100,247,0.3)' }}>
            <Avatar src={reply.profiles?.avatar_url ?? undefined} sx={{ width: 26, height: 26, bgcolor: 'secondary.dark', fontSize: 11 }}>
              {reply.profiles?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" fontWeight={600}>{reply.profiles?.username}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>{formatDate(reply.created_at)}</Typography>
                  {(reply.author_id === userId || isAdmin) && (
                    <IconButton size="small" onClick={() => onDelete(reply.id)}>
                      <DeleteIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                    </IconButton>
                  )}
                </Box>
              </Box>
              <Typography variant="body2" sx={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{reply.content}</Typography>
              <EmojiReactionBar reactions={reply.comment_reactions ?? []} onToggle={(e) => onReaction(reply.id, e)} userId={userId} />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default function PostDetailPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
    fetchComments()
    supabase.rpc('increment_view_count', { post_id: Number(postId) }).then(() => fetchPost())
  }, [postId])

  const fetchPost = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles:author_id(username, avatar_url), post_reactions(*)')
      .eq('id', postId)
      .single()
    setPost(data)
    setLoading(false)
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles:author_id(username, avatar_url), comment_reactions(*)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    setComments(data ?? [])
  }

  const handlePostReaction = async (emoji) => {
    if (!user) return
    const existing = post.post_reactions?.find((r) => r.emoji === emoji && r.user_id === user.id)
    if (existing) {
      await supabase.from('post_reactions').delete().eq('id', existing.id)
    } else {
      await supabase.from('post_reactions').insert({ post_id: Number(postId), user_id: user.id, emoji })
    }
    fetchPost()
  }

  const handleCommentReaction = async (commentId, emoji) => {
    if (!user) return
    const comment = comments.find((c) => c.id === commentId)
    const existing = comment?.comment_reactions?.find((r) => r.emoji === emoji && r.user_id === user.id)
    if (existing) {
      await supabase.from('comment_reactions').delete().eq('id', existing.id)
    } else {
      await supabase.from('comment_reactions').insert({ comment_id: commentId, user_id: user.id, emoji })
    }
    fetchComments()
  }

  const handleAddComment = async () => {
    if (!commentText.trim() || !user) return
    await supabase.from('comments').insert({ content: commentText.trim(), author_id: user.id, post_id: Number(postId) })
    setCommentText('')
    fetchComments()
  }

  const handleReply = async (parentId, text) => {
    if (!text.trim() || !user) return
    await supabase.from('comments').insert({ content: text.trim(), author_id: user.id, post_id: Number(postId), parent_id: parentId })
    fetchComments()
  }

  const handleDeleteComment = async (commentId) => {
    await supabase.from('comments').delete().eq('id', commentId)
    fetchComments()
  }

  const handleDeletePost = async () => {
    await supabase.from('posts').delete().eq('id', postId)
    navigate(-1)
  }

  if (loading) return <Box sx={{ p: 4 }}><Skeleton height={40} /><Skeleton height={200} /></Box>
  if (!post) return <Typography color="error">게시글을 찾을 수 없습니다.</Typography>

  const topComments = comments.filter((c) => !c.parent_id)

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2, color: 'text.secondary' }}>
        목록으로
      </Button>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>{post.title}</Typography>
          {(post.author_id === user?.id || isAdmin) && (
            <IconButton onClick={handleDeletePost} color="error" size="small">
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={post.profiles?.avatar_url ?? undefined}
              sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: 13 }}
            >
              {post.profiles?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight={600}>{post.profiles?.username}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">{formatDate(post.created_at)}</Typography>
          <Typography variant="body2" color="text.secondary">조회 {post.view_count}</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{post.content}</Typography>
        {post.media_urls?.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {post.media_urls.map((url, i) => (
              isVideo(url) ? (
                <video key={i} src={url} controls style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }} />
              ) : (
                <Box key={i} component="img" src={url} sx={{ maxWidth: '100%', maxHeight: 400, borderRadius: 1, cursor: 'pointer', objectFit: 'contain' }}
                  onClick={() => window.open(url, '_blank')} />
              )
            ))}
          </Box>
        )}
        <Divider sx={{ mt: 3, mb: 1 }} />
        <EmojiReactionBar reactions={post.post_reactions ?? []} onToggle={handlePostReaction} userId={user?.id} />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>댓글 {topComments.length}개</Typography>
        {topComments.map((c) => (
          <CommentItem key={c.id} comment={c} allComments={comments}
            onReply={handleReply} onDelete={handleDeleteComment}
            onReaction={handleCommentReaction} userId={user?.id} isAdmin={isAdmin} />
        ))}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField fullWidth multiline maxRows={4} placeholder="댓글을 입력하세요..." value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment() } }}
          />
          <Button variant="contained" onClick={handleAddComment} sx={{ alignSelf: 'flex-end' }}>
            등록
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
