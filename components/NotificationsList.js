import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { markAsRead, markAllAsRead } from '../reducers/notifications';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
const { colors } = useTheme();

// recupere les data des notifications du reducer et les affiche dans une liste
// onclick sur une notifications, ouvre la notification et la marque comme lue
// mettre un button pour marquer toutes les notifications comme lues

export default function NotificationsList({ ...props }) {
  const notifications = useSelector(state => state.notifications.items);
  const unreadCount = useSelector(state => state.notifications.unreadCount);
  const dispatch = useDispatch();

  const handleMarkAsRead = id => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <View className='absolute top-32 left-0 right-0 w-full items-center pt-2'>
      <View className='w-10/12 h-[200px] justify-start items-center bg-offwhite/80 rounded-3xl p-2 border border-deepSage'>
        <View className='w-full'>
          <Text className='text-darkSage font-manrope text-center text-lg font-bold mb-2'>
            Notifications ({unreadCount} non lues)
          </Text>
        </View>
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View className='p-4 border-b border-stone-300'>
              <Text className='text-gray-600'>{item.description}</Text>
              {!item.read && (
                <TouchableOpacity onPress={() => handleMarkAsRead(item.id)}>
                  <Text className='text-blue-500'>Mark as read</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          className='w-11/12 border border-stone-300 rounded-lg mb-2'
        />
        <TouchableOpacity
          className='pt-1.5 px-2 border border-danger bg-offwhite items-center justify-center rounded-full'
          onPress={handleMarkAllAsRead}>
          <Text className='text-danger font-manrope text-sm font-semibold mb-2'>
            Tout marquer comme lu
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
