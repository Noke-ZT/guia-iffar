import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from "./config/supabase";
import { useUsuario } from "./contexto/UsuarioContexto";
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';

export default function CadastroCurso() {
  const { perfil } = useUsuario();
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [nivel, setNivel] = useState('');
  const [turno, setTurno] = useState('');
  const [unidade, setUnidade] = useState('');
  const [duracao, setDuracao] = useState('');
  const [descricao, setDescricao] = useState('');
   const [carregando, setCarregando] = useState(false);

  const [arquivoUrl, setArquivoUrl] = useState(null);

  const selecionarArquivo = async () => {
        try {
            const resultado = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
            });

            console.log('Resultado do picker:', resultado);

            // Verifica se existe arquivos
            if (resultado.assets && resultado.assets.length > 0) {
                console.log('Arquivo selecionado');

                // Acessa o primeiro registro
                const { uri, name } = resultado.assets[0];

                // Converte o URI para blob
                const resposta = await fetch(uri);
                const blob = await resposta.blob();

                // Define o caminho no storage
                const caminho = `cursos/${Date.now()}_${name}`;

                // Faz o upload para o supabase
                const { data, error } = await supabase
                    .storage
                    .from('cursos')
                    .upload(caminho, blob);

                if (error) {
                    Alert.alert('Erro', 'Falha ao enviar o PDF.');
                    console.error('Erro no upload:', error);
                } else {
                    // Obtém a URL pública
                    const { data: { publicUrl } } = supabase
                        .storage
                        .from('cursos')
                        .getPublicUrl(caminho);

                    setArquivoUrl(publicUrl);
                    console.log(publicUrl);
                }
            }
        } catch (error) {
            console.error('Erro ao selecionar arquivo:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao selecionar o arquivo.');
        }
    };


  const salvarCurso = async () => {
    if (!nome || !modalidade || !nivel || !turno || !unidade || !duracao || !descricao) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos principais.');
      return;
    }

    const { error } = await supabase.from('cursos').insert([
      {
        nome,
        modalidade,
        nivel,
        turno,
        unidade,
        duracao,
        descricao,
        arquivo_url: arquivoUrl,
      }
    ]);

    if (error) {
      Alert.alert('Erro ao salvar', error.message);
    } else {
      Alert.alert('Sucesso', 'Curso cadastrado!');
      navigation.navigate('Cursos');
    }
  };
  

  if (perfil?.tipo !== 'aluno') {
    return (
      <View style={styles.bloqueado}>
        <Text variant="titleLarge">⛔ Acesso restrito</Text>
        <Text>Esta funcionalidade é exclusiva para administradores.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Novo Curso</Text>

      <TextInput label="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput label="Modalidade" value={modalidade} onChangeText={setModalidade} style={styles.input} />
      <TextInput label="Nível" value={nivel} onChangeText={setNivel} style={styles.input} />
      <TextInput label="Turno" value={turno} onChangeText={setTurno} style={styles.input} />
      <TextInput label="Unidade" value={unidade} onChangeText={setUnidade} style={styles.input} />
      <TextInput label="Duração" value={duracao} onChangeText={setDuracao} style={styles.input} />
      <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} multiline style={styles.input} />
        <Button mode="outlined" onPress={selecionarArquivo} style={styles.input}>
            Selecionar PDF do Curso
        </Button>
      {arquivoUrl && (
        <Text variant="bodyMedium" style={{ marginTop: 10 }}>
          PDF selecionado: {arquivoUrl}
        </Text>
      )}


      <Button style={styles.botao} mode="contained" onPress={salvarCurso} loading={carregando} disabled={carregando}>
        Salvar Curso
      </Button>
      <Button style={[styles.botao, styles.cancelarBtn]} mode="outlined" onPress={() => navigation.navigate('Cursos')} disabled={carregando}>
        Cancelar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  titulo: { marginBottom: 16 },
  input: { marginBottom: 12 },
  bloqueado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  botao:{
        marginTop: 10,
    },
});
