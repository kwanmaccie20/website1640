import {
  IconArchive,
  IconBulb,
  IconCalendarTime,
  IconCompass,
  IconConfetti,
  IconDashboard,
  IconHierarchy2,
  IconInfoCircle,
  IconUsers,
  IconVocabulary,
} from "@tabler/icons-react";

/**
 * @type {{staff: [{label:string, href: string, icon: any}], qaManager: [{label:string, href: string, icon: any}]}}
 */
export const headerLinks = {
  staff: [
    {
      label: "Explore",
      href: "/",
      icon: IconCompass,
    },
    {
      label: "Archived",
      href: "Archived",
      icon: IconArchive,
    },
    {
      label: "About",
      href: "/about",
      icon: IconInfoCircle,
    },
    {
      label: "Help",
      href: "/help",
      icon: IconVocabulary,
    },
  ],
  qaManager: [
    {
      label: "Dashboard",
      href: "/manager/dashboard",
      icon: IconDashboard,
    },
    {
      label: "Explore",
      href: "/",
      icon: IconCompass,
    },
    {
      label: "Academic Years",
      href: "/manager/academic-years",
      icon: IconCalendarTime,
    },
    {
      label: "Campaigns",
      href: "/manager/campaigns",
      icon: IconConfetti,
    },
    {
      label: "Departments",
      href: "/manager/departments",
      icon: IconHierarchy2,
    },
    {
      label: "Staff",
      href: "/manager/staff",
      icon: IconUsers,
    },
    {
      label: "About",
      href: "/about",
      icon: IconInfoCircle,
    },
    {
      label: "Help",
      href: "/help",
      icon: IconVocabulary,
    },
  ],
};
