import React, {useState,useEffect} from 'react';
import { View, Text, ScrollView, TouchableOpacity,RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getUserProfile } from '@/services/userService';
import { useAuth } from '@/context/authContext';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const router = useRouter();
  const {user} = useAuth();
  const [loading,setLoading] = useState(true);
  const [profile,setProfile] = useState<any>(null);
  const [refreshing,setRefreshing]= useState(false);

  useEffect(() => {
    loadProfile();
  },[])

  const loadProfile = async () => {
    try {
      const userData = getUserProfile();
    setProfile(userData);
    } catch (error) {
      console.error("Message")
    }finally{
      setRefreshing(false);
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if(hour < 12) return "Good Morning";
    if(hour < 17) return "Good Afternoon";
    return "Good Evening"
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-muted">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView className='flex-1 bg-background'>
      <ScrollView className='flex-1' contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}>
        <View className='mb-8'>
          <Text className='text-text-secondary text-sm'>{greeting()}</Text>
          <Text className='text-text-primary font-bold text-3xl '>{profile?.user?.fullName || user?.email?.split('@')[0] || 'Your farm Dashboard'}</Text>
          <Text className='text-text-secondary text-sm'> {profile?.farmProfile?.farmName || 'Your farm dashboard'}</Text>
        </View>

        <View className='mb-8 flex-row bg-primary rounded-xl items-center justify-between'>
          <View className='flex-col px-4 py-6 gap-1'>
            <Text className='text-surface text-sm'>Today's Weather</Text>
            <Text className='text-white font-bold text-4xl'>28°C</Text>
            <Text className='text-white text-sm'>Accra</Text> 
          </View>

          <View className=' flex-col p-4 items-center'>
            <Text style={{ fontSize: 64 }}>☀️</Text>
            <Text className="text-white text-sm mt-2">Sunny</Text>
          </View>
        </View>

        <View className='mb-8'>
          <Text className='font-bold text-xl text-text-primary mb-8'>Season Overview</Text>

          <View className='flex-row gap-4 mb-4'>
            <View className = 'gap-2 bg-surface p-4 rounded-xl flex-1'>
              <Ionicons name='calendar-outline' size={24}></Ionicons>
              <Text className='text-xs text-text-muted'>Season Start</Text>
              <Text className='font-bold text-text-primary'>{profile?.experience?.seasonStart || 'Not Set'} </Text>
            </View>
            <View className = 'gap-2 bg-surface p-4 rounded-xl flex-1'>
              <Ionicons name='leaf-outline' size={24}></Ionicons>
              <Text className='text-xs text-text-muted'>Active Crops</Text>
              <Text className='font-bold text-text-primary'>{profile?.experience?.seasonStart || 'Not Set'} </Text>
            </View>
          </View>
          <View className='flex-row gap-4'>
            <View className = 'gap-2 bg-surface p-4 rounded-xl flex-1'>
              <Ionicons name='cash-outline' size={24} color="#F59E0B"></Ionicons>
              <Text className='text-xs text-text-muted'>Total Expenses</Text>
              <Text className='font-bold text-text-primary'>{profile?.experience?.seasonStart || 'Not Set'} </Text>
            </View>
            <View className = 'gap-2 bg-surface p-4 rounded-xl flex-1'>
              <Ionicons name='trending-up-outline' size={24} color="#4ADE80"></Ionicons>
              <Text className='text-xs text-text-muted'>Total Yiels</Text>
              <Text className='font-bold text-text-primary'>{profile?.experience?.seasonStart || 'Not Set'} </Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-text-primary font-bold text-lg mb-4">
            Quick Actions
          </Text>

          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity
              className="flex-1 min-w-[45%] bg-primary rounded-xl p-4 items-center"
              onPress={() => router.push("/logs")}
            >
              <Ionicons name="add-circle-outline" size={32} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm mt-2">
                Log Activity
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 min-w-[45%] bg-surface border border-border rounded-xl p-4 items-center"
              onPress={() => router.push("/logs")}
            >
              <Ionicons name="wallet-outline" size={32} color="#1B4332" />
              <Text className="text-text-primary font-semibold text-sm mt-2">
                Add Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 min-w-[45%] bg-surface border border-border rounded-xl p-4 items-center"
              onPress={() => router.push("/logs")}
            >
              <Ionicons name="barbell-outline" size={32} color="#1B4332" />
              <Text className="text-text-primary font-semibold text-sm mt-2">
                Record Harvest
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 min-w-[45%] bg-accent rounded-xl p-4 items-center"
              onPress={() => router.push("/chat")}
            >
              <Ionicons name="chatbubbles-outline" size={32} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm mt-2">
                Ask Shamba AI
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary font-bold text-lg">
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => router.push("/logs")}>
              <Text className="text-accent text-sm font-semibold">See All</Text>
            </TouchableOpacity>
          </View>

          {/* Empty State */}
          <View className="bg-surface border border-border rounded-xl p-6 items-center">
            <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
            <Text className="text-text-muted text-sm mt-3 text-center">
              No activities yet
            </Text>
            <Text className="text-text-muted text-xs mt-1 text-center">
              Start logging your farm activities to see them here
            </Text>
            <TouchableOpacity
              className="mt-4 bg-primary px-6 py-2 rounded-full"
              onPress={() => router.push("/logs")}
            >
              <Text className="text-white font-semibold text-sm">
                Log Your First Activity
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-accent-light border border-accent rounded-xl p-4 mb-24">
          <View className="flex-row items-start">
            <Ionicons name="bulb-outline" size={24} color="#F59E0B" />
            <View className="flex-1 ml-3">
              <Text className="text-text-primary font-bold text-sm">
                Farming Tip of the Day
              </Text>
              <Text className="text-text-secondary text-sm mt-1">
                Regular monitoring of your crops helps identify pest issues early. 
                Check your {profile?.farmProfile?.primaryCrops?.[0] || 'crops'} at least twice a week!
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}