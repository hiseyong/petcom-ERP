import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { apiClient } from '../../shared/api/client'
import type { CustomerFormValues, HealthRecordFormValues, PetFormValues } from '../../shared/schemas/customerPetSchema'
import type { Customer, PetProfile } from '../../shared/types/domain'
import {
  addCustomer,
  addHealthRecord,
  addPet,
  setCustomersData,
  setSelectedCustomerId,
} from './customersSlice'
import { CustomerCreateModal } from './CustomerCreateModal'
import { PetCreateModal } from './PetCreateModal'
import { HealthRecordCreateModal } from './HealthRecordCreateModal'

export function CustomersPage() {
  const dispatch = useAppDispatch()
  const { customers, pets, selectedCustomerId } = useAppSelector((state) => state.customers)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [isPetModalOpen, setIsPetModalOpen] = useState(false)
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false)
  const selectedPets = useMemo(
    () => pets.filter((pet) => pet.customerId === selectedCustomerId),
    [pets, selectedCustomerId],
  )
  const firstPet = selectedPets[0]

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

  const submitCustomer = (values: CustomerFormValues) => {
    dispatch(addCustomer({ id: crypto.randomUUID(), ...values }))
  }

  const submitPet = (values: PetFormValues) => {
    dispatch(addPet({ id: crypto.randomUUID(), healthRecords: [], ...values }))
  }

  const submitRecord = (values: HealthRecordFormValues) => {
    if (!firstPet) {
      return
    }
    dispatch(
      addHealthRecord({
        petId: firstPet.id,
        record: { id: crypto.randomUUID(), ...values },
      }),
    )
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5">고객 및 반려동물 관리</Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={() => setIsCustomerModalOpen(true)}>
          고객 등록
        </Button>
        <Button variant="outlined" onClick={() => setIsPetModalOpen(true)} disabled={!customers.length}>
          반려동물 등록
        </Button>
        <Button
          variant="outlined"
          onClick={() => setIsHealthModalOpen(true)}
          disabled={!firstPet}
        >
          건강이력 추가
        </Button>
      </Stack>
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

      <CustomerCreateModal
        open={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSubmit={submitCustomer}
      />
      <PetCreateModal
        open={isPetModalOpen}
        onClose={() => setIsPetModalOpen(false)}
        customers={customers}
        onSubmit={submitPet}
      />
      <HealthRecordCreateModal
        open={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        disabled={!firstPet}
        onSubmit={submitRecord}
      />
    </Stack>
  )
}
