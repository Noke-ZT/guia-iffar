import React, { useState, useCallback, useEffect } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { Card, Text, TextInput, Button, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../config/supabase'; 
import { LinearGradient } from 'expo-linear-gradient';
import { useUsuario } from '../contexto/UsuarioContexto'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

export default function ComentariosEvento({route}) {
    const { eventoId } = route.params;
    const [comentarios, setComentarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [novoComentario, setNovoComentario] = useState("");
    const [eventoAtual, setEventoAtual] = useState(null);
    const { perfil } = useUsuario();

    // Função para buscar comentários
    const fetchComentarios = useCallback(async (forceRefresh = false) => {
        if (!eventoId) return;

        console.log('=== BUSCANDO COMENTÁRIOS ===');
        console.log('EventoId:', eventoId);
        console.log('Evento atual:', eventoAtual);
        console.log('Force refresh:', forceRefresh);
        
        // Se é o mesmo evento e não é um refresh forçado, não buscar novamente
        if (eventoAtual === eventoId && !forceRefresh) {
            console.log('Mesmo evento, pulando busca');
            return;
        }

        setCarregando(true);
        setComentarios([]);
        setEventoAtual(eventoId);
        
        try {
            const { data, error } = await supabase
                .from('comentarios_evento')
                .select('id, comentario, created_at, usuario_id, usuario:usuarios(nome)')
                .eq('evento_id', eventoId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log(`Encontrados ${data?.length || 0} comentários para evento ${eventoId}`);
            setComentarios(data || []);
        } catch (error) {
            console.error("Erro ao buscar comentários:", error.message);
            setComentarios([]);
        } finally {
            setCarregando(false);
        }
    }, [eventoId, eventoAtual]);

    // Detectar mudanças no eventoId
    useEffect(() => {
        console.log('=== EVENTO MUDOU ===');
        console.log('Novo eventoId:', eventoId);
        console.log('Evento anterior:', eventoAtual);
        
        if (eventoId !== eventoAtual) {
            setComentarios([]);
            setNovoComentario("");
            fetchComentarios(true);
        }
    }, [eventoId, eventoAtual, fetchComentarios]);

    // Carregar na primeira montagem
    useEffect(() => {
        if (!eventoAtual) {
            fetchComentarios(true);
        }
    }, [fetchComentarios, eventoAtual]);

    const handleAdicionarComentario = async () => {
        if (!novoComentario.trim()) return;

        try {
            const { data, error } = await supabase
                .from('comentarios_evento')
                .insert([{ 
                    comentario: novoComentario, 
                    evento_id: eventoId, 
                    usuario_id: perfil?.id 
                }])
                .select('id, comentario, created_at, usuario_id, usuario:usuarios(nome)')
                .single();

            if (error) throw error;

            setComentarios(prevComentarios => [data, ...prevComentarios]);
            setNovoComentario("");
        } catch (error) {
            console.error("Erro ao adicionar comentário:", error.message);
        }
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text variant="titleLarge">Comentários</Text>
            <Text variant="labelMedium" style={{ color: 'gray', marginBottom: 10 }}>
                Evento ID: {eventoId}
            </Text>
            <Divider style={{ marginVertical: 10 }} />
            
            {carregando ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : comentarios.length === 0 ? (
                <Text variant="bodyMedium" style={{ textAlign: 'center', marginVertical: 20 }}>
                    Nenhum comentário encontrado para este evento.
                </Text>
            ) : (
                comentarios.map((comentario) => (
                    <Card key={`${comentario.id}-${eventoId}`} style={{ marginBottom: 10 }}>
                        <Card.Content>
                            <Text variant="bodyMedium">{comentario.comentario}</Text>
                            <Text variant="labelMedium">
                                {comentario.usuario?.nome ?? 'Anônimo'} - {new Date(comentario.created_at).toLocaleString()}
                            </Text>
                        </Card.Content>
                    </Card>
                ))
            )}

            {perfil?.id && (
                <>
                    <TextInput
                        label="Novo comentário"
                        value={novoComentario}
                        onChangeText={setNovoComentario}
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        style={{ marginTop: 10 }}
                    />
                    <Button 
                        mode="contained" 
                        onPress={handleAdicionarComentario} 
                        style={{ marginTop: 10 }}
                        disabled={!novoComentario.trim()}
                    >
                        Adicionar Comentário
                    </Button>
                </>
            )}
        </ScrollView>
    );
}