import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material'

const tenantInfo = {
  companyName: '포포케어 동물케어센터',
  representative: '김도윤',
  businessNo: '123-45-67890',
  address: '서울특별시 강남구 테헤란로 123, 5층',
  phone: '02-1234-5678',
  email: 'admin@popocare.co.kr',
}

const infoRows = [
  { label: '상호명', value: tenantInfo.companyName },
  { label: '대표자', value: tenantInfo.representative },
  { label: '사업자번호', value: tenantInfo.businessNo },
  { label: '주소', value: tenantInfo.address },
  { label: '대표 연락처', value: tenantInfo.phone },
  { label: '대표 이메일', value: tenantInfo.email },
]

export function HomePage() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const formattedNow = useMemo(
    () =>
      new Intl.DateTimeFormat('ko-KR', {
        dateStyle: 'full',
        timeStyle: 'medium',
      }).format(now),
    [now],
  )

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            안녕하세요, {tenantInfo.companyName}님.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            오늘도 반려동물 케어 운영을 더 쉽고 빠르게 관리해보세요.
          </Typography>
          <Stack
            sx={{
              mt: 2.5,
              px: 2.2,
              py: 1.6,
              borderRadius: 2,
              bgcolor: 'rgba(91,108,255,0.1)',
              border: '1px solid rgba(91,108,255,0.2)',
              width: 'fit-content',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              현재 시각
            </Typography>
            <Typography
              sx={{
                color: 'primary.main',
                fontSize: { xs: 22, md: 28 },
                lineHeight: 1.2,
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              {formattedNow}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            고객사 정보
          </Typography>
          <Grid container spacing={2}>
            {infoRows.map((row) => (
              <Grid key={row.label} size={{ xs: 12, md: 6 }}>
                <Stack
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid rgba(130, 142, 180, 0.2)',
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {row.label}
                  </Typography>
                  <Typography variant="body1">{row.value}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  )
}
