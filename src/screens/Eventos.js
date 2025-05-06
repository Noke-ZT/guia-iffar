import { SafeAreaView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import EventoCard from "./componentes/EventoCard";
import { ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { supabase } from "./config/supabase";
import { useEffect, useState } from "react";



export default function Eventos({navigation}) {
    const [eventos, setEventos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() =>{
        async function buscarEventos(){
            const {data, error} = await supabase.from('eventos').select('*');
            if(error){
                console.log(error);
            }
            else{
                setEventos(data);
            }
            setCarregando(false);
        }
        buscarEventos();
    }, [])

    return (
        
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
                    <Text style={styles.titulo}>
                        Eventos Acadêmicos
                    </Text>
                    <Button style={styles.botao} mode="contained" onPress={() => navigation.navigate('CadastroEvento')}>
                        Cadastrar Evento
                    </Button>
                    
                    {carregando && <ActivityIndicator animating/>}
                    {!carregando && eventos.length == 0 && <Text> Não Tem Registro</Text>}

                    {eventos.map((evento, index) => (
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