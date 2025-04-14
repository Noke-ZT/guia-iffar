import { StyleSheet, View } from "react-native";
import { Badge, Card, Text, useTheme } from "react-native-paper";

export default function EventoCard({titulo, data, local, inscricao, onPress}) {
    const theme = useTheme();
    
    const corBadge = inscricao === "aberta" ? theme.colors.primary : "tomato";
    const textoBadge = inscricao === "aberta" ? "Incrições abertas" : "Encerradas";
    return(
        <Card style={styles.card} mode="outlined" onPress={onPress}>
            <Card.Content>
                <View style={styles.header}>
                    <Text variant="titleMedium">
                        {titulo}
                    </Text>
                <Badge style={[styles.badge, {backgroundColor:corBadge}]}>{textoBadge}</Badge>
                </View>
                
                <Text variant="bodyMedium">
                    Data: {data}
                </Text>
                <Text variant="bodyMedium">
                    Local: {local}
                </Text>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card:{
        marginBottom: 15,
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    badge:{
        color: 'white',
        paddingHorizontal: 10,
        fontSize: 12,
    },
    
});