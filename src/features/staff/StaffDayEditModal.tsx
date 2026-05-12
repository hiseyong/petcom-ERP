import { useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Stack,
  TextField,
  Checkbox,
} from '@mui/material'
import type { StaffMember, StaffRosterDay } from '../../shared/types/domain'

interface StaffDayEditModalProps {
  open: boolean
  date: string | null
  members: StaffMember[]
  rosterDay: StaffRosterDay | null
  onClose: () => void
  onSave: (row: StaffRosterDay) => void
}

export function StaffDayEditModal({ open, date, members, rosterDay, onClose, onSave }: StaffDayEditModalProps) {
  const [dutyId, setDutyId] = useState(() => rosterDay?.dutyStaffId ?? members[0]?.id ?? '')
  const [assigned, setAssigned] = useState<string[]>(() => (rosterDay ? [...rosterDay.assignedStaffIds] : []))
  const [notes, setNotes] = useState(() => rosterDay?.notes ?? '')
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!date) return
    if (!dutyId) {
      setError('당직 담당자를 선택해주세요.')
      return
    }
    setError('')
    onSave({
      date,
      dutyStaffId: dutyId,
      assignedStaffIds: assigned,
      notes: notes.trim() || undefined,
    })
    onClose()
  }

  const titleDate =
    date &&
    new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long', weekday: 'long' }).format(new Date(`${date}T12:00:00`))

  return (
    <Dialog open={open && Boolean(date)} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>일정 편집 · {titleDate}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <FormControl fullWidth>
            <TextField
              select
              label="당직"
              value={dutyId}
              onChange={(e) => setDutyId(e.target.value)}
              size="small"
              helperText="야간·비상 연락 우선 담당자"
            >
              {members.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">일별 근무 담당</FormLabel>
            <FormGroup>
              {members.map((m) => (
                <FormControlLabel
                  key={m.id}
                  control={
                    <Checkbox
                      checked={assigned.includes(m.id)}
                      onChange={() =>
                        setAssigned((prev) =>
                          prev.includes(m.id) ? prev.filter((id) => id !== m.id) : [...prev, m.id],
                        )
                      }
                    />
                  }
                  label={`${m.name} · ${m.role}`}
                />
              ))}
            </FormGroup>
          </FormControl>
          <TextField
            label="메모"
            size="small"
            fullWidth
            multiline
            minRows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={handleSave}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  )
}
