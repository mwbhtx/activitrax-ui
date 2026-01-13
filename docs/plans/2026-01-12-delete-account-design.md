# Delete Account Feature Design

## Overview

Allow users to permanently delete their account from the settings page. The deletion prioritizes removing the Auth0 account (preventing future logins) and queues database cleanup asynchronously via AWS SQS + Lambda.

## UI Design

### Settings Page Addition

Add a "Danger Zone" section at the bottom of the settings page (`src/routes/settings.js`):

- Red-outlined card containing:
  - Heading: "Delete Account"
  - Warning text: "Permanently delete your account and all associated data. This action cannot be undone."
  - Red "Delete Account" button

### Confirmation Dialog

When the delete button is clicked, show a dialog with:

- Title: "Delete Account"
- Warning text listing what will be deleted:
  - Profile and preferences
  - Activity history
  - Tracklists
  - Liked tracks
  - Strava and Spotify connections
- Text input with placeholder: "Type DELETE to confirm"
- Cancel button (outlined)
- Delete button (red, disabled until user types "DELETE" exactly)

## Frontend Implementation

### New Service Function (`src/services/auth0.js`)

```javascript
export const deleteAccount = async (api_token) => {
    const reqConfig = {
        method: "DELETE",
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/user/account",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        }
    }
    const response = await axios(reqConfig);
    return response.data
}
```

### Settings Page Flow

1. User clicks "Delete Account" button
2. Confirmation dialog opens
3. User types "DELETE" to enable the confirm button
4. On confirm:
   - Call `deleteAccount(api_token)`
   - On success: call Auth0's `logout()` to clear session and redirect
   - On error: show error message, user can retry

## Backend Implementation

### New Endpoint (`src/user/user.router.js`)

`DELETE /user/account`

```javascript
userRouter.delete('/account', validateAccessToken, async (req, res) => {
    try {
        const uid = req.auth.payload.sub;

        // 1. Deauthorize Strava (non-blocking)
        const userProfile = await mongoUserDb.getUser("auth0", uid);
        if (userProfile?.strava_access_token) {
            try {
                await stravaApi.deauthorizeUser(userProfile.strava_access_token);
            } catch (deauthError) {
                console.log('Strava deauthorization failed:', deauthError.message);
            }
        }

        // 2. Delete Auth0 account (priority - prevents future logins)
        await auth0Service.deleteUser(uid);

        // 3. Queue MongoDB cleanup
        await sqsService.sendMessage({
            type: 'DELETE_USER_DATA',
            user_id: uid
        });

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete account' });
    }
});
```

### Auth0 Service Addition (`src/auth0/auth0.service.js`)

Add a `deleteUser` function that uses the Auth0 Management API:

```javascript
const deleteUser = async (user_id) => {
    // Use Auth0 Management API to delete user
    // Requires Management API token with delete:users scope
    const managementToken = await getManagementToken();

    await axios.delete(`https://${AUTH0_DOMAIN}/api/v2/users/${user_id}`, {
        headers: {
            Authorization: `Bearer ${managementToken}`
        }
    });
}
```

Note: You'll need to configure Auth0 Management API credentials and ensure the application has `delete:users` permission.

## AWS Infrastructure

### SQS Queue

Create an SQS queue for user deletion tasks:

- Queue name: `activitrax-user-deletion`
- Configure dead-letter queue for failed messages
- Retention period: 14 days (for DLQ)

### Lambda Function

Create a Lambda function triggered by the SQS queue:

```javascript
// Handler: deleteUserData
exports.handler = async (event) => {
    for (const record of event.Records) {
        const message = JSON.parse(record.body);

        if (message.type === 'DELETE_USER_DATA') {
            const user_id = message.user_id;

            // Delete from MongoDB collections
            await usersCollection.deleteOne({ auth0_uid: user_id });
            await activitiesCollection.deleteMany({ user_id: user_id });
            await tracklistsCollection.deleteMany({ user_id: user_id });
            await likedTracksCollection.deleteMany({ user_id: user_id });
        }
    }
};
```

### SQS Service (`src/sqs/sqs.service.js`)

```javascript
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

const sendMessage = async (messageBody) => {
    const command = new SendMessageCommand({
        QueueUrl: process.env.SQS_USER_DELETION_QUEUE_URL,
        MessageBody: JSON.stringify(messageBody)
    });

    await sqsClient.send(command);
};

module.exports = { sendMessage };
```

## Environment Variables

### API

Add to API environment:

```
AWS_REGION=<your-region>
SQS_USER_DELETION_QUEUE_URL=<queue-url>
AUTH0_MANAGEMENT_CLIENT_ID=<client-id>
AUTH0_MANAGEMENT_CLIENT_SECRET=<client-secret>
```

### Lambda

Lambda needs access to MongoDB connection string.

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Strava deauthorization fails | Log warning, continue with deletion |
| Auth0 deletion fails | Return 500, user can retry |
| SQS publish fails | Return 500, Auth0 account already deleted - log for manual cleanup |
| Lambda MongoDB deletion fails | Message goes to dead-letter queue for review |

## Implementation Checklist

### Frontend (activitrax-ui)

- [ ] Add `deleteAccount` function to `src/services/auth0.js`
- [ ] Create confirmation dialog component with "DELETE" text input
- [ ] Add "Danger Zone" section to `src/routes/settings.js`
- [ ] Wire up delete flow with logout on success

### Backend (activitrax-api)

- [ ] Add `deleteUser` function to `src/auth0/auth0.service.js`
- [ ] Configure Auth0 Management API credentials
- [ ] Create `src/sqs/sqs.service.js` for SQS integration
- [ ] Add `DELETE /user/account` endpoint to `src/user/user.router.js`

### AWS Infrastructure

- [ ] Create SQS queue with dead-letter queue
- [ ] Create Lambda function for MongoDB cleanup
- [ ] Configure Lambda trigger from SQS
- [ ] Set up Lambda MongoDB connectivity (VPC/security groups if needed)
- [ ] Deploy and test end-to-end
