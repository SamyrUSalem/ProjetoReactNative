import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Register({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        try {
            const existingUser = await AsyncStorage.getItem(username);
            if (existingUser !== null) {
                Alert.alert('Erro', 'Nome de usuário já existe');
            } else {
                await AsyncStorage.setItem(username, JSON.stringify({ password }));
                Alert.alert('Sucesso', 'Usuário registrado com sucesso');
                navigation.replace('Login');
            }
        } catch (error) {
            console.error('Erro ao salvar dados de registro:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    input: {
        width: '100%',
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
    },
});

export default Register;
