import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Chip,
  IconButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { achievementsApi } from '../../api/achievements';
import { ACHIEVEMENT_TYPES, THEME } from '../../constants';
import { AchievementDTO } from '../../types';

const AchievementDetailsScreen = ({ route, navigation }: any) => {
  const { achievementId } = route.params;
  const [achievement, setAchievement] = useState<AchievementDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAchievementDetails();
  }, [achievementId]);

  const loadAchievementDetails = async () => {
    setIsLoading(true);
    try {
      const data = await achievementsApi.getById(achievementId);
      setAchievement(data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load achievement details');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Achievement',
      'Are you sure you want to delete this achievement record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await achievementsApi.delete(achievementId);
              Alert.alert('Success', 'Achievement deleted successfully');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete achievement');
            }
          },
        },
      ]
    );
  };

  const getAchievementTypeIcon = (type: string) => {
    switch (type) {
      case 'ACADEMIC': return 'school';
      case 'SPORTS': return 'sports-soccer';
      case 'CULTURAL': return 'music-note';
      case 'LEADERSHIP': return 'groups';
      case 'SERVICE': return 'volunteer-activism';
      default: return 'emoji-events';
    }
  };

  const getAchievementTypeColor = (type: string) => {
    switch (type) {
      case 'ACADEMIC': return '#2196F3';
      case 'SPORTS': return '#4CAF50';
      case 'CULTURAL': return '#9C27B0';
      case 'LEADERSHIP': return '#FF9800';
      case 'SERVICE': return '#795548';
      default: return THEME.colors.primary;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading achievement details...</Text>
      </View>
    );
  }

  if (!achievement) {
    return (
      <View style={styles.errorContainer}>
        <Text>Achievement not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Title style={styles.title}>Achievement Details</Title>
            <IconButton
              icon="delete"
              size={20}
              onPress={handleDelete}
              iconColor={THEME.colors.error}
            />
          </View>

          <View style={styles.typeRow}>
            <Icon 
              name={getAchievementTypeIcon(achievement.achievementType)} 
              size={24} 
              color={getAchievementTypeColor(achievement.achievementType)} 
            />
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
          </View>

          <Chip
            style={[styles.typeChip, { backgroundColor: getAchievementTypeColor(achievement.achievementType) + '20' }]}
            textStyle={[styles.typeText, { color: getAchievementTypeColor(achievement.achievementType) }]}
          >
            {achievement.achievementType.replace('_', ' ')}
          </Chip>
        </Card.Content>
      </Card>

      {/* Student Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Student Information</Title>
          <View style={styles.infoRow}>
            <Icon name="person" size={20} color={THEME.colors.primary} />
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{achievement.studentName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="badge" size={20} color={THEME.colors.primary} />
            <Text style={styles.infoLabel}>Roll Number:</Text>
            <Text style={styles.infoValue}>{achievement.studentRollNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="calendar-today" size={20} color={THEME.colors.primary} />
            <Text style={styles.infoLabel}>Date Achieved:</Text>
            <Text style={styles.infoValue}>
              {new Date(achievement.dateAchieved).toLocaleDateString()}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Achievement Details */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Achievement Details</Title>
          
          {achievement.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionLabel}>Description:</Text>
              <Text style={styles.descriptionText}>{achievement.description}</Text>
            </View>
          )}

          {achievement.awardedBy && (
            <View style={styles.awardedSection}>
              <Icon name="workspace-premium" size={20} color={THEME.colors.primary} />
              <Text style={styles.awardedLabel}>Awarded By:</Text>
              <Text style={styles.awardedText}>{achievement.awardedBy}</Text>
            </View>
          )}

          {achievement.certificateUrl && (
            <View style={styles.certificateSection}>
              <Icon name="description" size={20} color={THEME.colors.primary} />
              <Text style={styles.certificateLabel}>Certificate:</Text>
              <Button
                mode="outlined"
                onPress={() => {
                  // TODO: Open certificate URL
                  Alert.alert('Certificate', 'Certificate viewing not implemented yet');
                }}
                style={styles.viewCertificateButton}
              >
                View Certificate
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Record Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Record Information</Title>
          <View style={styles.infoRow}>
            <Icon name="history" size={20} color={THEME.colors.primary} />
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>
              {achievement.createdAt ? new Date(achievement.createdAt).toLocaleString() : 'N/A'}
            </Text>
          </View>
          {achievement.updatedAt && (
            <View style={styles.infoRow}>
              <Icon name="update" size={20} color={THEME.colors.primary} />
              <Text style={styles.infoLabel}>Updated:</Text>
              <Text style={styles.infoValue}>
                {new Date(achievement.updatedAt).toLocaleString()}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Back
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateAchievement', { editMode: true, achievement })}
          style={styles.editButton}
        >
          Edit
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginLeft: 12,
    flex: 1,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: THEME.colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginLeft: 8,
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: THEME.colors.text,
    flex: 1,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: THEME.colors.text,
    lineHeight: 20,
  },
  awardedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  awardedLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginLeft: 8,
    width: 100,
  },
  awardedText: {
    fontSize: 14,
    color: THEME.colors.text,
    flex: 1,
  },
  certificateSection: {
    marginBottom: 16,
  },
  certificateLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginLeft: 8,
    marginBottom: 8,
  },
  viewCertificateButton: {
    alignSelf: 'flex-start',
    marginLeft: 28,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  editButton: {
    flex: 1,
  },
});

export default AchievementDetailsScreen;
