// src/components/CommentInput.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const CommentInput = ({ onAddComment }) => {
    const [comment, setComment] = useState('');

    const handleAddComment = () => {
        if (comment.trim()) {
            onAddComment(comment);
            setComment('');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Envie um Comentário"
                value={comment}
                onChangeText={setComment}
            />
            <Button title="Adicionar" onPress={handleAddComment} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        marginRight: 8,
    },
});

export default CommentInput;
