import { Tabs, tabScreenOptions } from "@/components/Tabs";
import { Inbox, CalendarDays, User } from "lucide-react-native";

export default function ManagerLayout() {
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Входящи",
          tabBarLabel: "Входящи",
          tabBarIcon: ({ color, size }) => <Inbox color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Поръчки",
          tabBarLabel: "Поръчки",
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />,
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
