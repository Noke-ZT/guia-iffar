import { useNavigation} from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, StyleSheet } from "react-native";
import { ScrollView, Image, Platform, Pressable } from "react-native";
import { Button, Text, TextInput, RadioButton } from "react-native-paper";
import { useUsuario } from "./contexto/UsuarioContexto";
import { useState} from "react";
import { supabase } from "./config/supabase";

import * as ImagePicker from 'expo-image-picker';

export default function CadastroEvento() {
    const [titulo, setTitulo] = useState('');
    const [data, setData] = useState('');
    const [local, setLocal] = useState('');
    const [inscricao, setInscricao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [total_vagas, setTotalVagas] = useState('');
    const [vagas_disponiveis, setVagasDisponiveis] = useState('');
    
    const [carregando, setCarregando] = useState(false);

    const [fotoEventoUrl, setFotoEventoUrl] = useState(null);
    const [fotoLocal, setFotoLocal] = useState(null);
    const [carregandoFoto, setCarregandoFoto] = useState(false);
    

    const { perfil } = useUsuario();

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
            const nomeImagem = `eventos/foto_${Date.now()}.jpg`;

            const { error } = await supabase.storage
                .from('eventos')
                .upload(nomeImagem, blob);

            if (error) {
                console.log(error);
                Alert.alert('Erro ao enviar imagem');
                console.error(error);
            } else {
                const { data: { publicUrl } } = supabase
                    .storage
                    .from('eventos')
                    .getPublicUrl(nomeImagem);

                console.log(publicUrl);

                setFotoEventoUrl(publicUrl);
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

    const cadastrar = async () => {
        if (!titulo || !data || !local || !inscricao || !descricao || !total_vagas) {
            Alert.alert('Preencha todos os campos!');
            alert('Preencha todos os campos!');
            return;
        }

        if (perfil?.tipo !== 'aluno') {
            Alert.alert('Permissão negada', 'Apenas professores podem cadastrar eventos!');
            alert('Apenas professores podem cadastrar eventos!');
            return;
        }

        // Valida formato da data (DD/MM/YYYY)
        const dataRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dataRegex.test(data)) {
            Alert.alert('Erro', 'Formato de data inválido. Use DD/MM/YYYY');
            alert('Formato de data inválido. Use DD/MM/YYYY');
            return;
        }

        const [day, month, year] = data.split('/');
        const dataFormatada = `${year}-${month}-${day}`;

        // Valida total de vagas
        if (isNaN(total_vagas) || total_vagas < 10) {
            Alert.alert('Erro', 'O total de vagas deve ser um número maior ou igual a 10');
            alert('O total de vagas deve ser um número maior ou igual a 10');
            return;
        }
        // Valida inscrição
        if (inscricao !== 'aberta' && inscricao !== 'encerrada') {
            Alert.alert('Erro', 'Status de inscrição inválido. Use "aberta" ou "encerrada"');
            alert('Status de inscrição inválido. Use "aberta" ou "encerrada"');
            return;
        }

        setCarregando(true);

        try {
            const { error } = await supabase.from('eventos').insert([
                { 
                    titulo,
                    data: dataFormatada, // Data no formato ISO para o banco
                    local,
                    inscricao,
                    descricao,
                    total_vagas,
                    total_vagas: parseInt(total_vagas, 10),
                    vagas_disponiveis: parseInt(vagas_disponiveis, 10),
                    foto_url: fotoEventoUrl,
                }
            ]);
            
            if (error) {
                console.error('Erro ao cadastrar:', error);
                Alert.alert('Erro', `Falha ao cadastrar evento: ${error.message}`);
                alert(`Falha ao cadastrar evento: ${error.message}`);
                setCarregando(false);
                return;
            }
        
                
            navigation.navigate('Eventos');
            Alert.alert('Sucesso', 'Evento cadastrado com sucesso!');
            alert('Evento cadastrado com sucesso!');

            
        } catch (err) {
            console.error('Erro na operação:', err);
            Alert.alert('Erro', 'Ocorreu um erro ao processar sua solicitação');
            alert('Ocorreu um erro ao processar sua solicitação');
        } finally {
            setCarregando(false);
        }
    }


    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
            <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
                <Text style={styles.titulo}>
                    Cadastro de Eventos
                </Text>
                <TextInput 
                    label="Título" 
                    value={titulo} 
                    style={styles.input} 
                    onChangeText={setTitulo} 
                />
                <TextInput label="Data (DD/MM/YYYY)" value={data} style={styles.input} onChangeText={setData} placeholder="Ex: dia/mes/ano" keyboardType="numeric"/>
                <TextInput label="Local" value={local} style={styles.input} onChangeText={setLocal}/>
                    <Text style={{ marginBottom: 8 }}>Status da Inscrição</Text>
                    <RadioButton.Group onValueChange={setInscricao} value={inscricao}>
                        <RadioButton.Item label="Aberta" value="aberta" />
                        <RadioButton.Item label="Encerrada" value="encerrada" />
                    </RadioButton.Group>
                <TextInput label="Descrição" value={descricao} style={styles.input} onChangeText={setDescricao}/>
                <TextInput label="Total de Vagas" value={total_vagas} style={styles.input} onChangeText={(valor) => {
                    setTotalVagas(valor);
                    const num = parseInt(valor, 10);
                    if (!isNaN(num)) {
                        setVagasDisponiveis(num); // atualiza também as vagas disponíveis
                    } else {
                        setVagasDisponiveis('');
                    }
                }} 
                    placeholder="Mínimo de vagas 10" keyboardType="numeric"/>

                {/* Foto */}
                <Button mode="outlined" onPress={selecionarImagem} style={{ marginTop: 20 }}>
                    Adicionar Imagem do Evento
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

                <Button style={styles.botao} mode="contained" onPress={cadastrar} loading={carregando} disabled={carregando}>
                    Cadastrar
                </Button>
                <Button style={[styles.botao, styles.cancelarBtn]} mode="outlined" onPress={() => navigation.navigate('Eventos')} disabled={carregando}>
                    Cancelar
                </Button>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container:{
        padding: 20,  
    },
    titulo:{
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    botao:{
        marginTop: 10,
    },
    input: { marginBottom: 16 },
});