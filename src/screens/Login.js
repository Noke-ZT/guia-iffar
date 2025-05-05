import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

import { supabase } from "./config/supabase";

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const navigation = useNavigation();

    const entrar = async () =>{
            if(!email || !senha){
                alert('Preencha todos os campos!');
                return;
            }
            setCarregando(true);
    
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: senha,
              });
            if (error) {
                console.error('Erro ao conectar:', error);
                alert('Erro ao conectar:', error.message);
                setCarregando(false);
                return;
            }

            const idUser = data.user?.id;

            if (idUser) {
                const {error: erroUsuario} = await supabase.from('usuarios').from('usuarios').select().eq('id', idUser).single();
                if(erroUsuario){
                    console.error('Erro ao cadastrar usuário:', erroUsuario);
                    alert('Erro ao cadastrar usuário:', erroUsuario.message);
                }
                else{
                    alert('Usuário cadastrado com sucesso!');
                    navigation.navigate('Login');
                }
            }
                setCarregando(false);
            alert('Login realizado com sucesso!');
            setCarregando(false);
            navigation.navigate('Home');
    };
    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>

            <View style={styles.container}>
                
                <Image style={styles.imagem} source={require('../../assets/IFFar.png')}/>
                <TextInput label="E-mail" value={email} style={styles.input} onChangeText={setEmail} keyboardType="email-address"/>
                <TextInput label="Senha" value={senha} style={styles.input} onChangeText={setSenha} secureTextEntry/>
                <Button style={styles.botao} mode="contained"
                    onPress={entrar}>
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