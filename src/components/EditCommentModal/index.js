// src/components/EditCommentModal.js
import React from 'react';
import { View, Modal, TextInput, Button, StyleSheet } from 'react-native';

const EditCommentModal = ({ visible, onClose, onSave, text, setText }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Edite o Comentário"
                        value={text}
                        onChangeText={setText}
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Salvar" onPress={onSave} />
                        <Button title="Cancelar" color="red" onPress={onClose} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default EditCommentModal;
