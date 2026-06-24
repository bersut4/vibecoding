import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Paper, Avatar, Button, TextField, Divider,
  IconButton, Alert, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '@mui/material'
import { ArrowBack, CameraAlt as CameraIcon, DeleteForever as DeleteIcon } from '@mui/icons-material'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { uploadMedia } from '../utils/uploadMedia'

export default function ProfilePage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef()

  const [username, setUsername] = useState(profile?.username ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url ?? null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [profileMsg, setProfileMsg] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [newPwConfirm, setNewPwConfirm] = useState('')
  const [pwMsg, setPwMsg] = useState(null)
  const [pwLoading, setPwLoading] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirmPw, setDeleteConfirmPw] = useState('')
  const [deleteMsg, setDeleteMsg] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleDeleteAccount = async () => {
    if (!deleteConfirmPw) { setDeleteMsg({ type: 'error', text: '비밀번호를 입력해주세요.' }); return }
    setDeleteLoading(true)
    setDeleteMsg(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: deleteConfirmPw })
    if (signInError) {
      setDeleteMsg({ type: 'error', text: '비밀번호가 올바르지 않습니다.' })
      setDeleteLoading(false)
      return
    }
    const { error } = await supabase.rpc('delete_user')
    if (error) {
      setDeleteMsg({ type: 'error', text: '탈퇴 처리 중 오류가 발생했습니다.' })
    } else {
      await supabase.auth.signOut()
    }
    setDeleteLoading(false)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleProfileSave = async () => {
    if (!username.trim()) {
      setProfileMsg({ type: 'error', text: '닉네임을 입력해주세요.' })
      return
    }
    setProfileLoading(true)
    setProfileMsg(null)
    try {
      let avatar_url = profile?.avatar_url ?? null
      if (avatarFile) {
        avatar_url = await uploadMedia(avatarFile, user.id)
      }
      const { error } = await supabase
        .from('profiles')
        .update({ username: username.trim(), avatar_url, bio: bio.trim() || null })
        .eq('id', user.id)
      if (error) throw error
      setProfileMsg({ type: 'success', text: '프로필이 수정되었습니다.' })
    } catch (e) {
      setProfileMsg({ type: 'error', text: e.message })
    }
    setProfileLoading(false)
  }

  const handlePasswordChange = async () => {
    if (!currentPw) { setPwMsg({ type: 'error', text: '현재 비밀번호를 입력해주세요.' }); return }
    if (!newPw) { setPwMsg({ type: 'error', text: '새 비밀번호를 입력해주세요.' }); return }
    if (newPw.length < 6) { setPwMsg({ type: 'error', text: '새 비밀번호는 6자 이상이어야 합니다.' }); return }
    if (newPw !== newPwConfirm) { setPwMsg({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' }); return }

    setPwLoading(true)
    setPwMsg(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPw })
    if (signInError) {
      setPwMsg({ type: 'error', text: '현재 비밀번호가 올바르지 않습니다.' })
      setPwLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) {
      setPwMsg({ type: 'error', text: error.message })
    } else {
      setPwMsg({ type: 'success', text: '비밀번호가 변경되었습니다.' })
      setCurrentPw('')
      setNewPw('')
      setNewPwConfirm('')
    }
    setPwLoading(false)
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2, color: 'text.secondary' }}>
        돌아가기
      </Button>
      <Typography variant="h5" fontWeight={700} mb={3}>프로필 수정</Typography>

      {/* 프로필 정보 수정 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={3}>기본 정보</Typography>

        {/* 프로필 사진 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatarPreview}
              sx={{ width: 96, height: 96, bgcolor: 'primary.dark', fontSize: 36 }}
            >
              {!avatarPreview && (profile?.username?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase())}
            </Avatar>
            <IconButton
              size="small"
              onClick={() => fileRef.current.click()}
              sx={{
                position: 'absolute', bottom: 0, right: 0,
                bgcolor: 'primary.main', color: 'white', width: 28, height: 28,
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <CameraIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </Box>
        </Box>

        <TextField
          fullWidth label="닉네임" value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth label="한줄 소개" value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="자신을 한 문장으로 소개해보세요!"
          inputProps={{ maxLength: 80 }}
          helperText={`${bio.length}/80`}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth label="이메일" value={user?.email ?? ''}
          disabled
          helperText="이메일은 변경할 수 없습니다."
          sx={{ mb: 3 }}
        />

        {profileMsg && <Alert severity={profileMsg.type} sx={{ mb: 2 }}>{profileMsg.text}</Alert>}

        <Button
          variant="contained" fullWidth onClick={handleProfileSave}
          disabled={profileLoading}
        >
          {profileLoading ? <CircularProgress size={20} /> : '저장'}
        </Button>
      </Paper>

      {/* 비밀번호 변경 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={3}>비밀번호 변경</Typography>

        <TextField
          fullWidth label="현재 비밀번호" type="password" value={currentPw}
          onChange={(e) => setCurrentPw(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Divider sx={{ mb: 2 }} />
        <TextField
          fullWidth label="새 비밀번호" type="password" value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          helperText="6자 이상 입력해주세요."
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth label="새 비밀번호 확인" type="password" value={newPwConfirm}
          onChange={(e) => setNewPwConfirm(e.target.value)}
          sx={{ mb: 3 }}
        />

        {pwMsg && <Alert severity={pwMsg.type} sx={{ mb: 2 }}>{pwMsg.text}</Alert>}

        <Button
          variant="contained" fullWidth onClick={handlePasswordChange}
          disabled={pwLoading}
        >
          {pwLoading ? <CircularProgress size={20} /> : '비밀번호 변경'}
        </Button>
      </Paper>

      {/* 계정 탈퇴 */}
      <Paper sx={{ p: 3, border: '1px solid', borderColor: 'error.main' }}>
        <Typography variant="h6" fontWeight={600} mb={1} color="error.main">
          계정 탈퇴
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          탈퇴 시 작성한 게시글과 댓글이 모두 삭제되며 복구할 수 없습니다.
        </Typography>
        <Button
          variant="outlined" color="error" startIcon={<DeleteIcon />}
          onClick={() => setDeleteOpen(true)}
        >
          계정 탈퇴하기
        </Button>
      </Paper>

      {/* 탈퇴 확인 다이얼로그 */}
      <Dialog open={deleteOpen} onClose={() => { setDeleteOpen(false); setDeleteConfirmPw(''); setDeleteMsg(null) }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: 'error.main', fontWeight: 700 }}>⚠️ 정말 탈퇴하시겠습니까?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            탈퇴 후에는 모든 데이터가 삭제되며 복구가 불가능합니다.
            확인을 위해 현재 비밀번호를 입력해주세요.
          </Typography>
          <TextField
            fullWidth label="현재 비밀번호" type="password"
            value={deleteConfirmPw}
            onChange={(e) => setDeleteConfirmPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleDeleteAccount()}
            autoFocus
          />
          {deleteMsg && <Alert severity={deleteMsg.type} sx={{ mt: 2 }}>{deleteMsg.text}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setDeleteOpen(false); setDeleteConfirmPw(''); setDeleteMsg(null) }}>
            취소
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteAccount} disabled={deleteLoading}>
            {deleteLoading ? <CircularProgress size={20} color="inherit" /> : '탈퇴 확인'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
