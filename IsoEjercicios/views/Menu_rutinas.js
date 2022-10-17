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


const Menu_rutinas = ({navigation}) => {

  const [rutinas, setRutinas] = useState([
    { nombre: "Rutina "+1,
      data : [
        {Dias: `${"L - X - V"}`, 
        Duracion: `${30} minutos`}
      ]}
  ])
  
  const [Refresh, setRefresher] = useState(false);

  const actualizar = () => {
    setRefresher(true);
    setRutinas([...rutinas,
      { nombre: "Rutina "+(rutinas.length+1),
      data : [
        {Dias: `${"L - X - V"}`, 
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
        backgroundColor: "#2ba0c8d6",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20
      }
    }
    else if(onpres == true){
      return{
        backgroundColor: "#f583219c",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20
      }
    }
  }


    return(

      //Vista contenedora principal
      <View style={styles.body}> 
        {/* Titulo de menu de rutinas */}
        <Text style={styles.titulo_principal}>Menu de rutinas</Text>
        
        {/* Lista de rutinas guardadas */}
        <SectionList

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
              <Text style={styles.texto_tarjetas}>Dias: {item.Dias}</Text>
              <Text style={styles.texto_tarjetas}>Duracion: {item.Duracion}</Text>
            </View>
          )}

          renderSectionHeader = {({section}) => (
            <Pressable 
                onPress={()=>{tarjeta_presionada(section.nombre)}}
                style={style_tarjeta_presionada}
                >
                  <Text style={styles.titulo_rutinas}>{section.nombre}</Text>
            </Pressable>
          )}
        />

        {/* Contenedor de los dos botones */}
        <View style={styles.contenedor_botones}>
          <View style={styles.contenedor_añadir}>
            <TouchableOpacity style={styles.boton_añadir} onPress={() => {navigation.navigate("Editar")}}>
              <Text style={styles.texto_boton_añadir}>Añadir rutina</Text>
            </TouchableOpacity>
          </View>
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
      padding: 5
    }
  });

  export default Menu_rutinas;