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
import { incidentsApi } from '../../api/incidents';
import { INCIDENT_TYPES, SEVERITY_LEVELS, THEME } from '../../constants';
import { IncidentDTO } from '../../types';

const IncidentDetailsScreen = ({ route, navigation }: any) => {
  const { incidentId } = route.params;
  const [incident, setIncident] = useState<IncidentDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadIncidentDetails();
  }, [incidentId]);

  const loadIncidentDetails = async () => {
    setIsLoading(true);
    try {
      const data = await incidentsApi.getById(incidentId);
      setIncident(data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load incident details');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Incident',
      'Are you sure you want to delete this incident record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await incidentsApi.delete(incidentId);
              Alert.alert('Success', 'Incident deleted successfully');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete incident');
            }
          },
        },
      ]
    );
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading incident details...</Text>
      </View>
    );
  }

  if (!incident) {
    return (
      <View style={styles.errorContainer}>
        <Text>Incident not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Title style={styles.title}>Incident Details</Title>
            <IconButton
              icon="delete"
              size={20}
              onPress={handleDelete}
              iconColor={THEME.colors.error}
            />
          </View>

          <View style={styles.severityRow}>
            <Chip
              style={[styles.severityChip, { backgroundColor: getSeverityColor(incident.severity) }]}
              textStyle={styles.severityText}
            >
              {incident.severity}
            </Chip>
            <View style={styles.typeRow}>
              <Icon 
                name={getIncidentTypeIcon(incident.incidentType)} 
                size={20} 
                color={THEME.colors.primary} 
              />
              <Text style={styles.incidentType}>
                {incident.incidentType.replace('_', ' ')}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Student Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Student Information</Title>
          <View style={styles.infoRow}>
            <Icon name="person" size={20} color={THEME.colors.primary} />
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{incident.studentName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="badge" size={20} color={THEME.colors.primary} />
            <Text style={styles.infoLabel}>Roll Number:</Text>
            <Text style={styles.infoValue}>{incident.studentRollNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="calendar-today" size={20} color={THEME.colors.primary} />
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>
              {new Date(incident.incidentDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="schedule" size={20} color={THEME.colors.primary} />
            <Text style={styles.infoLabel}>Time:</Text>
            <Text style={styles.infoValue}>
              {new Date(incident.incidentDate).toLocaleTimeString()}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Incident Details */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Incident Details</Title>
          
          {incident.location && (
            <View style={styles.infoRow}>
              <Icon name="location-on" size={20} color={THEME.colors.primary} />
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoValue}>{incident.location}</Text>
            </View>
          )}

          {incident.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionLabel}>Description:</Text>
              <Text style={styles.descriptionText}>{incident.description}</Text>
            </View>
          )}

          {incident.actionTaken && (
            <View style={styles.actionSection}>
              <Text style={styles.actionLabel}>Action Taken:</Text>
              <Text style={styles.actionText}>{incident.actionTaken}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Logged By Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Report Information</Title>
          <View style={styles.infoRow}>
            <Icon name="account-circle" size={20} color={THEME.colors.primary} />
            <Text style={styles.infoLabel}>Logged By:</Text>
            <Text style={styles.infoValue}>{incident.loggedByName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="history" size={20} color={THEME.colors.primary} />
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>
              {incident.createdAt ? new Date(incident.createdAt).toLocaleString() : 'N/A'}
            </Text>
          </View>
          {incident.updatedAt && (
            <View style={styles.infoRow}>
              <Icon name="update" size={20} color={THEME.colors.primary} />
              <Text style={styles.infoLabel}>Updated:</Text>
              <Text style={styles.infoValue}>
                {new Date(incident.updatedAt).toLocaleString()}
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
          onPress={() => navigation.navigate('CreateIncident', { editMode: true, incident })}
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
  severityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  severityChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incidentType: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: THEME.colors.text,
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
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: THEME.colors.text,
    flex: 1,
  },
  descriptionSection: {
    marginTop: 16,
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
  actionSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: THEME.colors.success + '20',
    borderRadius: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.colors.success,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: THEME.colors.text,
    lineHeight: 20,
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

export default IncidentDetailsScreen;
