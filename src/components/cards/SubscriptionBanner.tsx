import React/* , { useState, useEffect } */ from 'react';
import { View, Text, StyleSheet, TouchableOpacity/* , Dimensions */ } from 'react-native';
// import { Ionicons } from '@expo/vector-icons'; // No longer needed directly
import { LinearGradient } from 'expo-linear-gradient';
import { useCountdownTimer } from '../../hooks/useCountdownTimer'; // Import the hook
import { CountdownDisplay } from '../items/CountdownDisplay'; // Import the display component

interface SubscriptionBannerProps {
  onPress: () => void;
  trialEndsAt?: Date;
  discount?: number;
}

const defaultTrialEndDate = () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ 
  onPress, 
  trialEndsAt = defaultTrialEndDate(), 
  discount = 80 
}) => {
  // Use the countdown hook
  const timeLeft = useCountdownTimer(trialEndsAt);

  // Timer state and logic removed, handled by the hook
  // const [timeLeft, setTimeLeft] = useState<{
  //   hours: number;
  //   minutes: number;
  //   seconds: number;
  // }>({ hours: 0, minutes: 0, seconds: 0 });

  // useEffect(() => {
  //   const calculateTimeLeft = () => {
  //     const difference = trialEndsAt.getTime() - Date.now();
      
  //     if (difference > 0) {
  //       const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  //       const minutes = Math.floor((difference / 1000 / 60) % 60);
  //       const seconds = Math.floor((difference / 1000) % 60);
        
  //       setTimeLeft({ hours, minutes, seconds });
  //     }
  //   };

  //   calculateTimeLeft();
  //   const timer = setInterval(calculateTimeLeft, 1000);

  //   return () => clearInterval(timer);
  // }, [trialEndsAt]);

  // Formatting function moved to CountdownDisplay or hook (not needed here)
  // const formatNumber = (num: number): string => num.toString().padStart(2, '0');

  // Days left calculation moved to hook
  // const daysLeft = Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const daysLeft = timeLeft.days; // Get days directly from hook

  // Only render if the trial hasn't ended
  if (timeLeft.total <= 0) {
    return null;
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#ffe1e9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <View style={styles.headerContainer}>
              <View style={styles.discountContainer}>
                <Text style={styles.discountText}>{discount}% OFF</Text>
              </View>
              <Text style={styles.trialText}>
                {/* Ensure correct pluralization for day(s) */}
                Trial ends in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
              </Text>
            </View>
            
            {/* Use the CountdownDisplay component */}
            <CountdownDisplay timeLeft={timeLeft} />

            {/* Timer rendering logic removed, handled by CountdownDisplay */}
            {/* <View style={styles.timerContainer}>
              <View style={styles.timeBlock}>
                <Text style={styles.timeNumber}>{formatNumber(timeLeft.hours)}</Text>
                <Text style={styles.timeLabel}>hours</Text>
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={styles.timeBlock}>
                <Text style={styles.timeNumber}>{formatNumber(timeLeft.minutes)}</Text>
                <Text style={styles.timeLabel}>mins</Text>
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={styles.timeBlock}>
                <Text style={styles.timeNumber}>{formatNumber(timeLeft.seconds)}</Text>
                <Text style={styles.timeLabel}>secs</Text>
              </View>
            </View> */}
          </View>

          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Subscribe Now</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  gradient: {
    width: '100%',
    padding: 16,
  },
  content: {
    alignItems: 'center',
  },
  mainContent: {
    width: '100%',
    marginBottom: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  discountContainer: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  trialText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 