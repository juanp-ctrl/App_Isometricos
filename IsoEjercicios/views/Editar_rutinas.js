import React, { cloneElement, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  RefreshControl,
  SectionList,
  TouchableOpacity,
  View,
  Pressable,
  FlatList
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SQLite from 'react-native-sqlite-storage';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Añadir_rutinas from './Añadir_rutinas';
import TituloPrincipal from '../components/TituloPrincipal';

const db = SQLite.openDatabase(
  {
    name: "database.db",
    createFromLocation: "~www/database.db",
  },
  ()=>{console.log("conexion - editar")},
  error => {console.log(error)}

);

const Editar_rutinas = ({navigation}) => {

  const [rutinas, setRutinas] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
       "SELECT Nombre, Dias, Duracion FROM Rutinas",
       [],
       (tx, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; i++){
          temp.push(results.rows.item(i));
        }
        setRutinas(temp)
       })
   })
  }, []);

  let onpres = false;

  const tarjeta_presionada = (nombre) => {
    console.log(nombre)
    onpres = !onpres
    console.log(onpres)
  }

  const style_tarjeta_presionada = () => {
    if(onpres == false){
      return{
        backgroundColor: "#60477eeb",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20
      }
    }
    else if(onpres == true){
      return{
        backgroundColor: "#7887bec4",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20
      }
    }
  }

  let listViewItemSeparator = () => {
    return (
      <View style={{height: 0, width: '100%', backgroundColor: '#808080'}} />
    );
  };

  let listItemView = (item) => {
    return (
      <View>
        <View style={styles.contenedor_titulo_tarjeta}>
          {/* Titulo de la tarjeta */}
          <View style={styles.contenedor_titulo}>
            <Text style={styles.titulo_rutinas}>{item.Nombre}</Text>
          </View>

          {/* Botones de la tarjeta */}
          <View style={styles.contenedor_botones_titulo}>

            {/* Boton de eliminar rutina */}
            <TouchableOpacity style={styles.botones_titulo}>
              <FontAwesome5
                  name = {"trash"}
                  size = {18}
                  color = {"black"}
                  style = {styles.icono_boton_basura}
                />
            </TouchableOpacity>

            {/* Boton de editar rutina */}
            <TouchableOpacity style={styles.botones_titulo}>
              <FontAwesome5
                  name = {"pen"}
                  size = {18}
                  color = {"black"}
                  style = {styles.icono_boton_editar}
                />
            </TouchableOpacity>
          </View>
        </View>
          <View style={styles.contenido_tarjeta}>
            <Text style={styles.texto_tarjetas}>Días: {item.Dias}</Text>
            <Text style={styles.texto_tarjetas}>Duración: {item.Duracion}</Text>
          </View>
      </View>
    );
  };

  const Stack = createNativeStackNavigator();

  const Vista_editar = () => {
    return(
    <View style={styles.super_body}>

      <TituloPrincipal titulo={"Editar"}/>
      
      {/* Vista contenedora de editar rutinas */}
      <View style={styles.body}> 
        
        {/* Lista de rutinas guardadas */}
        <View style={{flex: 1}}>
            <FlatList style={styles.lista}
              data={rutinas}
              ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => listItemView(item)}
            />
        </View>

        {/* Contenedor del boton de añadir rutina */}
        <View style={styles.contenedor_botones}>

          {/* Boton de añadir rutina */}
          <View style={styles.contenedor_boton_añadir}>
            <TouchableOpacity style={styles.boton_añadir}
              onPress={()=>{navigation.navigate("Agregar")}}
              >
              <FontAwesome5
                  name = {"plus"}
                  size = {25}
                  color = {"black"}
                  style = {styles.icono_boton_añadir}
                />
            </TouchableOpacity>
          </View>

        </View>

      </View>
    </View>)
  }

    return(
        <Stack.Navigator>
          <Stack.Screen 
          name = "Editar rutinas"
          component={Vista_editar}
          options={{headerShown: false}}
          />
          <Stack.Screen
            name = "Agregar"
            component={Añadir_rutinas}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
    )
  }

  const styles = StyleSheet.create({
    super_body:{
      flex: 1,
    },
    body:{
      flex: 1,
      backgroundColor: "#c7e9ea",
      borderTopEndRadius: 35,
      borderTopLeftRadius: 35,
      marginTop: -30,
      zIndex: 1
    },
    titulo_principal:{
      color: "black",
      paddingTop: 20,
      paddingLeft: 25,
      paddingBottom: 10,
      fontSize: 24
    },
    lista:{
      marginBottom: 55
    },
    texto:{
      color: "black",
      fontSize: 14
    },
    contenedor_titulo_tarjeta:{
      flexDirection: "row",
      backgroundColor: "#60477eeb",
      marginLeft: 20,
      marginRight: 20,
      marginTop: 20,
      borderTopStartRadius: 20,
      borderTopEndRadius: 20
    },
    contenedor_titulo:{
      flex: 1,
      flexDirection: "row",
    },
    contenedor_botones_titulo:{
      flex: 1,
      flexDirection: "row-reverse"
    },
    botones_titulo:{
      padding: 7,
      marginBottom: 10,
      marginRight: 7,
      marginTop: 14,
    },
    icono_boton_editar:{
      padding: 5
    },
    icono_boton_basura:{
      padding: 5,
      paddingRight: 20
    },
    titulo_rutinas: {
      color: "white",
      margin: 14,
      fontSize: 27
    },
    contenido_tarjeta: {
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 3,
      paddingTop: 5,
      paddingLeft: 10,
      paddingBottom: 7,
      backgroundColor: "white",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.41,
      shadowRadius: 9.11,

      elevation: 14,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10
    },
    texto_tarjetas:{
      fontSize: 17,
      color: "black",
      paddingBottom: 3,
      paddingTop: 3
    },
    contenedor_botones: {
      flexDirection: 'row'
    },
    contenedor_boton_añadir: {
      flex: 1,
      flexDirection: 'row-reverse',
    },
    boton_añadir:{
      backgroundColor: "#2ba0c8",
      padding: 10,
      borderRadius: 50,
      marginBottom: 24,
      marginTop: 27,
      marginRight: 37,
      position: 'absolute',                                          
      bottom: 3,                                                    
      left: 30, 
    },
    icono_boton_añadir:{
      paddingLeft: 7,
      paddingTop: 5,
      paddingRight: 7,
      paddingBottom: 5
    }
  });

  export default Editar_rutinas;