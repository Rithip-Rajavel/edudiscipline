import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Searchbar,
  Chip,
  Divider,
  Menu,
  IconButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { achievementsApi } from '../../api/achievements';
import { ACHIEVEMENT_TYPES, THEME } from '../../constants';
import { AchievementDTO } from '../../types';

const AchievementsScreen = ({ navigation }: any) => {
  const [achievements, setAchievements] = useState<AchievementDTO[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<AchievementDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadAchievements();
  }, []);

  useEffect(() => {
    filterAchievements();
  }, [achievements, searchQuery, selectedType]);

  const loadAchievements = async () => {
    setIsLoading(true);
    try {
      const data = await achievementsApi.getAll();
      setAchievements(data);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAchievements();
    setRefreshing(false);
  };

  const filterAchievements = () => {
    let filtered = achievements;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (achievement) =>
          achievement.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          achievement.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          achievement.studentRollNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          achievement.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((achievement) => achievement.achievementType === selectedType);
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(b.dateAchieved).getTime() - new Date(a.dateAchieved).getTime());

    setFilteredAchievements(filtered);
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

  const renderAchievementItem = ({ item }: { item: AchievementDTO }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AchievementDetails', { achievementId: item.id })}
      style={styles.achievementCard}
    >
      <Card elevation={2}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.achievementHeader}>
            <View style={styles.studentInfo}>
              <Icon name="person" size={20} color={THEME.colors.primary} />
              <Text style={styles.studentName}>{item.studentName}</Text>
              <Text style={styles.rollNumber}>({item.studentRollNumber})</Text>
            </View>
            <Chip
              style={[styles.typeChip, { backgroundColor: getAchievementTypeColor(item.achievementType) + '20' }]}
              textStyle={[styles.typeText, { color: getAchievementTypeColor(item.achievementType) }]}
            >
              {item.achievementType.replace('_', ' ')}
            </Chip>
          </View>

          <View style={styles.achievementDetails}>
            <View style={styles.titleRow}>
              <Icon 
                name={getAchievementTypeIcon(item.achievementType)} 
                size={20} 
                color={getAchievementTypeColor(item.achievementType)} 
              />
              <Text style={styles.achievementTitle}>{item.title}</Text>
            </View>
            
            <Text style={styles.achievementDate}>
              {new Date(item.dateAchieved).toLocaleDateString()}
            </Text>
            
            {item.awardedBy && (
              <View style={styles.awardedRow}>
                <Icon name="workspace-premium" size={14} color={THEME.colors.disabled} />
                <Text style={styles.awardedText}>Awarded by {item.awardedBy}</Text>
              </View>
            )}
            
            {item.description && (
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Searchbar
          placeholder="Search achievements..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <IconButton
              icon="filter-list"
              size={24}
              onPress={() => setFilterMenuVisible(true)}
              style={styles.filterButton}
            />
          }
        >
          <Menu.Item onPress={() => { setSelectedType('all'); setFilterMenuVisible(false); }} title="All Types" />
          {ACHIEVEMENT_TYPES.map((type) => (
            <Menu.Item
              key={type.value}
              onPress={() => { setSelectedType(type.value); setFilterMenuVisible(false); }}
              title={type.label}
            />
          ))}
        </Menu>
      </View>

      {selectedType !== 'all' && (
        <View style={styles.activeFilters}>
          <Chip
            onClose={() => setSelectedType('all')}
            style={styles.filterChip}
          >
            Type: {selectedType.replace('_', ' ')}
          </Chip>
        </View>
      )}

      <FlatList
        data={filteredAchievements}
        renderItem={renderAchievementItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="emoji-events" size={48} color={THEME.colors.disabled} />
            <Text style={styles.emptyText}>No achievements found</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="add"
        onPress={() => navigation.navigate('CreateAchievement')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  searchSection: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
  },
  filterButton: {
    marginLeft: 8,
  },
  activeFilters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  achievementCard: {
    marginBottom: 12,
  },
  cardContent: {
    padding: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginLeft: 8,
  },
  rollNumber: {
    fontSize: 12,
    color: THEME.colors.disabled,
    marginLeft: 4,
  },
  typeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  achievementDetails: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginLeft: 8,
    flex: 1,
  },
  achievementDate: {
    fontSize: 12,
    color: THEME.colors.disabled,
    marginBottom: 4,
  },
  awardedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  awardedText: {
    fontSize: 12,
    color: THEME.colors.disabled,
    marginLeft: 4,
  },
  description: {
    fontSize: 13,
    color: THEME.colors.text,
    lineHeight: 18,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: THEME.colors.disabled,
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: THEME.colors.primary,
  },
});

export default AchievementsScreen;
