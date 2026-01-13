import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Button,
    Tabs,
    Tab,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    IconButton,
    Menu,
    ListItemIcon,
    ListItemText,
    Badge
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getUserConfig } from "../services/auth0";
import { getTopics, deleteTopic, updateTopicStatus } from "../services/feedback";
import PageLayout from "../components/PageLayout";
import FeedbackCategoryChip from "../components/FeedbackCategoryChip";
import FeedbackStatusChip from "../components/FeedbackStatusChip";
import FeedbackTopicDialog from "../components/FeedbackTopicDialog";
import { createTopic } from "../services/feedback";

const CATEGORIES = ['All', 'Bug Report', 'Feature Request', 'Question', 'Discussion'];
const STATUSES = ['All', 'Open', 'Closed'];

export default function FeedbackPage() {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Filters and pagination
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sort, setSort] = useState('needs_response');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Admin menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) return;

            try {
                const api_token = await getAccessTokenSilently();

                // Get user config to check admin status
                const config = await getUserConfig(api_token);
                setIsAdmin(config.is_admin);

                // Fetch topics
                const filters = {};
                if (categoryFilter !== 'All') filters.category = categoryFilter;
                if (statusFilter !== 'All') filters.status = statusFilter;

                const pagination = { page, limit: 20 };
                if (config.is_admin) {
                    pagination.sort = sort;
                }

                const result = await getTopics(api_token, filters, pagination);
                setTopics(result.topics);
                setTotalPages(result.pages);
            } catch (error) {
                console.error('Failed to fetch feedback:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, getAccessTokenSilently, categoryFilter, statusFilter, sort, page]);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSubmitTopic = async (topicData) => {
        try {
            const api_token = await getAccessTokenSilently();
            await createTopic(api_token, topicData);

            // Refresh topics
            setPage(1);
            const result = await getTopics(api_token, {}, { page: 1, limit: 20 });
            setTopics(result.topics);
            setTotalPages(result.pages);
        } catch (error) {
            console.error('Failed to create topic:', error);
        }
    };

    const handleTopicClick = (topicId) => {
        navigate(`/feedback/${topicId}`);
    };

    const handleOpenMenu = (event, topic) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedTopic(topic);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedTopic(null);
    };

    const handleToggleStatus = async () => {
        if (!selectedTopic) return;

        try {
            const api_token = await getAccessTokenSilently();
            const newStatus = selectedTopic.status === 'Open' ? 'Closed' : 'Open';
            await updateTopicStatus(api_token, selectedTopic._id, newStatus);

            // Update local state
            setTopics(topics.map(t =>
                t._id === selectedTopic._id ? { ...t, status: newStatus } : t
            ));
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            handleCloseMenu();
        }
    };

    const handleDeleteTopic = async () => {
        if (!selectedTopic) return;

        if (!window.confirm('Are you sure you want to delete this topic and all its replies?')) {
            handleCloseMenu();
            return;
        }

        try {
            const api_token = await getAccessTokenSilently();
            await deleteTopic(api_token, selectedTopic._id);

            // Remove from local state
            setTopics(topics.filter(t => t._id !== selectedTopic._id));
        } catch (error) {
            console.error('Failed to delete topic:', error);
        } finally {
            handleCloseMenu();
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <PageLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {isAdmin ? 'All User Feedback' : 'My Feedback & Support'}
                    </Typography>
                    {!isAdmin && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleOpenDialog}
                        >
                            New Topic
                        </Button>
                    )}
                </Box>

                {/* Filters (Admin only) */}
                {isAdmin && (
                    <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {STATUSES.map((status) => (
                                <Chip
                                    key={status}
                                    label={status}
                                    onClick={() => setStatusFilter(status)}
                                    color={statusFilter === status ? 'primary' : 'default'}
                                    variant={statusFilter === status ? 'filled' : 'outlined'}
                                />
                            ))}
                        </Box>

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                label="Sort By"
                            >
                                <MenuItem value="needs_response">Needs Response</MenuItem>
                                <MenuItem value="recent_activity">Recent Activity</MenuItem>
                                <MenuItem value="newest">Newest</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                )}

                {/* Category Tabs */}
                <Tabs
                    value={categoryFilter}
                    onChange={(e, newValue) => setCategoryFilter(newValue)}
                    sx={{ mb: 2 }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {CATEGORIES.map((cat) => (
                        <Tab key={cat} label={cat} value={cat} />
                    ))}
                </Tabs>

                {/* Topics Table */}
                {topics.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                            {isAdmin
                                ? 'No feedback topics yet.'
                                : 'No feedback submitted yet. Have a question or suggestion?'}
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Topic</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="center">Replies</TableCell>
                                        <TableCell>Created</TableCell>
                                        {isAdmin && <TableCell align="right">Actions</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topics.map((topic) => (
                                        <TableRow
                                            key={topic._id}
                                            hover
                                            onClick={() => handleTopicClick(topic._id)}
                                            sx={{
                                                cursor: 'pointer',
                                                ...(isAdmin && !topic.last_reply_is_admin && topic.status === 'Open' && {
                                                    borderLeft: '4px solid',
                                                    borderColor: 'warning.main',
                                                    backgroundColor: 'rgba(255, 152, 0, 0.05)'
                                                })
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {isAdmin && !topic.last_reply_is_admin && topic.status === 'Open' && (
                                                        <Badge badgeContent="!" color="warning" sx={{ mr: 1 }} />
                                                    )}
                                                    {!isAdmin && topic.has_admin_reply && (
                                                        <Chip label="Admin Replied" size="small" color="info" sx={{ mr: 1 }} />
                                                    )}
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {topic.title}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <FeedbackCategoryChip category={topic.category} />
                                            </TableCell>
                                            <TableCell>
                                                <FeedbackStatusChip status={topic.status} />
                                            </TableCell>
                                            <TableCell align="center">{topic.reply_count}</TableCell>
                                            <TableCell>{formatDate(topic.created_at)}</TableCell>
                                            {isAdmin && (
                                                <TableCell align="right">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleOpenMenu(e, topic)}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={(e, value) => setPage(value)}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                )}


                {/* Admin Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                >
                    <MenuItem onClick={handleToggleStatus}>
                        <ListItemIcon>
                            {selectedTopic?.status === 'Open' ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                        </ListItemIcon>
                        <ListItemText>
                            Mark as {selectedTopic?.status === 'Open' ? 'Closed' : 'Open'}
                        </ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleDeleteTopic}>
                        <ListItemIcon>
                            <DeleteIcon color="error" />
                        </ListItemIcon>
                        <ListItemText>Delete Topic</ListItemText>
                    </MenuItem>
                </Menu>

                {/* Create Topic Dialog */}
                <FeedbackTopicDialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    onSubmit={handleSubmitTopic}
                />
            </Container>
        </PageLayout>
    );
}
