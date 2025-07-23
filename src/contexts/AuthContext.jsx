import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Verificar si el perfil existe, si no, crearlo (para usuarios de Google)
          let userData = null;
          
          const { data: existingUser } = await supabase
            .from('user_profiles_asdl5678f')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (existingUser) {
            userData = existingUser;
          } else if (session.user.app_metadata.provider === 'google') {
            // Usuario de Google sin perfil, crear uno
            const names = session.user.user_metadata.full_name.split(' ');
            const firstName = names[0] || '';
            const paternalLastName = names.length > 1 ? names[1] : '';
            const maternalLastName = names.length > 2 ? names.slice(2).join(' ') : '';
            
            const { data: newUser, error } = await supabase
              .from('user_profiles_asdl5678f')
              .insert({
                id: session.user.id,
                first_name: firstName,
                paternal_last_name: paternalLastName,
                maternal_last_name: maternalLastName,
                email: session.user.email,
                role: 'client', // Por defecto es cliente
                status: 'active',
              })
              .select()
              .single();
              
            if (error) {
              console.error('Error al crear perfil de usuario:', error);
            } else {
              userData = newUser;
            }
          }
          
          if (userData) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: `${userData.first_name} ${userData.paternal_last_name} ${userData.maternal_last_name}`.trim(),
              firstName: userData.first_name,
              paternalLastName: userData.paternal_last_name,
              maternalLastName: userData.maternal_last_name,
              whatsapp: userData.whatsapp,
              role: userData.role
            });
          }
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Verificar si el usuario tiene un perfil, si no, crearlo (para usuarios de Google)
        let userData = null;
        
        const { data: existingUser } = await supabase
          .from('user_profiles_asdl5678f')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (existingUser) {
          userData = existingUser;
          
          // Actualizar último acceso
          await supabase
            .from('user_profiles_asdl5678f')
            .update({ last_login: new Date().toISOString() })
            .eq('id', session.user.id);
        } else if (session.user.app_metadata.provider === 'google') {
          // Usuario de Google sin perfil, crear uno
          const names = session.user.user_metadata.full_name.split(' ');
          const firstName = names[0] || '';
          const paternalLastName = names.length > 1 ? names[1] : '';
          const maternalLastName = names.length > 2 ? names.slice(2).join(' ') : '';
          
          const { data: newUser, error } = await supabase
            .from('user_profiles_asdl5678f')
            .insert({
              id: session.user.id,
              first_name: firstName,
              paternal_last_name: paternalLastName,
              maternal_last_name: maternalLastName,
              email: session.user.email,
              role: 'client', // Por defecto es cliente
              status: 'active',
              last_login: new Date().toISOString()
            })
            .select()
            .single();
            
          if (error) {
            console.error('Error al crear perfil de usuario:', error);
          } else {
            userData = newUser;
          }
        }
        
        if (userData) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: `${userData.first_name} ${userData.paternal_last_name} ${userData.maternal_last_name}`.trim(),
            firstName: userData.first_name,
            paternalLastName: userData.paternal_last_name,
            maternalLastName: userData.maternal_last_name,
            whatsapp: userData.whatsapp,
            role: userData.role
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Los datos del usuario se configuran en el efecto de onAuthStateChange
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al iniciar sesión' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/#/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      return { success: false, error: 'Error al iniciar sesión con Google' };
    }
  };

  const updateUserProfile = async (updatedUserData) => {
    try {
      const { error } = await supabase
        .from('user_profiles_asdl5678f')
        .update({
          first_name: updatedUserData.firstName,
          paternal_last_name: updatedUserData.paternalLastName,
          maternal_last_name: updatedUserData.maternalLastName,
          email: updatedUserData.email,
          whatsapp: updatedUserData.whatsapp
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error al actualizar el perfil:', error);
        return { success: false, error: error.message };
      }

      setUser(updatedUserData);
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      return { success: false, error: 'Error al actualizar el perfil' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const value = {
    user,
    login,
    signInWithGoogle,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};