import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Calendario = ({navigation}) => {
    return(
      <View style={styles.body}>
        <Text style={styles.texto}>Calendario</Text>
      </View>
    )
  }

  const styles = StyleSheet.create({
    body:{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#b2e5e5"
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

  export default Calendario;