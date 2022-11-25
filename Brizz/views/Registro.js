import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
} from 'react-native';

import ProgressBar from 'react-native-progress/Bar'
import { BarChart } from 'react-native-chart-kit';

const Registro = ({navigation}) => {

  const [nombreUsuario, setNombreUsuario] = useState("Juan Pablo");

    return(
      <View style={styles.body}>

        {/* Sección de saludo */}
        <View style={styles.seccion_saludo}>
          <Text style={styles.texto_suludo}>Buenos dias, {nombreUsuario}</Text>
          <Text style={styles.texto_seccion_saludo}>Este es tu registro hasta la fecha:</Text>
        </View>

        {/* Sección de las estadisticas de dias y horas de la app */}
        <View style={styles.seccion_estadisticas_usuario}>
          <View style={styles.seccion_dias}>
            <Text style={styles.titulo_stats}>Días</Text>
            <View style={styles.conteneder_stats}>
              <Text style={styles.texto_stats_sup}>213</Text>
              <Text style={styles.texto_stats}>Dias del año</Text>
            </View>
          </View>
          <View style={styles.seccion_horas}>
            <Text style={styles.titulo_stats}>Horas</Text>
            <View style={styles.conteneder_stats}>
              <Text style={styles.texto_stats_sup}>426 hrs</Text>
              <Text style={styles.texto_stats}>Promedio de 2hrs diarias</Text>
            </View>
          </View>
        </View>

        {/* Barra de progreso */}
        <View style={styles.seccion_barra_progreso}>
          <Text style={styles.texto_seccion_saludo}>Progreso!</Text>
          <View style={styles.barra_progreso}>
            <ProgressBar progress={0.3} width={null} height={12} color={"#4af8ff"} unfilledColor={"white"} borderColor={"#c7e9ea"} borderRadius={10}/>
          </View>
        </View>

        <View style={styles.seccion_estadisticas_meses}>
          <Text style={styles.titulo_stats_meses}>Actividad Mensual</Text>
          <Text style={styles.subtitulo_stats_meses}>Día en transcurso: 16 de Noviembre</Text>
          <View style={styles.contenedor_grafica}>
            <BarChart
              data={{
                labels: ["Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100
                    ]
                  }
                ]
              }}
              width={Dimensions.get("window").width - 65}
              height={220}
              yAxisSuffix="%"
              yAxisInterval={1}
              chartConfig={{
                backgroundGradientFrom: "#7887be",
                backgroundGradientTo: "#7887be",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                barPercentage: 0.5,
                fillShadowGradient: 'white', // THIS
                fillShadowGradientOpacity: 2, // THIS
              }}
            />
          </View>
        </View>
      </View>
    )
  }

  const styles = StyleSheet.create({
    body:{
      flex: 1,
      backgroundColor: "#c7e9ea",
      borderTopEndRadius: 35,
      borderTopLeftRadius: 35,
      zIndex: 1,
      marginTop: -30
    },
    seccion_saludo:{
      paddingTop: 14,
      paddingLeft: 20,
    },
    texto_suludo:{
      fontSize: 28,
      color: "#47aaca",
      fontWeight: "bold",
      paddingBottom: 5
    },
    texto_seccion_saludo:{
      fontSize: 17,
      color: "#60477e",
    },
    seccion_estadisticas_usuario:{
      flexDirection: "row"
    },
    seccion_dias:{
      flex: 1,
      borderRadius: 25,
      backgroundColor: "#60477e",
      marginLeft: 14,
      marginTop: 20,
      marginRight: 14
    },
    seccion_horas:{
      flex: 1,
      borderRadius: 25,
      backgroundColor: "#60477e",
      marginRight: 14,
      marginTop: 20,
    },
    titulo_stats:{
      fontSize: 19,
      fontWeight: "bold",
      paddingLeft: 20,
      paddingTop: 10,
      paddingBottom: 3,
      color: "white"
    },
    conteneder_stats:{
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 20,
    },
    texto_stats_sup:{
      fontSize: 19,
      color: "white",
      paddingBottom: 3
    },
    texto_stats:{
      fontSize: 12,
      color: "white"
    },
    seccion_barra_progreso:{
      marginTop: 10,
      marginLeft: 20
    },
    barra_progreso:{
      marginTop: 5,
      marginRight: 20
    },
    seccion_estadisticas_meses:{
      flex: 1,
      borderTopEndRadius: 35,
      borderTopLeftRadius: 35,
      marginTop: 20,
      marginLeft: 20,
      marginRight: 20,
      backgroundColor: "#7887be",
      alignItems: "center",
      justifyContent: "center"
    },
    titulo_stats_meses:{
      fontSize: 18,
      fontWeight: "bold",
      color: "white",
      marginTop: 7,
      marginBottom: 5
    },
    subtitulo_stats_meses:{
      fontSize: 14,
      color: "white"
    },
    contenedor_grafica:{
      marginTop: 10
    }
  });

  export default Registro;