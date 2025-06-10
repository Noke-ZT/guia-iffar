import { Card, Text } from "react-native-paper";

export default function LikesEvento({ evento, onPress }) {
    return (
        <Card style={styles.card} mode="outlined" onPress={onPress}>
            <Card.Content>
                <Text variant="titleMedium">
                    Testando
                </Text>
            </Card.Content>
        </Card>
    );
}

const styles = {
    card: {
        marginBottom: 15,
    },
};