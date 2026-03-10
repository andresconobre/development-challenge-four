import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'

export function PageHeader() {
  const navigate = useNavigate()

  return (
    <Box
      mb={4}
      sx={{
        px: { xs: 3, md: 4 },
        py: { xs: 3, md: 4 },
        borderRadius: 2,
        background:
          'linear-gradient(135deg, rgba(0, 179, 173, 0.95), rgba(20, 118, 209, 0.92))',
        color: 'common.white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top right, rgba(255,255,255,0.22), transparent 28%)',
        }}
      />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        sx={{ position: 'relative' }}
      >
        <Box maxWidth={680}>
          <Chip
            label="Medcloud Patient Registry"
            sx={{
              mb: 2,
              color: 'common.white',
              bgcolor: 'rgba(255,255,255,0.18)',
              borderRadius: 1,
              fontWeight: 700,
            }}
          />

          <Typography variant="h4" component="h1" fontWeight={800} color="inherit" gutterBottom>
            Pacientes cadastrados
          </Typography>

          <Typography color="rgba(255,255,255,0.88)">
            Gestão de cadastros com uma interface limpa, objetiva e alinhada à identidade visual da
            Medcloud.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<AddIcon />}
          onClick={() => navigate('/patients/new')}
          sx={{
            bgcolor: 'common.white',
            color: 'primary.dark',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.92)',
            },
          }}
        >
          Cadastrar paciente
        </Button>
      </Stack>
    </Box>
  )
}
