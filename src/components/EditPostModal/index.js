// src/components/EditPostModal.js
import React from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';

const EditPostModal = ({ visible, onClose, onSave, title, setTitle, body, setBody }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Post</Text>
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
                    <Button title="Save" onPress={onSave} />
                    <Button title="Cancel" onPress={onClose} />
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
});

export default EditPostModal;
