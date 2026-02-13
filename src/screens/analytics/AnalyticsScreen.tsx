import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { incidentsApi } from '../../api/incidents';
import { studentsApi } from '../../api/students';
import { achievementsApi } from '../../api/achievements';
import { INCIDENT_TYPES, SEVERITY_LEVELS, THEME } from '../../constants';

const { width } = Dimensions.get('window');

interface AnalyticsData {
  totalIncidents: number;
  totalStudents: number;
  totalAchievements: number;
  incidentsByType: { [key: string]: number };
  incidentsBySeverity: { [key: string]: number };
  recentTrend: { date: string; incidents: number }[];
  topRiskStudents: Array<{ name: string; incidents: number; rollNumber: string }>;
  departmentStats: Array<{ department: string; incidents: number; students: number }>;
}

const AnalyticsScreen = ({ navigation }: any) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [incidents, students, achievements] = await Promise.all([
        incidentsApi.getAll(),
        studentsApi.getAll(),
        achievementsApi.getAll(),
      ]);

      // Process analytics data
      const incidentsByType: { [key: string]: number } = {};
      const incidentsBySeverity: { [key: string]: number } = {};
      const departmentStats: { [key: string]: { incidents: number; students: number } } = {};

      incidents.forEach(incident => {
        // Count by type
        incidentsByType[incident.incidentType] = (incidentsByType[incident.incidentType] || 0) + 1;
        
        // Count by severity
        incidentsBySeverity[incident.severity] = (incidentsBySeverity[incident.severity] || 0) + 1;
      });

      students.forEach(student => {
        if (student.department) {
          if (!departmentStats[student.department]) {
            departmentStats[student.department] = { incidents: 0, students: 0 };
          }
          departmentStats[student.department].students += 1;
        }
      });

      incidents.forEach(incident => {
        const student = students.find(s => s.id === incident.studentId);
        if (student?.department) {
          departmentStats[student.department].incidents += 1;
        }
      });

      // Calculate top risk students
      const studentIncidentCounts: { [key: number]: { name: string; incidents: number; rollNumber: string } } = {};
      incidents.forEach(incident => {
        const student = students.find(s => s.id === incident.studentId);
        if (student && incident.studentId) {
          const key = incident.studentId;
          if (!studentIncidentCounts[key]) {
            studentIncidentCounts[key] = {
              name: `${student.firstName} ${student.lastName}`,
              incidents: 0,
              rollNumber: student.rollNumber || '',
            };
          }
          studentIncidentCounts[key].incidents += 1;
        }
      });

      const topRiskStudents = Object.values(studentIncidentCounts)
        .sort((a, b) => b.incidents - a.incidents)
        .slice(0, 5);

      // Generate mock trend data (in real app, this would come from API)
      const recentTrend = [];
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();
        const incidentCount = Math.floor(Math.random() * 10) + 1; // Mock data
        recentTrend.push({ date: dateStr, incidents: incidentCount });
      }

      setAnalyticsData({
        totalIncidents: incidents.length,
        totalStudents: students.length,
        totalAchievements: achievements.length,
        incidentsByType,
        incidentsBySeverity,
        recentTrend,
        topRiskStudents,
        departmentStats: Object.entries(departmentStats).map(([dept, stats]) => ({
          department: dept,
          ...stats,
        })),
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
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

  const renderStatCard = (title: string, value: number, icon: string, color: string) => (
    <Card style={[styles.statCard, { borderLeftColor: color }]}>
      <Card.Content style={styles.statCardContent}>
        <Icon name={icon} size={32} color={color} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </Card.Content>
    </Card>
  );

  const renderBarChart = (data: { [key: string]: number }, colors: { [key: string]: string }) => {
    const maxValue = Math.max(...Object.values(data));
    return Object.entries(data).map(([key, value]) => (
      <View key={key} style={styles.barChartItem}>
        <Text style={styles.barChartLabel}>{key.replace('_', ' ')}</Text>
        <View style={styles.barChartContainer}>
          <View style={[
            styles.barChartBar,
            { 
              width: maxValue > 0 ? `${(value / maxValue) * 100}%` : '0%',
              backgroundColor: colors[key] || THEME.colors.primary
            }
          ]} />
          <Text style={styles.barChartValue}>{value}</Text>
        </View>
      </View>
    ));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading analytics...</Text>
      </View>
    );
  }

  if (!analyticsData) {
    return (
      <View style={styles.errorContainer}>
        <Text>Failed to load analytics data</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.headerTitle}>Analytics Dashboard</Title>
      
      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {['week', 'month', 'quarter', 'year'].map((period) => (
          <Chip
            key={period}
            selected={selectedPeriod === period}
            onPress={() => setSelectedPeriod(period)}
            style={styles.periodChip}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Chip>
        ))}
      </View>

      {/* Overview Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Overview</Title>
          <View style={styles.statsGrid}>
            {renderStatCard('Total Incidents', analyticsData.totalIncidents, 'warning', THEME.colors.warning)}
            {renderStatCard('Total Students', analyticsData.totalStudents, 'people', THEME.colors.primary)}
            {renderStatCard('Achievements', analyticsData.totalAchievements, 'emoji-events', THEME.colors.success)}
          </View>
        </Card.Content>
      </Card>

      {/* Incidents by Type */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Incidents by Type</Title>
          {renderBarChart(analyticsData.incidentsByType, {
            LATE_ARRIVAL: THEME.colors.primary,
            MISCONDUCT: THEME.colors.warning,
            ABSENCE: THEME.colors.error,
            VIOLATION: '#FF5722',
            WARNING: THEME.colors.success,
            OTHER: THEME.colors.disabled,
          })}
        </Card.Content>
      </Card>

      {/* Incidents by Severity */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Incidents by Severity</Title>
          {renderBarChart(analyticsData.incidentsBySeverity, {
            CRITICAL: THEME.colors.error,
            HIGH: '#FF5722',
            MEDIUM: THEME.colors.warning,
            LOW: THEME.colors.success,
          })}
        </Card.Content>
      </Card>

      {/* Top Risk Students */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Top Risk Students</Title>
          {analyticsData.topRiskStudents.map((student, index) => (
            <View key={index} style={styles.riskStudentItem}>
              <View style={styles.riskStudentInfo}>
                <Text style={styles.riskStudentName}>{student.name}</Text>
                <Text style={styles.riskStudentRollNumber}>{student.rollNumber}</Text>
              </View>
              <View style={styles.riskStudentIncidents}>
                <Text style={styles.riskStudentIncidentCount}>{student.incidents}</Text>
                <Text style={styles.riskStudentIncidentLabel}>incidents</Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Department Statistics */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Department Statistics</Title>
          {analyticsData.departmentStats.map((dept, index) => (
            <View key={index} style={styles.deptItem}>
              <View style={styles.deptInfo}>
                <Text style={styles.deptName}>{dept.department}</Text>
                <Text style={styles.deptStudents}>{dept.students} students</Text>
              </View>
              <View style={styles.deptIncidents}>
                <Text style={styles.deptIncidentCount}>{dept.incidents}</Text>
                <Text style={styles.deptIncidentLabel}>incidents</Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Export Button */}
      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => Alert.alert('Export', 'Export functionality not implemented yet')}
            style={styles.exportButton}
            icon="download"
          >
            Export Report
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: 16,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: THEME.colors.text,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  periodChip: {
    marginHorizontal: 4,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: THEME.colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 8,
    elevation: 2,
    borderLeftWidth: 4,
  },
  statCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: THEME.colors.text,
  },
  statTitle: {
    fontSize: 12,
    color: THEME.colors.disabled,
    marginTop: 4,
    textAlign: 'center',
  },
  barChartItem: {
    marginBottom: 12,
  },
  barChartLabel: {
    fontSize: 12,
    color: THEME.colors.text,
    marginBottom: 4,
    width: 100,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barChartBar: {
    height: 20,
    borderRadius: 4,
    marginRight: 8,
    minWidth: 4,
  },
  barChartValue: {
    fontSize: 12,
    color: THEME.colors.text,
    fontWeight: 'bold',
  },
  riskStudentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  riskStudentInfo: {
    flex: 1,
  },
  riskStudentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  riskStudentRollNumber: {
    fontSize: 12,
    color: THEME.colors.disabled,
  },
  riskStudentIncidents: {
    alignItems: 'flex-end',
  },
  riskStudentIncidentCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.colors.warning,
  },
  riskStudentIncidentLabel: {
    fontSize: 10,
    color: THEME.colors.disabled,
  },
  deptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  deptInfo: {
    flex: 1,
  },
  deptName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  deptStudents: {
    fontSize: 12,
    color: THEME.colors.disabled,
  },
  deptIncidents: {
    alignItems: 'flex-end',
  },
  deptIncidentCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  deptIncidentLabel: {
    fontSize: 10,
    color: THEME.colors.disabled,
  },
  exportButton: {
    backgroundColor: THEME.colors.primary,
  },
});

export default AnalyticsScreen;
