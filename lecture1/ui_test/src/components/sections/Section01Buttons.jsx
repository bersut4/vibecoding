import { Box, Typography, Stack, Button, Divider } from '@mui/material'

const VARIANTS = ['contained', 'outlined', 'text']
const COLORS = ['primary', 'secondary', 'error']

const Section01Buttons = () => {
  const handleClick = (variant, color) => {
    alert(`variant="${variant}" / color="${color}" 버튼 클릭!`)
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        01. Button
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        variant (contained / outlined / text) × color (primary / secondary / error)
      </Typography>

      <Stack spacing={3} divider={<Divider flexItem />}>
        {VARIANTS.map((variant) => (
          <Box key={variant}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              variant="{variant}"
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {COLORS.map((color) => (
                <Button
                  key={color}
                  variant={variant}
                  color={color}
                  onClick={() => handleClick(variant, color)}
                >
                  {color}
                </Button>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

export default Section01Buttons
