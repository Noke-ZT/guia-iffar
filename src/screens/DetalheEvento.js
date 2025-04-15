import { ScrollView, StyleSheet } from "react-native";
import { Badge, Button, Card, Divider, Text, useTheme} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";

export default function DetalheEvento({route}) {
    const {
        titulo,
        data,
        local,
        inscricao,
        descricao,
    } = route.params;

    const theme = useTheme();
        
        const corBadge = inscricao === "aberta" ? theme.colors.primary : "tomato";
        const textoBadge = inscricao === "aberta" ? "Incrições abertas" : "Encerradas";
    return(
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
            <ScrollView style={styles.container}>
                <Card mode="outlined" style={styles.card}>
                    <Card.Content>
                        <Text style={{color:corBadge}} variant="titleLarge">
                            {titulo}
                        </Text>
                        <Badge style={[styles.badge, {backgroundColor:corBadge}]}>{textoBadge}</Badge>

                        <Divider style={styles.divisor}/>

                        <Text variant="bodyMedium"> 🗓️Data: {format(data, "dd/MM/yyyy")} </Text>
                        <Text variant="bodyMedium"> 📍Local: {local} </Text>
                        

                        <Divider style={styles.divisor}/>

                        <Text variant="titleSmall"> Descrição </Text>
                        <Text variant="bodyMedium"> {descricao} </Text>

                    </Card.Content>
                </Card>
                <Button mode="outlined" onPress={() => navigation.navigate('/')}>
                    Voltar
                </Button>
            </ScrollView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 16,
    },
    card:{
        marginBottom: 15,
    },
    divisor:{
        marginVertical: 10,
    },
    badge:{
        color: 'white',
        paddingHorizontal: 10,
        fontSize: 12,
    },
})