import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import EventoCard from "./componentes/EventoCard";
import { ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


const eventos_db = [
    {
        titulo: "Semana Acadêmica - Sistemas para Internet", 
        data: "2025/12/12", 
        local: "Auditório",
        inscricao: "aberta",
        descricao: "A Semana Acadêmica é um evento que visa promover a troca de conhecimentos e experiências entre alunos, professores e profissionais da área de Sistemas para Internet. O evento contará com palestras, workshops e mesas redondas sobre temas relevantes para a formação dos alunos.",
    },
    {
        titulo: "Mostra Cultural", 
        data: "2025/03/26", 
        local: "Sala B-15", 
        inscricao: "fechada",
        descricao: "A Mostra Cultural é um evento que tem como objetivo apresentar as produções culturais dos alunos do IFFar. O evento contará com apresentações artísticas, exposições e oficinas.",
    },
]

export default function Eventos({navigation}) {
    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
                    <Text style={styles.titulo}>
                        Eventos Acadêmicos
                    </Text>
                    
                    {eventos_db.map((evento, index) => (
                        <EventoCard key={index} {...evento} 
                            onPress={()=>navigation.navigate('DetalheEvento', evento)}/>
                    ))
                    }


                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container:{
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