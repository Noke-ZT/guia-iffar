import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import CursoCard from "./componentes/CursoCard";
import { LinearGradient } from "expo-linear-gradient";

import { supabase } from "./config/supabase";
import { useEffect, useState } from "react";





export default function Cursos({navigation}) {
              //hook do react  
    const [cursos, setCursos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() =>{
        async function buscarCursos(){
            const {data, error} = await supabase.from('cursos').select('*');
            if(error){
                console.log(error);
            }
            else{
                setCursos(data);
            }
            setCarregando(false);
        }
        buscarCursos();
    }, [])

    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
                    <Text style={styles.titulo}>
                        Cursos do IFFar
                    </Text>
                    <Button style={styles.botao} mode="contained" onPress={() => navigation.navigate('CadastroCurso')}>
                        Cadastrar Curso
                    </Button>

                    {carregando && <ActivityIndicator animating/>}
                    {!carregando && cursos.length == 0 && <Text> Não Tem Registro</Text>}

                    {cursos.map((curso, index) => (
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