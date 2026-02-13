import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Portal,
  Modal,
  TextInput,
  Divider,
  Menu,
  Provider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { incidentsApi } from '../../api/incidents';
import { studentsApi } from '../../api/students';
import { achievementsApi } from '../../api/achievements';
import { THEME, INCIDENT_TYPES, SEVERITY_LEVELS } from '../../constants';
import { IncidentDTO, StudentDTO, AchievementDTO, QuickIncidentRequest } from '../../types';

interface DashboardStats {
  totalIncidents: number;
  totalStudents: number;
  totalAchievements: number;
  recentIncidents: IncidentDTO[];
  criticalIncidents: IncidentDTO[];
}

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalIncidents: 0,
    totalStudents: 0,
    totalAchievements: 0,
    recentIncidents: [],
    criticalIncidents: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showQuickIncident, setShowQuickIncident] = useState(false);
  const [incidentTypeMenuVisible, setIncidentTypeMenuVisible] = useState(false);
  const [severityMenuVisible, setSeverityMenuVisible] = useState(false);
  const [quickIncidentData, setQuickIncidentData] = useState<QuickIncidentRequest>({
    studentIdentifier: '',
    incidentType: 'LATE_ARRIVAL',
    severity: 'LOW',
    description: '',
    location: '',
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [incidents, students, achievements, criticalIncidents] = await Promise.all([
        incidentsApi.getAll(),
        studentsApi.getAll(),
        achievementsApi.getAll(),
        incidentsApi.getBySeverity('CRITICAL'),
      ]);

      const recentIncidents = incidents
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setStats({
        totalIncidents: incidents.length,
        totalStudents: students.length,
        totalAchievements: achievements.length,
        recentIncidents,
        criticalIncidents,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleQuickIncident = async () => {
    if (!quickIncidentData.studentIdentifier.trim()) {
      Alert.alert('Please enter student identifier');
      return;
    }

    try {
      await incidentsApi.createQuick(quickIncidentData);
      setShowQuickIncident(false);
      setQuickIncidentData({
        studentIdentifier: '',
        incidentType: 'LATE_ARRIVAL',
        severity: 'LOW',
        description: '',
        location: '',
      });
      loadDashboardData();
    } catch (error) {
      console.error('Error creating quick incident:', error);
      Alert.alert('Failed to create incident');
    }
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

  const StatCard = ({ title, value, icon, color, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.statCardContainer}>
      <Card style={[styles.statCard, { borderLeftColor: color }]}>
        <Card.Content style={styles.statCardContent}>
          <Icon name={icon} size={32} color={color} />
          <Title style={styles.statValue}>{value}</Title>
          <Paragraph style={styles.statTitle}>{title}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <Provider>
      <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Title style={styles.welcomeText}>
            Welcome back, {user?.firstName}!
          </Title>
          <Paragraph style={styles.roleText}>
            {user?.role} Dashboard
          </Paragraph>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Total Incidents"
            value={stats.totalIncidents}
            icon="warning"
            color={THEME.colors.warning}
            onPress={() => navigation.navigate('Incidents')}
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon="people"
            color={THEME.colors.primary}
            onPress={() => navigation.navigate('Students')}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Achievements"
            value={stats.totalAchievements}
            icon="emoji-events"
            color={THEME.colors.success}
            onPress={() => navigation.navigate('Achievements')}
          />
          <StatCard
            title="Critical Cases"
            value={stats.criticalIncidents.length}
            icon="error"
            color={THEME.colors.error}
            onPress={() => navigation.navigate('Incidents')}
          />
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Recent Incidents</Title>
            {stats.recentIncidents.length === 0 ? (
              <Paragraph style={styles.noDataText}>No recent incidents</Paragraph>
            ) : (
              stats.recentIncidents.map((incident, index) => (
                <View key={incident.id}>
                  <View style={styles.incidentItem}>
                    <View style={styles.incidentHeader}>
                      <Text style={styles.incidentStudent}>{incident.studentName}</Text>
                      <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(incident.severity) }]}>
                        <Text style={styles.severityText}>{incident.severity}</Text>
                      </View>
                    </View>
                    <Text style={styles.incidentType}>{incident.incidentType.replace('_', ' ')}</Text>
                    <Text style={styles.incidentDate}>
                      {new Date(incident.incidentDate).toLocaleDateString()}
                    </Text>
                    {incident.description && (
                      <Text style={styles.incidentDescription} numberOfLines={2}>
                        {incident.description}
                      </Text>
                    )}
                  </View>
                  {index < stats.recentIncidents.length - 1 && <Divider style={styles.divider} />}
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="add"
        onPress={() => setShowQuickIncident(true)}
      />

      <Portal>
        <Modal
          visible={showQuickIncident}
          onDismiss={() => setShowQuickIncident(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Quick Incident Report</Title>
          
          <TextInput
            label="Student ID / Roll Number / Mobile"
            value={quickIncidentData.studentIdentifier}
            onChangeText={(text) => setQuickIncidentData({...quickIncidentData, studentIdentifier: text})}
            mode="outlined"
            style={styles.modalInput}
          />

          <View style={styles.dropdownContainer}>
            <TextInput
              label="Incident Type"
              value={INCIDENT_TYPES.find(type => type.value === quickIncidentData.incidentType)?.label || ''}
              mode="outlined"
              style={styles.modalInput}
              editable={false}
              right={
                <TextInput.Icon
                  icon="menu-down"
                  onPress={() => setIncidentTypeMenuVisible(true)}
                />
              }
            />
            <Menu
              visible={incidentTypeMenuVisible}
              onDismiss={() => setIncidentTypeMenuVisible(false)}
              anchor={{ x: 0, y: 0 }}
              style={styles.menu}
            >
              {INCIDENT_TYPES.map((type) => (
                <Menu.Item
                  key={type.value}
                  onPress={() => {
                    setQuickIncidentData({...quickIncidentData, incidentType: type.value as 'LATE_ARRIVAL' | 'MISCONDUCT' | 'ABSENCE' | 'VIOLATION' | 'WARNING' | 'OTHER'});
                    setIncidentTypeMenuVisible(false);
                  }}
                  title={type.label}
                />
              ))}
            </Menu>
          </View>

          <View style={styles.dropdownContainer}>
            <TextInput
              label="Severity"
              value={SEVERITY_LEVELS.find(level => level.value === quickIncidentData.severity)?.label || ''}
              mode="outlined"
              style={styles.modalInput}
              editable={false}
              right={
                <TextInput.Icon
                  icon="menu-down"
                  onPress={() => setSeverityMenuVisible(true)}
                />
              }
            />
            <Menu
              visible={severityMenuVisible}
              onDismiss={() => setSeverityMenuVisible(false)}
              anchor={{ x: 0, y: 0 }}
              style={styles.menu}
            >
              {SEVERITY_LEVELS.map((level) => (
                <Menu.Item
                  key={level.value}
                  onPress={() => {
                    setQuickIncidentData({...quickIncidentData, severity: level.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'});
                    setSeverityMenuVisible(false);
                  }}
                  title={level.label}
                />
              ))}
            </Menu>
          </View>

          <TextInput
            label="Description"
            value={quickIncidentData.description}
            onChangeText={(text) => setQuickIncidentData({...quickIncidentData, description: text})}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.modalInput}
          />

          <TextInput
            label="Location"
            value={quickIncidentData.location}
            onChangeText={(text) => setQuickIncidentData({...quickIncidentData, location: text})}
            mode="outlined"
            style={styles.modalInput}
          />

          <View style={styles.modalActions}>
            <Button mode="text" onPress={() => setShowQuickIncident(false)}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleQuickIncident}>
              Report Incident
            </Button>
          </View>
        </Modal>
      </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  roleText: {
    fontSize: 14,
    color: THEME.colors.disabled,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCardContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  statCard: {
    borderLeftWidth: 4,
    elevation: 4,
  },
  statCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statTitle: {
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardTitle: {
    marginBottom: 16,
    color: THEME.colors.primary,
  },
  noDataText: {
    textAlign: 'center',
    color: THEME.colors.disabled,
    fontStyle: 'italic',
  },
  incidentItem: {
    paddingVertical: 8,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  incidentStudent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  severityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  incidentType: {
    fontSize: 14,
    color: THEME.colors.disabled,
    marginBottom: 2,
  },
  incidentDate: {
    fontSize: 12,
    color: THEME.colors.disabled,
    marginBottom: 4,
  },
  incidentDescription: {
    fontSize: 13,
    color: THEME.colors.text,
    lineHeight: 18,
  },
  divider: {
    marginVertical: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: THEME.colors.primary,
  },
  modal: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dropdownContainer: {
    position: 'relative',
  },
  menu: {
    marginTop: 8,
  },
});

export default DashboardScreen;
