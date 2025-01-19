import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import axiosInstance from '../utils/axiosInstance';

interface Resep {
  _id: string;
  name: string;
  bahan: string;
  langkah: string;
}

const HomeScreen = ({ route }: { route: any }) => {
  const [reseps, setReseps] = useState<Resep[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchReseps = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/reseps');
      setReseps(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch recipes.');
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await axiosInstance.get('/reseps');
      setReseps(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to refresh recipes.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReseps();
  }, [fetchReseps]);

  useEffect(() => {
    if (route.params?.newResep) {
      setReseps((prevReseps) => [...prevReseps, route.params.newResep]);
    }
  }, [route.params?.newResep]);

  const renderResepCard = ({ item }: { item: Resep }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSubtitle}>Bahan:</Text>
      <Text style={styles.cardContent}>{item.bahan}</Text>
      <Text style={styles.cardSubtitle}>Langkah:</Text>
      <Text style={styles.cardContent}>{item.langkah}</Text>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Buku Resep Anda</Text>
          <Text style={styles.subtitle}>Kelola resep dengan mudah dan praktis</Text>
        </>
      }
      data={reseps}
      keyExtractor={(item) => item._id}
      renderItem={renderResepCard}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: 50,
    marginBottom: 10,
    textAlign: 'center',
    color: '#800000',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#A52A2A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#800000',
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#A52A2A',
  },
  cardContent: {
    fontSize: 14,
    color: '#8B0000',
    lineHeight: 20,
  },
});

export default HomeScreen;
