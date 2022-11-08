import React, { cloneElement, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  RefreshControl,
  SectionList,
  TouchableOpacity,
  View,
  Pressable,
  SafeAreaView,
  FlatList,
  Alert
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SQLite from 'react-native-sqlite-storage';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Rutina_detalle from './Rutina_detalle';
import TituloPrincipal from '../components/TituloPrincipal';

const db = SQLite.openDatabase(
  {
    name: "database.db",
    createFromLocation: "~www/database.db",
  },
  ()=>{console.log("conexion - ejercitarse")},
  error => {console.log(error)}

);

const Menu_rutinas = ({navigation}) => {

  const isFocused = useIsFocused();
  
  const [rutinas, setRutinas] = useState([]);
  const [TarjetaSeleccionada, setTarjetaSeleccionada] = useState(0);
  const [NumTarjeta, setNumTarjeta] = useState(0);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
       "SELECT * FROM Rutinas",
       [],
       (tx, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; i++){
          let datos = {...results.rows.item(i),...{presd: false}}   //Concatenamos un booleano llamado presd que usamos para indicar si una tarjeta se ha seleccionado
          temp.push(datos);
          console.log(datos)
        }
        setRutinas(temp)
       })
   })
   setTarjetaSeleccionada(0)
   setNumTarjeta(0)
  }, [isFocused]);  //Pasamos como dependecia el valor que nos indica si la vista se está mostrando

  const [Refresh, setRefresher] = useState(false);

  // Funcion para actualizar al tener nuevos elementos en la lista
  const loadNew = () => {
    setRefresher(true)

    db.transaction((tx) => {
      tx.executeSql(
       "SELECT * FROM Rutinas",
       [],
       (tx, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; i++){
          let datos = {...results.rows.item(i),...{presd: false}}   //Concatenamos un booleano llamado presd que usamos para indicar si una tarjeta se ha seleccionado
          temp.push(datos);
        }
        setRutinas(temp)
       })
   })

   setRefresher(false)
  }

  const tarjeta_presionada = (id) => {

      let newArr = rutinas.map( obj => {
        if(obj.Id_rutina === id){
          if(TarjetaSeleccionada == id){
            setNumTarjeta(0)
            setTarjetaSeleccionada(0)
            return {...obj, presd: !obj.presd}
          }
          else{
            let idtemp = TarjetaSeleccionada
            setTarjetaSeleccionada(id)
            if(NumTarjeta < 1){
              setNumTarjeta(1)
              return {...obj, presd: !obj.presd}
            }
            else{
              setTarjetaSeleccionada(idtemp)
              console.log("Ya hay una tarjeta seleccionada")
            }
          }
        }
        return obj;
      })
      setRutinas(newArr)  
    }

  const style_tarjeta_presionada = (value) => {
    if(value == false){
      return{
        backgroundColor: "#60477eeb",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20
      }
    }
    else if(value == true){
      return{
        backgroundColor: "#7887bec4",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        borderBottomStartRadius: 20,
        borderBottomEndRadius: 20,
        paddingTop: 3,
        paddingBottom: 3,
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
          <Pressable 
                onPress={()=>{tarjeta_presionada(item.Id_rutina)}}
                style={style_tarjeta_presionada(item.presd)}
                >
                  <Text style={styles.titulo_rutinas}>{item.Nombre}</Text>
            </Pressable>
            <View style={styles.contenido_tarjeta}>
              <Text style={styles.texto_tarjetas}>Días: {item.Dias}</Text>
              <Text style={styles.texto_tarjetas}>Duración: {item.Duracion}</Text>
            </View>
      </View>
    );
  };

  const Stack = createNativeStackNavigator();

  const Vista_home = () => {

    return(

      //Vista contenedora principal
      <View style={styles.super_body}>

        <TituloPrincipal titulo={"Rutinas"}/>

          <View style={styles.body}> 
            
            {/* Lista de rutinas guardadas */}
              <View style={{flex: 1}}>
                <FlatList
                  data={rutinas}
                  extraData={rutinas}

                  refreshControl={
                    <RefreshControl
                      refreshing={Refresh}
                      onRefresh = {loadNew}
                    />
                  }

                  ItemSeparatorComponent={listViewItemSeparator}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => listItemView(item)}
                />
              </View>

            {/* Contenedor de los dos botones */}
            <View style={styles.contenedor_botones}>

              {/* Boton de añadir rutina */}
              <View style={styles.contenedor_añadir}>
                <TouchableOpacity style={styles.boton_añadir} onPress={() => {navigation.navigate("Editar", {screen: "Agregar"})}}>
                  <Text style={styles.texto_boton_añadir}>Añadir rutina</Text>
                </TouchableOpacity>
              </View>

              {/* Boton de play */}
              <View style={styles.contenedor_play}>
                <TouchableOpacity style={styles.boton_play} onPress={() => {
                  if(NumTarjeta > 0){
                    navigation.navigate("Detalles rutina", {id: TarjetaSeleccionada})
                  }
                  else{
                    Alert.alert("Atención", `Debes de seleccionar al menos una rutina.`)
                  }
                }}>
                  <FontAwesome5
                      name = {"play"}
                      size = {18}
                      color = {"black"}
                      style = {styles.icono_boton_play}
                    />
                </TouchableOpacity>
              </View>

            </View>

          </View>
      </View>
    )
  }

  return(
    <Stack.Navigator>
      <Stack.Screen 
        name = "Home"
        component={Vista_home}
        options={{headerShown: false}}
        />
      <Stack.Screen
        name = "Detalles rutina"
        component={Rutina_detalle}
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
    texto:{
      color: "black",
      fontSize: 14
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
    titulo_rutinas: {
      color: "white",
      margin: 14,
      fontSize: 27
    },
    contenedor_botones: {
      flexDirection: 'row'
    },
    contenedor_añadir: {
      flex: 1,
      flexDirection: 'row',
    },
    contenedor_play: {
      flex: 1,
      flexDirection: 'row-reverse',
    },
    boton_añadir:{
      backgroundColor: "white",
      borderRadius: 10,
      marginLeft: 27,
      marginBottom: 30,
      marginTop: 39,
      height: 40
    },
    boton_play:{
      backgroundColor: "#2ba0c8d6",
      padding: 14,
      borderRadius: 50,
      marginBottom: 30,
      marginTop: 27,
      marginRight: 37
    },
    texto_boton_añadir:{
      color: "black",
      fontSize: 14,
      paddingLeft: 17,
      paddingRight: 17,
      paddingTop: 10
    },
    icono_boton_play:{
      paddingLeft: 7,
      paddingTop: 5,
      paddingRight: 7,
      paddingBottom: 5
    }
  });

  export default Menu_rutinas;