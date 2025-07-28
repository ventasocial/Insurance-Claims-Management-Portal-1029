import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AvatarUploader from '../components/AvatarUploader';

const { FiArrowLeft, FiSave, FiMessageSquare, FiUsers, FiClock, FiGlobe, FiSettings, FiBook, FiHelpCircle, FiZap, FiPlus, FiTrash2, FiEdit } = FiIcons;

const HelpHubSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  
  const [helpConfig, setHelpConfig] = useState({
    // Configuración General
    general: {
      enabled: true,
      welcomeMessage: '¡Hola! Soy Greta, tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      placeholderText: 'Escribe tu pregunta aquí...',
      offlineMessage: 'Actualmente estoy fuera de línea, pero puedes dejar tu mensaje.',
      language: 'es-MX',
      timezone: 'America/Mexico_City',
      botName: 'Greta',
      botAvatar: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1741000949338-Vector%20%282%29.png',
      primaryColor: '#204499',
      position: 'bottom-right'
    },
    
    // Base de Conocimiento
    knowledgeBase: {
      enabled: true,
      articles: [
        {
          id: 1,
          title: '¿Cómo crear un reclamo?',
          content: 'Para crear un reclamo, dirígete al botón "Nuevo Reclamo" en tu panel principal...',
          category: 'Reclamos',
          tags: ['reclamo', 'crear', 'nuevo'],
          priority: 'high'
        },
        {
          id: 2,
          title: '¿Qué documentos necesito?',
          content: 'Los documentos necesarios varían según el tipo de reclamo...',
          category: 'Documentos',
          tags: ['documentos', 'requisitos'],
          priority: 'high'
        },
        {
          id: 3,
          title: '¿Cómo subir documentos?',
          content: 'Puedes subir documentos desde la sección de crear reclamo...',
          category: 'Documentos',
          tags: ['subir', 'documentos', 'archivos'],
          priority: 'medium'
        }
      ],
      categories: ['Reclamos', 'Documentos', 'Pagos', 'Cuenta', 'Soporte']
    },
    
    // FAQs
    faqs: {
      enabled: true,
      questions: [
        {
          id: 1,
          question: '¿Cuánto tiempo tarda en procesarse un reclamo?',
          answer: 'Los reclamos generalmente se procesan en 5-10 días hábiles, dependiendo de la complejidad.',
          category: 'Tiempos',
          priority: 'high'
        },
        {
          id: 2,
          question: '¿Puedo modificar un reclamo después de enviarlo?',
          answer: 'Sí, puedes modificar ciertos aspectos de tu reclamo hasta que sea revisado por un agente.',
          category: 'Reclamos',
          priority: 'medium'
        }
      ]
    },
    
    // Tareas Automatizadas
    tasks: {
      enabled: true,
      automatedTasks: [
        {
          id: 1,
          name: 'Bienvenida a nuevos usuarios',
          trigger: 'user_registration',
          action: 'send_welcome_message',
          message: '¡Bienvenido! Te ayudo a comenzar con tu primer reclamo.',
          enabled: true
        },
        {
          id: 2,
          name: 'Recordatorio de documentos pendientes',
          trigger: 'pending_documents',
          action: 'send_reminder',
          message: 'Tienes documentos pendientes por subir para tu reclamo.',
          enabled: true
        },
        {
          id: 3,
          name: 'Notificación de cambio de estatus',
          trigger: 'status_change',
          action: 'send_notification',
          message: 'El estatus de tu reclamo ha cambiado.',
          enabled: true
        }
      ]
    },
    
    // Horarios de Atención
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
      },
      holidays: [
        { date: '2024-12-25', name: 'Navidad' },
        { date: '2024-01-01', name: 'Año Nuevo' },
        { date: '2024-09-16', name: 'Día de la Independencia' }
      ]
    },
    
    // Equipo de Soporte
    supportTeam: {
      enabled: true,
      agents: [
        {
          id: 1,
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@seguro.com',
          role: 'Agente Senior',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
          specialties: ['Reclamos médicos', 'Seguros de vida'],
          available: true,
          workingHours: 'L-V 9:00-18:00'
        },
        {
          id: 2,
          name: 'Ana Martínez',
          email: 'ana.martinez@seguro.com',
          role: 'Especialista en Documentos',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          specialties: ['Documentación', 'Verificación'],
          available: true,
          workingHours: 'L-V 8:00-17:00'
        }
      ],
      escalationRules: {
        autoEscalate: true,
        escalateAfter: 10, // minutos
        escalateConditions: ['human_requested', 'unresolved_after_time', 'complex_query']
      }
    }
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Configuración del HelpHub guardada exitosamente');
    } catch (error) {
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleConfigChange = (section, field, value) => {
    setHelpConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addKnowledgeBaseArticle = () => {
    const newArticle = {
      id: Date.now(),
      title: 'Nuevo artículo',
      content: '',
      category: 'General',
      tags: [],
      priority: 'medium'
    };
    
    setHelpConfig(prev => ({
      ...prev,
      knowledgeBase: {
        ...prev.knowledgeBase,
        articles: [...prev.knowledgeBase.articles, newArticle]
      }
    }));
  };

  const addFAQ = () => {
    const newFAQ = {
      id: Date.now(),
      question: '',
      answer: '',
      category: 'General',
      priority: 'medium'
    };
    
    setHelpConfig(prev => ({
      ...prev,
      faqs: {
        ...prev.faqs,
        questions: [...prev.faqs.questions, newFAQ]
      }
    }));
  };

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      name: 'Nueva tarea',
      trigger: 'manual',
      action: 'send_message',
      message: '',
      enabled: true
    };
    
    setHelpConfig(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        automatedTasks: [...prev.tasks.automatedTasks, newTask]
      }
    }));
  };

  const removeItem = (section, itemId) => {
    setHelpConfig(prev => {
      if (section === 'knowledgeBase') {
        return {
          ...prev,
          knowledgeBase: {
            ...prev.knowledgeBase,
            articles: prev.knowledgeBase.articles.filter(item => item.id !== itemId)
          }
        };
      } else if (section === 'faqs') {
        return {
          ...prev,
          faqs: {
            ...prev.faqs,
            questions: prev.faqs.questions.filter(item => item.id !== itemId)
          }
        };
      } else if (section === 'tasks') {
        return {
          ...prev,
          tasks: {
            ...prev.tasks,
            automatedTasks: prev.tasks.automatedTasks.filter(item => item.id !== itemId)
          }
        };
      }
      return prev;
    });
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Configuración General</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Habilitar HelpHub
          </label>
          <input
            type="checkbox"
            checked={helpConfig.general.enabled}
            onChange={(e) => handleConfigChange('general', 'enabled', e.target.checked)}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Bot
          </label>
          <input
            type="text"
            value={helpConfig.general.botName}
            onChange={(e) => handleConfigChange('general', 'botName', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje de Bienvenida
          </label>
          <textarea
            value={helpConfig.general.welcomeMessage}
            onChange={(e) => handleConfigChange('general', 'welcomeMessage', e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texto del Placeholder
          </label>
          <input
            type="text"
            value={helpConfig.general.placeholderText}
            onChange={(e) => handleConfigChange('general', 'placeholderText', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Idioma
          </label>
          <select
            value={helpConfig.general.language}
            onChange={(e) => handleConfigChange('general', 'language', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="es-MX">Español (México)</option>
            <option value="es-ES">Español (España)</option>
            <option value="en-US">English (US)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color Primario
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={helpConfig.general.primaryColor}
              onChange={(e) => handleConfigChange('general', 'primaryColor', e.target.value)}
              className="h-10 w-16 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={helpConfig.general.primaryColor}
              onChange={(e) => handleConfigChange('general', 'primaryColor', e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar del Bot
          </label>
          <div className="flex justify-center">
            <AvatarUploader
              currentAvatar={helpConfig.general.botAvatar}
              onAvatarChange={(url) => handleConfigChange('general', 'botAvatar', url)}
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderKnowledgeBase = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Base de Conocimiento</h3>
        <button
          onClick={addKnowledgeBaseArticle}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Agregar Artículo</span>
        </button>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={helpConfig.knowledgeBase.enabled}
            onChange={(e) => handleConfigChange('knowledgeBase', 'enabled', e.target.checked)}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Habilitar Base de Conocimiento</span>
        </label>
      </div>

      <div className="space-y-4">
        {helpConfig.knowledgeBase.articles.map((article) => (
          <div key={article.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={article.title}
                onChange={(e) => {
                  const updatedArticles = helpConfig.knowledgeBase.articles.map(a =>
                    a.id === article.id ? { ...a, title: e.target.value } : a
                  );
                  handleConfigChange('knowledgeBase', 'articles', updatedArticles);
                }}
                className="flex-1 text-lg font-medium border-none focus:outline-none focus:ring-0"
                placeholder="Título del artículo"
              />
              <button
                onClick={() => removeItem('knowledgeBase', article.id)}
                className="text-red-500 hover:text-red-700"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                value={article.category}
                onChange={(e) => {
                  const updatedArticles = helpConfig.knowledgeBase.articles.map(a =>
                    a.id === article.id ? { ...a, category: e.target.value } : a
                  );
                  handleConfigChange('knowledgeBase', 'articles', updatedArticles);
                }}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {helpConfig.knowledgeBase.categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={article.priority}
                onChange={(e) => {
                  const updatedArticles = helpConfig.knowledgeBase.articles.map(a =>
                    a.id === article.id ? { ...a, priority: e.target.value } : a
                  );
                  handleConfigChange('knowledgeBase', 'articles', updatedArticles);
                }}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>

              <input
                type="text"
                value={article.tags.join(', ')}
                onChange={(e) => {
                  const updatedArticles = helpConfig.knowledgeBase.articles.map(a =>
                    a.id === article.id ? { ...a, tags: e.target.value.split(', ').filter(tag => tag.trim()) } : a
                  );
                  handleConfigChange('knowledgeBase', 'articles', updatedArticles);
                }}
                placeholder="Tags (separados por comas)"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <textarea
              value={article.content}
              onChange={(e) => {
                const updatedArticles = helpConfig.knowledgeBase.articles.map(a =>
                  a.id === article.id ? { ...a, content: e.target.value } : a
                );
                handleConfigChange('knowledgeBase', 'articles', updatedArticles);
              }}
              rows={4}
              placeholder="Contenido del artículo"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderFAQs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Preguntas Frecuentes (FAQs)</h3>
        <button
          onClick={addFAQ}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Agregar FAQ</span>
        </button>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={helpConfig.faqs.enabled}
            onChange={(e) => handleConfigChange('faqs', 'enabled', e.target.checked)}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Habilitar FAQs</span>
        </label>
      </div>

      <div className="space-y-4">
        {helpConfig.faqs.questions.map((faq) => (
          <div key={faq.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">FAQ #{faq.id}</h4>
              <button
                onClick={() => removeItem('faqs', faq.id)}
                className="text-red-500 hover:text-red-700"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pregunta</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const updatedFAQs = helpConfig.faqs.questions.map(f =>
                      f.id === faq.id ? { ...f, question: e.target.value } : f
                    );
                    handleConfigChange('faqs', 'questions', updatedFAQs);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Escribe la pregunta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Respuesta</label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => {
                    const updatedFAQs = helpConfig.faqs.questions.map(f =>
                      f.id === faq.id ? { ...f, answer: e.target.value } : f
                    );
                    handleConfigChange('faqs', 'questions', updatedFAQs);
                  }}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Escribe la respuesta"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={faq.category}
                    onChange={(e) => {
                      const updatedFAQs = helpConfig.faqs.questions.map(f =>
                        f.id === faq.id ? { ...f, category: e.target.value } : f
                      );
                      handleConfigChange('faqs', 'questions', updatedFAQs);
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="General">General</option>
                    <option value="Reclamos">Reclamos</option>
                    <option value="Documentos">Documentos</option>
                    <option value="Pagos">Pagos</option>
                    <option value="Cuenta">Cuenta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                  <select
                    value={faq.priority}
                    onChange={(e) => {
                      const updatedFAQs = helpConfig.faqs.questions.map(f =>
                        f.id === faq.id ? { ...f, priority: e.target.value } : f
                      );
                      handleConfigChange('faqs', 'questions', updatedFAQs);
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Tareas Automatizadas</h3>
        <button
          onClick={addTask}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Agregar Tarea</span>
        </button>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={helpConfig.tasks.enabled}
            onChange={(e) => handleConfigChange('tasks', 'enabled', e.target.checked)}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Habilitar Tareas Automatizadas</span>
        </label>
      </div>

      <div className="space-y-4">
        {helpConfig.tasks.automatedTasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.enabled}
                  onChange={(e) => {
                    const updatedTasks = helpConfig.tasks.automatedTasks.map(t =>
                      t.id === task.id ? { ...t, enabled: e.target.checked } : t
                    );
                    handleConfigChange('tasks', 'automatedTasks', updatedTasks);
                  }}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-lg font-medium text-gray-900">{task.name}</span>
              </div>
              <button
                onClick={() => removeItem('tasks', task.id)}
                className="text-red-500 hover:text-red-700"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Tarea</label>
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) => {
                    const updatedTasks = helpConfig.tasks.automatedTasks.map(t =>
                      t.id === task.id ? { ...t, name: e.target.value } : t
                    );
                    handleConfigChange('tasks', 'automatedTasks', updatedTasks);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disparador</label>
                <select
                  value={task.trigger}
                  onChange={(e) => {
                    const updatedTasks = helpConfig.tasks.automatedTasks.map(t =>
                      t.id === task.id ? { ...t, trigger: e.target.value } : t
                    );
                    handleConfigChange('tasks', 'automatedTasks', updatedTasks);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="user_registration">Registro de usuario</option>
                  <option value="claim_created">Reclamo creado</option>
                  <option value="status_change">Cambio de estatus</option>
                  <option value="pending_documents">Documentos pendientes</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Acción</label>
                <select
                  value={task.action}
                  onChange={(e) => {
                    const updatedTasks = helpConfig.tasks.automatedTasks.map(t =>
                      t.id === task.id ? { ...t, action: e.target.value } : t
                    );
                    handleConfigChange('tasks', 'automatedTasks', updatedTasks);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="send_message">Enviar mensaje</option>
                  <option value="send_notification">Enviar notificación</option>
                  <option value="send_reminder">Enviar recordatorio</option>
                  <option value="escalate_to_human">Escalar a humano</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
              <textarea
                value={task.message}
                onChange={(e) => {
                  const updatedTasks = helpConfig.tasks.automatedTasks.map(t =>
                    t.id === task.id ? { ...t, message: e.target.value } : t
                  );
                  handleConfigChange('tasks', 'automatedTasks', updatedTasks);
                }}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Mensaje que se enviará cuando se active la tarea"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSupportTeam = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Equipo de Soporte</h3>
      
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={helpConfig.supportTeam.enabled}
            onChange={(e) => handleConfigChange('supportTeam', 'enabled', e.target.checked)}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Habilitar Escalamiento a Equipo</span>
        </label>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="text-md font-medium text-gray-900 mb-4">Reglas de Escalamiento</h4>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={helpConfig.supportTeam.escalationRules.autoEscalate}
                onChange={(e) => {
                  const updatedRules = {
                    ...helpConfig.supportTeam.escalationRules,
                    autoEscalate: e.target.checked
                  };
                  handleConfigChange('supportTeam', 'escalationRules', updatedRules);
                }}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Escalamiento Automático</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escalar después de (minutos)
            </label>
            <input
              type="number"
              value={helpConfig.supportTeam.escalationRules.escalateAfter}
              onChange={(e) => {
                const updatedRules = {
                  ...helpConfig.supportTeam.escalationRules,
                  escalateAfter: parseInt(e.target.value)
                };
                handleConfigChange('supportTeam', 'escalationRules', updatedRules);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Agentes Disponibles</h4>
        {helpConfig.supportTeam.agents.map((agent) => (
          <div key={agent.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-4">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h5 className="text-sm font-medium text-gray-900">{agent.name}</h5>
                <p className="text-sm text-gray-500">{agent.role}</p>
                <p className="text-xs text-gray-400">{agent.email}</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  agent.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {agent.available ? 'Disponible' : 'No disponible'}
                </div>
                <p className="text-xs text-gray-500 mt-1">{agent.workingHours}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Especialidades:</span> {agent.specialties.join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Solo permitir acceso a SuperAdmin y Admin
  if (user?.role !== 'superadmin' && user?.role !== 'admin') {
    return (
      <Layout title="Acceso Denegado">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Configuración HelpHub">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(user?.role === 'superadmin' ? '/superadmin' : '/admin')}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Configuración HelpHub</h2>
              <p className="text-gray-600">Personaliza el asistente virtual y sistema de ayuda</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            <SafeIcon icon={FiSave} className="w-5 h-5" />
            <span>{saving ? 'Guardando...' : 'Guardar Configuración'}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'general', label: 'General', icon: FiSettings },
              { id: 'knowledge', label: 'Base de Conocimiento', icon: FiBook },
              { id: 'faqs', label: 'FAQs', icon: FiHelpCircle },
              { id: 'tasks', label: 'Tareas', icon: FiZap },
              { id: 'team', label: 'Equipo', icon: FiUsers }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'knowledge' && renderKnowledgeBase()}
          {activeTab === 'faqs' && renderFAQs()}
          {activeTab === 'tasks' && renderTasks()}
          {activeTab === 'team' && renderSupportTeam()}
        </div>
      </div>
    </Layout>
  );
};

export default HelpHubSettings;