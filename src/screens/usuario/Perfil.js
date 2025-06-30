import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { useUsuario } from "../contexto/UsuarioContexto";
import { useCallback, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";


export default function Perfil({navigation}) {
    const { perfil, user, recarregarDados } = useUsuario();
    const [nome, setNome] = useState(perfil?.nome || "");
    const [email, setEmail] = useState(user?.email || "");

    // Recarrega dados sempre que a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            const refresh = async () => {
                await recarregarDados();
            };
            refresh();
        }, [recarregarDados])
    );

    // Atualiza os states quando perfil/user mudarem
    useEffect(() => {
        setNome(perfil?.nome || "");
        setEmail(user?.email || "");
    }, [perfil, user]);

    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
            {perfil?.foto_url ? (
                <Card style={styles.card} mode="outlined">
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.titulo}>
                            Foto Perfil
                        </Text>
                        <Image 
                            source={{ uri: perfil.foto_url }} 
                            style={styles.imagem}
                            resizeMode="contain"
                        />
                    </Card.Content>
                </Card>
            ) : (
                <Card style={styles.card} mode="outlined">
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.titulo}>
                            Foto Perfil
                        </Text>
                        <Text variant="bodyMedium" style={styles.semFoto}>
                            Nenhuma foto encontrada
                        </Text>
                    </Card.Content>
                </Card>
            )}
            
                    <Text variant="titleMedium" style={styles.titulo}>
                        Informações do Perfil
                    </Text>

                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Nome:</Text>
                    <TextInput
                        value={nome}
                        mode="outlined"
                        disabled
                        style={styles.inputDesativado}
                    />
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.label}>E-mail:</Text>
                    <TextInput
                        value={email}
                        mode="outlined"
                        disabled
                        style={styles.inputDesativado}
                    />
                </View>
                <Button style={styles.botao} mode="contained" onPress={() => navigation.navigate('AlterarPerfil')}>
                    Alterar Dados
                </Button>
        </ScrollView>
        </LinearGradient>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 15,
    },
    titulo: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    imagem: {
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
    },
    semFoto: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
    },
    labelContainer: {
        marginTop: 12,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    valor: {
        fontSize: 16,
        paddingVertical: 4,
    },
    input: {
        marginTop: 4,
    },
    botao:{
        marginTop: 10,
        marginBottom: 50,
    },
    inputDesativado: {
        backgroundColor: '#f0f0f0',
    },
});