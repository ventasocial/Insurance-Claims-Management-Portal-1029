import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';

const { FiTrash2, FiUser } = FiIcons;

const InsuredPersonsList = ({ onSelectPerson }) => {
  const [insuredPersons, setInsuredPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInsuredPersons = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('insured_persons_asdl5678f')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching insured persons:', error);
          return;
        }

        setInsuredPersons(data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsuredPersons();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('insured_persons_asdl5678f')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting insured person:', error);
        return;
      }

      setInsuredPersons(prev => prev.filter(person => person.id !== id));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Asegurados Guardados</h3>
      {insuredPersons.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay asegurados guardados</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {insuredPersons.map((person) => (
            <div key={person.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <div className="flex justify-between items-start">
                <button onClick={() => onSelectPerson(person)} className="flex-1 text-left">
                  <div className="flex items-center space-x-2 mb-2">
                    <SafeIcon icon={FiUser} className="w-5 h-5 text-primary" />
                    <span className="font-medium text-gray-900">{person.full_name}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Email: {person.email}</p>
                    <p>WhatsApp: {person.whatsapp}</p>
                    <p>Póliza: {person.policy_number}</p>
                    <p>Aseguradora: {person.insurance}</p>
                  </div>
                </button>
                <button onClick={() => handleDelete(person.id)} className="text-red-500 hover:text-red-700 transition-colors p-1">
                  <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsuredPersonsList;