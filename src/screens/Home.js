import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Home({navigation}) {
    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>

            <View style={styles.container}>
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
                <Button style={styles.botao} mode="outlined"
                    onPress={() => navigation.navigate('Sobre')}>
                    Sobre o app
                </Button>
                <Button style={styles.botao} mode="outlined">
                    Sair
                </Button>
            </View>

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
        marginBottom: 30,
        textAlign: 'center',
    },
    botao:{
        marginVertical: 10,
    },
    imagem:{
        width: 180,
        height: 200,
        marginBottom: 30,
        alignSelf: 'center',
        resizeMode: 'contain',
        backgroundColor: '#F4F4F4',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
})