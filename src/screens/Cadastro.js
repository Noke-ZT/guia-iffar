import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { supabase } from "./config/supabase";


export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const navigation = useNavigation();
  
    const cadastrar = async () =>{
        if(!nome || !email || !senha){
            alert('Preencha todos os campos!');
            return;
        }
        setCarregando(true);

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: senha,
          });
      
            if (error) {
                console.error('Erro ao cadastrar:', error);
                alert('Erro ao cadastrar:', error.message);
                setCarregando(false);
                return;
            }
          
        const id = data.user?.id;

        if (id) {
            const {error: erroUsuario} = await supabase.from('usuarios').insert([
                {id, nome, tipo: 'aluno'}
            ]);
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
            };
    
    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>

            <View style={styles.container}>
                
                <Image style={styles.imagem} source={require('../../assets/IFFar.png')}/>
                <TextInput label="Nome Completo" value={nome} style={styles.input} onChangeText={setNome}/>
                <TextInput label="E-mail" value={email} keyboardType="email-address" autoCapitalize="none" style={styles.input} onChangeText={setEmail}/>
                <TextInput label="Senha" value={senha} secureTextEntry style={styles.input} onChangeText={setSenha}/>
                <Button style={styles.botao} mode="contained" onPress={cadastrar} loading={carregando}>
                    Cadastrar
                </Button>
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}> Já tenho conta </Text>
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