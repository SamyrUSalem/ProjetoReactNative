// src/components/EditPostModal.js
import React from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';

function EditPostModal({ visible, onClose, onSave, title, setTitle, body, setBody }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Editando...</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Title"
                    />
                    <TextInput
                        style={styles.input}
                        value={body}
                        onChangeText={setBody}
                        placeholder="Body"
                        multiline
                    />
                    <View style={styles.buttons}>
                        <Button title="Save" onPress={onSave} />
                        <Button title="Cancel" onPress={onClose} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        width: '100%',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    }
});

export default EditPostModal;
