import React, { Component } from 'react'
import socket from 'socket.io-client'

import api from '../services/api'
import Tweet from '../components/Tweet'

import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'

class Timeline extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Início",
        headerRight: (
            <TouchableOpacity onPress={ () => navigation.navigate('New') }>
                <Icon
                    name="add-circle-outline"
                    style={{ marginRight: 20 }}
                    size={24}
                    color="#4BB0EE"
                />
            </TouchableOpacity>
        )
    })

    state = {
        tweets: []
    }

    async componentDidMount() {
        this.subscribeToEvents()

        const response = await api.get('tweets')

        this.setState({ tweets: response.data })
    }

    subscribeToEvents = () => {
        const io = socket('http://10.0.3.2:3000')

        io.on('tweet', data => {
            this.setState({ tweets: [ data, ...this.state.tweets ]})
        })
        io.on('like', data => {
            this.setState({ tweets: this.state.tweets.map( tweet => 
                tweet._id === data._id ? data : tweet
            )})
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.tweets}
                    keyExtractor={ tweet => tweet._id }
                    renderItem={ ({ item }) => <Tweet tweet={item} /> } 
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingLeft: 25,
      backgroundColor: "#FFF"
    }
  })
  

export default Timeline