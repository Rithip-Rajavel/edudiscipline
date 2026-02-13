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
import { studentsApi } from '../../api/students';
import { incidentsApi } from '../../api/incidents';
import { THEME } from '../../constants';
import { StudentDTO, IncidentDTO } from '../../types';

const StudentsScreen = ({ navigation }: any) => {
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [studentStats, setStudentStats] = useState<{[key: number]: { incidents: number, achievements: number }}>({});

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchQuery, selectedDepartment]);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await studentsApi.getAll();
      setStudents(data);
      
      // Load stats for each student
      const stats: {[key: number]: { incidents: number, achievements: number }} = {};
      for (const student of data) {
        if (student.id) {
          try {
            const [incidents, achievements] = await Promise.all([
              incidentsApi.getByStudent(student.id),
              incidentsApi.getStudentStatistics(student.id)
            ]);
            stats[student.id] = {
              incidents: incidents.length,
              achievements: 0 // TODO: Load actual achievements
            };
          } catch (error) {
            stats[student.id] = { incidents: 0, achievements: 0 };
          }
        }
      }
      setStudentStats(stats);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
    setRefreshing(false);
  };

  const filterStudents = () => {
    let filtered = students;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by department
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter((student) => student.department === selectedDepartment);
    }

    setFilteredStudents(filtered);
  };

  const getDepartments = () => {
    const departments = [...new Set(students.map(student => student.department).filter(Boolean))];
    return departments;
  };

  const getRiskLevel = (incidentCount: number) => {
    if (incidentCount >= 10) return { level: 'High', color: THEME.colors.error };
    if (incidentCount >= 5) return { level: 'Medium', color: THEME.colors.warning };
    return { level: 'Low', color: THEME.colors.success };
  };

  const renderStudentItem = ({ item }: { item: StudentDTO }) => {
    const stats = studentStats[item.id || 0] || { incidents: 0, achievements: 0 };
    const risk = getRiskLevel(stats.incidents);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('StudentDetails', { studentId: item.id })}
        style={styles.studentCard}
      >
        <Card elevation={2}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.studentHeader}>
              <View style={styles.studentInfo}>
                <Icon name="person" size={24} color={THEME.colors.primary} />
                <View style={styles.nameSection}>
                  <Text style={styles.studentName}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text style={styles.rollNumber}>{item.rollNumber}</Text>
                </View>
              </View>
              <View style={styles.statusSection}>
                <Chip
                  style={[styles.statusChip, { backgroundColor: item.active ? THEME.colors.success : THEME.colors.disabled }]}
                  textStyle={styles.statusText}
                >
                  {item.active ? 'Active' : 'Inactive'}
                </Chip>
                <Chip
                  style={[styles.riskChip, { backgroundColor: risk.color + '20' }]}
                  textStyle={[styles.riskText, { color: risk.color }]}
                >
                  {risk.level} Risk
                </Chip>
              </View>
            </View>

            <View style={styles.studentDetails}>
              <View style={styles.detailRow}>
                <Icon name="email" size={16} color={THEME.colors.disabled} />
                <Text style={styles.detailText}>{item.email}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Icon name="phone" size={16} color={THEME.colors.disabled} />
                <Text style={styles.detailText}>{item.mobileNumber}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Icon name="school" size={16} color={THEME.colors.disabled} />
                <Text style={styles.detailText}>{item.department}</Text>
                {item.yearOfStudy && (
                  <Text style={styles.yearText}>Year {item.yearOfStudy}</Text>
                )}
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="warning" size={16} color={THEME.colors.warning} />
                <Text style={styles.statValue}>{stats.incidents}</Text>
                <Text style={styles.statLabel}>Incidents</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="emoji-events" size={16} color={THEME.colors.success} />
                <Text style={styles.statValue}>{stats.achievements}</Text>
                <Text style={styles.statLabel}>Achievements</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="trending-up" size={16} color={THEME.colors.primary} />
                <Text style={styles.statValue}>
                  {stats.incidents > 0 ? Math.round((stats.achievements / (stats.incidents + stats.achievements)) * 100) : 100}%
                </Text>
                <Text style={styles.statLabel}>Performance</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Searchbar
          placeholder="Search students..."
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
          <Menu.Item onPress={() => { setSelectedDepartment('all'); setFilterMenuVisible(false); }} title="All Departments" />
          {getDepartments().map((dept) => (
            <Menu.Item
              key={dept}
              onPress={() => { setSelectedDepartment(dept); setFilterMenuVisible(false); }}
              title={dept}
            />
          ))}
        </Menu>
      </View>

      {selectedDepartment !== 'all' && (
        <View style={styles.activeFilters}>
          <Chip
            onClose={() => setSelectedDepartment('all')}
            style={styles.filterChip}
          >
            Department: {selectedDepartment}
          </Chip>
        </View>
      )}

      <FlatList
        data={filteredStudents}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people" size={48} color={THEME.colors.disabled} />
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="add"
        onPress={() => navigation.navigate('CreateStudent')}
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
  studentCard: {
    marginBottom: 12,
  },
  cardContent: {
    padding: 16,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameSection: {
    marginLeft: 12,
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  rollNumber: {
    fontSize: 12,
    color: THEME.colors.disabled,
    marginTop: 2,
  },
  statusSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  riskChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  riskText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  studentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: THEME.colors.text,
    marginLeft: 8,
    flex: 1,
  },
  yearText: {
    fontSize: 12,
    color: THEME.colors.disabled,
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: THEME.colors.disabled,
    marginTop: 2,
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

export default StudentsScreen;
