const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

export const fetchNotifications = async id => {
  try {
    const response = await fetch(`${BACKEND}/notifications/${id}`);
    // , {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    const data = await response.json();
    return data.notifications;
  } catch (error) {
    console.error('Erreur lors de la recupération des notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (id, token) => {
  try {
    const response = await fetch(`${BACKEND}/notifications/${id}/read`, {
      method: 'PATCH',
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async id => {
  try {
    const response = await fetch(`${BACKEND}/notifications/read-all/${id}`, {
      method: 'PATCH',
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};
