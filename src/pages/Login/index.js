import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }
        try {
            // Recupera os dados do usuário do AsyncStorage
            const userData = await AsyncStorage.getItem(username);

            // Verifica se os dados do usuário foram encontrados
            if (userData !== null) {
                // Converte os dados do usuário de string para objeto JSON
                const user = JSON.parse(userData);

                if (user.password === password) {
                    navigation.navigate('Posts');
                } else {
                    Alert.alert('Erro', 'Nome de usuário ou senha incorretos');
                }
            } else {
                Alert.alert('Erro', 'Usuário não encontrado');
            }
        } catch (error) {
            console.error('Erro ao recuperar dados do usuário:', error);
            Alert.alert('Erro', 'Ocorreu um erro durante o login');
        }
    };

    const handleNavigateToRegister = () => {
        navigation.navigate('Register');
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
            <Button title="Login" onPress={handleLogin} />
            <Button title="Registre-se" onPress={handleNavigateToRegister} />
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

export default Login;
