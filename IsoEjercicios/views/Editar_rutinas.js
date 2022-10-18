import React, { cloneElement, useState } from 'react';
import {
  StyleSheet,
  Text,
  RefreshControl,
  SectionList,
  TouchableOpacity,
  View,
  Pressable
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

const Editar_rutinas = ({navigation}) => {

  const [nombre_e, setNombreE] = useState("e")

  const getData = () => {
    try {
      console.log("intentando")
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT Nombre FROM Ejercicios",
          [],
          (tx, results) => {
            let len = results.rows.length;
            console.log(len)
            if (len > 0){
              let Nombre_ejercicio = results.rows.item(0).Nombre;
              setNombreE(Nombre_ejercicio)
              console.log(nombre_e)
            }
          }
        )
      })
      console.log(nombre_e)
    } catch (error) {
      console.log(error)
    }
  }

  const [rutinas, setRutinas] = useState([
    { nombre: "Rutina "+1,
      data : [
        {id: 1,
        Dias: `${"L - X - V"}`, 
        Duracion: `${30} minutos`}
      ]}
  ])
  
  const [Refresh, setRefresher] = useState(false);

  const actualizar = () => {
    setRefresher(true);
    setRutinas([...rutinas,
      { nombre: "Rutina "+(rutinas.length+1),
      data : [
        {id: 1,
        Dias: `${"L - X - V"}`, 
        Duracion: `${30} minutos`}
      ]}]);
    setRefresher(false);
  }

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


    return(

      //Vista contenedora de editar rutinas
      <View style={styles.body}> 
        {/* Titulo de editar rutinas */}
        <Text style={styles.titulo_principal}>Rutinas</Text>
        
        {/* Lista de rutinas guardadas */}
        <SectionList style={styles.lista}

          refreshControl={
            <RefreshControl
              refreshing={Refresh}
              onRefresh = {actualizar}
            />
          }

          keyExtractor={(item, index) => index.toString()} 
          sections={rutinas}
          
          renderItem = {({ item }) => (
            <View style={styles.contenido_tarjeta}>
              <Text style={styles.texto_tarjetas}>Días: {item.Dias}</Text>
              <Text style={styles.texto_tarjetas}>Duración: {item.Duracion} {item.id}</Text>
            </View>
          )}

          renderSectionHeader = {({section}) => (
            <View style={styles.contenedor_titulo_tarjeta}>

              {/* Titulo de la tarjeta */}
              <View style={styles.contenedor_titulo}>
                <Text style={styles.titulo_rutinas}>{section.nombre}</Text>
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
          )}
        />

        {/* Contenedor del boton de añadir rutina */}
        <View style={styles.contenedor_botones}>

          {/* Boton de añadir rutina */}
          <View style={styles.contenedor_boton_añadir}>
            <TouchableOpacity style={styles.boton_añadir}
              onPress={getData}
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