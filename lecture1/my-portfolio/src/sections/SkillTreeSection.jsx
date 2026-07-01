import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import CodeIcon from '@mui/icons-material/Code'

const PLACEHOLDER_SKILLS = [
  { name: 'Skill A', value: 80 },
  { name: 'Skill B', value: 65 },
  { name: 'Skill C', value: 50 },
]

const SkillTreeSection = () => (
  <Box sx={{ backgroundColor: 'var(--color-bg-secondary)', py: 8 }}>
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ width: 4, height: 28, backgroundColor: 'var(--color-secondary)', borderRadius: 1 }} />
        <Typography variant="overline" sx={{ color: 'var(--color-secondary)', letterSpacing: 3 }}>
          SKILL TREE
        </Typography>
      </Box>
      <Typography variant="h3" sx={{ mb: 4, color: 'var(--color-text-primary)' }}>
        Skill Tree 섹션
      </Typography>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <CodeIcon sx={{ fontSize: 56, color: 'var(--color-secondary)', mb: 2 }} />
            <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)', lineHeight: 1.9 }}>
              여기는 Skill Tree 섹션입니다.
              <br />
              기술 스택을 트리나 프로그레스바로 시각화할 예정입니다.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2 }}>
            {PLACEHOLDER_SKILLS.map((skill) => (
              <Box key={skill.name}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                    {skill.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--color-secondary)' }}>
                    {skill.value}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={skill.value}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'var(--color-border-dark)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, var(--color-secondary), var(--color-button-hover))',
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  </Box>
)

export default SkillTreeSection
