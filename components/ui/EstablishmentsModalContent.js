import React from 'react';
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import useTheme from '../../hooks/useTheme';

export default function EstablishmentsModalContent() {
  const { colors } = useTheme();

  const establishments = useSelector(
    (state) => state.establishments.value
  );
  const user = useSelector((state) => state.user.value);

 const establishmentsToDisplay = (() => {
  if (user.role === 'agent') {
    if (!user.establishment) {
      return []; // agent sans association
    }

    return establishments.filter(
      (e) => e._id === user.establishment
    );
  }

  // civil
  return establishments;
})();


  return (
 <SafeAreaView style={{ flex: 1, backgroundColor: colors.offwhite }}>
     
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1, // Permet à la ScrollView de prendre tout l'espace
            paddingHorizontal: 30,
           
          }}
          keyboardShouldPersistTaps="handled"
        >
            <Text className="text-h2 text-center font-manrope font-bold text-deepSage mb-4">
             
  {user.role === 'agent' ? 'Mon organisation' : 'Associations'}
  
</Text>

{user.role === 'agent' && establishmentsToDisplay.length === 0 && (
  <View className="mt-6 p-4 bg-red-100 rounded">
    <Text className="text-center text-red-700 font-bold">
      Aucune association répertoriée
    </Text>
    <Text className="text-center text-red-700 mt-1">
      Veuillez contacter l'administrateur.
    </Text>
  </View>
)}

           
 
            {establishmentsToDisplay.map((establishment) => (
              <View
                key={establishment._id}
                className="bg-gray-100 p-4 "
              >
                {/* Logo */}
                {establishment.logo && (
                  <Image
                    source={{ uri: establishment.logo }}
                    className="w-16 h-16 mb-3 rounded"
                    resizeMode="contain"
                  />
                )}

                {/* Nom */}
                <Text className="font-bold ">
                  {establishment.name}
                </Text>

                {/* Adresse */}
                {establishment.address && (
                  <Text className="text-sm  mt-1">
                    {establishment.address.street},{' '}
                    {establishment.address.zipCode}{' '}
                    {establishment.address.city}
                  </Text>
                )}

                {/* Téléphone */}
                <TouchableOpacity
                 
                >
                  <Text className="text-sm mt-2">
                     {establishment.phone}
                  </Text>
                </TouchableOpacity>

                {/* Email */}
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`mailto:${establishment.email}`)
                  }
                >
                  <Text className="text-sm font-bold  text-deepSage mt-1">
                    {establishment.email}
                  </Text>
                </TouchableOpacity>

                {/* Site web */}
                {establishment.url && (
                  <TouchableOpacity
                    className="mt-2"
                    onPress={() => Linking.openURL(establishment.url)}
                  >
                    <Text className="text-sm font-bold text-deepSage">
                      Visiter le site 
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
           
            </ScrollView>
      
    </SafeAreaView>
     
  );
}
