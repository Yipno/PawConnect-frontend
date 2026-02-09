import { View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { markAsRead, markAllAsRead } from '../reducers/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { markNotificationAsRead, markAllNotificationsAsRead } from '../api/notifications';
import AppText from './ui/AppText';

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
          <AppText className='text-deepSage font-manrope-bold text-center text-lg'>
            Aucune nouvelle notification
          </AppText>
        ) : (
          <>
            <View className='w-full'>
              <AppText className='text-offwhite font-manrope-bold text-center text-lg mb-2'>
                Notifications ({unreadCount} non lues)
              </AppText>
            </View>
            <FlatList
              data={unreadNotifications}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <View className='p-4 bg-white border-b border-stone-300'>
                  {!item.read && (
                    <TouchableOpacity onPress={() => handleMarkAsRead(item._id)}>
                      <AppText className='text-text'>{item.message}</AppText>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              className='w-11/12 border border-stone-300 rounded-lg mb-2'
            />
            <TouchableOpacity
              className='pt-1.5 px-2 border border-darkSage bg-deepSage items-center justify-center rounded-full'
              onPress={handleMarkAllAsRead}>
              <AppText className='text-offwhite font-manrope-bold text-sm mb-2'>
                Tout marquer comme lu
              </AppText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
