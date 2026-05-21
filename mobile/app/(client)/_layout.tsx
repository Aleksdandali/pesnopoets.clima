import { Tabs, tabScreenOptions } from "@/components/Tabs";
import { Home, MessageCircle, User } from "lucide-react-native";

export default function ClientLayout() {
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Моите климатици",
          tabBarLabel: "Начало",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Чат с техник",
          tabBarLabel: "Чат",
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профил",
          tabBarLabel: "Профил",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
