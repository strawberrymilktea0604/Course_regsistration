import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import courseService, { CurriculumFrameworkModel, SemesterModel, MajorModel, CurriculumCourseModel } from '../src/api/services/courseService';

// Define your stack parameter list
type RootStackParamList = {
  TrangChuScreen: undefined;
  ChuongTrinhKhung: undefined;
  ThongBao: undefined;
  // Other screens...
};

// Create a typed navigation prop
type ChuongTrinhKhungNavigationProp = StackNavigationProp<RootStackParamList, 'ChuongTrinhKhung'>;

const ChuongTrinhKhung = () => {
  // Use typed navigation
  const navigation = useNavigation<ChuongTrinhKhungNavigationProp>();
  
  // State variables
  const [expandedSemesters, setExpandedSemesters] = useState<number[]>([]);
  const [expandedCourses, setExpandedCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [curriculumData, setCurriculumData] = useState<CurriculumFrameworkModel | null>(null);
  const [majors, setMajors] = useState<MajorModel[]>([]);
  const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allCourses, setAllCourses] = useState<CurriculumCourseModel[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CurriculumCourseModel[]>([]);
  const [viewMode, setViewMode] = useState<'semester' | 'all'>('semester');

  // Handle back navigation
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Add navigation to ThongBao screen
  const navigateToThongBao = () => {
    navigation.navigate('ThongBao');
  };

  // Load curriculum data and majors when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load list of majors
        const majorsData = await courseService.getMajors();
        setMajors(majorsData);
        
        // If there are majors, select the first one by default
        if (majorsData.length > 0) {
          setSelectedMajorId(majorsData[0].id);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading majors:', err);
        setError('Failed to load majors data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load curriculum when selected major changes
  useEffect(() => {
    const loadCurriculum = async () => {
      if (!selectedMajorId) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching curriculum data for major ID: ${selectedMajorId}`);
        
        // Make sure we pass major_id as a parameter to the API
        const data = await courseService.getCurriculumFramework(selectedMajorId);
        console.log('Curriculum data received:', JSON.stringify(data));
        
        // Enhanced validation with more detailed error messages
        if (!data) {
          throw new Error('No curriculum data received from server');
        }
        
        if (!data.semesters) {
          throw new Error('Curriculum data missing semesters property');
        }
        
        if (!Array.isArray(data.semesters)) {
          throw new Error('Curriculum semesters is not an array');
        }
        
        setCurriculumData(data);
        
        // Extract all courses from all semesters for search functionality
        const courses: CurriculumCourseModel[] = [];
        data.semesters.forEach(semester => {
          if (semester.courses && Array.isArray(semester.courses) && semester.courses.length > 0) {
            courses.push(...semester.courses);
          }
        });
        
        setAllCourses(courses);
        setFilteredCourses(courses);
        
        // Open the first semester by default if there are any
        if (data.semesters.length > 0) {
          setExpandedSemesters([0]);
        }
      } catch (err) {
        console.error('Error loading curriculum:', err);
        setError('Failed to load curriculum data. Please try again later.');
        setCurriculumData(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurriculum();
  }, [selectedMajorId]);

  // Filter courses when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(allCourses);
      setViewMode('semester');
    } else {
      const filtered = allCourses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        course.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
      setViewMode('all');
    }
  }, [searchQuery, allCourses]);

  const toggleSemester = (index: number) => {
    setExpandedSemesters((prev) => {
      // Check if semester is already expanded
      if (prev.includes(index)) {
        // If expanded, remove from array (close it)
        return prev.filter((i) => i !== index);
      } else {
        // If not expanded, add to array (open it)
        return [...prev, index];
      }
    });
  };

  const toggleCourse = (courseId: number) => {
    setExpandedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  // Handle major selection change
  const handleMajorChange = (majorId: number) => {
    setSelectedMajorId(majorId);
    // Reset expanded semesters when changing major
    setExpandedSemesters([]);
    setExpandedCourses([]);
  };

  // Render course item
  const renderCourseItem = (course: CurriculumCourseModel, showDivider: boolean = true) => {
    const isExpanded = expandedCourses.includes(course.id);
    
    return (
      <View key={course.id}>
        <TouchableOpacity 
          style={[
            styles.subjectItem,
            isExpanded && styles.subjectItemExpanded
          ]}
          onPress={() => toggleCourse(course.id)}
        >
          <Text style={styles.subjectName}>{course.title}</Text>
          <Text style={styles.subjectCode}>{course.code}</Text>
          <Text style={styles.subjectCredits}>{course.credits}</Text>
          <View style={styles.subjectStatus}>
            <Icon
              name={course.is_required ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={course.is_required ? 'green' : 'red'}
            />
          </View>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.courseDetails}>
            {course.description && (
              <Text style={styles.courseDescription}>
                <Text style={styles.courseDetailLabel}>Mô tả: </Text>
                {course.description}
              </Text>
            )}
            <Text style={styles.courseDetail}>
              <Text style={styles.courseDetailLabel}>Số tín chỉ: </Text>
              {course.credits}
            </Text>
            {course.prerequisite_courses && (
              <Text style={styles.courseDetail}>
                <Text style={styles.courseDetailLabel}>Điều kiện tiên quyết: </Text>
                {course.prerequisite_courses}
              </Text>
            )}
            <Text style={styles.courseDetail}>
              <Text style={styles.courseDetailLabel}>Bắt buộc: </Text>
              {course.is_required ? 'Có' : 'Không'}
            </Text>
          </View>
        )}
        
        {showDivider && !isExpanded && (
          <View style={styles.itemDivider} />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back button */}
        <TouchableOpacity onPress={handleBackPress} style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>Chương trình khung</Text>

        {/* Notification button */}
        <TouchableOpacity onPress={navigateToThongBao} style={styles.iconButton}>
          <Icon name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={50} color="#d9534f" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {/* Main Title */}
          <Text style={styles.subtitle}>Chuyên ngành</Text>
          <Text style={styles.mainTitle}>
            {curriculumData?.major?.name || 'Chương trình đào tạo'}
          </Text>

          {/* Major Selection Dropdown (if there are multiple majors) */}
          {majors.length > 1 && (
            <View style={styles.majorSelection}>
              <Text style={styles.majorLabel}>Chọn ngành:</Text>
              <View style={styles.majorDropdown}>
                {majors.map((major) => (
                  <TouchableOpacity
                    key={major.id}
                    style={[
                      styles.majorItem,
                      selectedMajorId === major.id && styles.selectedMajorItem
                    ]}
                    onPress={() => handleMajorChange(major.id)}
                  >
                    <Text
                      style={[
                        styles.majorText,
                        selectedMajorId === major.id && styles.selectedMajorText
                      ]}
                    >
                      {major.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm theo tên hoặc mã học phần"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={() => setSearchQuery('')}
              >
                <Icon name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* Detailed Information */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Ngành: </Text>
              {curriculumData?.major?.name || 'Không có thông tin'}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Chương trình: </Text>
              {curriculumData?.program?.name || 'Không có thông tin'}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Tổng số tín chỉ: </Text>
              {curriculumData?.totalCredits || 0}
            </Text>
          </View>

          {/* View Modes */}
          {filteredCourses.length > 0 && searchQuery.trim() === '' && (
            <View style={styles.viewModeContainer}>
              <TouchableOpacity 
                style={[
                  styles.viewModeButton, 
                  viewMode === 'semester' && styles.activeViewModeButton
                ]}
                onPress={() => setViewMode('semester')}
              >
                <Text style={[
                  styles.viewModeText,
                  viewMode === 'semester' && styles.activeViewModeText
                ]}>Xem theo học kỳ</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.viewModeButton, 
                  viewMode === 'all' && styles.activeViewModeButton
                ]}
                onPress={() => setViewMode('all')}
              >
                <Text style={[
                  styles.viewModeText,
                  viewMode === 'all' && styles.activeViewModeText
                ]}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Search Results or Empty State */}
          {filteredCourses.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Icon name="search-outline" size={50} color="#ccc" />
              <Text style={styles.noDataText}>Không tìm thấy học phần nào phù hợp</Text>
            </View>
          ) : (
            <>
              {/* All Courses View */}
              {(viewMode === 'all' || searchQuery.trim() !== '') && (
                <View style={styles.allCoursesContainer}>
                  <Text style={styles.allCoursesTitle}>
                    {searchQuery.trim() !== '' ? 'Kết quả tìm kiếm' : 'Tất cả học phần'}
                  </Text>
                  <View style={styles.subjectList}>
                    {/* Column Headers */}
                    <View style={styles.tableHeader}>
                      <Text style={styles.headerName}>Tên học phần</Text>
                      <Text style={styles.headerCode}>Mã HP</Text>
                      <Text style={styles.headerCredits}>TC</Text>
                      <Text style={styles.headerStatus}>BB</Text>
                    </View>
                    
                    {/* Courses */}
                    {filteredCourses.map((course, index) => (
                      renderCourseItem(course, index < filteredCourses.length - 1)
                    ))}
                  </View>
                </View>
              )}

              {/* Semester View */}
              {viewMode === 'semester' && searchQuery.trim() === '' && (
                <View style={styles.semesterList}>
                  {curriculumData?.semesters?.map((semester, index) => (
                    <View key={semester.id}>
                      {/* Semester */}
                      <TouchableOpacity
                        style={[
                          styles.semesterItem,
                          expandedSemesters.includes(index) && styles.semesterItemExpanded,
                        ]}
                        onPress={() => toggleSemester(index)}
                      >
                        <View style={styles.semesterLeft}>
                          <Icon
                            name={expandedSemesters.includes(index) ? 'chevron-up-outline' : 'chevron-down-outline'}
                            size={20}
                            color="#333"
                            style={styles.arrowIcon}
                          />
                          <Text style={styles.semesterText}>{semester.name}</Text>
                        </View>
                        <Text style={styles.semesterCredits}>{semester.credits} tín chỉ</Text>
                      </TouchableOpacity>

                      {/* Course List */}
                      {expandedSemesters.includes(index) && (
                        <View style={styles.subjectList}>
                          {/* Column Headers */}
                          <View style={styles.tableHeader}>
                            <Text style={styles.headerName}>Tên học phần</Text>
                            <Text style={styles.headerCode}>Mã HP</Text>
                            <Text style={styles.headerCredits}>TC</Text>
                            <Text style={styles.headerStatus}>BB</Text>
                          </View>
                          
                          {/* Courses */}
                          {semester.courses?.map((course, subIndex) => (
                            renderCourseItem(course, subIndex < semester.courses.length - 1)
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0066CC',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 20,
    color: '#999',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  viewModeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0066CC',
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeViewModeButton: {
    backgroundColor: '#0066CC',
  },
  viewModeText: {
    color: '#0066CC',
    fontWeight: '500',
  },
  activeViewModeText: {
    color: '#fff',
  },
  allCoursesContainer: {
    marginBottom: 16,
  },
  allCoursesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  semesterList: {
    marginTop: 16,
  },
  semesterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  semesterItemExpanded: {
    backgroundColor: '#E0F7FF',
  },
  semesterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    marginRight: 8,
  },
  semesterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  semesterCredits: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subjectList: {
    paddingTop: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0E7FF',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  headerName: {
    flex: 3,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
    paddingLeft: 10,
  },
  headerCode: {
    flex: 2,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#CCCCCC',
  },
  headerCredits: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#CCCCCC',
  },
  headerStatus: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#CCCCCC',
  },
  subjectItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#FFFFFF',
  },
  subjectItemExpanded: {
    backgroundColor: '#F5F9FF',
  },
  subjectName: {
    flex: 3,
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
    paddingLeft: 10,
  },
  subjectCode: {
    flex: 2,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E0E7FF',
  },
  subjectCredits: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E0E7FF',
  },
  subjectStatus: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E0E7FF',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#E0E7FF',
  },
  courseDetails: {
    padding: 16,
    backgroundColor: '#F5F9FF',
    borderTopWidth: 1,
    borderTopColor: '#E0E7FF',
  },
  courseDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  courseDetail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  courseDetailLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#d9534f',
    textAlign: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  majorSelection: {
    marginBottom: 20,
  },
  majorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  majorDropdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  majorItem: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 4,
  },
  selectedMajorItem: {
    backgroundColor: '#0066CC',
  },
  majorText: {
    fontSize: 14,
    color: '#333',
  },
  selectedMajorText: {
    color: '#fff',
  },
  bottomPadding: {
    height: 50,
  }
});

export default ChuongTrinhKhung;