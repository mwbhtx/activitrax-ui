import { Chip } from "@mui/material";

const FeedbackStatusChip = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'Open':
                return 'success';
            case 'Closed':
                return 'default';
            default:
                return 'default';
        }
    };

    return (
        <Chip
            label={status}
            color={getStatusColor()}
            size="small"
            sx={{ fontWeight: 500 }}
        />
    );
};

export default FeedbackStatusChip;
