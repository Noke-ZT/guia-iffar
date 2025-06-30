import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import { Badge, Button, Card, Text, useTheme } from "react-native-paper";
import { format } from "date-fns";
import { useUsuario } from "../contexto/UsuarioContexto";
import { supabase } from "../config/supabase";
import { useNavigation } from "@react-navigation/native";

export default function HistoricoEventos() {
    const { perfil } = useUsuario();
    const theme = useTheme();
    const [historico, setHistorico] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
        const buscarHistorico = async () => {
            if (!perfil?.id) return;

            const { data, error } = await supabase
                .from("historico")
                .select("*, eventos(id, titulo, local, data)")
                .eq("usuario_id", perfil.id)
                .order("data", { ascending: false });

            if (error) {
                console.error("Erro ao buscar histórico:", error.message);
            } else {
                setHistorico(data);
            }
        };

        buscarHistorico();
    }, [perfil?.id]);

    return (
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
            {historico.map((registro) => {
                const evento = registro.eventos;
                if (!evento) return null;

                const corBadge = registro.situacao ? "#00AA00" : "tomato";
                const textoBadge = registro.situacao
                    ? "Usuário Inscrito"
                    : "Usuário Cancelou a Inscrição";

                return (
                    <Card key={registro.id} style={styles.card} mode="outlined">
                        <Card.Content>
                            <View style={styles.cardContent}>
                                <View style={styles.info}>
                                    <Text variant="titleMedium">{evento.titulo}</Text>
                                    <Badge style={[styles.badge, { backgroundColor: corBadge }]}>
                                        {textoBadge}
                                    </Badge>
                                    <Text variant="bodyMedium">
                                        Data: {format(new Date(evento.data), "dd/MM/yyyy")}
                                    </Text>
                                    <Text variant="bodyMedium">Local: {evento.local}</Text>
                                    <Text variant="bodySmall" style={styles.dataHistorico}>
                                        Registro: {format(new Date(registro.data), "dd/MM/yyyy")}
                                    </Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                );
            })}
            <Button mode="outlined" onPress={() => navigation.navigate('Home')}>
                    Voltar
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
    },
    cardContent: {
        flexDirection: "row",
    },
    img: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
        resizeMode: "cover",
    },
    info: {
        flex: 1,
    },
    badge: {
        color: "white",
        alignSelf: "flex-start",
        marginVertical: 4,
    },
    dataHistorico: {
        marginTop: 4,
        fontStyle: "italic",
        color: "#666",
    },
});
