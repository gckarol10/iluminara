# React Native Implementation Examples

## Complete Usage Examples for React Native App

### 1. Authentication Flow

#### 1.1 Login Screen Implementation
```javascript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        
        navigation.navigate('Home');
      } else {
        Alert.alert('Erro', data.message || 'Credenciais inválidas');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        <Text>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

#### 1.2 Registration Screen Implementation
```javascript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Picker } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CITIZEN',
    location: {
      address: '',
      city: '',
      state: '',
      coordinates: []
    }
  });

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Conta criada com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Erro', data.message || 'Erro ao criar conta');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nome completo"
        value={formData.name}
        onChangeText={(text) => setFormData({...formData, name: text})}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({...formData, email: text})}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        value={formData.password}
        onChangeText={(text) => setFormData({...formData, password: text})}
        secureTextEntry
      />
      <TextInput
        placeholder="Endereço"
        value={formData.location.address}
        onChangeText={(text) => setFormData({
          ...formData, 
          location: {...formData.location, address: text}
        })}
      />
      <TextInput
        placeholder="Cidade"
        value={formData.location.city}
        onChangeText={(text) => setFormData({
          ...formData, 
          location: {...formData.location, city: text}
        })}
      />
      <TextInput
        placeholder="Estado (UF)"
        value={formData.location.state}
        onChangeText={(text) => setFormData({
          ...formData, 
          location: {...formData.location, state: text}
        })}
        maxLength={2}
      />
      
      <TouchableOpacity onPress={handleRegister}>
        <Text>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### 2. Reports Management

#### 2.1 Create Report Screen
```javascript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Picker } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateReportScreen = ({ navigation }) => {
  const [reportData, setReportData] = useState({
    type: 'POTHOLE',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      coordinates: []
    }
  });
  const [photos, setPhotos] = useState([]);

  const ISSUE_TYPES = [
    { label: 'Buraco', value: 'POTHOLE' },
    { label: 'Iluminação Pública', value: 'STREETLIGHT' },
    { label: 'Lixo', value: 'GARBAGE' },
    { label: 'Sinalização', value: 'TRAFFIC_SIGN' },
    { label: 'Calçada', value: 'SIDEWALK' },
    { label: 'Outro', value: 'OTHER' }
  ];

  const selectPhotos = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.8,
        selectionLimit: 5,
      },
      (response) => {
        if (response.assets) {
          setPhotos(response.assets);
        }
      }
    );
  };

  const createReport = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (photos.length > 0) {
        // Create report with photo upload
        const formData = new FormData();
        formData.append('type', reportData.type);
        formData.append('description', reportData.description);
        formData.append('location', JSON.stringify(reportData.location));
        
        photos.forEach((photo, index) => {
          formData.append('photos', {
            uri: photo.uri,
            type: photo.type,
            name: photo.fileName || `photo_${index}.jpg`,
          });
        });

        const response = await fetch('http://localhost:3000/reports', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const data = await response.json();
        
        if (response.ok) {
          Alert.alert('Sucesso', 'Relatório criado com sucesso!');
          navigation.goBack();
        } else {
          Alert.alert('Erro', data.message);
        }
      } else {
        // Create report without photos
        const response = await fetch('http://localhost:3000/reports', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reportData),
        });

        const data = await response.json();
        
        if (response.ok) {
          Alert.alert('Sucesso', 'Relatório criado com sucesso!');
          navigation.goBack();
        } else {
          Alert.alert('Erro', data.message);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar relatório');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Tipo do Problema:</Text>
      <Picker
        selectedValue={reportData.type}
        onValueChange={(value) => setReportData({...reportData, type: value})}
      >
        {ISSUE_TYPES.map(type => (
          <Picker.Item key={type.value} label={type.label} value={type.value} />
        ))}
      </Picker>

      <TextInput
        placeholder="Descrição do problema"
        value={reportData.description}
        onChangeText={(text) => setReportData({...reportData, description: text})}
        multiline
        numberOfLines={4}
      />

      <TextInput
        placeholder="Endereço"
        value={reportData.location.address}
        onChangeText={(text) => setReportData({
          ...reportData,
          location: {...reportData.location, address: text}
        })}
      />

      <TextInput
        placeholder="Cidade"
        value={reportData.location.city}
        onChangeText={(text) => setReportData({
          ...reportData,
          location: {...reportData.location, city: text}
        })}
      />

      <TextInput
        placeholder="Estado (UF)"
        value={reportData.location.state}
        onChangeText={(text) => setReportData({
          ...reportData,
          location: {...reportData.location, state: text}
        })}
        maxLength={2}
      />

      <TouchableOpacity onPress={selectPhotos}>
        <Text>Adicionar Fotos ({photos.length}/5)</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={createReport}>
        <Text>Criar Relatório</Text>
      </TouchableOpacity>
    </View>
  );
};
```

#### 2.2 Reports List Screen
```javascript
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput } from 'react-native';

const ReportsListScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    type: '',
    status: '',
    page: 1,
    limit: 10
  });

  const loadReports = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await fetch(`http://localhost:3000/reports?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setReports(data.reports || data);
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [filters]);

  const renderReport = ({ item }) => (
    <TouchableOpacity 
      style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
      onPress={() => navigation.navigate('ReportDetails', { reportId: item._id })}
    >
      <Text style={{ fontWeight: 'bold' }}>{getIssueTypeLabel(item.type)}</Text>
      <Text>{item.description.substring(0, 100)}...</Text>
      <Text style={{ color: '#666' }}>
        {item.location.city}, {item.location.state}
      </Text>
      <Text style={{ color: getStatusColor(item.status) }}>
        {getStatusLabel(item.status)}
      </Text>
      <Text style={{ fontSize: 12, color: '#999' }}>
        Votos: {item.votes} | Visualizações: {item.views}
      </Text>
    </TouchableOpacity>
  );

  const getIssueTypeLabel = (type) => {
    const types = {
      'POTHOLE': 'Buraco',
      'STREETLIGHT': 'Iluminação Pública',
      'GARBAGE': 'Lixo',
      'TRAFFIC_SIGN': 'Sinalização',
      'SIDEWALK': 'Calçada',
      'OTHER': 'Outro'
    };
    return types[type] || type;
  };

  const getStatusLabel = (status) => {
    const statuses = {
      'OPEN': 'Aberto',
      'IN_PROGRESS': 'Em Andamento',
      'RESOLVED': 'Resolvido',
      'REJECTED': 'Rejeitado'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'OPEN': '#f39c12',
      'IN_PROGRESS': '#3498db',
      'RESOLVED': '#27ae60',
      'REJECTED': '#e74c3c'
    };
    return colors[status] || '#000';
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <TextInput
          placeholder="Filtrar por cidade"
          value={filters.city}
          onChangeText={(text) => setFilters({...filters, city: text, page: 1})}
        />
        <TextInput
          placeholder="Filtrar por estado (UF)"
          value={filters.state}
          onChangeText={(text) => setFilters({...filters, state: text, page: 1})}
          maxLength={2}
        />
      </View>

      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item) => item._id}
        refreshing={loading}
        onRefresh={loadReports}
        onEndReached={() => {
          // Load more reports (pagination)
          setFilters({...filters, page: filters.page + 1});
        }}
      />

      <TouchableOpacity 
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: '#007bff',
          borderRadius: 50,
          padding: 15
        }}
        onPress={() => navigation.navigate('CreateReport')}
      >
        <Text style={{ color: 'white', fontSize: 24 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};
```

#### 2.3 Report Details Screen
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportDetailsScreen = ({ route }) => {
  const { reportId } = route.params;
  const [report, setReport] = useState(null);
  const [user, setUser] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    loadReport();
    loadUserData();
  }, []);

  const loadReport = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reports/${reportId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (response.ok) {
        setReport(data);
      }
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
    }
  };

  const loadUserData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const voteOnReport = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/reports/${reportId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        loadReport(); // Reload to get updated vote count
        Alert.alert('Sucesso', 'Voto registrado!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao votar');
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/reports/${reportId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: commentText })
      });

      if (response.ok) {
        setCommentText('');
        loadReport(); // Reload to get new comment
        Alert.alert('Sucesso', 'Comentário adicionado!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar comentário');
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        loadReport(); // Reload to get updated status
        Alert.alert('Sucesso', 'Status atualizado!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar status');
    }
  };

  if (!report) {
    return <Text>Carregando...</Text>;
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        {getIssueTypeLabel(report.type)}
      </Text>
      
      <Text style={{ marginVertical: 10 }}>
        {report.description}
      </Text>

      <Text style={{ fontWeight: 'bold' }}>Localização:</Text>
      <Text>{report.location.address}</Text>
      <Text>{report.location.city}, {report.location.state}</Text>

      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Status:</Text>
      <Text style={{ color: getStatusColor(report.status) }}>
        {getStatusLabel(report.status)}
      </Text>

      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
        <TouchableOpacity onPress={voteOnReport} style={{ marginRight: 20 }}>
          <Text>👍 Votar ({report.votes})</Text>
        </TouchableOpacity>
        <Text>👁 {report.views} visualizações</Text>
      </View>

      {/* City Hall Status Updates */}
      {user?.role === 'CITY_HALL' && (
        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Ações da Prefeitura:</Text>
          <TouchableOpacity onPress={() => updateStatus('IN_PROGRESS')}>
            <Text style={{ color: '#3498db' }}>Marcar como Em Andamento</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateStatus('RESOLVED')}>
            <Text style={{ color: '#27ae60' }}>Marcar como Resolvido</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateStatus('REJECTED')}>
            <Text style={{ color: '#e74c3c' }}>Rejeitar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Comments Section */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
        Comentários:
      </Text>
      
      {report.comments.map((comment, index) => (
        <View key={index} style={{ marginVertical: 5, padding: 10, backgroundColor: '#f5f5f5' }}>
          <Text>{comment.text}</Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            {new Date(comment.createdAt).toLocaleDateString()}
          </Text>
        </View>
      ))}

      {/* Add Comment (City Hall only) */}
      {user?.role === 'CITY_HALL' && (
        <View style={{ marginTop: 20 }}>
          <TextInput
            placeholder="Adicionar comentário..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
            numberOfLines={3}
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10 }}
          />
          <TouchableOpacity onPress={addComment} style={{ marginTop: 10 }}>
            <Text style={{ color: '#007bff' }}>Adicionar Comentário</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};
```

### 3. API Service Class (Complete Implementation)

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:3000'; // Change for production
  }

  async getAuthToken() {
    return await AsyncStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const token = await this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication
  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async signin(credentials) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
  }

  // Reports
  async createReport(reportData) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async createReportWithPhotos(reportData, photos) {
    const formData = new FormData();
    formData.append('type', reportData.type);
    formData.append('description', reportData.description);
    formData.append('location', JSON.stringify(reportData.location));
    
    photos.forEach((photo, index) => {
      formData.append('photos', {
        uri: photo.uri,
        type: photo.type,
        name: photo.fileName || `photo_${index}.jpg`,
      });
    });

    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseURL}/reports`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error creating report');
    }

    return response.json();
  }

  async getReports(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key].toString());
      }
    });
    return this.request(`/reports?${queryParams}`);
  }

  async getMyReports(page = 1, limit = 10) {
    return this.request(`/reports/my-reports?page=${page}&limit=${limit}`);
  }

  async getReportById(reportId) {
    return this.request(`/reports/${reportId}`);
  }

  async addComment(reportId, text) {
    return this.request(`/reports/${reportId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async updateReportStatus(reportId, status) {
    return this.request(`/reports/${reportId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async voteOnReport(reportId) {
    return this.request(`/reports/${reportId}/vote`, {
      method: 'POST',
    });
  }

  async getStatistics() {
    return this.request('/reports/statistics');
  }
}

export default new ApiService();
```

### 4. Constants File

```javascript
// constants/api.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000', // Change for production
  ENDPOINTS: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
    REPORTS: '/reports',
    MY_REPORTS: '/reports/my-reports',
    REPORT_BY_ID: '/reports/:id',
    REPORT_COMMENTS: '/reports/:id/comments',
    REPORT_STATUS: '/reports/:id/status',
    REPORT_VOTE: '/reports/:id/vote',
    REPORT_STATISTICS: '/reports/statistics',
  }
};

export const ISSUE_TYPES = {
  POTHOLE: 'POTHOLE',
  STREETLIGHT: 'STREETLIGHT',
  GARBAGE: 'GARBAGE',
  TRAFFIC_SIGN: 'TRAFFIC_SIGN',
  SIDEWALK: 'SIDEWALK',
  OTHER: 'OTHER'
};

export const REPORT_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED'
};

export const USER_ROLES = {
  CITIZEN: 'CITIZEN',
  CITY_HALL: 'CITY_HALL'
};

export const ISSUE_TYPE_LABELS = {
  [ISSUE_TYPES.POTHOLE]: 'Buraco',
  [ISSUE_TYPES.STREETLIGHT]: 'Iluminação Pública',
  [ISSUE_TYPES.GARBAGE]: 'Lixo',
  [ISSUE_TYPES.TRAFFIC_SIGN]: 'Sinalização',
  [ISSUE_TYPES.SIDEWALK]: 'Calçada',
  [ISSUE_TYPES.OTHER]: 'Outro'
};

export const STATUS_LABELS = {
  [REPORT_STATUS.OPEN]: 'Aberto',
  [REPORT_STATUS.IN_PROGRESS]: 'Em Andamento',
  [REPORT_STATUS.RESOLVED]: 'Resolvido',
  [REPORT_STATUS.REJECTED]: 'Rejeitado'
};

export const STATUS_COLORS = {
  [REPORT_STATUS.OPEN]: '#f39c12',
  [REPORT_STATUS.IN_PROGRESS]: '#3498db',
  [REPORT_STATUS.RESOLVED]: '#27ae60',
  [REPORT_STATUS.REJECTED]: '#e74c3c'
};
```

---

**Ready to use**: This documentation provides complete examples for implementing all API endpoints in a React Native application, including authentication, report management, photo uploads, and role-based features.
