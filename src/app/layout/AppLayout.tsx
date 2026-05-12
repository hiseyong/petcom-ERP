import { AppBar, Box, Button, Stack, Toolbar, Typography } from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: '대시보드' },
  { to: '/reservations', label: '예약 관리' },
  { to: '/customers', label: '고객/반려동물' },
  { to: '/sales', label: '결제/매출' },
  { to: '/tax', label: '세무' },
  { to: '/expenses', label: '지출' },
  { to: '/staff', label: '인력' },
]

export function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.78)',
          color: 'text.primary',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(130, 142, 180, 0.2)',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 70 }}>
          <Typography
            component={NavLink}
            to="/"
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            PetCom ERP
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', justifyContent: 'flex-end', rowGap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                sx={{
                  color: 'text.secondary',
                  px: 1.6,
                  py: 0.8,
                  '&.active': {
                    color: 'primary.main',
                    bgcolor: 'rgba(91,108,255,0.12)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ minHeight: '70px !important' }} />
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1280, mx: 'auto', width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  )
}
