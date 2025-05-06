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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DetalheCurso from './src/screens/DetalheCurso';
import DetalheEvento from './src/screens/DetalheEvento';
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import { UsuarioProvider } from './src/screens/contexto/UsuarioContexto';
import CadastroEvento from './src/screens/CadastroEvento';


//const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider theme={tema}>
      <UsuarioProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: true,
              tabBarActiveTintColor:tema.colors.primary,
            }}
          >
            <Tab.Screen name="Home" component={Home}
              options={{
                tabBarIcon: ({color, size}) => (
                  <MaterialCommunityIcons name="home" size={size} color={color}/>
                )
              }}
            />
            <Tab.Screen name="Cursos" component={Cursos}
              options={{
                tabBarIcon: ({color, size}) => (
                  <MaterialCommunityIcons name="book" size={size} color={color}/>
                )
              }}
            />
            <Tab.Screen name="Eventos" component={Eventos}
              options={{
                tabBarIcon: ({color, size}) => (
                  <MaterialCommunityIcons name="calendar" size={size} color={color}/>
                )
              }}
            />
            <Tab.Screen name="Sobre" component={Sobre}
              options={{
                tabBarIcon: ({color, size}) => (
                  <MaterialCommunityIcons name="information" size={size} color={color}/>
                )
              }}
            />
            <Tab.Screen name="DetalheCurso" component={DetalheCurso}
              options={{
                tabBarButton: () => null,
                tabBarStyle: { display: 'none' },
                tabBarItemStyle: { display: 'none', width: 0, height: 0 },
              }}
            />
            <Tab.Screen name="DetalheEvento" component={DetalheEvento}
              options={{
                tabBarButton: () => null,
                tabBarStyle: { display: 'none', },
                tabBarItemStyle: { display: 'none', width: 0, height: 0 },
              }}
            />
            <Tab.Screen name="Login" component={Login}
              options={{
                tabBarButton: () => null,
                tabBarStyle: { display: 'none', },
                tabBarItemStyle: { display: 'none', width: 0, height: 0 },
              }}
            />
            <Tab.Screen name="Cadastro" component={Cadastro}
              options={{
                tabBarButton: () => null,
                tabBarStyle: { display: 'none', },
                tabBarItemStyle: { display: 'none', width: 0, height: 0 },
              }}
            />
            <Tab.Screen name="CadastroEvento" component={CadastroEvento}
              options={{
                tabBarButton: () => null,
                tabBarStyle: { display: 'none' },
                tabBarItemStyle: { display: 'none', width: 0, height: 0 },
              }}
            />


          </Tab.Navigator>
        </NavigationContainer>
      </UsuarioProvider>
    </PaperProvider>
  );
}


