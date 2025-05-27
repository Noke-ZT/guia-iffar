import { Image, StyleSheet, View } from "react-native";
import { Badge, Card, Text, useTheme } from "react-native-paper";
import { format } from 'date-fns';

export default function EventoCard({titulo, data, local, inscricao, total_vagas, vagas_disponiveis, id, foto_url, onPress}) {
    const theme = useTheme();
    
    const corBadge = inscricao === "aberta" ? theme.colors.primary : "tomato";
    const textoBadge = inscricao === "aberta" ? "Incrições abertas" : "Encerradas";
    return(
        <Card style={styles.card} mode="outlined" onPress={onPress}>
            <Card.Content>
                <View style={styles.container}>
                    {foto_url && (
                        <View style={styles.imagemContainer}>
                            <Image 
                                source={{uri: foto_url}}
                                style={styles.img}
                            />
                        </View>
                    )}
                    <View style={styles.conteudoContainer}>
                        <View style={styles.header}>
                            <Text style={{color:corBadge}} variant="titleMedium">
                                {titulo}
                            </Text>
                        <Badge style={[styles.badge, {backgroundColor:corBadge}]}>{textoBadge}</Badge>
                        </View>
                
                        <Text variant="bodyMedium">
                            Data: {format(data, "dd/MM/yyyy")}
                        </Text>
                        <Text variant="bodyMedium">
                            Local: {local}
                        </Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card:{
        marginBottom: 15,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    badge:{
        color: 'white',
        paddingHorizontal: 10,
        fontSize: 12,
        resizeMode: 'contain',
    },
    img:{
        width: 80,
        height: 80,
        borderRadius: 8,
        resizeMode: 'cover',

    },
    imagemContainer: {
        marginRight: 12,
        borderRadius: 8,
        overflow: 'hidden',
    },
    conteudoContainer: {
        flex: 1,
        paddingTop: 2,
    },
    
});