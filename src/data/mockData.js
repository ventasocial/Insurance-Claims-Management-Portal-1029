export const mockClaims = [
  {
    id: 1,
    customerName: 'Juan Pérez García',
    customerEmail: 'juan.perez@email.com',
    customerWhatsApp: '+52 55 1234 5678',
    policyNumber: 'POL-2024-001',
    claimType: 'Reembolso',
    claimInitialType: 'Inicial',
    serviceType: 'Cirugía',
    status: 'Pendiente',
    date: '2024-01-15',
    description: 'Cirugía de apendicitis realizada en Hospital General',
    groupId: 1,
    assignedAgentId: 5,
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
    groupId: 2,
    assignedAgentId: 6,
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
    groupId: 1,
    assignedAgentId: 5,
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
    claimInitialType: 'Complemento',
    serviceType: 'Medicamentos',
    status: 'Aprobado',
    date: '2024-01-05',
    description: 'Medicamentos para tratamiento de diabetes',
    groupId: 3,
    assignedAgentId: 7,
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
    claimInitialType: 'Inicial',
    serviceType: 'Terapias',
    status: 'Rechazado',
    date: '2024-01-12',
    description: 'Sesiones de fisioterapia por lesión deportiva',
    groupId: 2,
    assignedAgentId: 6,
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
    groupId: 1,
    assignedAgentId: 5,
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
    groupId: 3,
    assignedAgentId: 7,
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
    lastLogin: '2024-06-01 09:23:45',
    groupId: null,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    whatsapp: '+52 55 1111 0000'
  },
  {
    id: 2,
    name: 'Cliente Demo',
    email: 'cliente@email.com',
    role: 'client',
    createdAt: '2023-11-20',
    status: 'active',
    lastLogin: '2024-06-01 14:12:30',
    groupId: 1,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=100&h=100&fit=crop&crop=face',
    whatsapp: '+52 55 2222 0000'
  },
  {
    id: 3,
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    role: 'client',
    createdAt: '2024-01-10',
    status: 'active',
    lastLogin: '2024-05-28 11:45:22',
    groupId: 1,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    whatsapp: '+52 55 1234 5678'
  },
  {
    id: 4,
    name: 'María López',
    email: 'maria.lopez@email.com',
    role: 'client',
    createdAt: '2024-02-05',
    status: 'inactive',
    lastLogin: '2024-04-15 16:30:10',
    groupId: 2,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    whatsapp: '+52 55 9876 5432'
  },
  {
    id: 5,
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@seguro.com',
    role: 'staff',
    createdAt: '2024-03-12',
    status: 'active',
    lastLogin: '2024-06-01 08:15:33',
    groupId: null,
    assignedGroups: [1, 2], // Grupos asignados al agente
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    whatsapp: '+52 55 3333 1111'
  },
  {
    id: 6,
    name: 'Ana Martínez',
    email: 'ana.martinez@seguro.com',
    role: 'staff',
    createdAt: '2024-04-20',
    status: 'active',
    lastLogin: '2024-05-30 13:40:55',
    groupId: null,
    assignedGroups: [2, 3],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    whatsapp: '+52 55 4444 2222'
  },
  {
    id: 7,
    name: 'Luis García',
    email: 'luis.garcia@seguro.com',
    role: 'staff',
    createdAt: '2024-05-15',
    status: 'active',
    lastLogin: '2024-05-31 16:22:10',
    groupId: null,
    assignedGroups: [1, 3],
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    whatsapp: '+52 55 5555 3333'
  },
  {
    id: 8,
    name: 'Patricia Jiménez',
    email: 'patricia.jimenez@email.com',
    role: 'client',
    createdAt: '2024-03-08',
    status: 'active',
    lastLogin: '2024-05-29 10:15:33',
    groupId: 3,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    whatsapp: '+52 55 6666 4444'
  },
  {
    id: 9,
    name: 'Roberto Silva',
    email: 'roberto.silva@email.com',
    role: 'client',
    createdAt: '2024-04-12',
    status: 'active',
    lastLogin: '2024-05-28 14:45:20',
    groupId: 1,
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face',
    whatsapp: '+52 55 7777 5555'
  },
  {
    id: 10,
    name: 'Carmen Vega',
    email: 'carmen.vega@email.com',
    role: 'client',
    createdAt: '2024-05-01',
    status: 'inactive',
    lastLogin: '2024-05-20 08:30:15',
    groupId: 2,
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
    whatsapp: '+52 55 8888 6666'
  }
];

// Nuevos datos para grupos de clientes
export const mockClientGroups = [
  {
    id: 1,
    name: 'Corporativo Premium',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    representativeName: 'Roberto Mendoza',
    representativePhone: '+52 55 1234 5678',
    representativeEmail: 'roberto.mendoza@corporativo.com',
    createdAt: '2024-01-15',
    clientsCount: 4,
    agentsCount: 2,
    status: 'active'
  },
  {
    id: 2,
    name: 'PYME Seguros',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face',
    representativeName: 'Ana Fernández',
    representativePhone: '+52 55 9876 5432',
    representativeEmail: 'ana.fernandez@pymeseguros.com',
    createdAt: '2024-02-01',
    clientsCount: 3,
    agentsCount: 2,
    status: 'active'
  },
  {
    id: 3,
    name: 'Salud Integral',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face',
    representativeName: 'Dr. Miguel Torres',
    representativePhone: '+52 55 5555 7777',
    representativeEmail: 'miguel.torres@saludintegral.com',
    createdAt: '2024-03-10',
    clientsCount: 2,
    agentsCount: 2,
    status: 'active'
  },
  {
    id: 4,
    name: 'Empresarial Plus',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    representativeName: 'Carlos Ramírez',
    representativePhone: '+52 55 3333 9999',
    representativeEmail: 'carlos.ramirez@empresarialplus.com',
    createdAt: '2024-04-05',
    clientsCount: 0,
    agentsCount: 1,
    status: 'inactive'
  }
];

// Relaciones agente-grupo para gestión de asignaciones
export const mockAgentGroupAssignments = [
  { agentId: 5, groupId: 1, assignedAt: '2024-01-20' },
  { agentId: 5, groupId: 2, assignedAt: '2024-02-15' },
  { agentId: 6, groupId: 2, assignedAt: '2024-02-01' },
  { agentId: 6, groupId: 3, assignedAt: '2024-03-15' },
  { agentId: 7, groupId: 1, assignedAt: '2024-03-01' },
  { agentId: 7, groupId: 3, assignedAt: '2024-03-20' }
];