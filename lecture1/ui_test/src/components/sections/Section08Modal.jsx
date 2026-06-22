import { useState } from 'react'
import {
  Box, Typography, Stack, Button, Divider,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  IconButton, Chip,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

const MODALS = [
  {
    id: 'basic',
    triggerLabel: '기본 모달 열기',
    triggerColor: 'primary',
    title: '기본 모달',
    content: 'Dialog 컴포넌트를 사용한 기본 모달입니다. 제목, 내용, 버튼 영역으로 구성됩니다. 배경을 클릭하거나 취소 버튼으로 닫을 수 있습니다.',
  },
  {
    id: 'confirm',
    triggerLabel: '확인 모달 열기',
    triggerColor: 'secondary',
    title: '삭제하시겠습니까?',
    content: '이 작업은 되돌릴 수 없습니다. 선택한 항목이 영구적으로 삭제됩니다. 계속 진행하시겠습니까?',
  },
  {
    id: 'alert',
    triggerLabel: '알림 모달 열기',
    triggerColor: 'error',
    title: '오류가 발생했습니다',
    content: '서버와의 연결이 끊어졌습니다. 네트워크 상태를 확인한 후 다시 시도해 주세요.',
  },
]

const Section08Modal = () => {
  const [openId, setOpenId] = useState(null)
  const [result, setResult] = useState(null)

  const handleConfirm = (id) => {
    setResult({ id, action: '확인' })
    setOpenId(null)
  }

  const handleCancel = (id) => {
    setResult({ id, action: '취소' })
    setOpenId(null)
  }

  const currentModal = MODALS.find((m) => m.id === openId)

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        08. Modal (Dialog)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Dialog + DialogTitle + DialogContent + DialogActions — 배경 클릭 / 닫기 버튼으로 닫기
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
        {MODALS.map(({ id, triggerLabel, triggerColor }) => (
          <Button
            key={id}
            variant="contained"
            color={triggerColor}
            onClick={() => setOpenId(id)}
          >
            {triggerLabel}
          </Button>
        ))}
      </Stack>

      {/* 마지막 액션 결과 */}
      {result && (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">마지막 액션:</Typography>
          <Chip
            label={`${MODALS.find((m) => m.id === result.id)?.title} → ${result.action}`}
            color={result.action === '확인' ? 'primary' : 'default'}
            size="small"
          />
        </Stack>
      )}

      {/* Dialog */}
      <Dialog
        open={openId !== null}
        onClose={() => handleCancel(openId)}
        maxWidth="sm"
        fullWidth
      >
        {currentModal && (
          <>
            <DialogTitle sx={{ pr: 6 }}>
              {currentModal.title}
              <IconButton
                onClick={() => handleCancel(openId)}
                sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 2.5 }}>
              <DialogContentText>{currentModal.content}</DialogContentText>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button variant="outlined" onClick={() => handleCancel(openId)}>
                취소
              </Button>
              <Button variant="contained" onClick={() => handleConfirm(openId)} autoFocus>
                확인
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default Section08Modal
