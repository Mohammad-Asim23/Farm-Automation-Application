import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from './screens/startScreen';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Details from './screens/Details';
import DataFlow from './screens/DataFlow';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DashboardScreen from './Navigation/DashboardScreen ';

import createTables from './Database/Tables'; 

createTables(); 


const stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      {/* stack navigation */}
      <NavigationContainer>
        <StatusBar style="dark" />

        <stack.Navigator initialRouteName='startScreen' screenOptions={{ animatedEnabled:false}}>
          <stack.Screen name='startScreen' options={{ headerShown: false }} component={StartScreen} />
          <stack.Screen name='Login' options={{ headerShown: false }} component={Login} />
          <stack.Screen name='Signup' options={{ headerShown: false }} component={Signup} />
          <stack.Screen name='DashBoard' options={{ headerShown: false }} component={DashboardScreen} />
          <stack.Screen name='Details' options={{ headerShown: false }} component={Details} />
          <stack.Screen name='DataFlow' options={{ headerShown: false }} component={DataFlow} />

        </stack.Navigator>
        

      </NavigationContainer>
    </GestureHandlerRootView>

  );
}


