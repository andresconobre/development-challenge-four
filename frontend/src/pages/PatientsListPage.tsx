import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Skeleton,
  TablePagination,
  TextField,
  Typography,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import InputAdornment from '@mui/material/InputAdornment'
import { useEffect, useState } from 'react'
import { useFeedback } from '../contexts/feedback-context'
import { PageHeader } from '../components/PageHeader'
import { PatientsTable } from '../components/PatientsTable'
import { patientsService } from '../services/patientsService'
import type { Patient } from '../types/patient'
import { getErrorMessage } from '../utils/httpError'

export function PatientsListPage() {
  const { pushFeedback } = useFeedback()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)

  async function loadPatients() {
    try {
      setLoading(true)

      const response = await patientsService.getAll(page + 1, rowsPerPage, debouncedSearch)
      setPatients(Array.isArray(response.items) ? response.items : [])
      setTotal(Number(response.total ?? 0))
    } catch (error) {
      console.error(error)
      setPatients([])
      setTotal(0)
      pushFeedback(getErrorMessage(error, 'Erro ao carregar pacientes'), 'error')
    } finally {
      setLoading(false)
    }
  }

  async function confirmDelete() {
    if (!patientToDelete || isLoading) return

    try {
      setIsLoading(true)
      await patientsService.remove(patientToDelete.id)
      pushFeedback('Paciente removido com sucesso', 'success')
      setPatientToDelete(null)
      await loadPatients()
    } catch (error) {
      console.error(error)
      pushFeedback(getErrorMessage(error, 'Erro ao remover paciente'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(0)
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    void loadPatients()
  }, [debouncedSearch, page, rowsPerPage])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader />

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.88)',
        }}
      >
        <TextField
          label="Buscar por nome"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Digite o nome do paciente"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {loading ? (
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box display="grid" gap={2}>
            <Skeleton variant="rounded" height={46} />
            <Skeleton variant="rounded" height={46} />
            <Skeleton variant="rounded" height={46} />
            <Skeleton variant="rounded" height={46} />
            <Box display="flex" justifyContent="flex-end">
              <CircularProgress color="primary" size={22} />
            </Box>
          </Box>
        </Paper>
      ) : patients.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            borderRadius: 2,
            textAlign: 'center',
            bgcolor: 'rgba(255,255,255,0.88)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Nenhum paciente cadastrado
          </Typography>
          <Typography color="text.secondary">
            Inicie o cadastro para começar a organizar os registros clínicos.
          </Typography>
        </Paper>
      ) : (
        <>
          <PatientsTable patients={patients} onDelete={setPatientToDelete} />
          <Paper sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={(_, nextPage) => setPage(nextPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(Number(event.target.value))
                setPage(0)
              }}
              rowsPerPageOptions={[5, 10, 20]}
              labelRowsPerPage="Linhas por página"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
              }
              sx={{
                '.MuiTablePagination-toolbar': {
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  rowGap: 1,
                  columnGap: 2,
                  py: { xs: 1.5, sm: 0 },
                },
                '.MuiTablePagination-spacer': {
                  display: { xs: 'none', sm: 'block' },
                },
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  margin: 0,
                },
                '.MuiTablePagination-actions': {
                  marginLeft: { xs: 0, sm: 2.5 },
                },
              }}
            />
          </Paper>
        </>
      )}

      <Dialog
        open={Boolean(patientToDelete)}
        onClose={() => {
          if (!isLoading) {
            setPatientToDelete(null)
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Excluir paciente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {patientToDelete
              ? `Tem certeza que deseja excluir o cadastro de ${patientToDelete.name}?`
              : 'Tem certeza que deseja excluir este paciente?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPatientToDelete(null)} color="inherit" disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={isLoading}>
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
