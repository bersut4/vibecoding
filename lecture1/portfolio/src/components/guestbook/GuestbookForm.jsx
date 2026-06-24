import { useState } from 'react'
import {
  Box, Typography, Card, CardContent, TextField, Button,
  Grid, ToggleButton, ToggleButtonGroup, Rating, Collapse,
  Alert, CircularProgress, Divider, Chip, IconButton,
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import { supabase } from '../../lib/supabase'

const EMOJI_LIST = ['😊', '🎉', '💡', '🔥', '👍', '🌟', '😎', '🤔', '❤️', '🚀']

const REFERRAL_OPTIONS = [
  '검색', 'SNS', '지인 소개', '우연히', '기타'
]

export default function GuestbookForm({ onSubmitted }) {
  const [expanded, setExpanded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [referralOther, setReferralOther] = useState('')

  const [form, setForm] = useState({
    name: '',
    message: '',
    email: '',
    phone: '',
    sns_account: '',
    occupation: '',
    referral_source: '',
    keyword: '',
    emoji: '',
    star_rating: 0,
  })

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const getFinalReferralSource = () => {
    if (form.referral_source === '기타') return referralOther.trim() || '기타'
    return form.referral_source || null
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('이름을 입력해주세요.'); return }
    if (!form.message.trim()) { setError('메시지를 입력해주세요.'); return }

    setSubmitting(true)
    setError('')

    const { error: err } = await supabase.from('guestbook_entries').insert({
      name: form.name.trim(),
      message: form.message.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      sns_account: form.sns_account.trim() || null,
      occupation: form.occupation.trim() || null,
      referral_source: getFinalReferralSource(),
      keyword: form.keyword.trim() || null,
      emoji: form.emoji || null,
      star_rating: form.star_rating || null,
    })

    if (err) {
      setError('작성 중 오류가 발생했습니다. 다시 시도해주세요.')
    } else {
      setSuccess(true)
      setForm({
        name: '', message: '', email: '', phone: '',
        sns_account: '', occupation: '', referral_source: '',
        keyword: '', emoji: '', star_rating: 0,
      })
      setReferralOther('')
      setExpanded(false)
      setTimeout(() => setSuccess(false), 4000)
      onSubmitted?.()
    }
    setSubmitting(false)
  }

  return (
    <Card
      elevation={0}
      sx={{
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: 3,
        mb: 3,
        bgcolor: 'background.paper',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 700, mb: 2.5 }}>
          ✍️ 방명록 남기기
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            🎉 방명록이 등록되었습니다! 감사합니다!
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
        )}

        {/* 필수 입력 */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth label="이름 *" value={form.name}
              onChange={set('name')} size="small"
              placeholder="홍길동"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              fullWidth label="메시지 *" value={form.message}
              onChange={set('message')} size="small"
              placeholder="안녕하세요! 포트폴리오 잘 봤습니다 🎉"
            />
          </Grid>
        </Grid>

        {/* 이모지 & 별점 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              이모지 선택
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {EMOJI_LIST.map((e) => (
                <Box
                  key={e}
                  onClick={() => setForm((prev) => ({ ...prev, emoji: prev.emoji === e ? '' : e }))}
                  sx={{
                    cursor: 'pointer', fontSize: '1.4rem', p: 0.5,
                    borderRadius: 1, transition: 'all 0.15s',
                    border: '2px solid',
                    borderColor: form.emoji === e ? 'primary.main' : 'transparent',
                    bgcolor: form.emoji === e ? 'rgba(249,115,22,0.1)' : 'transparent',
                    '&:hover': { transform: 'scale(1.2)' },
                  }}
                >
                  {e}
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              별점 평가
            </Typography>
            <Rating
              value={form.star_rating}
              onChange={(_, v) => setForm((prev) => ({ ...prev, star_rating: v }))}
              sx={{ color: 'secondary.main' }}
            />
          </Box>
        </Box>

        {/* 선택 정보 토글 */}
        <Divider sx={{ my: 1.5 }} />
        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          endIcon={
            <ExpandMoreIcon
              sx={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }}
            />
          }
          sx={{ color: 'text.secondary', mb: 1 }}
        >
          {expanded ? '선택 정보 접기' : '+ 더 많은 정보 입력하기 (선택)'}
        </Button>

        <Collapse in={expanded}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth label="이메일 (비공개)" type="email"
                value={form.email} onChange={set('email')} size="small"
                placeholder="example@email.com"
                helperText="관리자에게만 공개됩니다"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth label="전화번호 (비공개)"
                value={form.phone} onChange={set('phone')} size="small"
                placeholder="010-0000-0000"
                helperText="관리자에게만 공개됩니다"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth label="SNS 계정"
                value={form.sns_account} onChange={set('sns_account')} size="small"
                placeholder="@instagram_id"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth label="소속 / 직업"
                value={form.occupation} onChange={set('occupation')} size="small"
                placeholder="프리랜서 디자이너"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth label="한마디 키워드"
                value={form.keyword} onChange={set('keyword')} size="small"
                placeholder="창의적이에요! / 멋진 포트폴리오! / 협업하고 싶어요!"
              />
            </Grid>
            <Grid size={12}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                어떻게 알게 되셨나요?
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: form.referral_source === '기타' ? 1.5 : 0 }}>
                {REFERRAL_OPTIONS.map((opt) => (
                  <Chip
                    key={opt}
                    label={opt}
                    onClick={() => setForm((prev) => ({
                      ...prev,
                      referral_source: prev.referral_source === opt ? '' : opt,
                    }))}
                    variant={form.referral_source === opt ? 'filled' : 'outlined'}
                    color={form.referral_source === opt ? 'primary' : 'default'}
                    size="small"
                    sx={{ cursor: 'pointer', fontWeight: form.referral_source === opt ? 700 : 400 }}
                  />
                ))}
              </Box>
              <Collapse in={form.referral_source === '기타'}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="어떻게 알게 되셨는지 직접 입력해주세요"
                  value={referralOther}
                  onChange={(e) => setReferralOther(e.target.value)}
                  autoFocus
                  sx={{ mt: 0.5 }}
                />
              </Collapse>
            </Grid>
          </Grid>
        </Collapse>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2.5 }}>
          <Button
            variant="contained"
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ px: 3, borderRadius: 2 }}
          >
            {submitting ? '등록 중...' : '방명록 남기기'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
