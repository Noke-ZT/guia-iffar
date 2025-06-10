import React, { useState, useCallback } from 'react';
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
    const { perfil } = useUsuario();

    useFocusEffect(
        useCallback(() => {
            const fetchComentarios = async () => {
                setCarregando(true);
                try {
                    const { data, error } = await supabase
                        .from('comentarios_evento')
                        .select('*')
                        .eq('evento_id', eventoId)
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    setComentarios(data);
                } catch (error) {
                    console.error("Erro ao buscar comentários:", error.message);
                } finally {
                    setCarregando(false);
                }
            };

            fetchComentarios();
        }, [eventoId])
    );

    const handleAdicionarComentario = async () => {
        if (!novoComentario.trim()) return;

        try {
            const { data, error } = await supabase
                .from('comentarios_evento')
                .insert([{ comentario: novoComentario, evento_id: eventoId, usuario_id: perfil?.id }])
                .select()
                .single();

            if (error) throw error;

            setComentarios([data, ...comentarios]);
            setNovoComentario("");
        } catch (error) {
            console.error("Erro ao adicionar comentário:", error.message);
        }
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text variant="titleLarge">Comentários</Text>
            <Divider style={{ marginVertical: 10 }} />
            
            {carregando ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                comentarios.map((comentario) => (
                    <Card key={comentario.id} style={{ marginBottom: 10 }}>
                        <Card.Content>
                            <Text variant="bodyMedium">{comentario.comentario}</Text>
                            <Text variant="labelMedium">{new Date(comentario.created_at).toLocaleString()}</Text>
                        </Card.Content>
                    </Card>
                ))
            )}

            <TextInput
                label="Novo comentário"
                value={novoComentario}
                onChangeText={setNovoComentario}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={{ marginTop: 10 }}
            />
            <Button mode="contained" onPress={handleAdicionarComentario} style={{ marginTop: 10 }}>
                Adicionar Comentário
            </Button>
        </ScrollView>
    );
}

