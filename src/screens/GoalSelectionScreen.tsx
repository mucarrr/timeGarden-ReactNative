import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import IconWrapper from '../components/IconWrapper';
import { Colors, CommonStyles, FontSizes, FontWeights, Spacing, BorderRadius } from '../styles/theme';

interface GoalSelectionScreenProps {
  navigation?: any;
  onComplete?: () => void;
}

const GoalSelectionScreen: React.FC<GoalSelectionScreenProps> = ({
  navigation,
  onComplete,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);

  const handleGoalSelect = (goal: number) => {
    setSelectedGoal(goal);
  };

  const handleConfirm = () => {
    if (!selectedGoal) {
      // No goal selected, don't proceed
      return;
    }
    if (onComplete) {
      onComplete();
    } else if (navigation) {
      navigation.navigate('Garden');
    }
  };

  const goalOptions = [1, 2, 3, 4];

  return (
    <SafeAreaView style={styles.container}>
      {/* Pattern Overlay */}
      <View style={styles.patternOverlay} />

      {/* Content */}
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <IconWrapper
              name="psychology-alt"
              size={28}
              color={Colors.primary}
              emojiFallback="💭"
            />
          </View>
          <Text style={styles.title}>
            Günde kaç vakit namaz kılmak istersin?
          </Text>
          <Text style={styles.subtitle}>
            Kendine uygun bir hedef seç ve bahçeni büyüt! 🌱
          </Text>
        </View>

        {/* Goal Options Grid */}
        <View style={styles.gridContainer}>
          {/* 1-4 Vakit Options */}
          {goalOptions.map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.goalCard,
                selectedGoal === goal && styles.goalCardSelected,
              ]}
              onPress={() => handleGoalSelect(goal)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.goalNumber,
                  selectedGoal === goal && styles.goalNumberSelected,
                ]}>
                {goal}
              </Text>
              <Text
                style={[
                  styles.goalLabel,
                  selectedGoal === goal && styles.goalLabelSelected,
                ]}>
                Vakit
              </Text>
              <View style={styles.leafIcon}>
                <IconWrapper
                  name="eco"
                  size={18}
                  color={
                    selectedGoal === goal
                      ? Colors.primary
                      : 'rgba(0, 0, 0, 0.1)'
                  }
                  emojiFallback="🍃"
                />
              </View>
            </TouchableOpacity>
          ))}

          {/* 5 Vakit Selected Card */}
          <TouchableOpacity
            style={[
              styles.selectedCard,
              selectedGoal !== 5 && styles.selectedCardUnselected,
            ]}
            onPress={() => handleGoalSelect(5)}
            activeOpacity={0.9}>
            <View style={styles.selectedCardContent}>
              <View style={styles.selectedCardLeft}>
                <View
                  style={[
                    styles.flowerIconContainer,
                    selectedGoal !== 5 && styles.flowerIconContainerUnselected,
                  ]}>
                  <IconWrapper
                    name="local-florist"
                    size={24}
                    color={selectedGoal === 5 ? '#FFFFFF' : Colors.textSecondary}
                    emojiFallback="🌸"
                  />
                </View>
                <View style={styles.selectedCardText}>
                  <Text style={styles.selectedCardTitle}>5 Vakit</Text>
                  {selectedGoal === 5 && (
                    <Text style={styles.selectedCardSubtitle}>
                      Harika Seçim!
                    </Text>
                  )}
                </View>
              </View>
              {selectedGoal === 5 && (
                <View style={styles.checkIconContainer}>
                  <IconWrapper
                    name="check"
                    size={20}
                    color="#FFFFFF"
                    emojiFallback="✓"
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Onayla ve Devam Et"
          onPress={handleConfirm}
          disabled={!selectedGoal}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  title: {
    ...CommonStyles.title,
    fontSize: FontSizes.title,
    color: Colors.textDark, // Same as SignUpScreen title color
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 32,
  },
  subtitle: {
    ...CommonStyles.subtitle,
    color: Colors.textSecondary, // Same as SignUpScreen subtitle color
    textAlign: 'center',
    fontSize: FontSizes.bodySmall,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  goalCard: {
    width: '47%',
    height: 120,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  goalCardSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: Colors.primary,
  },
  goalNumber: {
    fontSize: 40,
    fontWeight: FontWeights.bold,
    color: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 4,
  },
  goalNumberSelected: {
    color: `${Colors.primary}66`, // 40% opacity
  },
  goalLabel: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semiBold,
    color: Colors.textDark,
  },
  goalLabelSelected: {
    color: Colors.textDark,
  },
  leafIcon: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
  },
  selectedCard: {
    width: '100%',
    height: 90,
    backgroundColor: '#F0FDF4',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 3,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  selectedCardUnselected: {
    backgroundColor: Colors.surface,
    borderColor: 'transparent',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  selectedCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  selectedCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  flowerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ rotate: '3deg' }],
  },
  flowerIconContainerUnselected: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  selectedCardText: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  selectedCardTitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 2,
  },
  selectedCardSubtitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.semiBold,
    color: Colors.primaryDark,
  },
  checkIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl * 2, // Same bottom spacing as other screens
    backgroundColor: Colors.background,
  },
});

export default GoalSelectionScreen;

