import { useState } from 'react'
import {
  Box, Typography, Stack, Divider, Paper, Chip,
  Button, IconButton,
  Menu, MenuItem, ListItemIcon, ListItemText,
} from '@mui/material'
import {
  KeyboardArrowDown as ArrowDownIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as CopyIcon,
  ContentCut as CutIcon,
  ContentPaste as PasteIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material'

const MENUS = [
  {
    id: 'file',
    triggerLabel: '파일',
    triggerVariant: 'contained',
    triggerColor: 'primary',
    TriggerIcon: ArrowDownIcon,
    groups: [
      [
        { label: '편집', icon: <EditIcon fontSize="small" />, shortcut: 'Ctrl+E' },
        { label: '복사', icon: <CopyIcon fontSize="small" />, shortcut: 'Ctrl+C' },
        { label: '잘라내기', icon: <CutIcon fontSize="small" />, shortcut: 'Ctrl+X' },
        { label: '붙여넣기', icon: <PasteIcon fontSize="small" />, shortcut: 'Ctrl+V' },
      ],
      [
        { label: '다운로드', icon: <DownloadIcon fontSize="small" /> },
        { label: '업로드', icon: <UploadIcon fontSize="small" /> },
        { label: '인쇄', icon: <PrintIcon fontSize="small" />, shortcut: 'Ctrl+P' },
      ],
      [
        { label: '삭제', icon: <DeleteIcon fontSize="small" />, color: 'error.main' },
      ],
    ],
  },
  {
    id: 'more',
    triggerLabel: null,
    triggerVariant: 'icon',
    triggerColor: 'default',
    TriggerIcon: MoreVertIcon,
    groups: [
      [
        { label: '공유', icon: <ShareIcon fontSize="small" /> },
        { label: '북마크', icon: <BookmarkIcon fontSize="small" /> },
      ],
      [
        { label: '복사', icon: <CopyIcon fontSize="small" />, shortcut: 'Ctrl+C' },
        { label: '다운로드', icon: <DownloadIcon fontSize="small" /> },
        { label: '인쇄', icon: <PrintIcon fontSize="small" /> },
      ],
      [
        { label: '삭제', icon: <DeleteIcon fontSize="small" />, color: 'error.main' },
      ],
    ],
  },
]

const Section13Menu = () => {
  const [anchors, setAnchors] = useState({})
  const [selected, setSelected] = useState({})

  const handleOpen = (id, e) => setAnchors((prev) => ({ ...prev, [id]: e.currentTarget }))
  const handleClose = (id) => setAnchors((prev) => ({ ...prev, [id]: null }))

  const handleSelect = (menuId, label) => {
    setSelected((prev) => ({ ...prev, [menuId]: label }))
    handleClose(menuId)
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        13. Menu
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Menu + MenuItem + ListItemIcon — 아이콘, 단축키, 구분선, 위험 액션
      </Typography>

      <Stack direction="row" spacing={4} flexWrap="wrap" alignItems="flex-start">
        {MENUS.map(({ id, triggerLabel, triggerVariant, triggerColor, TriggerIcon, groups }) => (
          <Box key={id}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              {id === 'file' ? '텍스트 버튼 메뉴' : '아이콘 버튼 메뉴 (⋮)'}
            </Typography>

            {/* 트리거 버튼 */}
            {triggerVariant === 'icon' ? (
              <IconButton onClick={(e) => handleOpen(id, e)}>
                <TriggerIcon />
              </IconButton>
            ) : (
              <Button
                variant={triggerVariant}
                color={triggerColor}
                endIcon={<TriggerIcon />}
                onClick={(e) => handleOpen(id, e)}
              >
                {triggerLabel}
              </Button>
            )}

            {/* Menu */}
            <Menu
              anchorEl={anchors[id]}
              open={Boolean(anchors[id])}
              onClose={() => handleClose(id)}
              slotProps={{ paper: { elevation: 3, sx: { minWidth: 200 } } }}
              transformOrigin={{ horizontal: 'left', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
              {groups.map((group, gi) => [
                gi > 0 && <Divider key={`div-${gi}`} />,
                ...group.map(({ label, icon, shortcut, color }) => (
                  <MenuItem
                    key={label}
                    onClick={() => handleSelect(id, label)}
                    sx={{ color: color ?? 'inherit' }}
                  >
                    <ListItemIcon sx={{ color: color ?? 'inherit' }}>
                      {icon}
                    </ListItemIcon>
                    <ListItemText>{label}</ListItemText>
                    {shortcut && (
                      <Typography variant="caption" color="text.disabled" sx={{ ml: 2 }}>
                        {shortcut}
                      </Typography>
                    )}
                  </MenuItem>
                )),
              ])}
            </Menu>

            {/* 선택 결과 */}
            <Paper variant="outlined" sx={{ mt: 1.5, px: 2, py: 1, minWidth: 140 }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                선택된 메뉴:
              </Typography>
              {selected[id]
                ? <Chip label={selected[id]} size="small" color="primary" />
                : <Typography variant="body2" color="text.disabled">없음</Typography>
              }
            </Paper>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

export default Section13Menu
