import { Chip } from "@mui/material";
import BugReportIcon from '@mui/icons-material/BugReport';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ForumIcon from '@mui/icons-material/Forum';

const FeedbackCategoryChip = ({ category }) => {
    const getCategoryConfig = () => {
        switch (category) {
            case 'Bug Report':
                return { icon: <BugReportIcon />, color: 'error' };
            case 'Feature Request':
                return { icon: <LightbulbIcon />, color: 'warning' };
            case 'Question':
                return { icon: <HelpOutlineIcon />, color: 'info' };
            case 'Discussion':
                return { icon: <ForumIcon />, color: 'primary' };
            default:
                return { icon: <ForumIcon />, color: 'default' };
        }
    };

    const config = getCategoryConfig();

    return (
        <Chip
            icon={config.icon}
            label={category}
            color={config.color}
            size="small"
            sx={{ fontWeight: 500 }}
        />
    );
};

export default FeedbackCategoryChip;
