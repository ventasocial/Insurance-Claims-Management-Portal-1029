export const mockClaims = [
  {
    id: 1,
    customerName: 'Juan Pérez García',
    customerEmail: 'juan.perez@email.com',
    customerWhatsApp: '+52 55 1234 5678',
    policyNumber: 'POL-2024-001',
    claimType: 'Reembolso',
    serviceType: 'Cirugía',
    status: 'Pendiente',
    date: '2024-01-15',
    description: 'Cirugía de apendicitis realizada en Hospital General',
    documents: [
      { name: 'factura_hospital.pdf', type: 'Factura' },
      { name: 'receta_medica.pdf', type: 'Receta médica' },
      { name: 'carnet_seguro.jpg', type: 'Carnet de seguro' }
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
      { name: 'orden_medica.pdf', type: 'Orden médica' },
      { name: 'carnet_seguro.jpg', type: 'Carnet de seguro' }
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
      { name: 'resultados_laboratorio.pdf', type: 'Resultados de laboratorio' },
      { name: 'orden_medica.pdf', type: 'Orden médica' },
      { name: 'carnet_seguro.jpg', type: 'Carnet de seguro' }
    ]
  },
  {
    id: 4,
    customerName: 'Ana Martínez Torres',
    customerEmail: 'ana.martinez@email.com',
    customerWhatsApp: '+52 55 7777 8888',
    policyNumber: 'POL-2024-004',
    claimType: 'Reembolso',
    serviceType: 'Medicamentos',
    status: 'Archivado',
    date: '2024-01-05',
    description: 'Medicamentos para tratamiento de diabetes',
    documents: [
      { name: 'receta_medica.pdf', type: 'Receta médica' },
      { name: 'factura_farmacia.pdf', type: 'Factura farmacia' },
      { name: 'carnet_seguro.jpg', type: 'Carnet de seguro' }
    ]
  },
  {
    id: 5,
    customerName: 'Roberto Sánchez Flores',
    customerEmail: 'roberto.sanchez@email.com',
    customerWhatsApp: '+52 55 3333 4444',
    policyNumber: 'POL-2024-005',
    claimType: 'Reembolso',
    serviceType: 'Terapias',
    status: 'Pendiente',
    date: '2024-01-12',
    description: 'Sesiones de fisioterapia por lesión deportiva',
    documents: [
      { name: 'orden_fisioterapia.pdf', type: 'Orden médica' },
      { name: 'factura_terapias.pdf', type: 'Factura' },
      { name: 'carnet_seguro.jpg', type: 'Carnet de seguro' }
    ]
  }
];