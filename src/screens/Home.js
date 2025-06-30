import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useUsuario } from "./contexto/UsuarioContexto";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function Home({navigation}) {
    const {usuario, perfil, logout, recarregarDados} = useUsuario();

    // Recarrega dados sempre que a tela ganha foco para atualizar foto e nome
    useFocusEffect(
        useCallback(() => {
            if (usuario) {
                const refresh = async () => {
                    await recarregarDados();
                };
                refresh();
            }
        }, [usuario, recarregarDados])
    );

    const sair = async ()=> {
        await logout();
        navigation.navigate('Login');
    }

    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
            <ScrollView style={{flex: 1}}>
                <View style={styles.container}>
                    <Text style={styles.nick} >
                        Olá, {perfil?.nome || "Visitante"}
                    </Text>
                    
                    {/* Mostra foto do perfil se existir e usuário logado, senão mostra logo */}
                    {usuario && perfil?.foto_url ? (
                        <Image 
                            style={styles.imagem} 
                            source={{ uri: perfil.foto_url }}
                            resizeMode="cover"
                        />
                    ) : (
                        <Image 
                            style={styles.imagem} 
                            source={require('../../assets/IFFar.png')}
                        />
                    )}
                    <Text style={styles.titulo}>
                        Guia Acadêmico IFFar Panambi
                    </Text>
                    <Button style={styles.botao} mode="contained"
                        onPress={() => navigation.navigate('Cursos')}>
                        Ver Cursos
                    </Button>
                    <Button style={styles.botao} mode="contained"
                        onPress={() => navigation.navigate('Eventos')}>
                        Ver Eventos
                    </Button>
                    <Button style={styles.botao} mode="contained"
                        onPress={() => navigation.navigate('Login')}>
                        Login
                    </Button>
                    <Button style={styles.botao} mode="contained"
                        onPress={() => navigation.navigate('Cadastro')}>
                        Cadastro
                    </Button>
                    {usuario &&(
                        <Button style={styles.botao} mode="contained"
                        onPress={() => navigation.navigate('HistoricoEventos')}>
                        Histórico
                        </Button>
                    )}
                    <Button style={styles.botao} mode="outlined"
                        onPress={() => navigation.navigate('Sobre')}>
                        Sobre o app
                    </Button>
                    {usuario &&(
                        <Button style={styles.botao} mode="outlined" onPress={sair}>
                            Sair
                        </Button> 
                    )}
                    
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        padding: 20,  
    },
    titulo:{
        fontSize: 24,
        marginBottom: 0,
        textAlign: 'center',
    },
    nick:{
        fontSize: 24,
        marginTop: 5,
        textAlign: 'center',
    },
    botao:{
        marginVertical: 10,
    },
    imagem:{
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
})