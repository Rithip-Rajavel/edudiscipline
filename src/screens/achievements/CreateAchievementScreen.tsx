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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { achievementsApi } from '../../api/achievements';
import { studentsApi } from '../../api/students';
import { ACHIEVEMENT_TYPES, THEME } from '../../constants';
import { AchievementDTO, StudentDTO } from '../../types';

const CreateAchievementScreen = ({ route, navigation }: any) => {
  const { user } = useAuth();
  const { editMode, achievement } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StudentDTO[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentDTO | null>(null);
  const [showStudentSearch, setShowStudentSearch] = useState(false);
  
  const [achievementData, setAchievementData] = useState<AchievementDTO>({
    studentId: 0,
    title: '',
    description: '',
    achievementType: 'ACADEMIC',
    dateAchieved: new Date().toISOString(),
    awardedBy: user?.firstName + ' ' + user?.lastName || '',
    certificateUrl: '',
  });

  const [errors, setErrors] = useState({
    student: '',
    title: '',
    achievementType: '',
    dateAchieved: '',
  });

  // Initialize form data if in edit mode
  React.useEffect(() => {
    if (editMode && achievement) {
      setAchievementData(achievement);
      setSelectedStudent({
        id: achievement.studentId,
        firstName: achievement.studentName?.split(' ')[0] || '',
        lastName: achievement.studentName?.split(' ')[1] || '',
        rollNumber: achievement.studentRollNumber || '',
        email: '',
        mobileNumber: '',
        department: '',
        username: '',
      });
    }
  }, [editMode, achievement]);

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
    setAchievementData({ ...achievementData, studentId: student.id || 0 });
    setSearchQuery('');
    setSearchResults([]);
    setShowStudentSearch(false);
    setErrors({ ...errors, student: '' });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAchievementData({ 
        ...achievementData, 
        dateAchieved: selectedDate.toISOString() 
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      student: !selectedStudent ? 'Please select a student' : '',
      title: !achievementData.title?.trim() ? 'Please enter achievement title' : '',
      achievementType: !achievementData.achievementType ? 'Please select achievement type' : '',
      dateAchieved: !achievementData.dateAchieved ? 'Please select date achieved' : '',
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
      const data = {
        ...achievementData,
        studentId: selectedStudent?.id || 0,
      };

      if (editMode) {
        await achievementsApi.update(achievement.id, data);
        Alert.alert('Success', 'Achievement updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await achievementsApi.create(data);
        Alert.alert('Success', 'Achievement recorded successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save achievement');
    } finally {
      setIsLoading(false);
    }
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

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>
            {editMode ? 'Edit Achievement' : 'Create Achievement'}
          </Title>
          <Paragraph style={styles.cardSubtitle}>
            {editMode ? 'Update achievement details' : 'Record student achievement'}
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

          {/* Achievement Title */}
          <View style={styles.section}>
            <TextInput
              label="Achievement Title"
              value={achievementData.title || ''}
              onChangeText={(text) => {
                setAchievementData({ ...achievementData, title: text });
                setErrors({ ...errors, title: '' });
              }}
              mode="outlined"
              style={styles.input}
              error={!!errors.title}
            />
            <HelperText type="error" visible={!!errors.title}>
              {errors.title}
            </HelperText>
          </View>

          {/* Achievement Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievement Type</Text>
            <RadioButton.Group
              onValueChange={(value) => {
                setAchievementData({ ...achievementData, achievementType: value as any });
                setErrors({ ...errors, achievementType: '' });
              }}
              value={achievementData.achievementType}
            >
              {ACHIEVEMENT_TYPES.map((type) => (
                <View key={type.value} style={styles.radioItem}>
                  <RadioButton value={type.value} />
                  <View style={styles.radioLabelContainer}>
                    <Icon 
                      name={getAchievementTypeIcon(type.value)} 
                      size={20} 
                      color={THEME.colors.primary} 
                    />
                    <Text style={styles.radioLabel}>{type.label}</Text>
                  </View>
                </View>
              ))}
            </RadioButton.Group>
            <HelperText type="error" visible={!!errors.achievementType}>
              {errors.achievementType}
            </HelperText>
          </View>

          {/* Date Achieved */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date Achieved</Text>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              {achievementData.dateAchieved 
                ? new Date(achievementData.dateAchieved).toLocaleDateString()
                : 'Select Date'
              }
            </Button>
            <HelperText type="error" visible={!!errors.dateAchieved}>
              {errors.dateAchieved}
            </HelperText>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <TextInput
              label="Description"
              value={achievementData.description || ''}
              onChangeText={(text) => setAchievementData({ ...achievementData, description: text })}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              placeholder="Provide details about the achievement"
            />
          </View>

          {/* Awarded By */}
          <View style={styles.section}>
            <TextInput
              label="Awarded By"
              value={achievementData.awardedBy || ''}
              onChangeText={(text) => setAchievementData({ ...achievementData, awardedBy: text })}
              mode="outlined"
              style={styles.input}
              placeholder="Person or organization awarding this"
            />
          </View>

          {/* Certificate URL */}
          <View style={styles.section}>
            <TextInput
              label="Certificate URL (Optional)"
              value={achievementData.certificateUrl || ''}
              onChangeText={(text) => setAchievementData({ ...achievementData, certificateUrl: text })}
              mode="outlined"
              style={styles.input}
              placeholder="Link to certificate or document"
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
              {isLoading ? 'Saving...' : (editMode ? 'Update Achievement' : 'Create Achievement')}
            </Button>
          </View>
        </Card.Content>
      </Card>

      {showDatePicker && (
        <DateTimePicker
          value={achievementData.dateAchieved ? new Date(achievementData.dateAchieved) : new Date()}
          mode="date"
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
  radioLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    flex: 1,
  },
  radioLabel: {
    fontSize: 14,
    color: THEME.colors.text,
    marginLeft: 8,
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

export default CreateAchievementScreen;
