import { useState, useRef } from 'react'
import {
  Box, Typography, Paper, Stack, Divider,
  List, ListItem, ListItemText, ListItemIcon,
  Fab, Chip, LinearProgress,
} from '@mui/material'
import {
  KeyboardArrowUp as ArrowUpIcon,
  Circle as CircleIcon,
} from '@mui/icons-material'

const ARTICLES = [
  { id: 1, title: 'React 19 새로운 기능 정리', category: '프론트엔드', desc: 'use() 훅, 서버 컴포넌트, 액션 API 등 React 19의 주요 변경 사항을 정리합니다.' },
  { id: 2, title: 'MUI v9 마이그레이션 가이드', category: 'UI/UX', desc: 'Grid 컴포넌트 변경, sx prop 개선, 테마 시스템 업데이트 내용을 다룹니다.' },
  { id: 3, title: 'TypeScript 5.x 타입 개선', category: '언어', desc: 'const 타입 파라미터, 데코레이터 표준화, 개선된 타입 추론을 살펴봅니다.' },
  { id: 4, title: 'Vite 8 빌드 최적화', category: '도구', desc: '롤업 기반에서 Rolldown으로 전환, 빌드 속도 10배 향상, 새로운 플러그인 API.' },
  { id: 5, title: 'React Router v7 소개', category: '라우팅', desc: 'Remix와 통합된 라우터, 데이터 로딩, 서버 렌더링 지원이 크게 강화되었습니다.' },
  { id: 6, title: 'CSS Grid 마스터하기', category: 'CSS', desc: '복잡한 레이아웃을 CSS Grid로 간결하게 구현하는 방법과 실전 패턴을 소개합니다.' },
  { id: 7, title: 'Zustand 상태 관리 패턴', category: '상태관리', desc: '가벼운 글로벌 상태 관리 라이브러리 Zustand의 슬라이스 패턴과 미들웨어 활용법.' },
  { id: 8, title: 'Tailwind CSS vs MUI 비교', category: 'UI/UX', desc: '두 스타일링 접근법의 장단점, 프로젝트별 선택 기준, 혼합 사용 전략을 비교합니다.' },
  { id: 9, title: 'Web Performance 최적화', category: '성능', desc: 'Core Web Vitals 개선, 이미지 최적화, 코드 스플리팅으로 로딩 속도를 높입니다.' },
  { id: 10, title: 'GitHub Actions CI/CD', category: 'DevOps', desc: 'React 프로젝트를 자동으로 빌드하고 GitHub Pages에 배포하는 워크플로우 설정법.' },
  { id: 11, title: 'Storybook 컴포넌트 문서화', category: '도구', desc: '재사용 컴포넌트를 Storybook으로 문서화하고 테스트하는 방법을 단계별로 설명합니다.' },
  { id: 12, title: 'Playwright E2E 테스트', category: '테스트', desc: '브라우저 자동화 도구 Playwright로 실제 사용자 시나리오를 테스트하는 방법.' },
]

const CATEGORY_COLORS = {
  프론트엔드: 'primary', 'UI/UX': 'info', 언어: 'secondary', 도구: 'default',
  라우팅: 'success', CSS: 'warning', 상태관리: 'error', 성능: 'primary',
  DevOps: 'success', 테스트: 'info',
}

const Section11Scroll = () => {
  const containerRef = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollPercent, setScrollPercent] = useState(0)

  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    const top = el.scrollTop
    const max = el.scrollHeight - el.clientHeight
    setScrollTop(top)
    setScrollPercent(max > 0 ? Math.round((top / max) * 100) : 0)
  }

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showTopButton = scrollTop > 80

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        11. Scroll
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        고정 높이 스크롤 컨테이너 — 스크롤 위치 추적, Top 버튼 표시
      </Typography>

      {/* 스크롤 진행률 */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary">스크롤 위치:</Typography>
        <Chip label={`${scrollTop}px`} size="small" variant="outlined" />
        <Chip label={`${scrollPercent}%`} size="small" color="primary" />
      </Stack>
      <LinearProgress
        variant="determinate"
        value={scrollPercent}
        sx={{ mb: 2, borderRadius: 1, height: 6 }}
      />

      {/* 스크롤 컨테이너 */}
      <Paper
        variant="outlined"
        ref={containerRef}
        onScroll={handleScroll}
        sx={{
          height: 300,
          overflowY: 'scroll',
          position: 'relative',
        }}
      >
        <List disablePadding>
          {ARTICLES.map(({ id, title, category, desc }, index) => (
            <Box key={id}>
              <ListItem alignItems="flex-start" sx={{ py: 1.5, px: 2 }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                  <CircleIcon sx={{ fontSize: 10, color: 'text.disabled' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="body1" fontWeight={500}>{title}</Typography>
                      <Chip
                        label={category}
                        size="small"
                        color={CATEGORY_COLORS[category] ?? 'default'}
                        variant="outlined"
                      />
                    </Stack>
                  }
                  secondary={desc}
                />
              </ListItem>
              {index < ARTICLES.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      </Paper>

      {/* Top 버튼 */}
      <Box sx={{ position: 'relative', height: 0 }}>
        <Fab
          size="small"
          color="primary"
          onClick={scrollToTop}
          sx={{
            position: 'absolute',
            right: 12,
            bottom: 12,
            opacity: showTopButton ? 1 : 0,
            transform: showTopButton ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            pointerEvents: showTopButton ? 'auto' : 'none',
          }}
        >
          <ArrowUpIcon />
        </Fab>
      </Box>
    </Box>
  )
}

export default Section11Scroll
