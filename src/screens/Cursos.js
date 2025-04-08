import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import CursoCard from "./componentes/CursoCard";
import { LinearGradient } from "expo-linear-gradient";



const cursos_db = [
    {   nome: "Sistemas para Internet", 
        modalidade: "Presencial", nivel: "Superior", 
        unidade: "IFFar - Panambi", 
        duracao: "3 anos", 
        turno: "Noturno", 
        descricao: "Contribuir para o desenvolvimento regional, formando profissionais qualificados para o mercado digital e para o mundo do trabalho, com conhecimentos técnicos, aptos a oferecer serviços no âmbito interno das organizações"},
    
]

export default function Cursos({navigation}) {
    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
                    <Text style={styles.titulo}>
                        Cursos do IFFar
                    </Text>
                    
                    {cursos_db.map((curso, index) => (
                        <CursoCard key={index} {...curso} 
                            onPress={()=>navigation.navigate('DetalheCurso', curso)}/>
                    ))
                    }


                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container:{
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