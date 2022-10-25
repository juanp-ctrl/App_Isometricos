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
  FlatList
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: "database.db",
    createFromLocation: "~www/database.db",
  },
  ()=>{console.log("bien hecho")},
  error => {console.log(error)}

);

const Menu_rutinas = ({navigation}) => {
  
  const [rutinas, setRutinas] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
       "SELECT Nombre, Dias, Duracion FROM Rutinas",
       [],
       (tx, results) => {
        // console.log(results.rows.item(0))
        // console.log(results.rows.length)
        let temp = [];
        for (let i = 0; i < results.rows.length; i++){
          temp.push(results.rows.item(i));
        }
        setRutinas(temp)
       })
   })
   console.log(rutinas)
  }, []);

  // const [Refresh, setRefresher] = useState(false);

  // const cargarRutinas = () => {
  //   setRefresher(true);
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       "SELECT Nombre, Dias, Duracion FROM Rutinas",
  //       [],
  //       (tx, results) => {
  //         let len = results.rows.length;
  //         if(len > 0){
  //           console.log(len)
  //           for (let i = 0; i <= results.rows.length; i++) {
  //             setRutinas([...rutinas,
  //               { nombre: results.rows.item(i).Nombre,
  //               data : [
  //                 {Dias: results.rows.item(i).Dias, 
  //                 Duracion: results.rows.item(i).Duracion}
  //               ]}]);
  //           }
  //         }
  //       }
  //     )
  //   })
  //   setRefresher(false);
  // }


  // const actualizar = () => {
  //   setRefresher(true);
  //   setRutinas([...rutinas,
  //     { nombre: "Rutina "+(rutinas.length+1),
  //     data : [
  //       {Dias: `${"L - X - V"}`, 
  //       Duracion: `${30} minutos`}
  //     ]}]);
  //   setRefresher(false);
  // }

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
      <View style={{height: 0.2, width: '100%', backgroundColor: '#808080'}} />
    );
  };

  let listItemView = (item) => {
    return (
      <View>
          <Pressable 
                onPress={()=>{tarjeta_presionada(item.Nombre)}}
                style={style_tarjeta_presionada}
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

    return(

      //Vista contenedora principal
      <View style={styles.body}> 
        {/* Titulo de menu de rutinas */}
        <Text style={styles.titulo_principal}>Menú de rutinas</Text>
        
        {/* Lista de rutinas guardadas */}
          <View style={{flex: 1}}>
            <FlatList
              data={rutinas}
              ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => listItemView(item)}
            />
          </View>

        {/* Contenedor de los dos botones */}
        <View style={styles.contenedor_botones}>

          {/* Boton de añadir rutina */}
          <View style={styles.contenedor_añadir}>
            <TouchableOpacity style={styles.boton_añadir} onPress={() => {navigation.navigate("Editar")}}>
              <Text style={styles.texto_boton_añadir}>Añadir rutina</Text>
            </TouchableOpacity>
          </View>

          {/* Boton de play */}
          <View style={styles.contenedor_play}>
            <TouchableOpacity style={styles.boton_play}>
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
    )
  }

  const styles = StyleSheet.create({
    body:{
      flex: 1,
      backgroundColor: "#b2e5e5ad"
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