import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

function Login({ navigation, onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }
        onLogin(username, password);
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
            <View style={styles.buttonsContainer}>
                <View>
                    <Button title="Login" onPress={handleLogin} />
                </View>
                <View>
                    <Button title="Registre-se" onPress={handleNavigateToRegister} />
                </View>
            </View>
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
    buttonsContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default Login;
