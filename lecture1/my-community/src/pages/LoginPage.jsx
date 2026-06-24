import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography, TextField, Button, Alert, Divider,
} from '@mui/material'
import { SportsEsports as GameIcon } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    let valid = true
    setEmailError('')
    setPasswordError('')
    if (!email) { setEmailError('이메일을 입력해주세요.'); valid = false }
    else if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('올바른 이메일 형식이 아닙니다.'); valid = false }
    if (!password) { setPasswordError('비밀번호를 입력해주세요.'); valid = false }
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setGeneralError('')
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      if (error.message.includes('Invalid login')) setGeneralError('이메일 또는 비밀번호가 올바르지 않습니다.')
      else setGeneralError(error.message)
    } else {
      navigate('/')
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: 'background.default', px: 2,
    }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
            <GameIcon sx={{ color: 'primary.main', fontSize: 36 }} />
            <Typography variant="h5" fontWeight={700} color="primary.light">공동 게임 구역</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            JGA에 로그인하세요
          </Typography>

          {generalError && <Alert severity="error" sx={{ mb: 2 }}>{generalError}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="이메일" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(emailError)}
              helperText={emailError}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="비밀번호" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(passwordError)}
              helperText={passwordError}
              sx={{ mb: 3 }}
            />
            <Button fullWidth variant="contained" type="submit" disabled={loading} size="large">
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" component="span">
              계정이 없으신가요?{' '}
            </Typography>
            <Typography variant="body2" component={Link} to="/signup" sx={{ color: 'primary.light', textDecoration: 'none', fontWeight: 600 }}>
              회원가입
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
