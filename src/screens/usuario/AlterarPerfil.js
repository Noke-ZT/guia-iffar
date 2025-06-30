import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { useUsuario } from "../contexto/UsuarioContexto";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../config/supabase";


export default function AlterarPerfil() {
    const { perfil, user } = useUsuario();
    const [nome, setNome] = useState(perfil?.nome || "");
    const [email, setEmail] = useState(user?.email || "");
    const [senha, setSenha] = useState(user?.password || "");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const navigation = useNavigation();

    const atualizarDados = async () => {
        const userId = user?.id;

        if (!userId) {
            alert("Usuário não encontrado.");
            return;
        }
        // Validação da senha
        if (senha || confirmarSenha) {
            if (senha !== confirmarSenha) {
                alert("As senhas não conferem.");
                return;
            }
        }

        let sucesso = true;

        // Atualizar nome, se houver alteração
        if (nome && nome !== perfil?.nome) {
            const { error: erroNome } = await supabase
                .from("usuarios")
                .update({ nome })
                .eq("id", userId); // ajuste conforme sua tabela

            if (erroNome) {
                console.error(erroNome);
                alert("Erro ao atualizar o nome.");
                sucesso = false;
            }
        }

        // Atualizar e-mail ou senha, se houver alteração
        if ((email && email !== user?.email) || senha) {
            const updateData = {};
            if (email && email !== user?.email) updateData.email = email;
            if (senha) updateData.password = senha;

            const { error: erroAuth } = await supabase.auth.updateUser(updateData);

            if (erroAuth) {
                console.error(erroAuth);
                alert("Erro ao atualizar e-mail ou senha.");
                sucesso = false;
            }
        }

            if (sucesso) {
            alert("Dados atualizados com sucesso!");
            navigation.goBack();
        }
    };

    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
            
            
                    <Text variant="titleMedium" style={styles.titulo}>
                        Editar perfil
                    </Text>

                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Alterar Nome:</Text>
                    <TextInput
                        value={nome}
                        onChangeText={setNome}
                        mode="outlined"
                        style={styles.input}
                    />
                </View>

                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Alterar E-mail:</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        style={styles.input}
                    />
                </View>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Nova Senha:</Text>
                    <TextInput
                        value={senha}
                        onChangeText={setSenha}
                        mode="outlined"
                        secureTextEntry
                        style={styles.input}
                    />
                </View>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Confirmar Senha:</Text>
                    <TextInput
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        mode="outlined"
                        secureTextEntry
                        style={styles.input}
                    />
                </View>
                <Button style={styles.botao} mode="contained" onPress={atualizarDados}>
                    Salvar Dados
                </Button>
                <Button style={styles.botao} mode="outlined" onPress={() => navigation.navigate('Perfil')}>
                    Voltar
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