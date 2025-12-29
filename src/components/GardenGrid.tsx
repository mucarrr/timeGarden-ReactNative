import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Flower } from '../types';
import AnimatedFlower from './AnimatedFlower';

interface GardenGridProps {
  flowers: Flower[];
}

const { width } = Dimensions.get('window');
const GRID_SIZE = 6; // 6x6 grid
const CELL_SIZE = (width * 0.7) / GRID_SIZE;

const GardenGrid: React.FC<GardenGridProps> = ({ flowers }) => {
  const renderCell = (row: number, col: number, index: number) => {
    const flower = flowers.find(
      f => f.position.row === row && f.position.col === col,
    );

    if (flower) {
      // Yeni eklenen çiçekler için animasyon delay'i
      const isNewFlower = flowers.indexOf(flower) === flowers.length - 1;
      const delay = isNewFlower ? 0 : index * 50;

      return (
        <View key={`${row}-${col}`} style={styles.cell}>
          <AnimatedFlower
            color={flower.color}
            size={CELL_SIZE * 0.6}
            delay={delay}
          />
        </View>
      );
    }

    return <View key={`${row}-${col}`} style={styles.cell} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {Array.from({ length: GRID_SIZE }).map((_, row) =>
          Array.from({ length: GRID_SIZE }).map((_, col) => {
            const index = row * GRID_SIZE + col;
            return renderCell(row, col, index);
          }),
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: '#C8E6C9',
    borderRadius: 20,
    padding: 5,
    borderWidth: 3,
    borderColor: '#81C784',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A5D6A7',
    backgroundColor: '#E8F5E9',
  },
});

export default GardenGrid;

