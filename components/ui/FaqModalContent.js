// components/ui/FaqModalContent.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function FaqModalContent() {
  const faqs = [
    {
      question: 'Comment signaler un animal ?',
      answer: "Vous pouvez signaler un animal via le bouton 'signalements'.",
    },
    {
      question: 'Puis-je modifier mon profil ?',
      answer: "Oui, dans le menu, dans 'Mon profil', vous pouvez mettre à jour vos informations.",
    },
    {
      question: 'Comment accéder aux ressources utiles ?',
      answer: "Cliquez sur 'Ressources utiles' dans le menu principal.",
    },
    {
      question: 'Comment supprimer mon compte ?',
      answer:
        "Allez dans menu, mon profil,  et cliquez sur 'Supprimer mon compte'. Cette action est définitive.",
    },
    {
      question: 'Que faire si je rencontre un problème technique ?',
      answer:
        "Vous pouvez signaler un problème via le bouton 'Signaler un problème' dans le menu principal.",
    },
    {
      question: 'Puis-je changer mon mot de passe ?',
      answer:
        "Oui, dans 'Mon profil', vous pouvez modifier votre mot de passe et confirmer les changements.",
    },
  ];

  return (
    <ScrollView  contentContainerStyle={{ paddingHorizontal: 24}}>
       
      <View >
        <Text className='text-h2 text-center font-manrope-bold text-deepSage'>
          FAQ
        </Text>
      </View>
      {faqs.map((faq, i) => (
        <View key={i} className={`bg-offwhite border border-lightGray rounded-2xl p-5 mb-3`}>
          <Text className='font-manrope-bold text-deepSage text-base mb-2'>
            {faq.question}
          </Text>
          <Text className='font-manrope text-sm  leading-5'>{faq.answer}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
