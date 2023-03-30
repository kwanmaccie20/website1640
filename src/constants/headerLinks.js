import {
  IconArchive,
  IconBulb,
  IconCalendarTime,
  IconCompass,
  IconConfetti,
  IconDashboard,
  IconHash,
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
      label: "Staff",
      href: "/manager/staff",
      icon: IconUsers,
    },
    {
      label: "Departments",
      href: "/manager/departments",
      icon: IconHierarchy2,
    },
    {
      label: "Campaigns",
      href: "/manager/campaigns",
      icon: IconConfetti,
    },
    {
      label: "Ideas",
      href: "/manager/ideas",
      icon: IconBulb,
    },
    {
      label: "Tags",
      href: "/manager/tags",
      icon: IconHash,
    },
    {
      label: "Academic Years",
      href: "/manager/academic-years",
      icon: IconCalendarTime,
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
