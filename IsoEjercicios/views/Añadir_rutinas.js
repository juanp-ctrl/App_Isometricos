import React, { cloneElement, useEffect, useState, useRef  } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Pressable,
  Alert
} from 'react-native';

import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: "database.db",
    createFromLocation: "~www/database.db",
  },
  ()=>{console.log("connection")},
  error => {console.log(error)}

);

const Añadir_rutinas = ({navigation}) => {

  const [tiempoGlobal, setTiempoGlobal] = useState(0)
  const [nombreRutina, setNombreRutina] = useState("")
  const [diasRutina, setDiasRutina] = useState("")
  const lista_ejercicios = useRef();

  const [ejercicios, setEjercicios] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
       "SELECT Id_ejercicios, Nombre, Duracion, Grupo_muscular FROM Ejercicios",
       [],
       (tx, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; i++){
          let datos = {...results.rows.item(i),...{presd: false}}
          temp.push(datos);
        }
        setEjercicios(temp)
       })
   })
  }, []);

  const setRutina = async (nombreRutina) => {
    if(nombreRutina.length == 0 || diasRutina.length == 0 || tiempoGlobal == 0){
      Alert.alert("Atención", "Antes de añadir una rutina dale un nombre, los dias a entrenar y selecciona al menos un ejercicio.")
      console.log("wtf")
    }
    else{
      try {

        await db.transaction(async (tx) => {
          await tx.executeSql(
            "INSERT INTO Rutinas (Nombre, Dias, Duracion) VALUES (?,?,?)",
            [nombreRutina, diasRutina, tiempoGlobal]
          )
        })

        setNombreRutina("")
        setDiasRutina("")
        setTiempoGlobal(0)

        let newArr = ejercicios.map( obj => {
            return {...obj, presd: false};
        })

        setEjercicios(newArr)

        Alert.alert("Nueva rutina añadida!", `La rutina ${nombreRutina} se ha añadido con exito.`)
        lista_ejercicios.current.scrollToIndex({index: 0})
        navigation.navigate("Ejercitarse", {
          
        })
  
      } catch (error) {
        console.log(error)
      }
    }
  }

  const tarjeta_presionada = (id) => {
    let newArr = ejercicios.map( obj => {
      if(obj.Id_ejercicios === id){
        if(obj.presd == false){
          setTiempoGlobal(tiempoGlobal+obj.Duracion)
        }
        else if(obj.presd == true){
          setTiempoGlobal(tiempoGlobal-obj.Duracion)
        }
        return {...obj, presd: !obj.presd}
      }
      return obj;
    })
    setEjercicios(newArr)
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
                onPress={()=>{tarjeta_presionada(item.Id_ejercicios)}}
                style={style_tarjeta_presionada(item.presd)}
                >
                  <Text style={styles.titulo_rutinas}>{item.Nombre}</Text>
            </Pressable>
            <View style={styles.contenido_tarjeta}>
              <Text style={styles.texto_tarjetas}>Duración: {item.Duracion}</Text>
              <Text style={styles.texto_tarjetas}>Grupo muscular: {item.Grupo_muscular}</Text>
            </View>
      </View>
    );
  };

    return(
        <View style={styles.body}> 

        {/* Titulo de añadir rutina */}
        <Text style={styles.titulo_principal}>Nueva Rutina!</Text>

        {/* Entrada del nombre de la rutina */}
        <View style={styles.contenedor_input}>
          <Text style={styles.nombre_input}>Nombre:</Text>
          <TextInput
            style={styles.entrada}
            placeholder='Nombre de mi rutina'
            onChangeText = {(e) => setNombreRutina(e)}
            value={nombreRutina}
          />
        </View>

        {/* Entrada de los dias de la rutina */}
        <View style={styles.contenedor_input}>
          <Text style={styles.nombre_input}>Dias:</Text>
          <TextInput
            style={styles.entrada}
            placeholder='Lunes-Miercoles'
            onChangeText = {(e) => setDiasRutina(e)}
            value={diasRutina}
          />
        </View>

        {/* Lista de ejercicios a elegir */}
        <View style={{flex: 1}}>
            <FlatList
              data={ejercicios}
              ref={lista_ejercicios}
              extraData={ejercicios}
              ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => listItemView(item)}
            />
        </View>

        {/* Contenedor de los dos elementos */}
        <View style={styles.contenedor_duracion_boton}>

          {/* Duracion total de la rutina */}
          <View style={styles.contenedor_duracion}>
            <Text style={styles.texto_duracion}>Duración:</Text>
            <Text style={styles.texto_numero_duracion}>{tiempoGlobal} Minutos</Text>
          </View>

          {/* Boton de añadir rutina */}
          <View style={styles.contenedor_añadir}>
              <TouchableOpacity style={styles.boton_añadir} onPress={() => {setRutina(nombreRutina)}}>
                <Text style={styles.texto_boton_añadir}>Añadir rutina</Text>
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
    boton:{
      backgroundColor: "aqua",
      padding: 14,
      borderRadius: 10,
      margin: 10
    },
    contenedor_input:{
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 10,
      paddingLeft: 25,
    },
    nombre_input:{
      fontSize: 18,
      color: "black"
    },
    entrada: {
      backgroundColor: "white",
      width: 200,
      height: 40,
      borderWidth: 1,
      borderRadius: 5,
      marginLeft: 10,
      marginTop: 5,
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
    contenedor_duracion_boton:{
      flexDirection: 'row'
    },
    contenedor_duracion:{
      flexDirection: "row",
      marginLeft: 25,
      marginTop: 30,
      marginBottom: 20 
    },
    texto_duracion:{
      fontSize: 17,
      color: "black",
    },
    texto_numero_duracion:{
      fontSize: 17,
      color: "black",
      paddingLeft: 10
    },
    contenedor_añadir: {
      flex: 1,
      flexDirection: 'row-reverse',
      marginTop: 25,
      marginBottom: 20 
    },
    boton_añadir:{
      backgroundColor: "white",
      borderRadius: 10,
      marginRight: 27,
      height: 40
    },
    texto_boton_añadir:{
      color: "black",
      fontSize: 14,
      paddingLeft: 17,
      paddingRight: 17,
      paddingTop: 10
    },
  });

  export default Añadir_rutinas;