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

const Menu_rutinas = ({navigation}) => {

  const [rutinas, setRutinas] = useState([
    { nombre: "Rutina "+1,
      data : [`Dias: ${"L - X - V"}`, `Duracion: ${30} minutos`]}
  ])
  
  const [Refresh, setRefresher] = useState(false);

  const actualizar = () => {
    setRefresher(true);
    setRutinas([...rutinas,
      { nombre: "Rutina "+(rutinas.length+1),
        data : [`Dias: ${rutinas.length+1}-1`, `Descripcion: ${rutinas.length+1}-2`]}]);
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
            <Text style={styles.contenido_tarjeta}>{item}</Text>
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

      </View>

      //Lista de las opciones de rutinas

      //Boton de añadir rutina

      //Boton de darle play a la rutina
    )
  }

  const styles = StyleSheet.create({
    body:{
      flex: 1,
      backgroundColor: "#b2e5e5ad"
    },
    titulo_principal:{
      color: "black",
      paddingTop: 25,
      paddingLeft: 25,
      fontSize: 24
    },
    texto:{
      color: "black",
      fontSize: 20
    },
    boton:{
      backgroundColor: "aqua",
      padding: 14,
      borderRadius: 10,
      margin: 10
    },
    contenido_tarjeta: {
      fontSize: 17,
      marginLeft: 20,
      marginRight: 20,
      paddingTop: 5,
      paddingLeft: 10,
      paddingBottom: 7,
      backgroundColor: "white",
      color: "black"
    },
    titulo_rutinas: {
      color: "white",
      margin: 14,
      fontSize: 27
    }
  });

  export default Menu_rutinas;