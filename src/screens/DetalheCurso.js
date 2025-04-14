import { ScrollView, StyleSheet } from "react-native";
import { Card, Divider, Text, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

export default function DetalheCurso({route}) {
    const {
        nome,
        modalidade,
        nivel,
        unidade,
        duracao,
        turno,
        descricao
    } = route.params;

    return(
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
            <ScrollView style={styles.container}>
                <Card mode="outlined" style={styles.card}>
                    <Card.Content>
                        <Text variant="titleLarge">
                            {nome}
                        </Text>

                        <Divider style={styles.divisor}/>

                        <Text variant="bodyMedium"> 📚Modalidade: {modalidade} </Text>
                        <Text variant="bodyMedium"> 🎓Nível: {nivel} </Text>
                        <Text variant="bodyMedium"> 📍Unidade: {unidade} </Text>
                        <Text variant="bodyMedium"> ⏱️Duração: {duracao} </Text>
                        <Text variant="bodyMedium"> 🕒Turno: {turno} </Text>

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
})