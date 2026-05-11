import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { apiClient } from '../../shared/api/client'
import type { ExpenseCategory } from '../../shared/types/common'
import type { Expense } from '../../shared/types/domain'
import { ExpenseCreateModal } from './ExpenseCreateModal'
import { addExpense, setExpenses } from './expensesSlice'

const categoryLabel: Record<ExpenseCategory, string> = {
  rent: '임차료',
  utilities: '수도·전기·가스',
  supplies: '소모품·재고',
  communication: '통신',
  equipment: '장비·도구',
  other: '기타',
}

const evidenceLabel: Record<Expense['evidence'], string> = {
  tax_invoice: '세금계산서',
  card: '카드',
  cash_receipt: '현금영수증',
}

function money(n: number) {
  return `${n.toLocaleString()}원`
}

export function ExpensesPage() {
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((s) => s.expenses)
  const [month, setMonth] = useState('2026-05')
  const [category, setCategory] = useState<ExpenseCategory | 'all'>('all')
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    if (items.length > 0) {
      return
    }
    const load = async () => {
      const data = await apiClient.loadBootstrapData()
      dispatch(setExpenses(data.expenses))
    }
    void load()
  }, [dispatch, items.length])

  const filtered = useMemo(() => {
    return items.filter((e) => {
      if (!e.bookedDate.startsWith(month)) return false
      if (category !== 'all' && e.category !== category) return false
      return true
    })
  }, [items, month, category])

  const totals = useMemo(() => {
    const gross = filtered.reduce((a, e) => a + e.totalAmount, 0)
    const vat = filtered.reduce((a, e) => a + e.vatAmount, 0)
    return { gross, vat, count: filtered.length }
  }, [filtered])

  const columns = useMemo<GridColDef<Expense>[]>(
    () => [
      { field: 'bookedDate', headerName: '지출일', flex: 0.75, minWidth: 110 },
      { field: 'vendorName', headerName: '공급처', flex: 1, minWidth: 130 },
      { field: 'description', headerName: '적요', flex: 1.1, minWidth: 120 },
      {
        field: 'category',
        headerName: '분류',
        flex: 0.75,
        minWidth: 110,
        valueGetter: (_v, row) => categoryLabel[row.category],
      },
      {
        field: 'supplyAmount',
        headerName: '공급가액',
        flex: 0.85,
        minWidth: 110,
        valueFormatter: (value) => money(Number(value)),
      },
      {
        field: 'vatAmount',
        headerName: '부가세',
        flex: 0.75,
        minWidth: 100,
        valueFormatter: (value) => money(Number(value)),
      },
      {
        field: 'totalAmount',
        headerName: '합계',
        flex: 0.85,
        minWidth: 110,
        valueFormatter: (value) => money(Number(value)),
      },
      {
        field: 'evidence',
        headerName: '증빙',
        flex: 0.65,
        minWidth: 100,
        valueGetter: (_v, row) => evidenceLabel[row.evidence],
      },
    ],
    [],
  )

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Stack spacing={0.5}>
          <Typography variant="h5">지출</Typography>
          <Typography variant="body2" color="text.secondary">
            사업비·매입 비용을 등록하고 월·분류별로 집계합니다. 세무 화면의 매입 요약과 동일 데이터를 사용합니다.
          </Typography>
        </Stack>
        <Button variant="contained" onClick={() => setCreateOpen(true)} sx={{ alignSelf: { md: 'center' } }}>
          지출 등록
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          type="month"
          label="집계 월"
          size="small"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ width: 200 }}
        />
        <TextField
          select
          label="분류"
          size="small"
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory | 'all')}
          sx={{ width: 200 }}
        >
          <MenuItem value="all">전체</MenuItem>
          {(Object.keys(categoryLabel) as ExpenseCategory[]).map((key) => (
            <MenuItem key={key} value={key}>
              {categoryLabel[key]}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              합계 지출
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              {money(totals.gross)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              부가세 {money(totals.vat)} · {totals.count}건
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              안내
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              합계 금액은 부가세 포함 금액으로 입력하면 공급가액·세액이 자동으로 나눕니다(10%).
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            지출 내역
          </Typography>
          <Box sx={{ height: 440 }}>
            <DataGrid
              rows={filtered}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
            />
          </Box>
        </CardContent>
      </Card>

      <ExpenseCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(expense) => dispatch(addExpense(expense))}
      />
    </Stack>
  )
}
