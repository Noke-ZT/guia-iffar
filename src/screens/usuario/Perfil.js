import { Alert, Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { useUsuario } from "../contexto/UsuarioContexto";
import { useCallback, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { supabase } from "../config/supabase";


export default function Perfil({navigation}) {
    const { perfil, user, recarregarDados } = useUsuario();
    const [nome, setNome] = useState(perfil?.nome || "");
    const [email, setEmail] = useState(user?.email || "");
    const [fotoLocal, setFotoLocal] = useState(null);
    const [carregandoFoto, setCarregandoFoto] = useState(false);

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
        if (!user?.id) {
            Alert.alert('Erro', 'Usuário não identificado');
            return;
        }

        setCarregandoFoto(true);
        try {
        // Remove a imagem antiga se existir
        const urlAntiga = perfil?.foto_url;
        if (urlAntiga) {
            try {
                
                const partesUrl = urlAntiga.split('/');
                const indicePublic = partesUrl.indexOf('public');
                
                if (indicePublic !== -1 && partesUrl.length > indicePublic + 1) {

                    const caminhoCompleto = partesUrl.slice(indicePublic + 1).join('/');
                    const caminhoImagem = caminhoCompleto.startsWith('usuarios/') 
                        ? caminhoCompleto.substring('usuarios/'.length) 
                        : caminhoCompleto;
                    
                    console.log('URL completa:', urlAntiga);
                    console.log('Caminho completo extraído:', caminhoCompleto);
                    console.log('Caminho final para remoção:', caminhoImagem);
                    
                    const { error: erroRemover, data: dataRemover } = await supabase.storage
                        .from('usuarios')
                        .remove([caminhoImagem]);

                    console.log('Resultado da remoção:', { error: erroRemover, data: dataRemover });

                    if (erroRemover) {
                        console.log('Erro ao remover imagem antiga:', erroRemover);

                        console.log('Tentando com caminho completo...');
                        const { error: erroRemover2 } = await supabase.storage
                            .from('usuarios')
                            .remove([caminhoCompleto]);
                        
                        if (erroRemover2) {
                            console.log('Erro também com caminho completo:', erroRemover2);
                        } else {
                            console.log('Sucesso com caminho completo!');
                        }
                    } else {
                        console.log('Imagem antiga removida com sucesso');
                    }
                } else {
                    console.log('Não foi possível extrair o caminho da URL:', urlAntiga);
                }
            } catch (err) {
                console.log('Erro ao processar remoção da imagem antiga:', err);
            }
        }
            // Faz o upload da nova imagem
            const resposta = await fetch(uri);
            const blob = await resposta.blob();
            const nomeImagem = `usuarios/foto_${user.id}_${Date.now()}.jpg`;

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

                // Atualiza a foto no banco de dados
                const { error: erroUpdate } = await supabase
                    .from('usuarios')
                    .update({ foto_url: publicUrl })
                    .eq('id', user.id);

                if (erroUpdate) {
                    console.error('Erro ao atualizar foto no perfil:', erroUpdate);
                    Alert.alert('Erro ao atualizar foto do perfil');
                } else {
                    Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
                    // Recarrega os dados para mostrar a nova foto
                    await recarregarDados();
                }
            }
        } catch (err) {
            console.error('Erro no envio da imagem:', err);
            Alert.alert('Erro', 'Falha ao processar a imagem');
        } finally {
            setCarregandoFoto(false);
        }
    };

    const selecionarImagem = () => {
        Alert.alert('Alterar Foto de Perfil',
            'Escolha a origem da imagem:',
            [
                { text: 'Câmera', onPress: tirarFoto },
                { text: 'Galeria', onPress: escolherDaGaleria },
                { text: 'Cancelar', style: 'cancel' },
            ]);
    };

    // Determina qual imagem mostrar (local recém selecionada ou do perfil)
    const imagemParaMostrar = fotoLocal || perfil?.foto_url;

    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
            <Card style={styles.card} mode="outlined">
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.titulo}>
                            Foto Perfil
                        </Text>
                        {imagemParaMostrar ? (
                            <TouchableOpacity onPress={selecionarImagem} style={styles.containerImagem}>
                                <Image 
                                    source={{ uri: imagemParaMostrar }} 
                                    style={styles.imagem}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={selecionarImagem} style={styles.containerSemFoto}>
                                <Text variant="bodyMedium" style={styles.semFoto}>
                                    Nenhuma foto encontrada
                                </Text>
                            </TouchableOpacity>
                        )}
                        
                        {/* Botão adicional para alterar foto */}
                        <Button 
                            mode="outlined" 
                            onPress={selecionarImagem} 
                            style={styles.botaoAlterarFoto}
                            loading={carregandoFoto}
                            disabled={carregandoFoto}
                        >
                            {carregandoFoto ? 'Enviando...' : 'Alterar Foto'}
                        </Button>

                        {/* Input para web */}
                        {Platform.OS === 'web' && (
                            <input
                                type="file"
                                accept="image/*"
                                style={{ marginTop: 10 }}
                                onChange={(event) => {
                                    const file = event.target.files[0];
                                    if (file) {
                                        const uri = URL.createObjectURL(file);
                                        setFotoLocal(uri);
                                        uploadFoto(uri);
                                    }
                                }}
                            />
                        )}
                    </Card.Content>
                </Card>
            
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