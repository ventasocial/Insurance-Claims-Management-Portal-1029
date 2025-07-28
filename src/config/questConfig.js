export default {
  QUEST_HELP_QUESTID: 'c-greta-help-hub',
  USER_ID: 'u-8667511c-8d11-42ea-a065-e8ac99b8098a',
  APIKEY: 'k-124dff2e-2bf3-4bc5-9cb0-5e588ad8ca5b',
  TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1LTg2Njc1MTFjLThkMTEtNDJlYS1hMDY1LWU4YWM5OWI4MDk4YSIsImlhdCI6MTc1MTMxMzk3NiwiZXhwIjoxNzUzOTA1OTc2fQ.2RJXSMgnjwxB2463hd2IcS2ZlS76MhSc843CpfZ7sEo',
  ENTITYID: 'e-80c90d10-a00c-4b75-8d79-0e3b23f22de5',
  PRIMARY_COLOR: '#204499',
  
  // Configuración de idioma por defecto
  DEFAULT_LANGUAGE: 'es-MX',
  
  // Configuración de personalización por tenant
  HELP_CUSTOMIZATION: {
    // Configuración global por defecto
    global: {
      welcomeMessage: '¡Hola! Soy Greta, tu asistente virtual para el portal de reclamos. ¿En qué puedo ayudarte hoy?',
      placeholderText: 'Escribe tu pregunta aquí...',
      offlineMessage: 'Actualmente estoy fuera de línea, pero puedes dejar tu mensaje y te responderé pronto.',
      language: 'es-MX',
      timezone: 'America/Mexico_City',
      workingHours: {
        enabled: true,
        schedule: {
          monday: { start: '09:00', end: '18:00', active: true },
          tuesday: { start: '09:00', end: '18:00', active: true },
          wednesday: { start: '09:00', end: '18:00', active: true },
          thursday: { start: '09:00', end: '18:00', active: true },
          friday: { start: '09:00', end: '18:00', active: true },
          saturday: { start: '10:00', end: '14:00', active: false },
          sunday: { start: '10:00', end: '14:00', active: false }
        }
      }
    },
    
    // Configuraciones específicas por tenant
    tenants: {
      // Ejemplo para diferentes tipos de aseguradoras
      'seguros-mx': {
        welcomeMessage: '¡Bienvenido a Seguros MX! Soy tu asistente especializada en seguros de vida y gastos médicos. ¿Cómo puedo apoyarte?',
        knowledgeBase: 'kb-seguros-mx',
        primaryColor: '#1B4332',
        botAvatar: 'https://example.com/seguros-mx-bot.png',
        companyName: 'Seguros MX',
        supportTeam: ['agent-carlos', 'agent-maria']
      },
      'aseguradora-global': {
        welcomeMessage: '¡Hola! Soy el asistente virtual de Aseguradora Global. Estoy aquí para ayudarte con tus pólizas empresariales.',
        knowledgeBase: 'kb-aseguradora-global',
        primaryColor: '#8B0000',
        botAvatar: 'https://example.com/global-bot.png',
        companyName: 'Aseguradora Global',
        supportTeam: ['agent-luis', 'agent-ana']
      }
    }
  }
};