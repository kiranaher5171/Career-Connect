import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";

/**
 * Shared menu items configuration
 * Update menu items here and they will be reflected in both MainLayout sidebar and MobileDrawer
 * 
 * Usage:
 * import { getMenuItems } from './menuItems';
 * const menuItems = getMenuItems();
 */
export const getMenuItems = () => [
    { href: '/dashboard', title: 'Dashboard', icon: DashboardOutlinedIcon },
    { href: '/home', title: 'Home', icon: FileUploadOutlinedIcon },
    { href: '/projects', title: 'Projects', icon: BuildOutlinedIcon },
    { href: '/documents', title: 'Documents', icon: DescriptionOutlinedIcon },
    { href: '/progress-reports', title: 'Progress Reports', icon: AssessmentOutlinedIcon },
    { href: '/budget-finance', title: 'Budget & Finance', icon: AccountBalanceOutlinedIcon },
    { href: '/team-management', title: 'Team Management', icon: GroupsOutlinedIcon },
    { href: '/timeline', title: 'Timeline', icon: ScheduleOutlinedIcon },
    { href: '/contact-us', title: 'Contact Us', icon: ContactMailOutlinedIcon },
    { href: '/components', title: 'Components', icon: PublishedWithChangesOutlinedIcon },
];
