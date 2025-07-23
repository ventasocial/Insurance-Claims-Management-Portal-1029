// Actualiza solo las funciones relevantes para la integración con Supabase
// Manteniendo el resto del archivo igual

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import InsuredPersonsList from '../components/InsuredPersonsList';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';

const { FiUser, FiMail, FiPhone, FiFileText, FiUpload, FiX, FiAlertCircle, FiCheck, FiUsers } = FiIcons;

const CreateClaim = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const complementData = location.state?.complementData;

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerWhatsApp: '',
    policyNumber: '',
    insurance: '',
    claimType: '',
    serviceTypes: [],
    isTraumaOrthopedicSurgery: false,
    claimInitialType: '',
    previousClaimNumber: '',
    description: '',
    saveCustomerDetails: true,
    isTitularCuentaBancaria: false,
    signatureType: 'electronic'
  });

  const [documents, setDocuments] = useState({
    section1: [],
    section2: [],
    section3: []
  });
  
  const [loading, setLoading] = useState(false);
  const [whatsappError, setWhatsappError] = useState('');
  const [showInsuredList, setShowInsuredList] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Pre-cargar datos si viene de complemento
  useEffect(() => {
    if (complementData) {
      setFormData(prev => ({ ...prev, ...complementData }));
    }
  }, [complementData]);

  // Resto del código existente para handleInputChange, handleCheckboxChange, etc.
  // ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerWhatsApp.startsWith('+')) {
      setWhatsappError('El número debe incluir el código de país (ej. +52)');
      return;
    }

    setLoading(true);
    
    try {
      // Generar un código de reclamo aleatorio
      const claimCode = generateClaimCode();
      
      // 1. Guardar los detalles del asegurado si la opción está marcada
      let insuredPersonId = null;
      
      if (formData.saveCustomerDetails) {
        const { data: insuredPerson, error: insuredError } = await supabase
          .from('insured_persons_asdl5678f')
          .insert({
            user_id: user.id,
            full_name: formData.customerName,
            email: formData.customerEmail,
            whatsapp: formData.customerWhatsApp,
            policy_number: formData.policyNumber,
            insurance: formData.insurance
          })
          .select()
          .single();
          
        if (insuredError) {
          console.error('Error al guardar asegurado:', insuredError);
        } else {
          insuredPersonId = insuredPerson.id;
        }
      }
      
      // 2. Crear el reclamo
      const serviceType = formData.serviceTypes.join(', ');
      
      const { data: claim, error: claimError } = await supabase
        .from('claims_asdl5678f')
        .insert({
          user_id: user.id,
          insured_person_id: insuredPersonId,
          claim_code: claimCode,
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_whatsapp: formData.customerWhatsApp,
          policy_number: formData.policyNumber,
          claim_type: formData.claimType,
          claim_initial_type: formData.claimInitialType || null,
          previous_claim_number: formData.previousClaimNumber || null,
          service_type: serviceType,
          status: 'Pendiente',
          insurance: formData.insurance,
          description: formData.description
        })
        .select()
        .single();
        
      if (claimError) {
        console.error('Error al crear reclamo:', claimError);
        throw new Error('Error al crear el reclamo');
      }
      
      // 3. Registrar la actividad
      await supabase
        .from('activity_logs_asdl5678f')
        .insert({
          claim_id: claim.id,
          user_id: user.id,
          type: 'creation',
          description: 'Reclamo creado'
        });
      
      // 4. Subir documentos al Storage
      const uploadPromises = [];
      
      // Procesar los documentos por sección
      for (const section in documents) {
        for (const doc of documents[section]) {
          if (doc.file) {
            const filePath = `${user.id}/${claim.id}/${section}/${doc.name}`;
            const { error: uploadError } = await supabase.storage
              .from('claims_documents')
              .upload(filePath, doc.file);
              
            if (uploadError) {
              console.error('Error al subir documento:', uploadError);
              continue;
            }
            
            // Obtener la URL del documento
            const { data: urlData } = supabase.storage
              .from('claims_documents')
              .getPublicUrl(filePath);
              
            const url = urlData?.publicUrl || '';
            
            // Registrar el documento en la base de datos
            const { error: docError } = await supabase
              .from('documents_asdl5678f')
              .insert({
                claim_id: claim.id,
                name: doc.name,
                type: doc.type || 'Documento',
                category: section,
                status: 'recibido',
                url: url
              });
              
            if (docError) {
              console.error('Error al registrar documento:', docError);
            }
          }
        }
      }
      
      alert('Reclamo creado exitosamente');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el reclamo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para generar un código de reclamo aleatorio
  const generateClaimCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // El resto del componente permanece igual
  // ...

  return (
    // El JSX existente se mantiene igual
    <Layout title="Crear Nuevo Reclamo">
      {/* ... */}
    </Layout>
  );
};

export default CreateClaim;