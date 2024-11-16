import { getUserRole, getSuperUser } from '../firebaseconect.js';

window.addEventListener('DOMContentLoaded', async () => {
    // Check if the user is authenticated
    const userId = localStorage.getItem('userId');
    if (!userId) {
        // Redirect to the login page if the user is not authenticated
        window.location.href = 'login.html';
        return;
    }

    // Check if the user is a super user
    const superUserData = await getSuperUser(userId);
    if (superUserData) {
        // Render the admin dashboard content
        // ...
    } else {
        // Redirect to the employee dashboard or show an error message
        window.location.href = 'employee-dashboard.html';
    }
});