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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import { incidentsApi } from '../../api/incidents';
import { studentsApi } from '../../api/students';
import { INCIDENT_TYPES, SEVERITY_LEVELS, THEME } from '../../constants';
import { IncidentDTO, StudentDTO } from '../../types';

const CreateIncidentScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StudentDTO[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentDTO | null>(null);
  const [showStudentSearch, setShowStudentSearch] = useState(false);
  
  const [incidentData, setIncidentData] = useState<IncidentDTO>({
    studentId: 0,
    loggedById: user?.id || 0,
    incidentType: 'LATE_ARRIVAL',
    severity: 'LOW',
    incidentDate: new Date().toISOString(),
    description: '',
    location: '',
    actionTaken: '',
  });

  const [errors, setErrors] = useState({
    student: '',
    incidentType: '',
    severity: '',
    description: '',
    location: '',
  });

  const searchStudents = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await studentsApi.searchByName(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching students:', error);
      setSearchResults([]);
    }
  };

  const handleStudentSelect = (student: StudentDTO) => {
    setSelectedStudent(student);
    setIncidentData({ ...incidentData, studentId: student.id || 0 });
    setSearchQuery('');
    setSearchResults([]);
    setShowStudentSearch(false);
    setErrors({ ...errors, student: '' });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setIncidentData({ 
        ...incidentData, 
        incidentDate: selectedDate.toISOString() 
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      student: !selectedStudent ? 'Please select a student' : '',
      incidentType: !incidentData.incidentType ? 'Please select incident type' : '',
      severity: !incidentData.severity ? 'Please select severity level' : '',
      description: (incidentData.description?.length || 0) < 10 ? 'Description must be at least 10 characters' : '',
      location: !incidentData.location?.trim() ? 'Please enter location' : '',
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
      const incident = {
        ...incidentData,
        studentId: selectedStudent?.id || 0,
        loggedById: user?.id || 0,
      };

      await incidentsApi.create(incident);
      Alert.alert('Success', 'Incident reported successfully', [
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
          <Title style={styles.cardTitle}>Create Incident Report</Title>
          <Paragraph style={styles.cardSubtitle}>
            Fill in the details to report a disciplinary incident
          </Paragraph>

          {/* Student Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Student Information</Text>
            <TextInput
              label="Search Student (Name or Roll Number)"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                searchStudents(text);
                setShowStudentSearch(true);
              }}
              mode="outlined"
              style={styles.input}
              onFocus={() => setShowStudentSearch(true)}
            />

            {selectedStudent && (
              <View style={styles.selectedStudent}>
                <Text style={styles.selectedStudentName}>
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </Text>
                <Text style={styles.selectedStudentDetails}>
                  {selectedStudent.rollNumber} • {selectedStudent.department}
                </Text>
              </View>
            )}

            {showStudentSearch && searchResults.length > 0 && (
              <View style={styles.searchResults}>
                {searchResults.map((student) => (
                  <Button
                    key={student.id}
                    mode="outlined"
                    onPress={() => handleStudentSelect(student)}
                    style={styles.studentResult}
                    contentStyle={styles.studentResultContent}
                  >
                    {student.firstName} {student.lastName} ({student.rollNumber})
                  </Button>
                ))}
              </View>
            )}

            <HelperText type="error" visible={!!errors.student}>
              {errors.student}
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

          {/* Date and Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date and Time</Text>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              {new Date(incidentData.incidentDate).toLocaleString()}
            </Button>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <TextInput
              label="Location"
              value={incidentData.location}
              onChangeText={(text) => {
                setIncidentData({ ...incidentData, location: text });
                setErrors({ ...errors, location: '' });
              }}
              mode="outlined"
              style={styles.input}
              error={!!errors.location}
            />
            <HelperText type="error" visible={!!errors.location}>
              {errors.location}
            </HelperText>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <TextInput
              label="Description"
              value={incidentData.description}
              onChangeText={(text) => {
                setIncidentData({ ...incidentData, description: text });
                setErrors({ ...errors, description: '' });
              }}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              error={!!errors.description}
            />
            <HelperText type="error" visible={!!errors.description}>
              {errors.description}
            </HelperText>
          </View>

          {/* Action Taken */}
          <View style={styles.section}>
            <TextInput
              label="Action Taken (Optional)"
              value={incidentData.actionTaken}
              onChangeText={(text) => setIncidentData({ ...incidentData, actionTaken: text })}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
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
              {isLoading ? 'Creating...' : 'Create Incident'}
            </Button>
          </View>
        </Card.Content>
      </Card>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(incidentData.incidentDate)}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
        />
      )}
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
  selectedStudent: {
    padding: 12,
    backgroundColor: THEME.colors.primary + '20',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedStudentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  selectedStudentDetails: {
    fontSize: 14,
    color: THEME.colors.disabled,
    marginTop: 2,
  },
  searchResults: {
    maxHeight: 200,
    marginBottom: 8,
  },
  studentResult: {
    marginBottom: 4,
  },
  studentResultContent: {
    justifyContent: 'flex-start',
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
  dateButton: {
    marginBottom: 8,
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

export default CreateIncidentScreen;
