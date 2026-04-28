import { AppBar, Box, Button, Stack, Toolbar, Typography } from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/reservations', label: '예약 관리' },
  { to: '/customers', label: '고객/반려동물' },
  { to: '/sales', label: '결제/매출' },
]

export function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">PetCom ERP</Typography>
          <Stack direction="row" spacing={1}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                color="inherit"
                component={NavLink}
                to={item.to}
                sx={{ '&.active': { borderBottom: '2px solid #fff' }, borderRadius: 0 }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
