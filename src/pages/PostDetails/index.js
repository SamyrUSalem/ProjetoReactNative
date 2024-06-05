import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import CommentInput from '../../components/CommentInput';
import EditCommentModal from '../../components/EditCommentModal';
import { loadPostComments, savePostComments } from '../../utils/storageComments';

const STORAGE_KEY = '@comments_';

function PostDetails({ route }) {
    const { post } = route.params;
    const [comments, setComments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        const loadComments = async () => {
            const postComments = await loadPostComments(post.id);
            setComments(postComments);
        };
        loadComments();
    }, [post.id]);

    const handleAddComment = async (comment) => {
        const newComment = {
            id: Date.now().toString(),
            text: comment,
        };
        const updatedComments = [newComment, ...comments];
        setComments(updatedComments);
        await savePostComments(post.id, updatedComments);
    };

    const handleDeleteComment = async (commentId) => {
        Alert.alert(
            'Deletar Comentário',
            'Tem certeza?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        const updatedComments = comments.filter(comment => comment.id !== commentId);
                        setComments(updatedComments);
                        await savePostComments(post.id, updatedComments);
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const handleEditComment = (comment) => {
        setCurrentComment(comment);
        setCommentText(comment.text);
        setModalVisible(true);
    };

    const handleSaveEdit = async () => {
        const updatedComment = { ...currentComment, text: commentText };
        const updatedComments = comments.map(comment => (comment.id === updatedComment.id ? updatedComment : comment));
        setComments(updatedComments);
        await savePostComments(post.id, updatedComments);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.body}>{post.body}</Text>
            <CommentInput onAddComment={handleAddComment} />
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                        <Text>{item.text}</Text>
                        <View style={styles.buttonContainer}>
                            <Button title="Editar" onPress={() => handleEditComment(item)} />
                            <Button title="Deletar" color="red" onPress={() => handleDeleteComment(item.id)} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text>Sem comentários...</Text>}
                extraData={comments}
            />
            <EditCommentModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveEdit}
                text={commentText}
                setText={setCommentText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    body: {
        fontSize: 16,
        marginBottom: 16,
    },
    commentItem: {
        backgroundColor: '#DAD8D6',
        borderRadius: 8,
        padding: 16,
        marginTop: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
});

export default PostDetails;
