import { ScrollView, StyleSheet, TouchableOpacity, Alert, View } from "react-native";
import { Badge, Button, Card, Divider, Text, useTheme} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";
import { useUsuario } from "./contexto/UsuarioContexto";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./config/supabase";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FotosEvento from "./componentes/FotosEvento";
import ComentariosEvento from "./componentes/ComentariosEvento";
import LikesEvento from "./componentes/LikesEvento";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

export default function DetalheEvento({route, navigation}) {
    const Tab = createMaterialTopTabNavigator();
    const {
        titulo,
        data,
        local,
        inscricao,
        descricao,
        total_vagas,
        vagas_disponiveis,
        foto_url,
        id
    } = route.params;

    const { perfil } = useUsuario(); 
    const [isInscrito, setIsInscrito] = useState(false);
    const [carregando, setCarregando] = useState(true);

    const theme = useTheme();
        
    const corBadge = inscricao === "aberta" ? theme.colors.primary : "tomato";
    const textoBadge = inscricao === "aberta" ? "Incrições abertas" : "Encerradas";

    // SOLUÇÃO: Criar componentes wrapper que recebem o eventoId como prop
    const ComentariosWrapper = useCallback((props) => {
        return <ComentariosEvento {...props} route={{params: {eventoId: id}}} />;
    }, [id]);

    const LikesWrapper = useCallback((props) => {
        return <LikesEvento {...props} route={{params: {eventoId: id}}} />;
    }, [id]);

    const FotosWrapper = useCallback((props) => {
        return <FotosEvento {...props} route={{params: {eventoId: id, foto_url: foto_url}}} />;
    }, [id, foto_url]);

    useFocusEffect(
        useCallback(() => {
            const verificarInscricao = async () => {
                if (perfil?.id && id) {
                    setCarregando(true);
                    
                    const { data, error } = await supabase
                    .from('inscricoes')
                    .select('*')
                    .eq('usuario_id', perfil.id)
                    .eq('evento_id', id);

                    if (error) {
                        console.log("Erro ao verificar inscrição:", error.message);
                    }
                    setIsInscrito(data?.length > 0);
                    setCarregando(false);
                } else {
                    setCarregando(false);
                }
            };

            verificarInscricao();
        }, [perfil?.id, id])
    );

    const handleInscricao = async () => {
        if (!perfil?.id) {
            Alert.alert('Erro', 'Você precisa estar logado para se inscrever');
            return;
        }

        const inscricao = {
            usuario_id: perfil.id,
            evento_id: id,
            data: new Date().toISOString()
        };

        const { error: erroInscricao } = await supabase
            .from('inscricoes')
            .insert([inscricao]);

        if (erroInscricao) {
            Alert.alert('Erro ao se inscrever', erroInscricao.message);
            return;
        }

        const { error: erroHistorico } = await supabase
            .from('historico')
            .insert([{ ...inscricao, situacao: true }]); // true para inscrito

        if (erroHistorico) {
            console.log("Erro ao registrar no histórico:", erroHistorico.message);
        }

        setIsInscrito(true);
        Alert.alert('Sucesso', 'Você se inscreveu com sucesso no evento!');
    };

    const handleCancelamento = async () => {
        if (!perfil?.id) {
            Alert.alert('Erro', 'Você precisa estar logado para cancelar a inscrição');
            return;
        }

        const { error: erroDelete } = await supabase
            .from('inscricoes')
            .delete()
            .eq('usuario_id', perfil.id)
            .eq('evento_id', id);

        if (erroDelete) {
            Alert.alert('Erro ao cancelar inscrição', erroDelete.message);
            return;
        }

        const cancelamento = {
            usuario_id: perfil.id,
            evento_id: id,
            data: new Date().toISOString(),
            situacao: false // false para cancelado
        };

        const { error: erroHistorico } = await supabase
            .from('historico')
            .insert([cancelamento]);

        if (erroHistorico) {
            console.log("Erro ao registrar cancelamento no histórico:", erroHistorico.message);
        }

        setIsInscrito(false);
        Alert.alert('Sucesso', 'Sua inscrição foi cancelada!');
    };

    return(
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
            <ScrollView style={styles.container}>
                <Card mode="outlined" style={styles.card}>
                    <Card.Content>
                        {foto_url && (
                            <Card.Cover source={{ uri: foto_url }} 
                            style={styles.img}
                            />
                        )}
                        <Text style={{color:corBadge}} variant="titleLarge">
                            {titulo}
                        </Text>
                        <Badge style={[styles.badge, { backgroundColor: corBadge }]}>
                            {textoBadge}
                        </Badge>

                        <Divider style={styles.divisor}/>
                        <Badge style={{backgroundColor: 'blue'}}>Total de Vagas:{total_vagas} / Vagas restantes:{vagas_disponiveis}</Badge>

                        <Text variant="bodyMedium"> 🗓️Data: {format(data, "dd/MM/yyyy")} </Text>
                        <Text variant="bodyMedium"> 📍Local: {local} </Text>

                        <Divider style={styles.divisor}/>

                        <Text variant="titleSmall"> Descrição </Text>
                        <Text variant="bodyMedium"> {descricao} </Text>

                        <View style={{ height: 400 }}>
                            {/* Usar key única baseada no ID do evento para forçar remount */}
                            <Tab.Navigator key={`evento-tabs-${id}`}>
                                <Tab.Screen 
                                    name="Comentarios" 
                                    component={ComentariosWrapper}
                                    options={{
                                        tabBarIcon: ({color, size}) => (
                                            <MaterialCommunityIcons name="chat-outline" size={size} color={color}/>
                                        )
                                    }}
                                />
                                <Tab.Screen 
                                    name="Likes" 
                                    component={LikesWrapper}
                                    options={{
                                        tabBarIcon: ({color, size}) => (
                                            <MaterialCommunityIcons name="cards-heart-outline" size={size} color={color}/>
                                        )
                                    }}
                                />
                                <Tab.Screen 
                                    name="Fotos" 
                                    component={FotosWrapper}
                                    options={{
                                        tabBarIcon: ({color, size}) => (
                                            <MaterialCommunityIcons name="panorama-outline" size={size} color={color}/>
                                        )
                                    }}
                                />
                            </Tab.Navigator>
                        </View>
                    </Card.Content>
                </Card>
                
                {!carregando && vagas_disponiveis > 0 && perfil?.tipo === 'aluno' && (
                    isInscrito ? (
                        <Button mode="contained" style={{color: 'tomato'}} onPress={handleCancelamento}>
                            Cancelar Inscrição
                        </Button>
                    ) : (
                        <Button mode="contained" onPress={handleInscricao}>
                            Clique para se inscrever
                        </Button>
                    )
                )}
                {!carregando && vagas_disponiveis === 0 && perfil?.tipo === 'aluno' && (
                    isInscrito ? (
                        <Button mode="contained" style={{color: 'tomato'}} onPress={handleCancelamento}>
                            Cancelar Inscrição
                        </Button>
                    ) : (
                        <Text variant="bodyMedium" style={{color: 'red'}}>
                            Não há vagas disponíveis para este evento.
                        </Text>
                    )
                )}
                <Button mode="outlined" onPress={() => navigation.navigate('Eventos')}>
                    Voltar
                </Button>
            </ScrollView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 16,
    },
    card:{
        marginBottom: 15,
    },
    divisor:{
        marginVertical: 10,
    },
    badge:{
        color: 'white',
        paddingHorizontal: 10,
        fontSize: 12,
    },
    img:{
        width: 180,
        height: 200,
        marginBottom: 25,
        alignSelf: 'center',
        resizeMode: 'contain',
        backgroundColor: '#F4F4F4',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginTop: 15,
    }
})