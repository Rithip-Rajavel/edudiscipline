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
import { incidentsApi } from '../../api/incidents';
import { INCIDENT_TYPES, SEVERITY_LEVELS, THEME } from '../../constants';
import { IncidentDTO } from '../../types';

const IncidentsScreen = ({ navigation }: any) => {
  const [incidents, setIncidents] = useState<IncidentDTO[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<IncidentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    filterIncidents();
  }, [incidents, searchQuery, selectedFilter, severityFilter]);

  const loadIncidents = async () => {
    setIsLoading(true);
    try {
      const data = await incidentsApi.getAll();
      setIncidents(data);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadIncidents();
    setRefreshing(false);
  };

  const filterIncidents = () => {
    let filtered = incidents;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (incident) =>
          incident.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          incident.studentRollNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          incident.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by incident type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((incident) => incident.incidentType === selectedFilter);
    }

    // Filter by severity
    if (severityFilter !== 'all') {
      filtered = filtered.filter((incident) => incident.severity === severityFilter);
    }

    setFilteredIncidents(filtered);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return THEME.colors.error;
      case 'HIGH': return '#FF5722';
      case 'MEDIUM': return THEME.colors.warning;
      case 'LOW': return THEME.colors.success;
      default: return THEME.colors.disabled;
    }
  };

  const getIncidentTypeIcon = (type: string) => {
    switch (type) {
      case 'LATE_ARRIVAL': return 'schedule';
      case 'MISCONDUCT': return 'gavel';
      case 'ABSENCE': return 'not-interested';
      case 'VIOLATION': return 'block';
      case 'WARNING': return 'warning';
      default: return 'info';
    }
  };

  const renderIncidentItem = ({ item }: { item: IncidentDTO }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('IncidentDetails', { incidentId: item.id })}
      style={styles.incidentCard}
    >
      <Card elevation={2}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.incidentHeader}>
            <View style={styles.studentInfo}>
              <Icon name="person" size={20} color={THEME.colors.primary} />
              <Text style={styles.studentName}>{item.studentName}</Text>
              <Text style={styles.rollNumber}>({item.studentRollNumber})</Text>
            </View>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
              <Text style={styles.severityText}>{item.severity}</Text>
            </View>
          </View>

          <View style={styles.incidentDetails}>
            <View style={styles.incidentTypeRow}>
              <Icon 
                name={getIncidentTypeIcon(item.incidentType)} 
                size={16} 
                color={THEME.colors.disabled} 
              />
              <Text style={styles.incidentType}>
                {item.incidentType ? item.incidentType.replace('_', ' ') : 'Unknown'}
              </Text>
            </View>
            
            <Text style={styles.incidentDate}>
              {new Date(item.incidentDate).toLocaleDateString()} at {new Date(item.incidentDate).toLocaleTimeString()}
            </Text>
            
            {item.location && (
              <View style={styles.locationRow}>
                <Icon name="location-on" size={14} color={THEME.colors.disabled} />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>
            )}
            
            {item.description && (
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>

          {item.actionTaken && (
            <View style={styles.actionTaken}>
              <Text style={styles.actionTakenLabel}>Action Taken:</Text>
              <Text style={styles.actionTakenText}>{item.actionTaken}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Searchbar
          placeholder="Search incidents..."
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
          <Menu.Item onPress={() => { setSelectedFilter('all'); setFilterMenuVisible(false); }} title="All Types" />
          {INCIDENT_TYPES.map((type) => (
            <Menu.Item
              key={type.value}
              onPress={() => { setSelectedFilter(type.value); setFilterMenuVisible(false); }}
              title={type.label}
            />
          ))}
        </Menu>
      </View>

      {severityFilter !== 'all' && (
        <View style={styles.activeFilters}>
          <Chip
            onClose={() => setSeverityFilter('all')}
            style={styles.filterChip}
          >
            Severity: {severityFilter}
          </Chip>
        </View>
      )}

      <FlatList
        data={filteredIncidents}
        renderItem={renderIncidentItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="warning" size={48} color={THEME.colors.disabled} />
            <Text style={styles.emptyText}>No incidents found</Text>
          </View>
        }
      />

      <View style={styles.quickActions}>
        <Chip
          icon="plus"
          onPress={() => navigation.navigate('CreateIncident')}
          style={styles.quickActionChip}
        >
          Create Incident
        </Chip>
        <Chip
          icon="flash-on"
          onPress={() => navigation.navigate('QuickIncident')}
          style={styles.quickActionChip}
        >
          Quick Report
        </Chip>
      </View>

      <FAB
        style={styles.fab}
        icon="add"
        onPress={() => navigation.navigate('CreateIncident')}
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
  incidentCard: {
    marginBottom: 12,
  },
  cardContent: {
    padding: 16,
  },
  incidentHeader: {
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
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  incidentDetails: {
    marginBottom: 8,
  },
  incidentTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  incidentType: {
    fontSize: 14,
    color: THEME.colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  incidentDate: {
    fontSize: 12,
    color: THEME.colors.disabled,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
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
  actionTaken: {
    marginTop: 8,
    padding: 8,
    backgroundColor: THEME.colors.background,
    borderRadius: 4,
  },
  actionTakenLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME.colors.primary,
    marginBottom: 2,
  },
  actionTakenText: {
    fontSize: 12,
    color: THEME.colors.text,
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  quickActionChip: {
    marginHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: THEME.colors.primary,
  },
});

export default IncidentsScreen;
