export const mockClaims = [
  {
    id: 1,
    customerName: 'Juan Pérez García',
    customerEmail: 'juan.perez@email.com',
    customerWhatsApp: '+52 55 1234 5678',
    policyNumber: 'POL-2024-001',
    claimType: 'Reembolso',
    claimInitialType: 'Inicial', // Nuevo campo
    serviceType: 'Cirugía',
    status: 'Pendiente',
    date: '2024-01-15',
    description: 'Cirugía de apendicitis realizada en Hospital General',
    documents: [
      {
        name: 'factura_hospital.pdf',
        type: 'Factura',
        status: 'recibido',
        comment: '',
        url: '#'
      },
      {
        name: 'receta_medica.pdf',
        type: 'Receta médica',
        status: 'aprobado',
        comment: 'Documento correcto',
        url: '#'
      },
      {
        name: 'carnet_seguro.jpg',
        type: 'Carnet de seguro',
        status: 'rechazado',
        comment: 'Documento ilegible, favor de enviar una versión más clara',
        url: '#'
      }
    ]
  },
  {
    id: 2,
    customerName: 'María López Hernández',
    customerEmail: 'maria.lopez@email.com',
    customerWhatsApp: '+52 55 9876 5432',
    policyNumber: 'POL-2024-002',
    claimType: 'Programación',
    serviceType: 'Honorarios Médicos',
    status: 'Verificado',
    date: '2024-01-10',
    description: 'Consulta especializada en cardiología',
    documents: [
      {
        name: 'orden_medica.pdf',
        type: 'Orden médica',
        status: 'aprobado',
        comment: '',
        url: '#'
      },
      {
        name: 'carnet_seguro.jpg',
        type: 'Carnet de seguro',
        status: 'aprobado',
        comment: '',
        url: '#'
      }
    ]
  },
  {
    id: 3,
    customerName: 'Carlos Rodríguez Silva',
    customerEmail: 'carlos.rodriguez@email.com',
    customerWhatsApp: '+52 55 5555 1234',
    policyNumber: 'POL-2024-003',
    claimType: 'Maternidad',
    serviceType: 'Laboratorio',
    status: 'Enviado a Aseguradora',
    date: '2024-01-08',
    description: 'Exámenes prenatales de rutina',
    documents: [
      {
        name: 'resultados_laboratorio.pdf',
        type: 'Resultados de laboratorio',
        status: 'aprobado',
        comment: '',
        url: '#'
      },
      {
        name: 'orden_medica.pdf',
        type: 'Orden médica',
        status: 'aprobado',
        comment: '',
        url: '#'
      },
      {
        name: 'carnet_seguro.jpg',
        type: 'Carnet de seguro',
        status: 'aprobado',
        comment: '',
        url: '#'
      }
    ]
  },
  {
    id: 4,
    customerName: 'Ana Martínez Torres',
    customerEmail: 'ana.martinez@email.com',
    customerWhatsApp: '+52 55 7777 8888',
    policyNumber: 'POL-2024-004',
    claimType: 'Reembolso',
    claimInitialType: 'Complemento', // Nuevo campo
    serviceType: 'Medicamentos',
    status: 'Aprobado',
    date: '2024-01-05',
    description: 'Medicamentos para tratamiento de diabetes',
    documents: [
      {
        name: 'receta_medica.pdf',
        type: 'Receta médica',
        status: 'aprobado',
        comment: '',
        url: '#'
      },
      {
        name: 'factura_farmacia.pdf',
        type: 'Factura farmacia',
        status: 'aprobado',
        comment: '',
        url: '#'
      },
      {
        name: 'carnet_seguro.jpg',
        type: 'Carnet de seguro',
        status: 'aprobado',
        comment: '',
        url: '#'
      }
    ]
  },
  {
    id: 5,
    customerName: 'Roberto Sánchez Flores',
    customerEmail: 'roberto.sanchez@email.com',
    customerWhatsApp: '+52 55 3333 4444',
    policyNumber: 'POL-2024-005',
    claimType: 'Reembolso',
    claimInitialType: 'Inicial', // Nuevo campo
    serviceType: 'Terapias',
    status: 'Rechazado',
    date: '2024-01-12',
    description: 'Sesiones de fisioterapia por lesión deportiva',
    documents: [
      {
        name: 'orden_fisioterapia.pdf',
        type: 'Orden médica',
        status: 'recibido',
        comment: '',
        url: '#'
      },
      {
        name: 'factura_terapias.pdf',
        type: 'Factura',
        status: 'pendiente',
        comment: 'Documento pendiente de recepción',
        url: '#'
      },
      {
        name: 'carnet_seguro.jpg',
        type: 'Carnet de seguro',
        status: 'recibido',
        comment: '',
        url: '#'
      }
    ]
  },
  {
    id: 6,
    customerName: 'Laura Gómez Vega',
    customerEmail: 'laura.gomez@email.com',
    customerWhatsApp: '+52 55 1122 3344',
    policyNumber: 'POL-2024-006',
    claimType: 'Reembolso',
    claimInitialType: 'Inicial',
    serviceType: 'Hospital',
    status: 'Aprobado',
    date: '2024-02-05',
    description: 'Hospitalización por neumonía',
    documents: [
      {
        name: 'factura_hospital.pdf',
        type: 'Factura',
        status: 'aprobado',
        comment: '',
        url: '#'
      },
      {
        name: 'informe_medico.pdf',
        type: 'Informe médico',
        status: 'aprobado',
        comment: '',
        url: '#'
      }
    ]
  },
  {
    id: 7,
    customerName: 'Javier Morales Ruiz',
    customerEmail: 'javier.morales@email.com',
    customerWhatsApp: '+52 55 9988 7766',
    policyNumber: 'POL-2024-007',
    claimType: 'Programación',
    serviceType: 'Cirugía',
    status: 'Aprobado',
    date: '2024-02-10',
    description: 'Cirugía de rodilla programada',
    documents: [
      {
        name: 'orden_cirugia.pdf',
        type: 'Orden médica',
        status: 'aprobado',
        comment: '',
        url: '#'
      },
      {
        name: 'estudios_imagen.pdf',
        type: 'Estudios de imagen',
        status: 'aprobado',
        comment: '',
        url: '#'
      }
    ]
  }
];

export const mockUsers = [
  { 
    id: 1, 
    name: 'Administrador', 
    email: 'admin@seguro.com', 
    role: 'admin',
    createdAt: '2023-10-15',
    status: 'active',
    lastLogin: '2024-06-01 09:23:45'
  },
  { 
    id: 2, 
    name: 'Cliente Demo', 
    email: 'cliente@email.com', 
    role: 'client',
    createdAt: '2023-11-20',
    status: 'active',
    lastLogin: '2024-06-01 14:12:30'
  },
  { 
    id: 3, 
    name: 'Juan Pérez', 
    email: 'juan.perez@email.com', 
    role: 'client',
    createdAt: '2024-01-10',
    status: 'active',
    lastLogin: '2024-05-28 11:45:22'
  },
  { 
    id: 4, 
    name: 'María López', 
    email: 'maria.lopez@email.com', 
    role: 'client',
    createdAt: '2024-02-05',
    status: 'inactive',
    lastLogin: '2024-04-15 16:30:10'
  },
  { 
    id: 5, 
    name: 'Carlos Rodríguez', 
    email: 'carlos.rodriguez@seguro.com', 
    role: 'staff',
    createdAt: '2024-03-12',
    status: 'active',
    lastLogin: '2024-06-01 08:15:33'
  },
  { 
    id: 6, 
    name: 'Ana Martínez', 
    email: 'ana.martinez@seguro.com', 
    role: 'staff',
    createdAt: '2024-04-20',
    status: 'active',
    lastLogin: '2024-05-30 13:40:55'
  }
];