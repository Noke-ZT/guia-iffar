import { SafeAreaView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import EventoCard from "./componentes/EventoCard";
import { ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { supabase } from "./config/supabase";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';



export default function Eventos({navigation}) {
    const [eventos, setEventos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useFocusEffect(
        useCallback(() =>{
        async function buscarEventosComComentarios() {
                try {
                    // Buscar eventos
                    const { data: eventosData, error: eventosError } = await supabase
                        .from('eventos')
                        .select('*');
                    
                    if (eventosError) {
                        console.log('Erro ao buscar eventos:', eventosError);
                        return;
                    }

                    // Buscar comentários para cada evento
                    const eventosComComentarios = await Promise.all(
                        eventosData.map(async (evento) => {
                            // Contar comentários do evento
                            const { count, error: comentariosError } = await supabase
                                .from('comentarios_evento')
                                .select('*', { count: 'exact', head: true })
                                .eq('evento_id', evento.id);

                            if (comentariosError) {
                                console.log('Erro ao buscar comentários:', comentariosError);
                                return { ...evento, numeroComentarios: 0 };
                            }

                            return { ...evento, numeroComentarios: count || 0 };
                        })
                    );

                    setEventos(eventosComComentarios);
                } catch (error) {
                    console.log('Erro geral:', error);
                } finally {
                    setCarregando(false);
                }
            }

            buscarEventosComComentarios();
        }, [])
);

    return (
        
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
                    <Text style={styles.titulo}>
                        Eventos Acadêmicos
                    </Text>
                    <Button style={styles.botao} mode="contained" onPress={() => navigation.navigate('CadastroEvento')}>
                        Cadastrar Evento
                    </Button>
                    
                    {carregando && <ActivityIndicator animating/>}
                    {!carregando && eventos.length === 0 && <Text> Não Tem Registro</Text>}

                    {eventos.map((evento, index) => (
                        <EventoCard key={index} {...evento} 
                            onPress={()=>navigation.navigate('DetalheEvento', evento)}/>
                    ))
                    }


                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container:{
        padding: 20,  
    },
    titulo:{
        fontSize: 24,
        marginBottom: 30,
        textAlign: 'center',
    },
    botao:{
        marginVertical: 10,
    }
})