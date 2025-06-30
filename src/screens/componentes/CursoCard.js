import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CursoCard({nome, duracao, modalidade, turno, arquivo_url, onPress}) {
    return(
        <Card style={styles.card} mode="outlined" onPress={onPress}>
            <Card.Content>
                <Text variant="titleMedium">
                    {nome}
                </Text>
                <Text variant="bodyMedium">
                <MaterialCommunityIcons name="clock-outline" size={16} color="black" />
                    Duração: {duracao}
                </Text>
                <Text variant="bodyMedium">
                <MaterialCommunityIcons name="weather-night" size={16} color="black" />
                    Modalidade: {modalidade}
                </Text>
                <Text variant="bodyMedium">
                <MaterialCommunityIcons name="account-group-outline" size={16} color="black" />
                    Turno: {turno}
                </Text>
                {arquivo_url && (
                    <Text variant="bodyMedium">
                        <MaterialCommunityIcons name="file-pdf-box" size={16} color="black" />
                        PDF do Curso: {arquivo_url}
                    </Text>
                )}
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card:{
        marginBottom: 15,
    },
});