import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, Box, Avatar, Typography, Divider, IconButton, Chip, Skeleton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { supabase } from '../lib/supabase'

export default function UserProfileDialog({ userId, open, onClose }) {
  const [profile, setProfile] = useState(null)
  const [postCount, setPostCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !userId) return
    const fetchProfile = async () => {
      setLoading(true)
      setProfile(null)
      const [{ data: prof }, { count }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('author_id', userId),
      ])
      setProfile(prof)
      setPostCount(count ?? 0)
      setLoading(false)
    }
    fetchProfile()
  }, [open, userId])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1, pr: 1 }}>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </Box>
      <DialogContent sx={{ pt: 0, pb: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="circular" width={80} height={80} />
            <Skeleton width={120} height={24} />
            <Skeleton width={200} height={20} />
          </Box>
        ) : profile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Avatar
              src={profile.avatar_url ?? undefined}
              sx={{ width: 80, height: 80, bgcolor: 'primary.dark', fontSize: 32, mb: 1.5 }}
            >
              {profile.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h6" fontWeight={700}>{profile.username}</Typography>
              {profile.is_admin && (
                <Chip label="관리자" size="small" sx={{ height: 18, fontSize: 10, bgcolor: 'rgba(248,113,113,0.15)', color: 'error.main' }} />
              )}
            </Box>
            {profile.bio && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, maxWidth: 260 }}>
                {profile.bio}
              </Typography>
            )}
            <Divider sx={{ width: '100%', my: 1.5 }} />
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight={700} color="primary.main">{postCount}</Typography>
                <Typography variant="caption" color="text.secondary">게시글</Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography color="text.secondary" align="center">사용자 정보를 불러올 수 없습니다.</Typography>
        )}
      </DialogContent>
    </Dialog>
  )
}
