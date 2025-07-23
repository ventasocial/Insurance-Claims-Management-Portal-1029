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
    serviceType: 'Medicamentos',
    status: 'Archivado',
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
    serviceType: 'Terapias',
    status: 'Pendiente',
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
  }
];