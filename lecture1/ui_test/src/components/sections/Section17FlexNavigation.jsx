import { Box, Typography, Divider, Stack, Chip } from '@mui/material'

const MENU_ITEMS = ['홈', '소개', '상품', '연락처', '설정']

const Section17FlexNavigation = () => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h2" sx={{ mb: 1 }}>
      17. Flex Navigation
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Flexbox — justifyContent: space-between 으로 로고(좌) / 메뉴(우) 양 끝 정렬
    </Typography>

    {/* ── 네비게이션 구현 ── */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 60,
        bgcolor: '#2d3748',
        px: 3,
        borderRadius: 1,
      }}
    >
      {/* 로고 박스 */}
      <Box>
        <Typography
          sx={{
            color: '#ffffff',
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          MyWebsite
        </Typography>
      </Box>

      {/* 메뉴들 박스 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
        }}
      >
        {MENU_ITEMS.map((item) => (
          <Typography
            key={item}
            sx={{
              color: '#a0aec0',
              fontSize: 16,
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              '&:hover': { color: '#ffffff' },
            }}
          >
            {item}
          </Typography>
        ))}
      </Box>
    </Box>

    {/* ── Flexbox 속성 설명 ── */}
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        사용된 Flexbox 속성
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Chip label="display: flex" size="small" color="primary" variant="outlined" />
        <Chip label="justifyContent: space-between" size="small" color="primary" variant="outlined" />
        <Chip label="alignItems: center" size="small" color="primary" variant="outlined" />
        <Chip label="gap: 15px" size="small" color="secondary" variant="outlined" />
      </Stack>
    </Box>
  </Box>
)

export default Section17FlexNavigation
