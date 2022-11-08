import React, { useEffect, useState, useRef  } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import TituloPrincipal from '../components/TituloPrincipal';
import { useIsFocused } from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const db = SQLite.openDatabase(
    {
      name: "database.db",
      createFromLocation: "~www/database.db",
    },
    ()=>{console.log("conexion - detalle rutina")},
    error => {console.log(error)}
  
  );

const Rutina_detalle = ({navigation, route}) => {

    const isFocused = useIsFocused();

    const { id } = route.params;

    const [ejercicios, setEjercicios] = useState([]);

    const [nombreRutina, setNombreRutina] = useState("");
    const [duracionRutina, setDuracionRutina] = useState(0);

    useEffect(() => {
        db.transaction((tx) => {
        tx.executeSql(
        "SELECT * FROM Ejercicios_rut",
        [],
        (tx, results) => {
            console.log(results.rows.length)
            let temp = [];
            let idRutina;
            for (let i = 0; i < results.rows.length; i++){
            console.log(results.rows.item(i))
            // temp.push(datos);
            }
            // setEjercicios(temp)   //Guardamos en el arreglo original los valores de la base de datos
            tx.executeSql(
                "SELECT * FROM Rutinas WHERE Id_rutina=?",
                [JSON.stringify(id)],
                (tx, results) => {
                    setNombreRutina(results.rows.item(0).Nombre)
                    setDuracionRutina(results.rows.item(0).Duracion)
                }
            )
        })
    })
    }, [isFocused]);

    return(
        
        <View style={styles.super_body}>
            
            <TituloPrincipal titulo={"Ejercitarse"}/>

            <View style={styles.body}>

                {/* Seccion boton de retroceder y subtitulo */}
                <View style={styles.contenedor_seccion_titulo}>

                    <TouchableOpacity style={styles.boton_go_back}
                        onPress={()=>{navigation.navigate("Home")}}
                        >
                        <FontAwesome5
                            name = {"chevron-left"}
                            size = {14}
                            color = {"black"}
                            style = {styles.icono_go_back}
                        />
                    </TouchableOpacity>

                    {/* Titulo de añadir rutina */}
                    <Text style={styles.titulo_principal}>{nombreRutina}</Text>

                    </View>
            </View>

        </View>
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
        paddingLeft: 30,
        paddingBottom: 10,
        fontSize: 24
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
    texto:{
      color: "black",
      fontSize: 20
    },
    boton:{
      backgroundColor: "aqua",
      padding: 14,
      borderRadius: 10,
      margin: 10
    }
  });

  export default Rutina_detalle;