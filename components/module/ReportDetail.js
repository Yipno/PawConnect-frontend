import React from 'react';
import { View, Text, Image } from 'react-native';
import CustomModal from '../ui/CustomModal';

export default function ReportDetail({ visible, onClose, report }) {
  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      content={
        report ? (
          <View>
            <View className='w-full aspect-[4/3] mb-4'>
              <Image
                source={{ url: report.photoUrl }}
                className='w-full h-full rounded-2xl object-cover'
              />
            </View>

            {/* Title */}
            <Text className='text-xl font-bold mb-2 text-left'>{report.title}</Text>

            {/* Place & Date */}
            <View className='w-full flex-row justify-between mb-3'>
              <Text>{report.place}</Text>
              <Text>{report.date}</Text>
            </View>

            {/* Priority */}
            <View className='bg-deepSage/20 border border-deepSage rounded-2xl px-3 py-1 self-start mb-4'>
              <Text>{report.priority}</Text>
            </View>

            {/* Description */}
            <View>
              <Text className='text-base text-gray-800 leading-5' style={{ textAlign: 'justify' }}>
                {report.description}
              </Text>
            </View>
          </View>
        ) : (
          <Text>Aucun détail disponible.</Text>
        )
      }
    />
  );
}
