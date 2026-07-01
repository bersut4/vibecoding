import { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, CircularProgress, Button, Skeleton, Card, CardContent,
} from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'
import { supabase } from '../../lib/supabase'
import { useAdmin } from '../../contexts/AdminContext'
import GuestbookEntry from './GuestbookEntry'

const PAGE_SIZE = 10

export default function GuestbookList({ refreshTrigger }) {
  const { isAdmin } = useAdmin()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  const fetchEntries = useCallback(async (currentPage = 1, append = false) => {
    setLoading(true)
    const from = (currentPage - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const selectFields = isAdmin
      ? '*'
      : 'id, name, message, occupation, referral_source, keyword, emoji, star_rating, created_at'

    const { data, count } = await supabase
      .from('guestbook_entries')
      .select(selectFields, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (data) {
      setEntries((prev) => (append ? [...prev, ...data] : data))
      setTotal(count ?? 0)
      setHasMore(to < (count ?? 0) - 1)
    }
    setLoading(false)
  }, [isAdmin])

  useEffect(() => {
    setPage(1)
    fetchEntries(1, false)
  }, [refreshTrigger, fetchEntries])

  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    fetchEntries(next, true)
  }

  const handleDelete = async (entryId) => {
    if (!window.confirm('이 방명록을 삭제하시겠습니까?')) return
    await supabase.from('guestbook_entries').delete().eq('id', entryId)
    fetchEntries(1, false)
    setPage(1)
  }

  if (loading && entries.length === 0) {
    return (
      <Box>
        {[1, 2, 3].map((i) => (
          <Card key={i} elevation={0} sx={{ border: '1.5px solid', borderColor: 'divider', borderRadius: 3, mb: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton width="30%" height={20} />
                  <Skeleton width="50%" height={16} />
                </Box>
              </Box>
              <Skeleton width="90%" height={20} />
              <Skeleton width="70%" height={20} />
            </CardContent>
          </Card>
        ))}
      </Box>
    )
  }

  if (!loading && entries.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center', py: 6, px: 2,
          border: '2px dashed', borderColor: 'primary.light',
          borderRadius: 3, bgcolor: 'rgba(249,115,22,0.03)',
        }}
      >
        <Typography variant="h2" sx={{ fontSize: '3rem', mb: 1 }}>📮</Typography>
        <Typography variant="h3" color="text.secondary" sx={{ fontSize: '1rem' }}>
          아직 방명록이 없습니다
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          첫 번째로 방명록을 남겨보세요! 🎉
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          총 <strong>{total}</strong>개의 방명록
        </Typography>
        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={() => { setPage(1); fetchEntries(1, false) }}
          sx={{ color: 'text.secondary', fontSize: 12 }}
        >
          새로고침
        </Button>
      </Box>

      {entries.map((entry) => (
        <GuestbookEntry key={entry.id} entry={entry} onDelete={handleDelete} />
      ))}

      {hasMore && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={20} /> : '더 보기'}
          </Button>
        </Box>
      )}
    </Box>
  )
}
