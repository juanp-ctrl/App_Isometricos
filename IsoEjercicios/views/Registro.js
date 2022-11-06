import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Registro = ({navigation}) => {
    return(
      <View style={styles.body}>
        <Text style={styles.texto}>Registro de actividad</Text>
      </View>
    )
  }

  const styles = StyleSheet.create({
    body:{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#c7e9ea",
      borderTopEndRadius: 35,
      borderTopLeftRadius: 35,
      zIndex: 1,
      marginTop: -30
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

  export default Registro;