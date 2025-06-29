import { Image, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useUsuario } from "../contexto/UsuarioContexto";


export default function Perfil({foto_url}) {
    const { perfil } = useUsuario();

    return (
        <View style={styles.container}>
            {foto_url ? (
                <Card style={styles.card} mode="outlined">
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.titulo}>
                            Foto Perfil
                        </Text>
                        <Image 
                            source={{ uri: foto_url }} 
                            style={styles.imagem}
                            resizeMode="contain"
                        />
                    </Card.Content>
                </Card>
            ) : (
                <Card style={styles.card} mode="outlined">
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.titulo}>
                            Foto Perfil
                        </Text>
                        <Text variant="bodyMedium" style={styles.semFoto}>
                            Nenhuma foto encontrada
                        </Text>
                    </Card.Content>
                </Card>
            )}
        </View>

        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 15,
    },
    titulo: {
        marginBottom: 10,
        textAlign: 'center',
    },
    imagem: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
    },
    semFoto: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
    },
});