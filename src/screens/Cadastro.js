import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { supabase } from "./config/supabase";
import { Platform } from "react-native";
import { Alert } from "react-native";

import * as ImagePicker from 'expo-image-picker';


export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [fotoPerfilUrl, setFotoPerfilUrl] = useState(null);
    const [fotoLocal, setFotoLocal] = useState(null);
    const [carregandoFoto, setCarregandoFoto] = useState(false);
    
    const [carregando, setCarregando] = useState(false);

    const navigation = useNavigation();

    // Funções para seleção e upload da foto
        const tirarFoto = async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão da câmera negada...');
                return;
            }
    
            const resultado = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });
    
            if (!resultado.canceled) {
                const imagem = resultado.assets[0];
                setFotoLocal(imagem.uri);
                await uploadFoto(imagem.uri);
            }
        };

        const escolherDaGaleria = async () => {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permissão negada...');
                    return;
                }
        
                const resultado = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.7,
                });
        
                if (!resultado.canceled) {
                    const imagem = resultado.assets[0];
                    setFotoLocal(imagem.uri);
                    await uploadFoto(imagem.uri);
                }
            };

            const uploadFoto = async (uri) => {
                    setCarregandoFoto(true);
                    try {
                        const resposta = await fetch(uri);
                        const blob = await resposta.blob();
                        const nomeImagem = `usuarios/foto_${Date.now()}.jpg`;
            
                        const { error } = await supabase.storage
                            .from('usuarios')
                            .upload(nomeImagem, blob);
            
                        if (error) {
                            console.log(error);
                            Alert.alert('Erro ao enviar imagem');
                            console.error(error);
                        } else {
                            const { data: { publicUrl } } = supabase
                                .storage
                                .from('usuarios')
                                .getPublicUrl(nomeImagem);
            
                            console.log(publicUrl);
            
                            setFotoPerfilUrl(publicUrl);
                        }
                    } catch (err) {
                        console.error('Erro no envio da imagem:', err);
                    }
                    finally {
                        setCarregandoFoto(false);
                    }
                };

                const selecionarImagem = () => {
                        Alert.alert('Adicionar Imagem',
                            'Escolha a origem da imagem:',
                            [
                                { text: 'Câmera', onPress: tirarFoto },
                                { text: 'Galeria', onPress: escolherDaGaleria },
                                { text: 'Cancelar', style: 'cancel' },
                            ]);
                    };
  
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
                {id, nome, tipo: 'aluno', foto_url: fotoPerfilUrl}
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

            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
                
                <Image style={styles.imagem} source={require('../../assets/IFFar.png')}/>
                <TextInput label="Nome Completo" value={nome} style={styles.input} onChangeText={setNome}/>
                <TextInput label="E-mail" value={email} keyboardType="email-address" autoCapitalize="none" style={styles.input} onChangeText={setEmail}/>
                <TextInput label="Senha" value={senha} secureTextEntry style={styles.input} onChangeText={setSenha}/>
                {/* Foto */}
                    <Button mode="outlined" onPress={selecionarImagem} style={{ marginTop: 20 }}>
                        Adicionar Foto de Perfil
                    </Button>
                
                    {Platform.OS === 'web' && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    const uri = URL.createObjectURL(file);
                                    setFotoLocal(uri);
                                    uploadFoto(uri);
                                }
                            }}/>
                        )
                    }
                
                    {fotoLocal && (
                        <Image
                            source={{ uri: fotoLocal }}
                            style={{ width: 200, height: 200, borderRadius: 10, marginTop: 10 }}
                        />
                    )}
                                
                {/* Fim da Foto */}
                <Button style={styles.botao} mode="contained" onPress={cadastrar} loading={carregando}>
                    Cadastrar
                </Button>
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}> Já tenho conta </Text>
                </ScrollView>
            </SafeAreaView>

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