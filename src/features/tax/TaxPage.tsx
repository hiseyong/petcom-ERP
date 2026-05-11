import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { apiClient } from '../../shared/api/client'
import type { Expense, TaxDocument } from '../../shared/types/domain'
import { setExpenses } from '../expenses/expensesSlice'
import { setPayments } from '../sales/salesSlice'
import { setTaxDocuments, setTaxReportMonth } from './taxSlice'

function splitVatInclusive(total: number) {
  const supplyAmount = Math.round(total / 1.1)
  const vatAmount = total - supplyAmount
  return { supplyAmount, vatAmount }
}

const docKindLabel: Record<TaxDocument['kind'], string> = {
  tax_invoice: '세금계산서',
  cash_receipt: '현금영수증',
}

const docStatusLabel: Record<TaxDocument['status'], string> = {
  issued: '발행',
  cancelled: '취소',
  pending: '대기',
}

const evidenceLabel: Record<Expense['evidence'], string> = {
  tax_invoice: '세금계산서',
  card: '카드',
  cash_receipt: '현금영수증',
}

const expenseCategoryLabel: Record<Expense['category'], string> = {
  rent: '임차료',
  utilities: '수도·전기·가스',
  supplies: '소모품·재고',
  communication: '통신',
  equipment: '장비·도구',
  other: '기타',
}

function money(n: number) {
  return `${n.toLocaleString()}원`
}

export function TaxPage() {
  const dispatch = useAppDispatch()
  const { payments } = useAppSelector((s) => s.sales)
  const { documents, reportMonth } = useAppSelector((s) => s.tax)
  const { items: expenses } = useAppSelector((s) => s.expenses)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const load = async () => {
      const data = await apiClient.loadBootstrapData()
      if (payments.length === 0) {
        dispatch(setPayments(data.payments))
      }
      if (documents.length === 0) {
        dispatch(setTaxDocuments(data.taxDocuments))
      }
      if (expenses.length === 0) {
        dispatch(setExpenses(data.expenses))
      }
    }
    void load()
  }, [dispatch, payments.length, documents.length, expenses.length])

  const paymentsInMonth = useMemo(
    () => payments.filter((p) => p.date.startsWith(reportMonth)),
    [payments, reportMonth],
  )

  const docsInMonth = useMemo(
    () => documents.filter((d) => d.issueDate.startsWith(reportMonth)),
    [documents, reportMonth],
  )

  const expensesInMonth = useMemo(
    () => expenses.filter((e) => e.bookedDate.startsWith(reportMonth)),
    [expenses, reportMonth],
  )

  const fromPayments = useMemo(() => {
    let supply = 0
    let vat = 0
    for (const p of paymentsInMonth) {
      const s = splitVatInclusive(p.amount)
      supply += s.supplyAmount
      vat += s.vatAmount
    }
    const gross = paymentsInMonth.reduce((a, p) => a + p.amount, 0)
    return { supply, vat, gross, count: paymentsInMonth.length }
  }, [paymentsInMonth])

  const issuedDocs = useMemo(
    () => docsInMonth.filter((d) => d.status === 'issued'),
    [docsInMonth],
  )

  const docTotals = useMemo(() => {
    const supply = issuedDocs.reduce((a, d) => a + d.supplyAmount, 0)
    const vat = issuedDocs.reduce((a, d) => a + d.vatAmount, 0)
    return { supply, vat, count: issuedDocs.length }
  }, [issuedDocs])

  const expenseVat = useMemo(
    () => expensesInMonth.reduce((a, e) => a + e.vatAmount, 0),
    [expensesInMonth],
  )

  const roughPayable = useMemo(
    () => Math.max(0, fromPayments.vat - expenseVat),
    [fromPayments.vat, expenseVat],
  )

  const docColumns = useMemo<GridColDef<TaxDocument>[]>(
    () => [
      { field: 'issueDate', headerName: '발행일', flex: 0.75, minWidth: 110 },
      {
        field: 'kind',
        headerName: '유형',
        flex: 0.7,
        minWidth: 110,
        valueGetter: (_v, row) => docKindLabel[row.kind],
      },
      { field: 'counterpartyName', headerName: '거래처', flex: 1, minWidth: 140 },
      {
        field: 'supplyAmount',
        headerName: '공급가액',
        flex: 0.85,
        minWidth: 110,
        valueFormatter: (value) => money(Number(value)),
      },
      {
        field: 'vatAmount',
        headerName: '세액',
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
        field: 'status',
        headerName: '상태',
        flex: 0.55,
        minWidth: 90,
        valueGetter: (_v, row) => docStatusLabel[row.status],
      },
    ],
    [],
  )

  const expenseColumns = useMemo<GridColDef<Expense>[]>(
    () => [
      { field: 'bookedDate', headerName: '기장일', flex: 0.75, minWidth: 110 },
      { field: 'vendorName', headerName: '공급처', flex: 1, minWidth: 140 },
      { field: 'description', headerName: '적요', flex: 1.1, minWidth: 120 },
      {
        field: 'category',
        headerName: '분류',
        flex: 0.75,
        minWidth: 110,
        valueGetter: (_v, row) => expenseCategoryLabel[row.category],
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
        headerName: '매입세액',
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
      <Stack spacing={0.5}>
        <Typography variant="h5">세무</Typography>
        <Typography variant="body2" color="text.secondary">
          결제·발행·매입 데이터를 바탕으로 부가세를 요약합니다. 실제 신고는 세무사와 국세청 기준에 맞춰 주세요.
        </Typography>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
        <TextField
          type="month"
          label="집계 월"
          size="small"
          value={reportMonth}
          onChange={(e) => dispatch(setTaxReportMonth(e.target.value))}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ width: 200 }}
        />
        <Typography variant="body2" color="text.secondary">
          부가가치세 확정·신고 예시일: 매월 25일(1기·2기 과세월 이후)
        </Typography>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              결제 매출 ({reportMonth})
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              {money(fromPayments.gross)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              추정 공급가액 {money(fromPayments.supply)} · 추정 부가세 {money(fromPayments.vat)} · 건수{' '}
              {fromPayments.count}건
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              발행 문서 (발행 확정)
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              부가세 {money(docTotals.vat)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              공급가액 {money(docTotals.supply)} · {docTotals.count}건
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              매입 세액 공제 · 단순 예상 납부
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              공제 {money(expenseVat)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              결제 추정 매출세 − 매입세 = 약 {money(roughPayable)} (참고용)
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Card>
        <CardContent>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="매출 발행" />
            <Tab label="매입·비용" />
          </Tabs>
          {tab === 0 && (
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={docsInMonth}
                columns={docColumns}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25]}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
              />
            </Box>
          )}
          {tab === 1 && (
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={expensesInMonth}
                columns={expenseColumns}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25]}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  )
}
