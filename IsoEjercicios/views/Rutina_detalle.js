import React, { useEffect, useState, useRef  } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  Modal,
} from 'react-native';

import TituloPrincipal from '../components/TituloPrincipal';
import { useIsFocused } from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import CountDown from 'react-native-countdown-component';
import Timer from '../components/Temporizador';

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

    const [visibilidadTarjeta, setVisibilidadTarjeta] = useState(false);
    const [nombreEjercicioActual, setNombreEjercicioActual] = useState("");
    const [duracionActual, setDuracionActual] = useState(0);

    useEffect(() => {
        db.transaction((tx) => {
        tx.executeSql(
        "SELECT Nombre, Duracion, Grupo_muscular FROM Ejercicios INNER JOIN Ejercicios_rut ON Ejercicios.Id_ejercicios = Ejercicios_rut.Id_ejercicio WHERE Id_rutina=?",
        [JSON.stringify(id)],
        (tx, results) => {
            let temp = [];
            for (let i = 0; i < results.rows.length; i++){
                temp.push(results.rows.item(i));
            }
            setEjercicios(temp)
        })
        tx.executeSql(
            "SELECT * FROM Rutinas WHERE Id_rutina=?",
            [JSON.stringify(id)],
            (tx, results) => {
                setNombreRutina(results.rows.item(0).Nombre)
                setDuracionRutina(results.rows.item(0).Duracion)
            }
        )
    })
    }, [isFocused]);

    let listItemView = (item) => {
        return (
          <View>
                <View style={styles.contenido_tarjeta}>
                  <Text style={styles.texto_tarjetas}>Nombre: {item.Nombre}</Text>
                  <Text style={styles.texto_tarjetas}>Duración: {item.Duracion}</Text>
                  <Text style={styles.texto_tarjetas}>Grupo muscular: {item.Grupo_muscular}</Text>
                </View>
          </View>
        );
      };

    let arregloDeTiempos = () => {
        let arreglo = []
        for(let i=0; i<ejercicios.length; i++){
            arreglo.push(ejercicios[i].Duracion)
        }
        console.log(arreglo)
        return arreglo
    };

    let arregloEjercicios = () => {
        let arreglo = []
        for(let i=0; i<ejercicios.length; i++){
            arreglo.push(ejercicios[i].Nombre)
        }
        console.log(arreglo)
        return arreglo
    }

    return(
        
        <View style={styles.super_body}>

            {/* Tarjetas de reproduccion */}
            <Modal
                visible={visibilidadTarjeta}
                transparent
                animationType="fade"
                hardwareAccelerated
                onRequestClose={() => {
                    setVisibilidadTarjeta(false)
                }}
                >
                    <View style={styles.modal_centrado}>
                        <View style={styles.modal_recuadro}>
                            <View style={styles.modal_body}>
                                <View style={styles.seccion_control}>
                                    <TouchableOpacity style={styles.boton_go_back_2}
                                        onPress={()=>{setVisibilidadTarjeta(false)}}
                                        >
                                        <FontAwesome5
                                            name = {"chevron-left"}
                                            size = {14}
                                            color = {"black"}
                                            style = {styles.icono_go_back}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {/* Contador del reproductor */}
                                <Timer nombre={arregloEjercicios()} tiempo={arregloDeTiempos()}></Timer>     
                            </View>
                        </View>
                    </View>

            </Modal>
            
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

                    <View style={styles.contenedor_duracion}>
                        <Text style={styles.duracion_rutina}>| {duracionRutina} Minutos</Text>
                    </View>

                </View>

                {/* Lista de rutinas guardadas */}
                <View style={{flex: 1, marginTop: 20}}>
                    <FlatList
                    data={ejercicios}
                    extraData={ejercicios}

                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => listItemView(item)}
                    />
                </View>

                <View style={styles.contenedor_botones_reproduccion}>
                    {/* Boton de reiniciar */}
                    <TouchableOpacity style={styles.boton_reset}
                        onPress={()=>{console.log("Reiniciar")}}
                        >
                        <FontAwesome5
                            name = {"redo"}
                            size = {18}
                            color = {"black"}
                            style = {styles.icono_rep}
                        />
                    </TouchableOpacity>

                    {/* Boton de reproducir */}
                    <TouchableOpacity style={styles.boton_reproduccion}
                        onPress={()=>{
                            setNombreEjercicioActual(ejercicios[0].Nombre);
                            setDuracionActual(ejercicios[0].Duracion)
                            setVisibilidadTarjeta(true)}}
                        >
                        <FontAwesome5
                            name = {"play"}
                            size = {18}
                            color = {"black"}
                            style = {styles.icono_rep}
                        />
                    </TouchableOpacity>

                    {/* Boton de detener */}
                    <TouchableOpacity style={styles.boton_reproduccion}
                        onPress={()=>{console.log("Stop")}}
                        >
                        <FontAwesome5
                            name = {"stop"}
                            size = {18}
                            color = {"black"}
                            style = {styles.icono_rep}
                        />
                    </TouchableOpacity>
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
    contenedor_duracion:{
        flex: 1,
        flexDirection: "row-reverse"
    },
    duracion_rutina:{
        color: "black",
        fontSize: 17,
        paddingTop: 27,
        paddingRight: 30,
    },
    contenido_tarjeta: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 5,
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
        borderRadius: 10
    },
    texto_tarjetas:{
        fontSize: 17,
        color: "black",
        paddingBottom: 3,
        paddingTop: 3
    },
    contenedor_botones_reproduccion:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: 20
    },
    boton_reset:{
        marginTop: 18,
        paddingLeft: 3,
        paddingTop: 7,
        width: 45,
        height: 45,
        backgroundColor: "white",
        borderRadius: 30
    },
    boton_reproduccion:{
        marginLeft: 20,
        marginTop: 18,
        paddingLeft: 5,
        paddingTop: 7,
        width: 45,
        height: 45,
        backgroundColor: "white",
        borderRadius: 30
    },
    icono_rep:{
        padding: 5,
        paddingLeft: 10
    },
    // Modal Styles
    modal_centrado:{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#0000005e"
      },
      modal_recuadro:{
        height: "90%",
        width: "85%",
        backgroundColor: "white",
        borderRadius: 10
      },
      modal_body: {
        flex: 1,
        alignItems: 'center',
      },
      seccion_control:{
        width: "100%",
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start"
      },
      boton_go_back_2:{
        marginTop: 18,
        marginLeft: 14,
        padding: 5,
        width: 40,
        height: 38,
        backgroundColor: "#c7e9ea",
        borderRadius: 30
    },
  });

  export default Rutina_detalle;