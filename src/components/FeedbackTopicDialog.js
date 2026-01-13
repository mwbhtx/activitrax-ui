import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Box
} from "@mui/material";

const CATEGORIES = ['Bug Report', 'Feature Request', 'Question', 'Discussion'];

const FeedbackTopicDialog = ({ open, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [errors, setErrors] = useState({});

    const handleClose = () => {
        setTitle('');
        setDescription('');
        setCategory('');
        setErrors({});
        onClose();
    };

    const validate = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        } else if (title.length > 200) {
            newErrors.title = 'Title must be 200 characters or less';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        } else if (description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        if (!category) {
            newErrors.category = 'Category is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit({ title, description, category });
            handleClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error={!!errors.title}
                        helperText={errors.title || `${title.length}/200`}
                        fullWidth
                        required
                    />

                    <FormControl fullWidth error={!!errors.category} required>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            label="Category"
                        >
                            {CATEGORIES.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.category && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                                {errors.category}
                            </Typography>
                        )}
                    </FormControl>

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description || 'Describe your feedback in detail'}
                        multiline
                        rows={6}
                        fullWidth
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FeedbackTopicDialog;
