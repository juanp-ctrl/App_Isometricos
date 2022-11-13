import React, { Component, useState } from 'react'
import { 
    StyleSheet, 
    View, 
    Text,
    TouchableOpacity 
} from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export class Timer extends Component {
    constructor(props){
        super(props)
        this.state={
            tiempos: props.tiempo,
            timeLeft: 60,
            segundos: 0,
            minutos: 0,
            contadorPlay: 0,
            iterador: 0,
            nombres: props.nombre,
            ejercicio: "",
            boton_play: "play"
        }
    }

    componentDidMount(){
        if(this.state.contadorPlay == 1){
            if(this.state.segundos > 60){
                this.setState({minutos: (this.state.segundos/60)})

                this.interval = setInterval(
                    () => {
                        if(this.state.timeLeft == 0){
                            this.setState({
                                timeLeft: 60,
                                minutos: this.state.minutos - 1
                            })
                        }
                        else if(this.state.timeLeft > 0){
                            this.setState({
                                timeLeft: this.state.timeLeft - 1
                            })
                        } 
    
                }
                    , 1000)
            }
            else{
                this.interval = setInterval(
                    () => {
                        if(this.state.timeLeft == 0){
                            this.setState({
                                minutos: -1,
                            })
                        }
                        else if(this.state.timeLeft > 0){
                            this.setState({
                                timeLeft: this.state.timeLeft - 1
                            })
                        } 
    
                }
                    , 1000)
            }
            this.setState({contadorPlay: 2})
        }
        else{
            console.log("waitin")
            if(this.state.segundos < 60){
                this.setState({segundos: this.state.tiempos[this.state.iterador]})
                this.setState({timeLeft: this.state.tiempos[this.state.iterador]})
                this.setState({ejercicio: this.state.nombres[this.state.iterador]})
            }
        }
    }

    componentDidUpdate(prevProps, prevState){
        if (this.state.minutos < 0){
            if(this.state.iterador == this.state.tiempos.length-1){
                console.log("hasta aca")
                clearInterval(this.interval)
            }
            else{
                this.setState({minutos: 0})
                this.setState({iterador: this.state.iterador + 1})
                this.setState({segundos: this.state.tiempos[this.state.iterador+1]})
                this.setState({timeLeft: this.state.tiempos[this.state.iterador+1]})
                this.setState({ejercicio: this.state.nombres[this.state.iterador+1]})
            }
        }
        else if (this.state.contadorPlay == 1){
            this.componentDidMount()
            this.setState({contadorPlay: 2})
        }
        else if (this.state.contadorPlay == 0){
            clearInterval(this.interval)
        }
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    render() {
        console.log(this.state);
        return (
            <>
            {this.state.minutos >= 0 ? <>
            {/* Titulo del ejercicio */}
            <Text style={styles.titulo_ejercicio}>{this.state.ejercicio}</Text>

            <Text style={styles.titulo}>Tiempo restante:</Text>
            <View style={styles.contenedor_tiempo}>
                <View style={styles.contenedor_detallesTiempo}>
                    <Text style={styles.texto_tiempo}>{this.state.minutos}</Text>
                    <Text>Min</Text>
                </View>
                <View style={styles.contenedor_detallesTiempo}>
                    <Text style={styles.texto_tiempo}>{this.state.timeLeft}</Text>
                    <Text>Seg</Text>
                </View>
            </View>
            </>
            :
            <Text style={styles.titulo_final}>
                Tiempo!
            </Text>
            }

            {/* Boton de stop */}
            <TouchableOpacity style={styles.boton_stop}
                onPress={()=>{
                    this.setState({timeLeft: this.state.segundos})
                    this.setState({contadorPlay: 0})
                }}
                >
                <FontAwesome5
                    name = {"stop"}
                    size = {18}
                    color = {"black"}
                    style = {styles.icono_rep}
                />
            </TouchableOpacity>

            {/* Contenedor de botones de reproduccion */}
            <View style={styles.botones_reproduccion_tarjeta}>

                {/* Boton de backward */}
                <TouchableOpacity style={styles.boton_prev}
                    onPress={()=>{
                        console.log("previous")
                        if(this.state.iterador > 0){
                            this.setState({iterador: this.state.iterador - 1})
                            this.setState({segundos: this.state.tiempos[this.state.iterador-1]})
                            this.setState({timeLeft: this.state.tiempos[this.state.iterador-1]})
                            this.setState({ejercicio: this.state.nombres[this.state.iterador-1]})
                        }
                        else{
                            console.log("Primer ejercicio")
                        }
                    }}
                    >
                    <FontAwesome5
                        name = {"step-backward"}
                        size = {18}
                        color = {"black"}
                        style = {styles.icono_rep}
                    />
                </TouchableOpacity>

                {/* Boton de reproducir */}
                <TouchableOpacity style={styles.boton_play}
                    onPress={()=>{
                        if(this.state.contadorPlay != 2){
                            this.setState({contadorPlay: 1})
                            this.setState({boton_play: "pause"})
                        }
                        else{
                            this.setState({contadorPlay: 0})
                            this.setState({boton_play: "play"})
                        }
                    }}
                    >
                    <FontAwesome5
                        name = {this.state.boton_play}
                        size = {18}
                        color = {"black"}
                        style = {styles.icono_rep}
                    />
                </TouchableOpacity>

                {/* Boton de forward */}
                <TouchableOpacity style={styles.boton_next}
                    onPress={()=>{
                        console.log("next")
                        if(this.state.iterador < this.state.tiempos.length-1){
                            this.setState({iterador: this.state.iterador + 1})
                            this.setState({segundos: this.state.tiempos[this.state.iterador+1]})
                            this.setState({timeLeft: this.state.tiempos[this.state.iterador+1]})
                            this.setState({ejercicio: this.state.nombres[this.state.iterador+1]})
                        }
                        else{
                            this.setState({minutos: -1})
                            console.log("Ultimo ejercicio")
                        }
                    }}
                    >
                    <FontAwesome5
                        name = {"step-forward"}
                        size = {18}
                        color = {"black"}
                        style = {styles.icono_rep}
                    />
                </TouchableOpacity>
            </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    titulo:{
        fontSize: 16,
        color: "black",
        paddingBottom: 10,
        marginTop: 100,
    },
    titulo_final:{
        fontSize: 27,
        color: "black",
        paddingTop: 30
    },
    titulo_ejercicio:{
        paddingTop: 50,
        fontSize: 26,
        color: "black"
    },
    contenedor_tiempo:{
        flexDirection: "row",
    },
    contenedor_detallesTiempo:{
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "black",
        margin: 7,
        alignItems: "center"
    },
    texto_tiempo:{
        fontSize: 26,
        color: "black"
    },
    boton_stop:{
        marginTop: 50,
        paddingLeft: 5,
        paddingTop: 7,
        width: 45,
        height: 45,
        backgroundColor: "#7887bec7",
        borderRadius: 30
    },
    botones_reproduccion_tarjeta:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 70,
        marginBottom: 70
    },
    boton_prev:{
        marginTop: 18,
        paddingTop: 7,
        paddingLeft: 4,
        width: 45,
        height: 45,
        backgroundColor: "#7887bec7",
        borderRadius: 30
    },
    boton_play:{
        marginLeft: 20,
        marginTop: 18,
        paddingLeft: 5,
        paddingTop: 7,
        width: 45,
        height: 45,
        backgroundColor: "#7887bec7",
        borderRadius: 30
    },
    boton_next:{
        marginLeft: 20,
        marginTop: 18,
        paddingLeft: 6,
        paddingTop: 7,
        width: 45,
        height: 45,
        backgroundColor: "#7887bec7",
        borderRadius: 30
    },
    icono_rep:{
        padding: 5,
        paddingLeft: 10
    },
})

export default Timer