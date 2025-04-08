import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import EventoCard from "./componentes/EventoCard";
import { ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


const eventos_db = [
    {titulo: "Semana Acadêmica - Sistemas para Internet", data: "2025/12/12", local: "Auditório", inscricao: "aberta"},
    {titulo: "Mostra Cultural", data: "2025/03/26", local: "Sala B-15", inscricao: "fechada"},
]

export default function Eventos({navigation}) {
    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.titulo}>
                    Eventos Acadêmicos
                </Text>
                
                {eventos_db.map((evento, index) => (
                    <EventoCard key={index} {...evento} />
                ))
                }


            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        padding: 20,  
    },
    titulo:{
        fontSize: 24,
        marginBottom: 30,
        textAlign: 'center',
    },
    botao:{
        marginVertical: 10,
    }
})