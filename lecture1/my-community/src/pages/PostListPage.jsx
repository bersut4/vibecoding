import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Pagination, Skeleton, Divider,
} from '@mui/material'
import {
  Add as AddIcon, Visibility as EyeIcon,
  ChatBubbleOutlineRounded as CommentIcon,
  Whatshot as FireIcon,
} from '@mui/icons-material'
import { supabase } from '../lib/supabase'

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

const PostRow = ({ post, onClick, badge, number }) => (
  <TableRow
    hover
    onClick={onClick}
    sx={{
      cursor: 'pointer',
      bgcolor: badge ? 'rgba(248,113,113,0.04)' : 'inherit',
      '&:hover': { bgcolor: badge ? 'rgba(248,113,113,0.08)' : 'rgba(156,100,247,0.05)' },
    }}
  >
    <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>
      {badge ? <FireIcon sx={{ fontSize: 16, color: '#f87171', verticalAlign: 'middle' }} /> : number}
    </TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {badge && (
          <Chip label="인기글" size="small" sx={{ height: 18, fontSize: 10, bgcolor: 'rgba(248,113,113,0.15)', color: '#f87171', fontWeight: 700 }} />
        )}
        <Typography variant="body2" fontWeight={badge ? 700 : 500}>{post.title}</Typography>
      </Box>
    </TableCell>
    <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>
      {post.profiles?.username ?? post.username ?? '익명'}
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
)

export default function PostListPage() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const [boardName, setBoardName] = useState('')
  const [posts, setPosts] = useState([])
  const [popularPosts, setPopularPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPage(1)
  }, [boardId])

  useEffect(() => {
    fetchAll()
  }, [boardId, page])

  const fetchAll = async () => {
    setLoading(true)
    await Promise.all([fetchBoardName(), fetchPopularPosts(), fetchPosts()])
    setLoading(false)
  }

  const fetchBoardName = async () => {
    const { data } = await supabase.from('boards').select('name').eq('id', boardId).single()
    setBoardName(data?.name ?? '게시판')
  }

  const fetchPopularPosts = async () => {
    const { data } = await supabase.rpc('get_popular_posts', { board_id_param: Number(boardId) })
    setPopularPosts(data ?? [])
  }

  const fetchPosts = async () => {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const { data, count, error } = await supabase
      .from('posts')
      .select(`id, title, view_count, created_at, profiles:author_id(username), comments(count)`, { count: 'exact' })
      .eq('board_id', boardId)
      .order('created_at', { ascending: false })
      .range(from, to)
    if (!error) {
      setPosts(data ?? [])
      setTotal(count ?? 0)
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const tableHead = (
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
  )

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
          {tableHead}
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <>
                {/* 인기글 */}
                {popularPosts.length > 0 && popularPosts.map((post) => (
                  <PostRow
                    key={`popular-${post.id}`}
                    post={post}
                    badge
                    onClick={() => navigate(`/posts/${post.id}`)}
                  />
                ))}

                {/* 구분선 */}
                {popularPosts.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Divider sx={{ borderColor: 'rgba(156,100,247,0.2)', borderStyle: 'dashed' }} />
                    </TableCell>
                  </TableRow>
                )}

                {/* 일반 게시글 */}
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      아직 게시글이 없습니다. 첫 게시글을 작성해보세요!
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post, idx) => (
                    <PostRow
                      key={post.id}
                      post={post}
                      number={total - (page - 1) * PAGE_SIZE - idx}
                      onClick={() => navigate(`/posts/${post.id}`)}
                    />
                  ))
                )}
              </>
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
