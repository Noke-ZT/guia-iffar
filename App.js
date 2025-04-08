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



//const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider theme={tema}>
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
              tabBarStyle: { display: 'none' }
            }}
          />


        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}


