import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { withWebLayout } from '@/components/layout/withWebLayout';

function FeedScreen() {
  const [showComposer, setShowComposer] = useState(false);
  const [postText, setPostText] = useState('');

  const posts = [
    {
      id: 1,
      user: {
        name: 'Carlos Mendoza',
        avatar: 'https://via.placeholder.com/40',
        gym: 'PowerGym Centro',
      },
      time: 'hace 2 horas',
      content: '¡Nuevo PR en peso muerto! 180kg 💪',
      image: 'https://via.placeholder.com/300x200',
      likes: 15,
      comments: 3,
      liked: false,
    },
    {
      id: 2,
      user: {
        name: 'Ana García',
        avatar: 'https://via.placeholder.com/40',
        gym: 'FitZone Norte',
      },
      time: 'hace 4 horas',
      content:
        'Completé mi primera rutina de 10K en cinta. ¡Qué sensación tan increíble!',
      likes: 23,
      comments: 7,
      liked: true,
    },
    {
      id: 3,
      user: {
        name: 'Miguel Torres',
        avatar: 'https://via.placeholder.com/40',
        gym: 'EliteGym Plaza',
      },
      time: 'hace 6 horas',
      content: 'Día de piernas intenso. Mañana no podré caminar 😅',
      image: 'https://via.placeholder.com/300x200',
      likes: 8,
      comments: 2,
      liked: false,
    },
  ];

  const renderPostComposer = () => (
    <View style={styles.composerCard}>
      <View style={styles.composerHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }}
          style={styles.userAvatar}
        />
        <TouchableOpacity
          style={styles.composerInput}
          onPress={() => setShowComposer(true)}
        >
          <Text style={styles.composerPlaceholder}>
            ¿Cómo fue tu entrenamiento hoy?
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.composerActions}>
        <TouchableOpacity style={styles.composerButton}>
          <FontAwesome name='camera' size={16} color='#B0B0B0' />
          <Text style={styles.composerButtonText}>Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.composerButton}>
          <FontAwesome name='map-marker' size={16} color='#B0B0B0' />
          <Text style={styles.composerButtonText}>Ubicación</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPost = (post: (typeof posts)[0]) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.user.avatar }} style={styles.userAvatar} />
        <View style={styles.postUserInfo}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <Text style={styles.userGym}>{post.user.gym}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
        <TouchableOpacity style={styles.postMenu}>
          <FontAwesome name='ellipsis-h' size={16} color='#B0B0B0' />
        </TouchableOpacity>
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome
            name={post.liked ? 'heart' : 'heart-o'}
            size={20}
            color={post.liked ? '#FF6B6B' : '#B0B0B0'}
          />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name='comment-o' size={20} color='#B0B0B0' />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name='share' size={20} color='#B0B0B0' />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActiveUsers = () => (
    <View style={styles.activeUsersCard}>
      <Text style={styles.activeUsersTitle}>Entrenando Ahora</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.activeUsersList}>
          {[1, 2, 3, 4, 5].map(user => (
            <View key={user} style={styles.activeUser}>
              <View style={styles.activeUserImageContainer}>
                <Image
                  source={{
                    uri: `https://via.placeholder.com/50?text=${user}`,
                  }}
                  style={styles.activeUserImage}
                />
                <View style={styles.onlineIndicator} />
              </View>
              <Text style={styles.activeUserName}>Usuario {user}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  if (showComposer) {
    return (
      <View style={styles.container}>
        <View style={styles.composerHeader}>
          <TouchableOpacity onPress={() => setShowComposer(false)}>
            <FontAwesome name='times' size={24} color='#FFFFFF' />
          </TouchableOpacity>
          <Text style={styles.composerTitle}>Nuevo Post</Text>
          <TouchableOpacity style={styles.publishButton}>
            <Text style={styles.publishButtonText}>Publicar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.composerBody}>
          <TextInput
            style={styles.composerTextInput}
            placeholder='¿Cómo fue tu entrenamiento hoy?'
            placeholderTextColor='#B0B0B0'
            multiline
            value={postText}
            onChangeText={setPostText}
            autoFocus
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Feed</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <FontAwesome name='bell' size={24} color='#FFFFFF' />
          </TouchableOpacity>
        </View>

        {renderActiveUsers()}
        {renderPostComposer()}

        <View style={styles.postsContainer}>{posts.map(renderPost)}</View>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

export default withWebLayout(FeedScreen, { defaultTab: 'feed' });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    padding: 8,
  },
  activeUsersCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  activeUsersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  activeUsersList: {
    flexDirection: 'row',
    gap: 16,
  },
  activeUser: {
    alignItems: 'center',
  },
  activeUserImageContainer: {
    position: 'relative',
  },
  activeUserImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#1E1E1E',
  },
  activeUserName: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 4,
  },
  composerCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  composerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  composerInput: {
    flex: 1,
    marginLeft: 12,
    padding: 12,
    backgroundColor: '#333333',
    borderRadius: 20,
  },
  composerPlaceholder: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  composerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  composerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  composerButtonText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  postCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userGym: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 2,
  },
  postTime: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 2,
  },
  postMenu: {
    padding: 4,
  },
  postContent: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  postsContainer: {
    paddingBottom: 20,
  },
  composerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  publishButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  composerBody: {
    flex: 1,
    padding: 20,
  },
  composerTextInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    textAlignVertical: 'top',
  },
  footer: {
    height: 100,
  },
});
