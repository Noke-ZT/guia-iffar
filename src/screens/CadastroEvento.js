import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useUsuario } from "./contexto/UsuarioContexto";
import { useState } from "react";
import { supabase } from "./config/supabase";

export default function CadastroEvento() {
    const [titulo, setTitulo] = useState('');
    const [data, setData] = useState('');
    const [local, setLocal] = useState('');
    const [inscricao, setInscricao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [carregando, setCarregando] = useState(false);

    const { perfil } = useUsuario();

    const navigation = useNavigation();

    const cadastrar = async () => {
        if (!titulo || !data || !local || !inscricao || !descricao) {
            Alert.alert('Preencha todos os campos!');
            return;
        }

        if (perfil?.tipo !== 'professor') {
            Alert.alert('Permissão negada', 'Apenas professores podem cadastrar eventos!');
            alert('Apenas professores podem cadastrar eventos!');
            return;
        }

        // Valida formato da data (DD/MM/YYYY)
        const dataRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dataRegex.test(data)) {
            Alert.alert('Erro', 'Formato de data inválido. Use DD/MM/YYYY');
            return;
        }

        const [day, month, year] = data.split('/');
        const dataFormatada = `${year}-${month}-${day}`;

        setCarregando(true);

        try {
            const { error } = await supabase.from('eventos').insert([
                { 
                    titulo,
                    data: dataFormatada, // Data no formato ISO para o banco
                    local,
                    inscricao,
                    descricao,
                }
            ]);
            
            if (error) {
                console.error('Erro ao cadastrar:', error);
                Alert.alert('Erro', `Falha ao cadastrar evento: ${error.message}`);
                setCarregando(false);
                return;
            }
            
            Alert.alert('Sucesso', 'Evento cadastrado com sucesso!', [
                { 
                    text: 'OK', 
                    onPress: () => navigation.navigate('Eventos')
                }
            ]);
        } catch (err) {
            console.error('Erro na operação:', err);
            Alert.alert('Erro', 'Ocorreu um erro ao processar sua solicitação');
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
                <TextInput label="Data (DD/MM/YYYY)" value={data} style={styles.input} onChangeText={setData} placeholder="Ex: 00/00/0000" keyboardType="numeric"/>
                <TextInput label="Local" value={local} style={styles.input} onChangeText={setLocal}/>
                <TextInput label="Inscrição" value={inscricao} style={styles.input} onChangeText={setInscricao}/>
                <TextInput label="Descrição" value={descricao} style={styles.input} onChangeText={setDescricao}/>
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