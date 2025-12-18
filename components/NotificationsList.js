import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { markAsRead, markAllAsRead } from '../reducers/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { markNotificationAsRead, markAllNotificationsAsRead } from '../api/notifications';

// recupere les data des notifications du reducer et les affiche dans une liste
// onclick sur une notifications, ouvre la notification et la marque comme lue
// mettre un button pour marquer toutes les notifications comme lues

export default function NotificationsList({ ...props }) {
  const notifications = useSelector(state => state.notifications.items);
  const unreadCount = useSelector(state => state.notifications.unreadCount);
  const user = useSelector(state => state.user.value);
  const dispatch = useDispatch();

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleMarkAsRead = id => {
    dispatch(markAsRead(id));
    markNotificationAsRead(id, user.token);
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
    markAllNotificationsAsRead(user.token);
  };

  return (
    <View className='absolute top-32 left-0 right-0 w-full items-center pt-2'>
      <View className='w-10/12 justify-start items-center bg-offwhite rounded-3xl p-2 border border-deepSage'>
        {unreadCount === 0 ? (
          <Text className='text-deepSage font-manrope text-center text-lg font-bold'>
            Aucune nouvelle notification
          </Text>
        ) : (
          <>
            <View className='w-full'>
              <Text className='text-offwhite font-manrope text-center text-lg font-bold mb-2'>
                Notifications ({unreadCount} non lues)
              </Text>
            </View>
            <FlatList
              data={unreadNotifications}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <View className='p-4 bg-white border-b border-stone-300'>
                  {!item.read && (
                    <TouchableOpacity onPress={() => handleMarkAsRead(item._id)}>
                      <Text className='text-text'>{item.message}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              className='w-11/12 border border-stone-300 rounded-lg mb-2'
            />
            <TouchableOpacity
              className='pt-1.5 px-2 border border-darkSage bg-deepSage items-center justify-center rounded-full'
              onPress={handleMarkAllAsRead}>
              <Text className='text-offwhite font-manrope text-sm font-bold mb-2'>
                Tout marquer comme lu
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
