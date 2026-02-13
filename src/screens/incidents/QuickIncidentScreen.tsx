import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  RadioButton,
  HelperText,
} from 'react-native-paper';
import { incidentsApi } from '../../api/incidents';
import { INCIDENT_TYPES, SEVERITY_LEVELS, THEME } from '../../constants';
import { QuickIncidentRequest } from '../../types';

const QuickIncidentScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [incidentData, setIncidentData] = useState<QuickIncidentRequest>({
    studentIdentifier: '',
    incidentType: 'LATE_ARRIVAL',
    severity: 'LOW',
    description: '',
    location: '',
  });

  const [errors, setErrors] = useState({
    studentIdentifier: '',
    incidentType: '',
    severity: '',
  });

  const validateForm = () => {
    const newErrors = {
      studentIdentifier: !incidentData.studentIdentifier.trim() ? 'Please enter student identifier' : '',
      incidentType: !incidentData.incidentType ? 'Please select incident type' : '',
      severity: !incidentData.severity ? 'Please select severity level' : '',
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await incidentsApi.createQuick(incidentData);
      Alert.alert('Success', 'Quick incident reported successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create incident');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Quick Incident Report</Title>
          <Paragraph style={styles.cardSubtitle}>
            Fast incident reporting using student identifier
          </Paragraph>

          {/* Student Identifier */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Student Identifier</Text>
            <TextInput
              label="Roll Number / ID Card / Mobile"
              value={incidentData.studentIdentifier}
              onChangeText={(text) => {
                setIncidentData({ ...incidentData, studentIdentifier: text });
                setErrors({ ...errors, studentIdentifier: '' });
              }}
              mode="outlined"
              style={styles.input}
              error={!!errors.studentIdentifier}
              placeholder="Enter roll number, ID card number, or mobile"
            />
            <HelperText type="error" visible={!!errors.studentIdentifier}>
              {errors.studentIdentifier}
            </HelperText>
          </View>

          {/* Incident Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Incident Type</Text>
            <RadioButton.Group
              onValueChange={(value) => {
                setIncidentData({ ...incidentData, incidentType: value as any });
                setErrors({ ...errors, incidentType: '' });
              }}
              value={incidentData.incidentType}
            >
              {INCIDENT_TYPES.map((type) => (
                <View key={type.value} style={styles.radioItem}>
                  <RadioButton value={type.value} />
                  <Text style={styles.radioLabel}>{type.label}</Text>
                </View>
              ))}
            </RadioButton.Group>
            <HelperText type="error" visible={!!errors.incidentType}>
              {errors.incidentType}
            </HelperText>
          </View>

          {/* Severity Level */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Severity Level</Text>
            <RadioButton.Group
              onValueChange={(value) => {
                setIncidentData({ ...incidentData, severity: value as any });
                setErrors({ ...errors, severity: '' });
              }}
              value={incidentData.severity}
            >
              {SEVERITY_LEVELS.map((level) => (
                <View key={level.value} style={styles.radioItem}>
                  <RadioButton value={level.value} />
                  <Text style={styles.radioLabel}>{level.label}</Text>
                </View>
              ))}
            </RadioButton.Group>
            <HelperText type="error" visible={!!errors.severity}>
              {errors.severity}
            </HelperText>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <TextInput
              label="Location (Optional)"
              value={incidentData.location || ''}
              onChangeText={(text) => setIncidentData({ ...incidentData, location: text })}
              mode="outlined"
              style={styles.input}
              placeholder="Where did the incident occur?"
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <TextInput
              label="Description (Optional)"
              value={incidentData.description || ''}
              onChangeText={(text) => setIncidentData({ ...incidentData, description: text })}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              placeholder="Provide additional details about the incident"
            />
          </View>

          {/* Submit Button */}
          <View style={styles.actions}>
            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
            >
              {isLoading ? 'Creating...' : 'Report Incident'}
            </Button>
          </View>
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
  card: {
    elevation: 4,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  cardSubtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: THEME.colors.disabled,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: 12,
  },
  input: {
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: THEME.colors.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default QuickIncidentScreen;
