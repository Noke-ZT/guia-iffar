import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../config/supabase";

const UsuarioContext = createContext();

export const UsuarioProvider = ({children}) => {
    const [usuario, setUsuario] = useState(null);
    const [ perfil, setPerfil] = useState(null);
    const [user, setUser] = useState(null);

    const [carregando, setCarregando] = useState(true);

     // Função para recarregar os dados do usuário autenticado
    const recarregarDados = async () => {
        try {
            // Recarrega dados do auth
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userData?.user) {
                setUser(userData.user);
            }

            
        
            if (userData?.user?.id) {
                const { data: usuarioData, error: usuarioError } = await supabase
                    .from('usuarios')
                    .select('*')
                    .eq('id', userData.user.id) 
                    .single();
                
                if (usuarioData && !usuarioError) {
                    setPerfil(usuarioData); 
                }
            }
        } catch (error) {
            console.error('Erro ao recarregar dados:', error);
        }
    };

    useEffect(() => {
        const carregarUsuario = async () => {
            setCarregando(true);
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) {
                setUser(data.user);
            }
            setCarregando(false);
        };

        carregarUsuario();

        // Escuta mudanças de autenticação
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        setUsuario(null);
        setPerfil(null);
        setUser(null);
    }
    return (
        <UsuarioContext.Provider
            value={{
                user,
                setUser,
                usuario, 
                setUsuario, 
                perfil, 
                setPerfil, 
                carregando, 
                setCarregando,
                recarregarDados,
                logout
            }}
        >
            {children}
        </UsuarioContext.Provider>
    );
};

export const useUsuario = () => useContext(UsuarioContext);