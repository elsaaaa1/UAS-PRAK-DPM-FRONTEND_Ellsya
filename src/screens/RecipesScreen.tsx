import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axiosInstance from '../utils/axiosInstance';

interface Resep {
  _id: string;
  name: string;
  bahan: string;
  langkah: string;
}

const RecipesScreen = () => {
  const [items, setItems] = useState<Resep[]>([]);
  const [name, setName] = useState('');
  const [bahan, setBahan] = useState('');
  const [langkah, setLangkah] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchReseps = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/reseps');
      setItems(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch reseps.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateResep = async () => {
    if (!name || !bahan || !langkah) {
      Alert.alert('Validation', 'Name, Bahan, and Langkah are required.');
      return;
    }

    try {
      if (editMode && editingId) {
        await axiosInstance.put(`/reseps/${editingId}`, { name, bahan, langkah });
        Alert.alert('Success', 'Resep updated successfully!');
      } else {
        const response = await axiosInstance.post('/reseps', { name, bahan, langkah });
        Alert.alert('Success', 'Resep added successfully!');
        setItems((prevItems) => [...prevItems, response.data]);
      }
      resetForm();
      fetchReseps();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to save Resep.');
    }
  };

  const handleDeleteResep = async (id: string) => {
    try {
      await axiosInstance.delete(`/reseps/${id}`);
      Alert.alert('Success', 'Resep deleted successfully!');
      fetchReseps();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to delete Resep.');
    }
  };

  const handleEditResep = (item: Resep) => {
    setName(item.name);
    setBahan(item.bahan);
    setLangkah(item.langkah);
    setEditMode(true);
    setEditingId(item._id);
  };

  const resetForm = () => {
    setName('');
    setBahan('');
    setLangkah('');
    setEditMode(false);
    setEditingId(null);
  };

  useEffect(() => {
    fetchReseps();
  }, []);

  const renderRecipeCard = ({ item }: { item: Resep }) => (
    <View style={styles.recipeCard}>
      <Text style={styles.recipeTitle}>{item.name}</Text>
      <Text style={styles.recipeSubtitle}>Bahan:</Text>
      <Text style={styles.recipeContent}>{item.bahan}</Text>
      <Text style={styles.recipeSubtitle}>Langkah:</Text>
      <Text style={styles.recipeContent}>{item.langkah}</Text>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEditResep(item)}>
          <AntDesign name="edit" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteResep(item._id)}>
          <AntDesign name="delete" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buku Resep Anda</Text>
      <Text style={styles.subtitle}>
        {editMode ? 'Edit Resep yang Dipilih' : 'Tambahkan Resep Baru atau Lihat Daftar Resep'}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nama Resep"
          placeholderTextColor="#A0522D"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Bahan"
          placeholderTextColor="#A0522D"
          value={bahan}
          onChangeText={setBahan}
        />
        <TextInput
          style={styles.input}
          placeholder="Langkah"
          placeholderTextColor="#A0522D"
          value={langkah}
          onChangeText={setLangkah}
        />
      </View>

      <Pressable style={styles.addButton} onPress={handleAddOrUpdateResep}>
        <Text style={styles.addButtonText}>
          {editMode ? 'Perbarui Resep' : 'Tambah Resep'}
        </Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderRecipeCard}
        contentContainerStyle={styles.recipeList}
        refreshing={loading}
        onRefresh={fetchReseps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingTop: 40,
    marginBottom: 10,
    textAlign: 'center',
    color: '#800000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#A52A2A',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#800000',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#8B0000',
  },
  addButton: {
    backgroundColor: '#800000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  recipeList: {
    marginTop: 20,
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: '#FFF8DC',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8B4513',
  },
  recipeSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#A0522D',
  },
  recipeContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B4226',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#8B0000',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default RecipesScreen;
