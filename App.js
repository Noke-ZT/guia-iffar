import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './src/screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import Cursos from './src/screens/Cursos';
import Eventos from './src/screens/Eventos';
import Sobre from './src/screens/Sobre';
import { tema } from './src/screens/config/tema';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={tema}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="Cursos" component={Cursos}/>
          <Stack.Screen name="Eventos" component={Eventos}/>
          <Stack.Screen name="Sobre" component={Sobre}/>

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}


