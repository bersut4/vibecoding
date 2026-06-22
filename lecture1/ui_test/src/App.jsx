import { Box, Container, Typography, Divider } from '@mui/material'

import Section01Buttons from './components/sections/Section01Buttons'
import Section02Inputs from './components/sections/Section02Inputs'
import Section03Navigation from './components/sections/Section03Navigation'
import Section04Dropdown from './components/sections/Section04Dropdown'
import Section05Checkboxes from './components/sections/Section05Checkboxes'
import Section06Radio from './components/sections/Section06Radio'
import Section07Slider from './components/sections/Section07Slider'
import Section08Modal from './components/sections/Section08Modal'
import Section09Cards from './components/sections/Section09Cards'
import Section10DragDrop from './components/sections/Section10DragDrop'
import Section11Scroll from './components/sections/Section11Scroll'
import Section12Animation from './components/sections/Section12Animation'
import Section13Menu from './components/sections/Section13Menu'
import Section14Sidebar from './components/sections/Section14Sidebar'
import Section15Hover from './components/sections/Section15Hover'
import Section16Swipe from './components/sections/Section16Swipe'
import Section17FlexNavigation from './components/sections/Section17FlexNavigation'

function App() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">

        <Typography variant="h1" sx={{ mb: 1, textAlign: 'center' }}>
          MUI UI 컴포넌트 테스트
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, textAlign: 'center' }}>
          16개 UI 요소 순차 추가
        </Typography>

        <Divider sx={{ mb: 6 }} />

        <Section01Buttons />
        <Section02Inputs />
        <Section03Navigation />
        <Section04Dropdown />
        <Section05Checkboxes />
        <Section06Radio />
        <Section07Slider />
        <Section08Modal />
        <Section09Cards />
        <Section10DragDrop />
        <Section11Scroll />
        <Section12Animation />
        <Section13Menu />
        <Section14Sidebar />
        <Section15Hover />
        <Section16Swipe />
        <Section17FlexNavigation />

      </Container>
    </Box>
  )
}

export default App
