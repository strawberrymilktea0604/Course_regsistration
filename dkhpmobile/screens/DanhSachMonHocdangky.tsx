import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { registrationService } from '../src/api/services/registrationService';
import courseService from '../src/api/services/courseService';
import { Registration } from '../src/api/types/registration';

// Status options for filtering
const statusOptions = [
  { label: 'All Active', value: 'all' },  // Changed from empty string to 'all'
  { label: 'Enrolled', value: 'enrolled' },
  { label: 'Waitlisted', value: 'waitlisted' },
  { label: 'Dropped', value: 'dropped' },
  { label: 'Completed', value: 'completed' }
];

const DanhSachMonHocdangky = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [droppingCourse, setDroppingCourse] = useState<{[key: number]: boolean}>({});
  
  // Filtering state
  const [terms, setTerms] = useState<Array<{ id: number, term_name: string }>>([]);
  const [selectedTerm, setSelectedTerm] = useState<number | string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Multi-select state
  const [selectedRegistrations, setSelectedRegistrations] = useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [batchDropping, setBatchDropping] = useState(false);

  // Load registered courses and available terms when component mounts
  useEffect(() => {
    Promise.all([
      fetchRegistrations(),
      fetchTerms()
    ]).catch(error => {
      console.error('Error during initial data fetch:', error);
    });
  }, []);

  // Fetch available academic terms
  const fetchTerms = async () => {
    try {
      const response = await courseService.getActiveTerms();
      // Map the response to match expected state structure
      const formattedTerms = (response || []).map(term => ({
        id: term.id,
        term_name: term.term_name // Assuming 'term_name' is the correct property in AcademicTermModel
      }));
      setTerms(formattedTerms);
    } catch (error) {
      console.error('Error fetching terms:', error);
    }
  };

  // Fetch all registrations for the current student with filters
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      
      // Apply filters if selected
      const options: { status?: string; termId?: number } = {};
      if (selectedStatus && selectedStatus !== 'all') options.status = selectedStatus;
      if (selectedTerm && selectedTerm !== "all") options.termId = selectedTerm as number;
      
      const response = await registrationService.getMyRegistrations(options);
      setRegistrations(
        ((response.data || [])as Registration[]).map(r => ({
          ...r,
          title: r.title || r.course_title || 'Không xác định'
        }))
      );
      
      // Clear selection when refreshing data
      if (selectionMode) {
        setSelectionMode(false);
        setSelectedRegistrations([]);
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching registrations:', error);
      Alert.alert(
        'Lỗi',
        'Không thể tải danh sách các môn học đã đăng ký. Vui lòng thử lại sau.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchRegistrations();
    } catch (error) {
      console.error('Error refreshing registrations:', error);
    }
    setRefreshing(false);
  };

  // Toggle course selection in multi-select mode
  const toggleCourseSelection = (registrationId: number) => {
    setSelectedRegistrations(prev => {
      if (prev.includes(registrationId)) {
        return prev.filter(id => id !== registrationId);
      } else {
        return [...prev, registrationId];
      }
    });
  };

  // Handle batch drop operation
  const handleBatchDrop = () => {
    if (selectedRegistrations.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một môn học để hủy đăng ký');
      return;
    }

    // Filter out any potentially undefined registration IDs
    const validRegistrationIds = selectedRegistrations.filter(id => id !== undefined);
    
    if (validRegistrationIds.length < selectedRegistrations.length) {
      Alert.alert(
        'Cảnh báo', 
        'Một số môn học không thể hủy đăng ký vì ID đăng ký không hợp lệ. Chỉ các môn học hợp lệ sẽ được hủy.'
      );
      
      // Update selectedRegistrations to only include valid IDs
      setSelectedRegistrations(validRegistrationIds);
      
      if (validRegistrationIds.length === 0) {
        return;
      }
    }

    Alert.alert(
      'Hủy đăng ký nhiều môn học',
      `Bạn có chắc chắn muốn hủy đăng ký ${validRegistrationIds.length} môn học đã chọn?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          style: 'destructive',
          onPress: () => {
            (async () => {
              try {
                setBatchDropping(true);
                const result = await registrationService.batchDropCourses(validRegistrationIds);
                
                if (result.successfulDrops > 0) {
                  Alert.alert(
                    'Thành công',
                    `Đã hủy đăng ký ${result.successfulDrops}/${result.totalRequested} môn học thành công.`
                  );
                  
                  // Reset selection and refresh the list
                  setSelectionMode(false);
                  setSelectedRegistrations([]);
                  await fetchRegistrations();
                } else {
                  Alert.alert(
                    'Thông báo',
                    `Không có môn học nào được hủy đăng ký. ${result.failedDrops} thao tác thất bại.`
                  );
                }
              } catch (error) {
                console.error('Error batch dropping courses:', error);
                
                let errorMsg = 'Không thể hủy đăng ký môn học. Vui lòng thử lại sau.';
                const err = error as any;
                if (err?.response?.data?.message) {
                  errorMsg = err.response.data.message;
                }
                
                Alert.alert('Lỗi', errorMsg);
              } finally {
                setBatchDropping(false);
              }
            })();
          }
        }
      ]
    );
  };

  // Drop/cancel a single course registration
  const dropCourse = async (registration: Registration) => {
    // Validate that registration ID exists
    if (!registration.registration_id) {
      Alert.alert(
        'Lỗi',
        'Không thể hủy đăng ký vì ID đăng ký không hợp lệ.'
      );
      return;
    }

    Alert.alert(
      'Hủy đăng ký môn học',
      `Bạn có chắc chắn muốn hủy đăng ký môn ${registration.title}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          style: 'destructive',
          onPress: async () => {
            try {
              setDroppingCourse(prev => ({ ...prev, [registration.registration_id]: true }));
              await registrationService.dropCourse(registration.registration_id);
              
              Alert.alert(
                'Thành công', 
                `Bạn đã hủy đăng ký môn ${registration.title} thành công`
              );
              
              // Refresh the list
              fetchRegistrations();
            } catch (error) {
              console.error('Error dropping course:', error);
              let errorMessage = 'Không thể hủy đăng ký môn học';
              
              const err = error as any;
              if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
              }
              
              Alert.alert('Lỗi', errorMessage);
            } finally {
              setDroppingCourse(prev => ({ ...prev, [registration.registration_id]: false }));
            }
          }
        }
      ]
    );
  };

  // Check if a course can be dropped (only enrolled or waitlisted courses)
  const canDropCourse = (status: string): boolean => {
    return ['enrolled', 'waitlisted'].includes(status.toLowerCase());
  };

  // Check if the course is within the drop period
  const isWithinDropPeriod = (registration: Registration): boolean => {
    if (!registration.registration_start || !registration.registration_end) {
      return true; // If no period info, default to true
    }
    
    const now = new Date();
    const regStart = new Date(registration.registration_start);
    const regEnd = new Date(registration.registration_end);
    
    return now >= regStart && now <= regEnd;
  };
  
  // Format date to Vietnamese format
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  
  // Render a registration item
  const renderItem = ({ item }: { item: Registration }) => {
    const isSelected = selectedRegistrations.includes(item.registration_id);
    const isDroppable = canDropCourse(item.registration_status);
    const isInDropPeriod = isWithinDropPeriod(item);
    
    return (
      <TouchableOpacity 
        style={[
          styles.courseCard,
          isSelected && styles.selectedCard
        ]}
        onPress={() => selectionMode ? toggleCourseSelection(item.registration_id) : null}
        onLongPress={() => {
          if (!selectionMode && isDroppable && isInDropPeriod) {
            setSelectionMode(true);
            setSelectedRegistrations([item.registration_id]);
          }
        }}
      >
        {selectionMode && (
          <View style={styles.checkboxContainer}>
            <Ionicons 
              name={isSelected ? 'checkbox' : 'square-outline'} 
              size={24} 
              color={isSelected ? '#0066CC' : '#888'} 
            />
          </View>
        )}
        
        <View style={styles.courseContent}>
          <View style={styles.courseInfo}>
            <Text style={styles.courseCode}>{item.course_code}</Text>
            <Text style={styles.courseTitle}>{item.title}</Text>
            
            <View style={styles.courseDetailsRow}>
              <Text style={styles.courseDetails}>
                {item.credits} tín chỉ • {item.term_name}
              </Text>
              <View style={[
                styles.statusBadge, 
                getStatusStyle(item.registration_status)
              ]}>
                <Text style={styles.statusText}>
                  {getStatusLabel(item.registration_status)}
                </Text>
              </View>
            </View>
            
            {item.section_number && (
              <Text style={styles.sectionText}>Nhóm: {item.section_number}</Text>
            )}
            
            {item.schedule_details && item.schedule_details.length > 0 && (
              <View style={styles.scheduleContainer}>
                <Text style={styles.scheduleTitle}>Lịch học:</Text>
                {item.schedule_details.map((schedule, idx) => (
                  <Text key={idx} style={styles.scheduleText}>
                    {`${schedule.day}, ${schedule.start_time}-${schedule.end_time}, ${schedule.room}`}
                  </Text>
                ))}
              </View>
            )}
            
            <Text style={styles.registrationDate}>
              Đăng ký: {formatDate(item.registration_date)}
            </Text>

            {item.registration_start && item.registration_end && (
              <Text style={styles.registrationPeriod}>
                Thời gian hủy đăng ký: {formatDate(item.registration_start)} - {formatDate(item.registration_end)}
              </Text>
            )}
            
            {isDroppable && !isInDropPeriod && (
              <Text style={styles.outOfPeriodText}>
                Đã hết thời gian hủy đăng ký
              </Text>
            )}
          </View>
          
          {!selectionMode && isDroppable && isInDropPeriod && (
            <TouchableOpacity 
              style={styles.dropButton}
              onPress={() => dropCourse(item)}
              disabled={Boolean(droppingCourse[item.registration_id])}
            >
              {droppingCourse[item.registration_id] ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.dropButtonText}>Hủy</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  // Helper function to get status label
  const getStatusLabel = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'enrolled': return 'Đã đăng ký';
      case 'waitlisted': return 'Chờ xét';
      case 'dropped': return 'Đã hủy';
      case 'completed': return 'Hoàn thành';
      default: return status;
    }
  };
  
  // Helper function to get status style
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'enrolled': return styles.statusEnrolled;
      case 'waitlisted': return styles.statusWaitlisted;
      case 'dropped': return styles.statusDropped;
      case 'completed': return styles.statusCompleted;
      default: return {};
    }
  };

  return (
    <View style={styles.container}>
      {/* Filter Controls */}
      <View style={styles.filterContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Học kỳ:</Text>
          <Picker
            selectedValue={selectedTerm}
            onValueChange={(itemValue) => setSelectedTerm(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Tất cả học kỳ" value="all" />
            {terms.map(term => (
              <Picker.Item 
                key={term.id} 
                label={term.term_name} 
                value={term.id} 
              />
            ))}
          </Picker>
        </View>
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Trạng thái:</Text>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(itemValue) => setSelectedStatus(itemValue)}
            style={styles.picker}
          >
            {statusOptions.map((option, index) => (
              <Picker.Item 
                key={index} 
                label={option.label} 
                value={option.value} 
              />
            ))}
          </Picker>
        </View>
        
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={fetchRegistrations}
        >
          <Text style={styles.applyButtonText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>
      
      {/* Selection Actions */}
      {selectionMode && (
        <View style={styles.selectionActionsContainer}>
          <Text style={styles.selectionText}>
            Đã chọn {selectedRegistrations.length} môn học
          </Text>
          
          <View style={styles.selectionButtons}>
            <TouchableOpacity 
              style={styles.cancelSelectionButton}
              onPress={() => {
                setSelectionMode(false);
                setSelectedRegistrations([]);
              }}
            >
              <Text style={styles.cancelSelectionText}>Hủy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.batchDropButton,
                selectedRegistrations.length === 0 && styles.disabledButton
              ]}
              onPress={handleBatchDrop}
              disabled={selectedRegistrations.length === 0 || batchDropping}
            >
              {batchDropping ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.batchDropText}>Hủy đăng ký</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Registration List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      ) : registrations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="document-text-outline" 
            size={80} 
            color="#cccccc" 
            style={styles.emptyImage} 
          />
          <Text style={styles.emptyText}>
            Không tìm thấy môn học đã đăng ký
          </Text>
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate('Đăng Ký', { screen: 'DangKyHocPhan' })}
          >
            <Text style={styles.registerButtonText}>Đăng ký môn học</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={registrations}
          keyExtractor={(item) => `${item.registration_id}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0066CC']}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pickerContainer: {
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  picker: {
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 40,
  },
  applyButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectionActionsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectionButtons: {
    flexDirection: 'row',
  },
  cancelSelectionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  cancelSelectionText: {
    color: '#333',
  },
  batchDropButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#d9534f',
  },
  batchDropText: {
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    opacity: 0.5,
  },
  listContainer: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: 'row',
  },
  selectedCard: {
    backgroundColor: '#e6f2ff',
    borderColor: '#0066CC',
    borderWidth: 1,
  },
  checkboxContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  courseContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  courseDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  courseDetails: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  statusEnrolled: {
    backgroundColor: '#28a745',
  },
  statusWaitlisted: {
    backgroundColor: '#ffc107',
  },
  statusDropped: {
    backgroundColor: '#dc3545',
  },
  statusCompleted: {
    backgroundColor: '#17a2b8',
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scheduleContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  registrationDate: {
    fontSize: 13,
    color: '#888',
  },
  registrationPeriod: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  outOfPeriodText: {
    fontSize: 13,
    color: '#dc3545',
    marginTop: 4,
  },
  dropButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
    alignSelf: 'center',
  },
  dropButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  separator: {
    height: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyImage: {
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  registerButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

export default DanhSachMonHocdangky;