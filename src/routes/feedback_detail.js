import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    TextField,
    Button,
    Breadcrumbs,
    Link,
    Divider,
    IconButton,
    Chip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Badge
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getUserConfig } from "../services/auth0";
import { getTopicDetail, createReply, updateTopicStatus, deleteTopic, deleteReply, markTopicAsRead } from "../services/feedback";
import AppHeader from "../components/AppHeader";
import FeedbackCategoryChip from "../components/FeedbackCategoryChip";
import FeedbackStatusChip from "../components/FeedbackStatusChip";

export default function FeedbackDetailPage() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const [topic, setTopic] = useState(null);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Admin menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuType, setMenuType] = useState(null); // 'topic' or 'reply'
    const [selectedReply, setSelectedReply] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) return;

            try {
                const api_token = await getAccessTokenSilently();

                // Get user config to check admin status
                const config = await getUserConfig(api_token);
                setIsAdmin(config.is_admin);

                // Fetch topic and replies
                const data = await getTopicDetail(api_token, topicId);
                setTopic(data.topic);
                setReplies(data.replies);

                // Mark topic as read
                await markTopicAsRead(api_token, topicId);
            } catch (error) {
                console.error('Failed to fetch topic:', error);
                if (error.response?.status === 403) {
                    alert('Access denied. You do not have permission to view this topic.');
                    navigate('/feedback');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, getAccessTokenSilently, topicId, navigate]);

    const handleSubmitReply = async () => {
        if (!replyContent.trim()) return;

        setSubmitting(true);
        try {
            const api_token = await getAccessTokenSilently();
            const newReply = await createReply(api_token, topicId, replyContent);

            // Add reply to local state
            setReplies([...replies, newReply]);
            setReplyContent('');

            // Update topic metadata
            setTopic({
                ...topic,
                reply_count: topic.reply_count + 1,
                has_admin_reply: isAdmin ? true : topic.has_admin_reply,
                last_reply_is_admin: isAdmin
            });
        } catch (error) {
            console.error('Failed to submit reply:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenMenu = (event, type, reply = null) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setMenuType(type);
        setSelectedReply(reply);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setMenuType(null);
        setSelectedReply(null);
    };

    const handleToggleStatus = async () => {
        try {
            const api_token = await getAccessTokenSilently();
            const newStatus = topic.status === 'Open' ? 'Closed' : 'Open';
            await updateTopicStatus(api_token, topicId, newStatus);

            setTopic({ ...topic, status: newStatus });
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            handleCloseMenu();
        }
    };

    const handleDeleteTopic = async () => {
        if (!window.confirm('Are you sure you want to delete this topic and all its replies?')) {
            handleCloseMenu();
            return;
        }

        try {
            const api_token = await getAccessTokenSilently();
            await deleteTopic(api_token, topicId);

            navigate('/feedback');
        } catch (error) {
            console.error('Failed to delete topic:', error);
        } finally {
            handleCloseMenu();
        }
    };

    const handleDeleteReply = async () => {
        if (!selectedReply) return;

        if (!window.confirm('Are you sure you want to delete this reply?')) {
            handleCloseMenu();
            return;
        }

        try {
            const api_token = await getAccessTokenSilently();
            await deleteReply(api_token, selectedReply._id);

            // Remove from local state
            setReplies(replies.filter(r => r._id !== selectedReply._id));
            setTopic({ ...topic, reply_count: topic.reply_count - 1 });
        } catch (error) {
            console.error('Failed to delete reply:', error);
        } finally {
            handleCloseMenu();
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <>
                <AppHeader />
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </>
        );
    }

    if (!topic) {
        return (
            <>
                <AppHeader />
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Typography>Topic not found</Typography>
                </Container>
            </>
        );
    }

    return (
        <>
            <AppHeader />
            <Container maxWidth="md" sx={{ py: 4 }}>
                {/* Breadcrumbs */}
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate('/feedback')} size="small">
                        <ArrowBackIcon />
                    </IconButton>
                    <Breadcrumbs>
                        <Link
                            underline="hover"
                            color="inherit"
                            onClick={() => navigate('/feedback')}
                            sx={{ cursor: 'pointer' }}
                        >
                            Feedback
                        </Link>
                        <Typography color="text.primary">{topic.title}</Typography>
                    </Breadcrumbs>
                </Box>

                {/* Topic Card */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                <FeedbackCategoryChip category={topic.category} />
                                <FeedbackStatusChip status={topic.status} />
                                {isAdmin && !topic.last_reply_is_admin && topic.status === 'Open' && (
                                    <Chip label="Awaiting Response" color="warning" size="small" />
                                )}
                            </Box>
                            {isAdmin && (
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleOpenMenu(e, 'topic')}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            )}
                        </Box>

                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            {topic.title}
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                            {topic.description}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            Created {formatDate(topic.created_at)}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Replies Section */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Conversation ({replies.length})
                </Typography>

                {replies.map((reply, index) => (
                    <Box key={reply._id} sx={{ mb: 2 }}>
                        <Card
                            sx={{
                                ...(reply.is_admin && {
                                    backgroundColor: 'rgba(144, 202, 249, 0.08)',
                                    borderLeft: '4px solid',
                                    borderColor: 'primary.light'
                                })
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        {reply.is_admin ? (
                                            <Chip label="Admin" color="primary" size="small" />
                                        ) : (
                                            <Chip label="You" size="small" />
                                        )}
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDate(reply.created_at)}
                                        </Typography>
                                    </Box>
                                    {isAdmin && (
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleOpenMenu(e, 'reply', reply)}
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>

                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {reply.content}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}

                {/* Reply Input */}
                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            {isAdmin ? 'Reply to user' : 'Send message to support team'}
                        </Typography>
                        <TextField
                            multiline
                            rows={4}
                            fullWidth
                            placeholder="Type your message..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmitReply}
                                disabled={!replyContent.trim() || submitting}
                            >
                                {submitting ? 'Sending...' : 'Send'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Admin Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                >
                    {menuType === 'topic' && (
                        <>
                            <MenuItem onClick={handleToggleStatus}>
                                <ListItemIcon>
                                    {topic.status === 'Open' ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                                </ListItemIcon>
                                <ListItemText>
                                    Mark as {topic.status === 'Open' ? 'Closed' : 'Open'}
                                </ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleDeleteTopic}>
                                <ListItemIcon>
                                    <DeleteIcon color="error" />
                                </ListItemIcon>
                                <ListItemText>Delete Topic</ListItemText>
                            </MenuItem>
                        </>
                    )}
                    {menuType === 'reply' && (
                        <MenuItem onClick={handleDeleteReply}>
                            <ListItemIcon>
                                <DeleteIcon color="error" />
                            </ListItemIcon>
                            <ListItemText>Delete Reply</ListItemText>
                        </MenuItem>
                    )}
                </Menu>
            </Container>
        </>
    );
}
