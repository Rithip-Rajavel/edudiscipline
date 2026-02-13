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
  List,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { studentsApi } from '../../api/students';
import { incidentsApi } from '../../api/incidents';
import { achievementsApi } from '../../api/achievements';
import { THEME, SEVERITY_LEVELS } from '../../constants';
import { StudentDTO, IncidentDTO, AchievementDTO } from '../../types';

const StudentDetailsScreen = ({ route, navigation }: any) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState<StudentDTO | null>(null);
  const [incidents, setIncidents] = useState<IncidentDTO[]>([]);
  const [achievements, setAchievements] = useState<AchievementDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'incidents' | 'achievements'>('overview');

  useEffect(() => {
    loadStudentData();
  }, [studentId]);

  const loadStudentData = async () => {
    setIsLoading(true);
    try {
      const [studentData, incidentData, achievementData] = await Promise.all([
        studentsApi.getById(studentId),
        incidentsApi.getByStudent(studentId),
        achievementsApi.getByStudent(studentId),
      ]);

      setStudent(studentData);
      setIncidents(incidentData);
      setAchievements(achievementData);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load student details');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!student) return;

    try {
      const updatedStudent = student.active 
        ? await studentsApi.deactivate(studentId)
        : await studentsApi.activate(studentId);
      
      setStudent(updatedStudent);
      Alert.alert('Success', `Student ${updatedStudent.active ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update student status');
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

  const getRiskLevel = () => {
    const criticalCount = incidents.filter(i => i.severity === 'CRITICAL').length;
    const highCount = incidents.filter(i => i.severity === 'HIGH').length;
    
    if (criticalCount > 0) return { level: 'Critical', color: THEME.colors.error };
    if (highCount > 2) return { level: 'High', color: '#FF5722' };
    if (incidents.length > 5) return { level: 'Medium', color: THEME.colors.warning };
    return { level: 'Low', color: THEME.colors.success };
  };

  const renderOverview = () => {
    const risk = getRiskLevel();
    const recentIncidents = incidents.slice(0, 3);
    const recentAchievements = achievements.slice(0, 3);

    return (
      <View>
        {/* Quick Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Performance Overview</Title>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Icon name="warning" size={24} color={THEME.colors.warning} />
                <Text style={styles.statValue}>{incidents.length}</Text>
                <Text style={styles.statLabel}>Total Incidents</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="emoji-events" size={24} color={THEME.colors.success} />
                <Text style={styles.statValue}>{achievements.length}</Text>
                <Text style={styles.statLabel}>Achievements</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="trending-up" size={24} color={THEME.colors.primary} />
                <Text style={styles.statValue}>
                  {incidents.length + achievements.length > 0 
                    ? Math.round((achievements.length / (incidents.length + achievements.length)) * 100)
                    : 100}%
                </Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="assessment" size={24} color={risk.color} />
                <Text style={styles.statValue}>{risk.level}</Text>
                <Text style={styles.statLabel}>Risk Level</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Incidents */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.sectionTitle}>Recent Incidents</Title>
              <Button
                mode="text"
                onPress={() => setActiveTab('incidents')}
                compact
              >
                View All
              </Button>
            </View>
            {recentIncidents.length === 0 ? (
              <Paragraph style={styles.noDataText}>No incidents recorded</Paragraph>
            ) : (
              recentIncidents.map((incident, index) => (
                <View key={incident.id}>
                  <View style={styles.listItem}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{incident.incidentType.replace('_', ' ')}</Text>
                      <Chip
                        style={[styles.severityChip, { backgroundColor: getSeverityColor(incident.severity) }]}
                        textStyle={styles.severityText}
                      >
                        {incident.severity}
                      </Chip>
                    </View>
                    <Text style={styles.itemDate}>
                      {new Date(incident.incidentDate).toLocaleDateString()}
                    </Text>
                    {incident.description && (
                      <Text style={styles.itemDescription} numberOfLines={2}>
                        {incident.description}
                      </Text>
                    )}
                  </View>
                  {index < recentIncidents.length - 1 && <Divider />}
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Recent Achievements */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.sectionTitle}>Recent Achievements</Title>
              <Button
                mode="text"
                onPress={() => setActiveTab('achievements')}
                compact
              >
                View All
              </Button>
            </View>
            {recentAchievements.length === 0 ? (
              <Paragraph style={styles.noDataText}>No achievements recorded</Paragraph>
            ) : (
              recentAchievements.map((achievement, index) => (
                <View key={achievement.id}>
                  <View style={styles.listItem}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{achievement.title}</Text>
                      <Chip style={styles.achievementChip}>
                        {achievement.achievementType}
                      </Chip>
                    </View>
                    <Text style={styles.itemDate}>
                      {new Date(achievement.dateAchieved).toLocaleDateString()}
                    </Text>
                    {achievement.description && (
                      <Text style={styles.itemDescription} numberOfLines={2}>
                        {achievement.description}
                      </Text>
                    )}
                  </View>
                  {index < recentAchievements.length - 1 && <Divider />}
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderIncidents = () => (
    <View>
      {incidents.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content style={styles.emptyContainer}>
            <Icon name="warning" size={48} color={THEME.colors.disabled} />
            <Text style={styles.emptyText}>No incidents recorded</Text>
          </Card.Content>
        </Card>
      ) : (
        incidents.map((incident, index) => (
          <Card key={incident.id} style={styles.card}>
            <Card.Content>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{incident.incidentType.replace('_', ' ')}</Text>
                <Chip
                  style={[styles.severityChip, { backgroundColor: getSeverityColor(incident.severity) }]}
                  textStyle={styles.severityText}
                >
                  {incident.severity}
                </Chip>
              </View>
              <Text style={styles.itemDate}>
                {new Date(incident.incidentDate).toLocaleDateString()} at {new Date(incident.incidentDate).toLocaleTimeString()}
              </Text>
              {incident.location && (
                <View style={styles.locationRow}>
                  <Icon name="location-on" size={16} color={THEME.colors.disabled} />
                  <Text style={styles.locationText}>{incident.location}</Text>
                </View>
              )}
              {incident.description && (
                <Text style={styles.itemDescription}>{incident.description}</Text>
              )}
              {incident.actionTaken && (
                <View style={styles.actionSection}>
                  <Text style={styles.actionLabel}>Action Taken:</Text>
                  <Text style={styles.actionText}>{incident.actionTaken}</Text>
                </View>
              )}
            </Card.Content>
          </Card>
        ))
      )}
    </View>
  );

  const renderAchievements = () => (
    <View>
      {achievements.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content style={styles.emptyContainer}>
            <Icon name="emoji-events" size={48} color={THEME.colors.disabled} />
            <Text style={styles.emptyText}>No achievements recorded</Text>
          </Card.Content>
        </Card>
      ) : (
        achievements.map((achievement, index) => (
          <Card key={achievement.id} style={styles.card}>
            <Card.Content>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{achievement.title}</Text>
                <Chip style={styles.achievementChip}>
                  {achievement.achievementType}
                </Chip>
              </View>
              <Text style={styles.itemDate}>
                {new Date(achievement.dateAchieved).toLocaleDateString()}
              </Text>
              {achievement.awardedBy && (
                <Text style={styles.awardedBy}>Awarded by: {achievement.awardedBy}</Text>
              )}
              {achievement.description && (
                <Text style={styles.itemDescription}>{achievement.description}</Text>
              )}
            </Card.Content>
          </Card>
        ))
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading student details...</Text>
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.errorContainer}>
        <Text>Student not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Title style={styles.title}>{student.firstName} {student.lastName}</Title>
            <IconButton
              icon={student.active ? "person-off" : "person"}
              size={20}
              onPress={handleToggleStatus}
              iconColor={student.active ? THEME.colors.error : THEME.colors.success}
            />
          </View>

          <View style={styles.studentInfo}>
            <View style={styles.infoRow}>
              <Icon name="badge" size={16} color={THEME.colors.primary} />
              <Text style={styles.infoText}>{student.rollNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="email" size={16} color={THEME.colors.primary} />
              <Text style={styles.infoText}>{student.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="phone" size={16} color={THEME.colors.primary} />
              <Text style={styles.infoText}>{student.mobileNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="school" size={16} color={THEME.colors.primary} />
              <Text style={styles.infoText}>{student.department}</Text>
              {student.yearOfStudy && (
                <Text style={styles.yearText}> • Year {student.yearOfStudy}</Text>
              )}
            </View>
          </View>

          <View style={styles.tabRow}>
            {[
              { key: 'overview', label: 'Overview', icon: 'dashboard' },
              { key: 'incidents', label: 'Incidents', icon: 'warning' },
              { key: 'achievements', label: 'Achievements', icon: 'emoji-events' },
            ].map((tab) => (
              <Button
                key={tab.key}
                mode={activeTab === tab.key ? 'contained' : 'text'}
                onPress={() => setActiveTab(tab.key as any)}
                style={styles.tabButton}
                compact
              >
                {tab.label}
              </Button>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'incidents' && renderIncidents()}
        {activeTab === 'achievements' && renderAchievements()}
      </ScrollView>

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
          onPress={() => navigation.navigate('CreateIncident', { studentId })}
          style={styles.reportButton}
        >
          Report Incident
        </Button>
      </View>
    </View>
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
  headerCard: {
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
  studentInfo: {
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: THEME.colors.text,
    marginLeft: 8,
  },
  yearText: {
    fontSize: 14,
    color: THEME.colors.disabled,
  },
  tabRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    color: THEME.colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.colors.disabled,
    marginTop: 2,
    textAlign: 'center',
  },
  listItem: {
    paddingVertical: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.colors.text,
    flex: 1,
  },
  severityChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  severityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  achievementChip: {
    backgroundColor: THEME.colors.success + '20',
  },
  itemDate: {
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
  itemDescription: {
    fontSize: 13,
    color: THEME.colors.text,
    lineHeight: 18,
    marginTop: 4,
  },
  actionSection: {
    marginTop: 8,
    padding: 8,
    backgroundColor: THEME.colors.success + '20',
    borderRadius: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME.colors.success,
    marginBottom: 2,
  },
  actionText: {
    fontSize: 12,
    color: THEME.colors.text,
  },
  awardedBy: {
    fontSize: 12,
    color: THEME.colors.disabled,
    marginBottom: 4,
  },
  noDataText: {
    textAlign: 'center',
    color: THEME.colors.disabled,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: THEME.colors.disabled,
    marginTop: 16,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  reportButton: {
    flex: 1,
  },
});

export default StudentDetailsScreen;
