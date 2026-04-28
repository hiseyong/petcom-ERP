import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { apiClient } from '../../shared/api/client'
import { customerFormSchema, healthRecordSchema, petFormSchema, type CustomerFormValues, type HealthRecordFormValues, type PetFormValues } from '../../shared/schemas/customerPetSchema'
import type { Customer, PetProfile } from '../../shared/types/domain'
import {
  addCustomer,
  addHealthRecord,
  addPet,
  setCustomersData,
  setSelectedCustomerId,
} from './customersSlice'

export function CustomersPage() {
  const dispatch = useAppDispatch()
  const { customers, pets, selectedCustomerId } = useAppSelector((state) => state.customers)
  const selectedPets = useMemo(
    () => pets.filter((pet) => pet.customerId === selectedCustomerId),
    [pets, selectedCustomerId],
  )
  const firstPet = selectedPets[0]

  const customerForm = useForm<CustomerFormValues>({ defaultValues: { name: '', phone: '', email: '', memo: '' } })
  const petForm = useForm<PetFormValues>({
    defaultValues: { customerId: '', name: '', species: 'dog', breed: '', age: 1, weightKg: 1 },
  })
  const recordForm = useForm<HealthRecordFormValues>({
    defaultValues: { date: '', type: 'checkup', detail: '' },
  })

  useEffect(() => {
    if (customers.length > 0) {
      return
    }
    const load = async () => {
      const data = await apiClient.loadBootstrapData()
      dispatch(setCustomersData({ customers: data.customers, pets: data.pets }))
    }
    void load()
  }, [customers.length, dispatch])

  const customerColumns: GridColDef<Customer>[] = [
    { field: 'name', headerName: '고객명', flex: 1.1, minWidth: 120 },
    { field: 'phone', headerName: '연락처', flex: 1, minWidth: 140 },
    { field: 'email', headerName: '이메일', flex: 1.2, minWidth: 180 },
    { field: 'memo', headerName: '메모', flex: 1.2, minWidth: 180 },
  ]

  const petColumns: GridColDef<PetProfile>[] = [
    { field: 'name', headerName: '이름', flex: 1, minWidth: 120 },
    { field: 'species', headerName: '종', flex: 0.7, minWidth: 80 },
    { field: 'breed', headerName: '품종', flex: 1, minWidth: 120 },
    { field: 'age', headerName: '나이', flex: 0.6, minWidth: 70 },
    { field: 'weightKg', headerName: '체중(kg)', flex: 0.8, minWidth: 100 },
  ]

  const submitCustomer = customerForm.handleSubmit(async (values) => {
    await customerFormSchema.validate(values)
    dispatch(addCustomer({ id: crypto.randomUUID(), ...values }))
    customerForm.reset()
  })

  const submitPet = petForm.handleSubmit(async (values) => {
    await petFormSchema.validate(values)
    dispatch(addPet({ id: crypto.randomUUID(), healthRecords: [], ...values }))
    petForm.reset({ customerId: values.customerId, name: '', species: 'dog', breed: '', age: 1, weightKg: 1 })
  })

  const submitRecord = recordForm.handleSubmit(async (values) => {
    if (!firstPet) {
      return
    }
    await healthRecordSchema.validate(values)
    dispatch(
      addHealthRecord({
        petId: firstPet.id,
        record: { id: crypto.randomUUID(), ...values },
      }),
    )
    recordForm.reset({ date: '', type: 'checkup', detail: '' })
  })

  return (
    <Stack spacing={3}>
      <Typography variant="h5">고객 및 반려동물 관리</Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">고객 조회</Typography>
          <Box sx={{ height: 320, mt: 1.5 }}>
            <DataGrid
              rows={customers}
              columns={customerColumns}
              disableRowSelectionOnClick
              onRowClick={(params) => dispatch(setSelectedCustomerId(params.row.id))}
            />
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">반려동물 정보</Typography>
          <Typography variant="body2" color="text.secondary">
            선택 고객 ID: {selectedCustomerId ?? '-'}
          </Typography>
          <Box sx={{ height: 280, mt: 1.5 }}>
            <DataGrid rows={selectedPets} columns={petColumns} disableRowSelectionOnClick />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">건강/접종 이력</Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {(firstPet?.healthRecords ?? []).map((record) => (
              <Box key={record.id} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                <Typography variant="body2">
                  {record.date} · {record.type === 'vaccination' ? '접종' : '검진'} · {record.detail}
                </Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">고객/반려동물/건강이력 등록</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 1.5 }}>
            <Box component="form" onSubmit={submitCustomer} sx={{ flex: 1 }}>
              <TextField label="고객명" size="small" fullWidth {...customerForm.register('name')} sx={{ mb: 1 }} />
              <TextField label="연락처" size="small" fullWidth {...customerForm.register('phone')} sx={{ mb: 1 }} />
              <TextField label="이메일" size="small" fullWidth {...customerForm.register('email')} sx={{ mb: 1 }} />
              <TextField label="메모" size="small" fullWidth {...customerForm.register('memo')} />
              <Button sx={{ mt: 1 }} variant="contained" type="submit">
                고객 등록
              </Button>
            </Box>
            <Box component="form" onSubmit={submitPet} sx={{ flex: 1 }}>
              <TextField select label="보호자" size="small" fullWidth {...petForm.register('customerId')} sx={{ mb: 1 }}>
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="반려동물명" size="small" fullWidth {...petForm.register('name')} sx={{ mb: 1 }} />
              <TextField select label="종" size="small" fullWidth {...petForm.register('species')} sx={{ mb: 1 }}>
                <MenuItem value="dog">강아지</MenuItem>
                <MenuItem value="cat">고양이</MenuItem>
              </TextField>
              <TextField label="품종" size="small" fullWidth {...petForm.register('breed')} sx={{ mb: 1 }} />
              <TextField label="나이" size="small" type="number" fullWidth {...petForm.register('age', { valueAsNumber: true })} sx={{ mb: 1 }} />
              <TextField label="체중(kg)" size="small" type="number" fullWidth {...petForm.register('weightKg', { valueAsNumber: true })} />
              <Button sx={{ mt: 1 }} variant="contained" type="submit">
                반려동물 등록
              </Button>
            </Box>
            <Box component="form" onSubmit={submitRecord} sx={{ flex: 1 }}>
              <TextField size="small" type="date" fullWidth slotProps={{ inputLabel: { shrink: true } }} label="기록일" {...recordForm.register('date')} sx={{ mb: 1 }} />
              <TextField select label="유형" size="small" fullWidth {...recordForm.register('type')} sx={{ mb: 1 }}>
                <MenuItem value="vaccination">접종</MenuItem>
                <MenuItem value="checkup">검진</MenuItem>
              </TextField>
              <TextField label="상세내용" size="small" fullWidth {...recordForm.register('detail')} />
              <Button sx={{ mt: 1 }} variant="contained" type="submit" disabled={!firstPet}>
                건강 이력 추가
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
