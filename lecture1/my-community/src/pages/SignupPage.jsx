import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Divider } from '@mui/material'
import { SportsEsports as GameIcon } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

export default function SignupPage() {
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', username: '' })
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.username) errs.username = '닉네임을 입력해주세요.'
    if (!form.email) errs.email = '이메일을 입력해주세요.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = '올바른 이메일 형식이 아닙니다.'
    if (!form.password) errs.password = '비밀번호를 입력해주세요.'
    else if (form.password.length < 6) errs.password = '비밀번호는 6자 이상이어야 합니다.'
    if (form.password !== form.passwordConfirm) errs.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setGeneralError('')
    const { error } = await signUp(form.email, form.password, form.username)
    setLoading(false)
    if (error) {
      if (error.message.includes('already registered')) setGeneralError('이미 사용 중인 이메일입니다.')
      else setGeneralError(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={700} mb={2} color="primary.light">회원가입 완료!</Typography>
          <Typography color="text.secondary" mb={3}>이메일 인증 링크를 확인해주세요.<br />인증 후 로그인하실 수 있습니다.</Typography>
          <Button variant="contained" onClick={() => navigate('/login')}>로그인하러 가기</Button>
        </CardContent>
      </Card>
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
            <GameIcon sx={{ color: 'primary.main', fontSize: 36 }} />
            <Typography variant="h5" fontWeight={700} color="primary.light">회원가입</Typography>
          </Box>
          {generalError && <Alert severity="error" sx={{ mb: 2 }}>{generalError}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="닉네임" value={form.username} onChange={handleChange('username')}
              error={Boolean(errors.username)} helperText={errors.username} sx={{ mb: 2 }} />
            <TextField fullWidth label="이메일" type="email" value={form.email} onChange={handleChange('email')}
              error={Boolean(errors.email)} helperText={errors.email} sx={{ mb: 2 }} />
            <TextField fullWidth label="비밀번호" type="password" value={form.password} onChange={handleChange('password')}
              error={Boolean(errors.password)} helperText={errors.password} sx={{ mb: 2 }} />
            <TextField fullWidth label="비밀번호 확인" type="password" value={form.passwordConfirm} onChange={handleChange('passwordConfirm')}
              error={Boolean(errors.passwordConfirm)} helperText={errors.passwordConfirm} sx={{ mb: 3 }} />
            <Button fullWidth variant="contained" type="submit" disabled={loading} size="large">
              {loading ? '가입 중...' : '회원가입'}
            </Button>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" component="span">이미 계정이 있으신가요?{' '}</Typography>
            <Typography variant="body2" component={Link} to="/login" sx={{ color: 'primary.light', textDecoration: 'none', fontWeight: 600 }}>로그인</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
