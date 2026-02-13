import React from 'react';
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
  List,
  Avatar,
  IconButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { THEME } from '../../constants';

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return THEME.colors.error;
      case 'teacher':
        return THEME.colors.primary;
      case 'warden':
        return THEME.colors.warning;
      default:
        return THEME.colors.disabled;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return 'admin-panel-settings';
      case 'teacher':
        return 'school';
      case 'warden':
        return 'security';
      default:
        return 'person';
    }
  };

  const menuItems = [
    {
      title: 'Settings',
      icon: 'settings',
      onPress: () => Alert.alert('Settings', 'Settings screen not implemented yet'),
    },
    {
      title: 'Help & Support',
      icon: 'help',
      onPress: () => Alert.alert('Help', 'Help screen not implemented yet'),
    },
    {
      title: 'About',
      icon: 'info',
      onPress: () => Alert.alert('About', 'EduDiscipline v1.0.0\nStudent Disciplinary Management System'),
    },
    {
      title: 'Privacy Policy',
      icon: 'privacy-tip',
      onPress: () => Alert.alert('Privacy Policy', 'Privacy policy not implemented yet'),
    },
    {
      title: 'Terms of Service',
      icon: 'description',
      onPress: () => Alert.alert('Terms of Service', 'Terms of service not implemented yet'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <Avatar.Icon
            size={80}
            icon={getRoleIcon(user?.role || '')}
            style={[styles.avatar, { backgroundColor: getRoleColor(user?.role || '') }]}
          />
          <Title style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Title>
          <View style={styles.roleContainer}>
            <Icon 
              name={getRoleIcon(user?.role || '')} 
              size={16} 
              color={getRoleColor(user?.role || '')} 
            />
            <Text style={[styles.roleText, { color: getRoleColor(user?.role || '') }]}>
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : ''}
            </Text>
          </View>
          <Paragraph style={styles.userEmail}>{user?.username}</Paragraph>
        </Card.Content>
      </Card>

      {/* Quick Stats */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Stats</Title>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="warning" size={24} color={THEME.colors.warning} />
              <Text style={styles.statValue}>--</Text>
              <Text style={styles.statLabel}>Incidents</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="people" size={24} color={THEME.colors.primary} />
              <Text style={styles.statValue}>--</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="emoji-events" size={24} color={THEME.colors.success} />
              <Text style={styles.statValue}>--</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Account Settings */}
      <Card style={styles.menuCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Account Settings</Title>
          
          <List.Item
            title="Edit Profile"
            description="Update your personal information"
            left={(props) => <List.Icon {...props} icon="edit" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Edit Profile', 'Profile editing not implemented yet')}
            style={styles.listItem}
          />

          <List.Item
            title="Change Password"
            description="Update your password"
            left={(props) => <List.Icon {...props} icon="lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Change Password', 'Password change not implemented yet')}
            style={styles.listItem}
          />

          <List.Item
            title="Notifications"
            description="Manage notification preferences"
            left={(props) => <List.Icon {...props} icon="notifications" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Notifications', 'Notification settings not implemented yet')}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* App Settings */}
      <Card style={styles.menuCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>App Settings</Title>
          
          {menuItems.map((item, index) => (
            <List.Item
              key={item.title}
              title={item.title}
              left={(props) => <List.Icon {...props} icon={item.icon} />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={item.onPress}
              style={styles.listItem}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Card style={styles.logoutCard}>
        <Card.Content>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            icon="logout"
          >
            Logout
          </Button>
        </Card.Content>
      </Card>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>EduDiscipline v1.0.0</Text>
        <Text style={styles.copyrightText}>© 2024 EduDiscipline Team</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  headerCard: {
    margin: 16,
    elevation: 4,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  roleText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  userEmail: {
    fontSize: 14,
    color: THEME.colors.disabled,
    textAlign: 'center',
  },
  statsCard: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: THEME.colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.colors.disabled,
    marginTop: 4,
    textAlign: 'center',
  },
  menuCard: {
    margin: 16,
    elevation: 2,
  },
  listItem: {
    paddingVertical: 4,
  },
  logoutCard: {
    margin: 16,
    elevation: 2,
  },
  logoutButton: {
    borderColor: THEME.colors.error,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: THEME.colors.disabled,
  },
  copyrightText: {
    fontSize: 10,
    color: THEME.colors.disabled,
    marginTop: 4,
  },
});

export default ProfileScreen;
