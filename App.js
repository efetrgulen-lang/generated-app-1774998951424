import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveNotes = async (newNotes) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    } catch (error) {
      console.error(error);
    }
  };

  const addNote = () => {
    if (inputText.trim() === '') return;
    const newNote = { id: Date.now().toString(), text: inputText };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setInputText('');
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Not Defteri</Text>
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <Text style={styles.noteText}>{item.text}</Text>
            <TouchableOpacity onPress={() => deleteNote(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Sil</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Henüz not eklenmedi.</Text>}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Yeni not ekle..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.addButton} onPress={addNote}>
            <Text style={styles.addButtonText}>Ekle</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#333' },
  noteItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, marginHorizontal: 20, marginVertical: 8, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, alignItems: 'center', justifyContent: 'space-between' },
  noteText: { fontSize: 16, color: '#333', flex: 1 },
  deleteButton: { backgroundColor: '#ff5252', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
  inputContainer: { flexDirection: 'row', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, backgroundColor: '#fafafa', marginRight: 10 },
  addButton: { backgroundColor: '#4CAF50', paddingHorizontal: 20, justifyContent: 'center', borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});