import { Tabs, tabScreenOptions } from "@/components/Tabs";
import { ClipboardList, Plus, User } from "lucide-react-native";

export default function InstallerLayout() {
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "За днес",
          tabBarLabel: "За днес",
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "Нов монтаж",
          tabBarLabel: "Нов",
          tabBarIcon: ({ color, size }) => <Plus color={color} size={size} />,
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
