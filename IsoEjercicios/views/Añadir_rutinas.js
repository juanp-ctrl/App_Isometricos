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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TituloPrincipal from '../components/TituloPrincipal';

const db = SQLite.openDatabase(
  {
    name: "database.db",
    createFromLocation: "~www/database.db",
  },
  ()=>{console.log("conexion - añadir")},
  error => {console.log(error)}

);

const Añadir_rutinas = ({navigation}) => {

  const [tiempoGlobal, setTiempoGlobal] = useState(0)
  const [nombreRutina, setNombreRutina] = useState("")
  const [diasRutina, setDiasRutina] = useState("")
  const [idRutinaTemp, setIdRutinaTemp] = useState(0)
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
          let datos = {...results.rows.item(i),...{presd: false}}   //Concatenamos un booleano llamado presd que usamos para indicar si una tarjeta se ha seleccionado
          temp.push(datos);
        }
        setEjercicios(temp)   //Guardamos en el arreglo original los valores de la base de datos
       })
   })
  }, []);

  //Funcion para almacenar la nueva rutina en la base de datos
  const setRutina = async (nombreRutina) => {
    if(nombreRutina.length == 0 || diasRutina.length == 0 || tiempoGlobal == 0){    //Control de envio de elementos vacios
      Alert.alert("Atención", "Antes de añadir una rutina dale un nombre, los dias a entrenar y selecciona al menos un ejercicio.")
    }
    else{
      try {

        await db.transaction(async (tx) => {
          //Insertamos en la Tabla Rutinas la información de la nueva rutina
          await tx.executeSql(
            "INSERT INTO Rutinas (Nombre, Dias, Duracion) VALUES (?,?,?)",
            [nombreRutina, diasRutina, tiempoGlobal],
            (tx, res) => {
              //Obtenemos el id de la rutina agregada
              tx.executeSql(
                "SELECT Id_rutina FROM Rutinas WHERE Nombre=?",
                [nombreRutina],
                (tx, res) => {
                  let NumRutina = res.rows.item(0).Id_rutina
                  console.log(NumRutina)
                  //Insertamos en la tabla de ejercicios por rutina los ejercicios seleccionados
                  for(let i=0; i<ejercicios.length; i++){
                    if(ejercicios[i].presd == true){
                      tx.executeSql(
                        "INSERT INTO Ejercicios_rut (Id_rutina, Id_ejercicio) VALUES (?,?)",
                        [NumRutina, ejercicios[i].Id_ejercicios]
                      )
                      console.log("Agregado")
                    }
                  }
                }
              )
            }
          );
        })

        //Reseteamos los valores de los input y del tiempo global
        setNombreRutina("")
        setDiasRutina("")
        setTiempoGlobal(0)

        //Deseleccionamos todas las tarjetas
        let newArr = ejercicios.map( obj => {
            return {...obj, presd: false};
        })
        setEjercicios(newArr)

        //Mensaje de aviso de rutina agregada con exito
        Alert.alert("Nueva rutina añadida!", `La rutina ${nombreRutina} se ha añadido con exito.`)
        lista_ejercicios.current.scrollToIndex({index: 0})
        navigation.navigate("Rutinas")
  
      } catch (error) {
        console.log(error)
      }
    }
  }

  //Funcion que encuentra el elemento del arreglo de ejercicios apartir del id dado 
  //incrementa o decrementa el tiempo total de la rutina
  //y alterna el valor del booleano presd del elemento encontrado
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

  //Estilos dependiendo del estado de seleccion de la tarjeta
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
              <Text style={styles.texto_tarjetas}>Duración: {item.Duracion} Seg</Text>
              <Text style={styles.texto_tarjetas}>Grupo muscular: {item.Grupo_muscular}</Text>
            </View>
      </View>
    );
  };

    return(
      <View style={styles.super_body}>

        <TituloPrincipal titulo={"Agregar"}/>

        <View style={styles.body}> 

          {/* Seccion boton de retroceder y subtitulo */}
          <View style={styles.contenedor_seccion_titulo}>

            <TouchableOpacity style={styles.boton_go_back}
                onPress={()=>{navigation.navigate("Editar rutinas")}}
                >
                <FontAwesome5
                    name = {"chevron-left"}
                    size = {14}
                    color = {"black"}
                    style = {styles.icono_go_back}
                  />
            </TouchableOpacity>

            {/* Titulo de añadir rutina */}
            <Text style={styles.titulo_principal}>Nueva Rutina!</Text>
          
          </View>

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
          <View style={styles.contenedor_input_dias}>
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
              <Text style={styles.texto_numero_duracion}>{tiempoGlobal} Segundos</Text>
            </View>

            {/* Boton de añadir rutina */}
            <View style={styles.contenedor_añadir}>
                <TouchableOpacity style={styles.boton_añadir} onPress={() => {setRutina(nombreRutina)}}>
                  <Text style={styles.texto_boton_añadir}>Añadir rutina</Text>
                </TouchableOpacity>
            </View>

          </View>

        </View>
      </View>)
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
    icono_go_back:{
      padding: 5,
      paddingLeft: 10
    },
    contenedor_seccion_titulo:{
      flexDirection: "row"
    },
    boton_go_back:{
      marginLeft: 20,
      marginTop: 18,
      padding: 5,
      width: 40,
      height: 38,
      backgroundColor: "white",
      borderRadius: 30
    },
    titulo_principal:{
        color: "black",
        paddingTop: 20,
        paddingLeft: 30,
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
    contenedor_input_dias:{
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 10,
      paddingLeft: 25,
      paddingBottom: 15
    },
    nombre_input:{
      fontSize: 17,
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
      fontSize: 16,
      color: "black",
      paddingBottom: 3,
      paddingTop: 3
    },
    titulo_rutinas: {
      color: "white",
      margin: 14,
      fontSize: 24
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