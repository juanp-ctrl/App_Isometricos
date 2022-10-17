import React, { cloneElement, useState } from 'react';
import {
  StyleSheet,
  Text,
  RefreshControl,
  SectionList,
  TouchableOpacity,
  View,
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
        data : [`Dias: ${libros.length+1}-1`, `Descripcion: ${libros.length+1}-2`]}]);
    setRefresher(false);
  }

    return(

      //Vista contenedora principal
      <View style={styles.body}> 
        {/* Titulo de menu de rutinas */}
        <Text style={styles.titulo_principal}>Menu de rutinas</Text>
        
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
        <View style={styles.contenedor_titulo}>
          <Text style={styles.titulo_rutinas}>{section.nombre}</Text>
        </View>
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
    contenedor_titulo: {
      backgroundColor: "#2ba0c8d6",
      marginLeft: 20,
      marginRight: 20,
      marginTop: 20
    },
    contenido_tarjeta: {
      fontSize: 18,
      marginLeft: 20,
      marginRight: 20,
      backgroundColor: "white"
    },
    titulo_rutinas: {
      color: "white",
      margin: 14,
      fontSize: 27
    }
  });

  export default Menu_rutinas;