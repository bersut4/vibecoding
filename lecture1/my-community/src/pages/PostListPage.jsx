import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Pagination, CircularProgress, Skeleton,
} from '@mui/material'
import { Add as AddIcon, Visibility as EyeIcon, ChatBubbleOutlineRounded as CommentIcon } from '@mui/icons-material'
import { supabase } from '../lib/supabase'

const BOARD_NAMES = { 1: '자유게시판', 2: '공략 & 팁', 3: '모집 & 파티' }
const PAGE_SIZE = 15

const formatDate = (iso) => {
  const d = new Date(iso)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return '방금 전'
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  return d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function PostListPage() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPage(1)
  }, [boardId])

  useEffect(() => {
    fetchPosts()
  }, [boardId, page])

  const fetchPosts = async () => {
    setLoading(true)
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, count, error } = await supabase
      .from('posts')
      .select(`
        id, title, view_count, created_at,
        profiles:author_id(username),
        comments(count)
      `, { count: 'exact' })
      .eq('board_id', boardId)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (!error) {
      setPosts(data ?? [])
      setTotal(count ?? 0)
    }
    setLoading(false)
  }

  const boardName = BOARD_NAMES[boardId] ?? '게시판'
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>{boardName}</Typography>
          <Typography variant="body2" color="text.secondary">총 {total}개의 게시글</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate(`/posts/new?boardId=${boardId}`)}>
          글쓰기
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(156,100,247,0.05)' }}>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, width: '5%' }}>번호</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>제목</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, width: '12%' }}>작성자</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, width: '15%' }}>작성일</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, width: '8%' }} align="center">조회</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, width: '8%' }} align="center">댓글</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  아직 게시글이 없습니다. 첫 게시글을 작성해보세요!
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post, idx) => (
                <TableRow
                  key={post.id}
                  hover
                  onClick={() => navigate(`/posts/${post.id}`)}
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(156,100,247,0.05)' } }}
                >
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>
                    {total - (page - 1) * PAGE_SIZE - idx}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{post.title}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>
                    {post.profiles?.username ?? '익명'}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>
                    {formatDate(post.created_at)}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary', fontSize: 12 }}>
                      <EyeIcon sx={{ fontSize: 14 }} />{post.view_count}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary', fontSize: 12 }}>
                      <CommentIcon sx={{ fontSize: 14 }} />{post.comments?.[0]?.count ?? 0}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
        </Box>
      )}
    </Box>
  )
}
