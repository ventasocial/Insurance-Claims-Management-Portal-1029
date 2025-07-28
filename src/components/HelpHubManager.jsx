import React, { useState, useEffect } from 'react';
import { HelpHub } from '@questlabs/react-sdk';
import { useAuth } from '../contexts/AuthContext';
import questConfig from '../config/questConfig';

const HelpHubManager = () => {
  const { user } = useAuth();
  const [helpConfig, setHelpConfig] = useState(null);
  const [tenantConfig, setTenantConfig] = useState(null);

  useEffect(() => {
    loadHelpConfiguration();
  }, [user]);

  const loadHelpConfiguration = async () => {
    try {
      // Determinar configuración basada en el tenant del usuario
      const tenantId = user?.tenantId || 'global';
      const config = questConfig.HELP_CUSTOMIZATION.tenants[tenantId] || 
                    questConfig.HELP_CUSTOMIZATION.global;

      // Configuración personalizada por tenant
      const customConfig = {
        ...config,
        userId: user?.id?.toString() || questConfig.USER_ID,
        userEmail: user?.email,
        userName: user?.name,
        userRole: user?.role,
        tenantId: tenantId,
        
        // Configuración de idioma
        language: config.language || questConfig.DEFAULT_LANGUAGE,
        
        // Configuración de apariencia
        primaryColor: config.primaryColor || questConfig.PRIMARY_COLOR,
        
        // Configuración contextual
        contextData: {
          currentPage: window.location.pathname,
          userRole: user?.role,
          tenantName: config.companyName,
          lastActivity: new Date().toISOString()
        }
      };

      setHelpConfig(customConfig);
      setTenantConfig(config);
    } catch (error) {
      console.error('Error loading help configuration:', error);
    }
  };

  // Función para obtener mensajes contextuales
  const getContextualMessages = () => {
    const currentPath = window.location.pathname;
    
    const contextualHelp = {
      '/dashboard': {
        welcomeMessage: '¡Hola! Veo que estás en tu panel principal. ¿Necesitas ayuda para crear un reclamo o revisar el estado de uno existente?',
        quickActions: [
          'Crear nuevo reclamo',
          'Verificar estado de reclamo',
          'Subir documentos',
          'Contactar a mi agente'
        ]
      },
      '/crear-reclamo': {
        welcomeMessage: '¿Necesitas ayuda para crear tu reclamo? Te puedo guiar paso a paso.',
        quickActions: [
          'Tipos de reclamo disponibles',
          'Documentos necesarios',
          'Llenar información del asegurado',
          'Proceso de revisión'
        ]
      },
      '/admin': {
        welcomeMessage: 'Hola Admin, ¿en qué puedo asistirte para gestionar el sistema?',
        quickActions: [
          'Gestión de usuarios',
          'Configurar agentes',
          'Reportes del sistema',
          'Configuración de grupos'
        ]
      },
      '/superadmin': {
        welcomeMessage: 'Bienvenido SuperAdmin, ¿necesitas ayuda con la gestión de tenants?',
        quickActions: [
          'Crear nuevo tenant',
          'Gestión de suscripciones',
          'Configurar integraciones',
          'White label settings'
        ]
      }
    };

    return contextualHelp[currentPath] || {
      welcomeMessage: helpConfig?.welcomeMessage || questConfig.HELP_CUSTOMIZATION.global.welcomeMessage,
      quickActions: []
    };
  };

  if (!helpConfig) {
    return null; // o un loader
  }

  const contextualMessages = getContextualMessages();

  return (
    <HelpHub
      uniqueUserId={helpConfig.userId}
      questId={questConfig.QUEST_HELP_QUESTID}
      token={questConfig.TOKEN}
      primaryColor={helpConfig.primaryColor}
      
      // Configuración de apariencia
      botLogo={{
        logo: tenantConfig?.botAvatar || 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1741000949338-Vector%20%282%29.png'
      }}
      
      // Configuración de idioma y localización
      language={helpConfig.language}
      timezone={questConfig.HELP_CUSTOMIZATION.global.timezone}
      
      // Mensajes personalizados
      customMessages={{
        welcomeMessage: contextualMessages.welcomeMessage,
        placeholderText: helpConfig.placeholderText || 'Escribe tu pregunta aquí...',
        offlineMessage: helpConfig.offlineMessage,
        quickActions: contextualMessages.quickActions
      }}
      
      // Configuración de estilo
      styleConfig={{
        zIndex: 10000,
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}
      
      // Datos de contexto para el bot
      contextData={helpConfig.contextData}
      
      // Configuración de horarios
      workingHours={questConfig.HELP_CUSTOMIZATION.global.workingHours}
      
      // Knowledge Base específica del tenant
      knowledgeBaseId={tenantConfig?.knowledgeBase}
      
      // Equipo de soporte asignado
      supportTeam={tenantConfig?.supportTeam}
      
      // Callbacks para eventos
      onMessageSent={(message) => {
        console.log('Mensaje enviado:', message);
        // Aquí puedes agregar analytics o logging
      }}
      
      onBotResponse={(response) => {
        console.log('Respuesta del bot:', response);
        // Aquí puedes procesar respuestas especiales
      }}
      
      onEscalateToHuman={() => {
        console.log('Usuario solicitó hablar con humano');
        // Aquí puedes implementar lógica de escalamiento
      }}
    />
  );
};

export default HelpHubManager;