import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { Patient } from '../types/patient'

type PatientsTableProps = {
  patients: Patient[]
  onDelete: (patient: Patient) => void
}

export function PatientsTable({ patients, onDelete }: PatientsTableProps) {
  const navigate = useNavigate()

  function formatBirthDate(value: string) {
    const [year, month, day] = value.split('-')

    if (!year || !month || !day) {
      return value
    }

    return `${day}/${month}/${year}`
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 1.5,
        overflow: 'hidden',
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'rgba(0, 179, 173, 0.05)' }}>
            <TableCell>Nome</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>Data de nascimento</TableCell>
            <TableCell>Cidade</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell>
                <Box>
                  <Box fontWeight={700} color="text.primary">
                    {patient.name}
                  </Box>
                  <Box fontSize="0.85rem" color="text.secondary">
                    ID {patient.id.slice(0, 8)}
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{formatBirthDate(patient.birthDate)}</TableCell>
              <TableCell>{patient.address.city}</TableCell>
              <TableCell>
                <Chip
                  label={patient.address.state}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(0, 179, 173, 0.12)',
                    color: 'primary.dark',
                    fontWeight: 700,
                    borderRadius: 0.75,
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() =>
                    navigate(`/patients/${patient.id}/edit`, {
                      state: {
                        patient,
                      },
                    })
                  }
                  sx={{ color: 'secondary.main' }}
                >
                  <EditIcon />
                </IconButton>

                <IconButton onClick={() => onDelete(patient)} sx={{ color: '#cc4b4b' }}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
