import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { PatientFormPage } from '../pages/PatientFormPage'
import { PatientsListPage } from '../pages/PatientsListPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <PatientsListPage />,
      },
      {
        path: 'patients/new',
        element: <PatientFormPage />,
      },
      {
        path: 'patients/:id/edit',
        element: <PatientFormPage />,
      },
    ],
  },
])
