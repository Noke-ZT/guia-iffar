import { LinearGradient } from "expo-linear-gradient";
import { Alert, Image, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

import { supabase } from "./config/supabase";
import { useUsuario } from "./contexto/UsuarioContexto";

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const { setUsuario, setPerfil } = useUsuario();

    const navigation = useNavigation();


    const fazerLogin = async () =>{
        setCarregando(true);
            //tabela Users do supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: senha,
            })

            if (error) {
                Alert.alert('Erro ao conectar:');
                alert('Erro ao conectar:' + error.message);
                setCarregando(false);
                return;
            }

            const user = data.user;

            if (user) {
                //buscar na nossa tabela
                const { data: perfilUsuario, error: erroPerfil } = await supabase.from('usuarios').select('*').eq('id', user.id).single();
                if(erroPerfil){
                    console.error('Erro de usuário:');
                    Alert.alert('Erro de usuário:');
                    alert('Erro de usuário:' + erroPerfil.message);
                    setCarregando(false);
                    return;
                }
            setUsuario(user);
            setPerfil(perfilUsuario);
            navigation.navigate('Home'); 
            }
            
    };
    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>

            <View style={styles.container}>
                
                <Image style={styles.imagem} source={require('../../assets/IFFar.png')}/>
                <TextInput label="E-mail" value={email} style={styles.input} onChangeText={setEmail} keyboardType="email-address"/>
                <TextInput label="Senha" value={senha} style={styles.input} onChangeText={setSenha} secureTextEntry/>
                <Button style={styles.botao} mode="contained"
                    onPress={fazerLogin}>
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