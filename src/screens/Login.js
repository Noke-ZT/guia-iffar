import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function Login() {
    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>

            <View style={styles.container}>
                
                <Image style={styles.imagem} source={require('../../assets/IFFar.png')}/>
                <TextInput label="E-mail" style={styles.input} />
                <TextInput label="Senha" style={styles.input} />
                <Button style={styles.botao} mode="contained"
                    onPress={() => navigation.navigate('Home')}>
                    Entrar
                </Button>
                <Text style={styles.link} onPress={() => navigation.navigate('Cadastro')}> Ainda não teenho conta </Text>
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
        marginBottom: 25,
        alignSelf: 'center',
        resizeMode: 'contain',
        backgroundColor: '#F4F4F4',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    link:{
        color: 'green',
    },
    input: { marginBottom: 16 },
})