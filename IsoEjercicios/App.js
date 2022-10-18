import React from 'react';

//Libreria de navegacion
import {NavigationContainer} from '@react-navigation/native';
//El metodo de navegacion por tabs
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//Libreria de iconos
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Menu_rutinas from './views/Menu_rutinas';
import Editar_rutinas from './views/Editar_rutinas';
import Calendario from './views/Calendario';

//Aplicacion principal
const App = ()  => {

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator 
        initialRouteName='Ejercitarse'  
        screenOptions={({route}) => ({

          tabBarInactiveTintColor: "black",
          tabBarActiveTintColor: "#2ba0c8d6",
          tabBarInactiveBackgroundColor: "#e5e5e5",
          tabBarLabelStyle: {
            fontSize: 14
          },
          tabBarStyle: [
            {
              display: "flex"
            }
          ],

          // Control de los iconos de las tabs
          tabBarIcon: ({ focused, size, color }) =>{
            let iconName;
            if (route.name === "Ejercitarse"){
              iconName = "stopwatch";
              size = focused ? 25 : 20;
              color = color;
            } else if (route.name === "Editar"){
              iconName = "stream";
              size = focused ? 25 : 20;
              color = color;
            }
            else if (route.name === "Calendario"){
              iconName = "calendar";
              size = focused ? 25 : 20;
              color = color;
            }
            return (
              <FontAwesome5
                name = {iconName}
                size = {size}  
                color = {color}
              />
            )
          }
        })
      }
      >
        <Tab.Screen
          name="Calendario"
          component={Calendario}
        />
        <Tab.Screen
          name="Ejercitarse"
          component={Menu_rutinas}
          // options={{tabBarBadge: 1}}
        />
        <Tab.Screen
          name="Editar"
          component={Editar_rutinas}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
};

export default App;
