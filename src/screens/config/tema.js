import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const tema = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,// os ... significam que está carregando tudo que tem no DefaultTheme.colors
    primary: '#1C9B5E', 
    secondary: '#C4112F', 
    background: '#F4F4F4', 
    surface: '#FFFFFF',
    onSurface: '#000000',
    text: '#000000',
    outline: '#CCCCCC',
  },
};
