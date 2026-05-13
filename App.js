import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  Animated,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [keterangan, setKeterangan] = useState('');
  const [nominalInput, setNominalInput] = useState('');
  
  // State Array dengan ID, Ket, Nominal, Tipe, Tanggal, dan Waktu
  const [transaksi, setTransaksi] = useState([
    { 
      id: 'TRX-171558', 
      ket: 'Gaji Bulanan', 
      nominal: 5000000, 
      tipe: 'masuk', 
      tanggal: '13 Mei 2026', 
      waktu: '08:00' 
    },
  ]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleTambah = (tipe) => {
    if (!keterangan || !nominalInput) return;

    // Inovasi: Membuat ID Unik Berdasarkan Waktu
    const uniqueId = `TRX-${Math.floor(Date.now() / 1000).toString().slice(-6)}`;
    
    // Mengambil Waktu dan Tanggal Real-time
    const sekarang = new Date();
    const tgl = sekarang.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const jam = sekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const baru = {
      id: uniqueId,
      ket: keterangan,
      nominal: parseInt(nominalInput),
      tipe: tipe,
      tanggal: tgl,
      waktu: jam
    };

    setTransaksi([baru, ...transaksi]);
    setKeterangan('');
    setNominalInput('');
  };

  const hapusItem = (id) => {
    setTransaksi(transaksi.filter(item => item.id !== id));
  };

  // Logic Hitung Saldo (Reduce)
  const totalMasuk = transaksi.filter(t => t.tipe === 'masuk').reduce((s, t) => s + t.nominal, 0);
  const totalKeluar = transaksi.filter(t => t.tipe === 'keluar').reduce((s, t) => s + t.nominal, 0);
  const totalSaldo = totalMasuk - totalKeluar;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Saldo Modern */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.labelHeader}>DOMPETKU DIGITAL</Text>
        <Text style={styles.saldoText}>Rp {totalSaldo.toLocaleString()}</Text>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryIn}>▲ Rp {totalMasuk.toLocaleString()}</Text>
          <Text style={styles.summaryOut}>▼ Rp {totalKeluar.toLocaleString()}</Text>
        </View>
      </Animated.View>

      {/* Form Input */}
      <View style={styles.cardForm}>
        <TextInput 
          style={styles.input} 
          placeholder="Keterangan (Contoh: Beli cilok)" 
          value={keterangan}
          onChangeText={setKeterangan}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Nominal (Rp)" 
          keyboardType="numeric"
          value={nominalInput}
          onChangeText={setNominalInput}
        />
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, styles.btnMasuk]} onPress={() => handleTambah('masuk')}>
            <Ionicons name="add-circle" size={18} color="#fff" />
            <Text style={styles.btnText}> Income</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnKeluar]} onPress={() => handleTambah('keluar')}>
            <Ionicons name="remove-circle" size={18} color="#fff" />
            <Text style={styles.btnText}> Outcome</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List Riwayat */}
      <Text style={styles.listTitle}>Riwayat Transaksi</Text>
      <FlatList
        data={transaksi}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <View style={styles.historyLeft}>
              <View style={[styles.iconCircle, { backgroundColor: item.tipe === 'masuk' ? '#eefdf3' : '#fdf2f2' }]}>
                <Ionicons 
                  name={item.tipe === 'masuk' ? 'trending-up' : 'trending-down'} 
                  size={20} 
                  color={item.tipe === 'masuk' ? '#2ecc71' : '#e74c3c'} 
                />
              </View>
              <View>
                <Text style={styles.historyKet}>{item.ket}</Text>
                {/* Menampilkan ID dan Waktu sebagai Inovasi */}
                <Text style={styles.historyMeta}>{item.id} • {item.tanggal} {item.waktu}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.historyNominal, { color: item.tipe === 'masuk' ? '#2ecc71' : '#e74c3c' }]}>
                {item.tipe === 'masuk' ? '+' : '-'} {item.nominal.toLocaleString()}
              </Text>
              <TouchableOpacity onPress={() => hapusItem(item.id)}>
                <Text style={styles.textHapus}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Belum ada transaksi.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9', padding: 20 },
  header: { 
    backgroundColor: '#fff', 
    padding: 25, 
    borderRadius: 25, 
    alignItems: 'center', 
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  labelHeader: { color: '#7f8c8d', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  saldoText: { color: '#2c3e50', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
  divider: { width: '80%', height: 1, backgroundColor: '#f1f2f6', marginVertical: 10 },
  summaryRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  summaryIn: { color: '#2ecc71', fontWeight: 'bold', fontSize: 13 },
  summaryOut: { color: '#e74c3c', fontWeight: 'bold', fontSize: 13 },
  
  cardForm: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 25, elevation: 2 },
  input: { backgroundColor: '#f8f9fa', borderRadius: 12, padding: 12, marginBottom: 12, fontSize: 14 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, padding: 14, borderRadius: 12, marginHorizontal: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnMasuk: { backgroundColor: '#2ecc71' },
  btnKeluar: { backgroundColor: '#e74c3c' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  listTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15 },
  historyCard: { backgroundColor: '#fff', padding: 15, borderRadius: 18, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: { width: 45, height: 45, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  historyKet: { fontSize: 15, fontWeight: '600', color: '#2c3e50' },
  historyMeta: { fontSize: 10, color: '#95a5a6', marginTop: 3 },
  historyNominal: { fontSize: 15, fontWeight: 'bold' },
  textHapus: { color: '#bdc3c7', fontSize: 10, marginTop: 5, textDecorationLine: 'underline' },
  empty: { textAlign: 'center', marginTop: 20, color: '#bdc3c7' }
});