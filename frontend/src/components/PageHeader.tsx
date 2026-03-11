import { Box, Button, Stack, Typography } from '@mui/material'
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
        backgroundColor: 'common.white',
        color: 'text.primary',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(20, 48, 66, 0.08)',
        boxShadow: '0 14px 34px rgba(13, 74, 109, 0.08)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'none',
        }}
      />

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        justifyContent={{ xs: 'center', lg: 'space-between' }}
        alignItems="center"
        spacing={2}
        sx={{ position: 'relative' }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
          justifyContent={{ xs: 'center', lg: 'flex-start' }}
          sx={{ maxWidth: 680 }}
        >
          <Box
            component="img"
            src="https://cdn.prod.website-files.com/6760868f67abf4e09f96edc7/67b38f80a21f4479be0135b1_logo%20medcloud.svg"
            alt="Medcloud"
            sx={{
              height: { xs: 34, sm: 40 },
              width: 'auto',
              flexShrink: 0,
            }}
          />

          <Box textAlign={{ xs: 'center', lg: 'left' }}>
            <Typography variant="h4" component="h2" fontWeight={800} color="inherit">
              Cadastro de pacientes
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<AddIcon />}
          onClick={() => navigate('/patients/new')}
          sx={{
            width: { xs: '100%', lg: 'auto' },
            maxWidth: { xs: 360, lg: 'none' },
            bgcolor: 'primary.main',
            color: 'common.white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Cadastrar paciente
        </Button>
      </Stack>
    </Box>
  )
}
