import {
  Heart,
  Home,
  Building2,
  Shield,
  Landmark,
  FileText,
  Umbrella,
  Car,
  Briefcase,
  PiggyBank,
  HandCoins,
  Users,
} from "lucide-react";

export const serviceIcons = {
  Heart,
  Home,
  Building2,
  Shield,
  Landmark,
  FileText,
  Umbrella,
  Car,
  Briefcase,
  PiggyBank,
  HandCoins,
  Users,
};

export const serviceIconNames = Object.keys(serviceIcons);

export function getServiceIcon(name) {
  return serviceIcons[name] || Shield;
}
