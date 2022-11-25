import React, { cloneElement, useEffect, useState } from 'react';

import {
StyleSheet,
Text,
View
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

const TituloPrincipal = (props) => {
    return(
        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#928fc1', '#7a9dbd', '#5cacba']} style={{
        height:114}} >
            <View style={styles.contenedor_principal}>
            <View style={styles.contenedor_nombre_app}>
                <FontAwesome5
                        name = {"dumbbell"}
                        size = {14}
                        color = {"black"}
                        style = {styles.logotipo}
                    />
                <Text style={styles.textoH}>Brizz</Text>
            </View>
            <View style={styles.contenedor_tituloH}>
                {/* Hacemos uso de las propiedades pasadas al componente */}
                <Text style={styles.tituloH}>{props.titulo}</Text>   
            </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    contenedor_principal:{
        zIndex: 0
    },
    contenedor_nombre_app:{
        marginTop: 5,
        flexDirection: 'row'
    },
    textoH:{
        fontSize: 17,
        color: "black"
    },
    logotipo:{
        padding: 5,
        paddingLeft: 10
    },
        contenedor_tituloH:{
        alignItems: "center"
    },
    tituloH:{
        color: "white",
        fontWeight: "bold",
        fontSize: 30
    }
})

export default TituloPrincipal;