import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useUsuario } from "./contexto/UsuarioContexto";

export default function Home({navigation}) {
    const {usuario, perfil, logout} = useUsuario();

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
                    <Image style={styles.imagem} source={require('../../assets/IFFar.png')}/>
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