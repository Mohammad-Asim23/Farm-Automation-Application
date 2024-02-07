import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from '../screens/Dashboard';
import Admin from '../screens/Admin'
import SideMenu from '../components/SideMenu';


const Drawer = createDrawerNavigator();

const DashboardScreen = () => {
  return (
    
      <Drawer.Navigator
        initialRouteName="Dashboard"
        drawerContent={(props) => <SideMenu {...props} />}
        screenOptions={{
          
          overlayColor: 'transparent',
        }}
        >
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="Admin" component={Admin} />

        
        

      </Drawer.Navigator>
   
  );
};
export default DashboardScreen;