import { ManageAccount, getSuperUser } from '../firebaseconect.js';

const manageAccount = new ManageAccount();

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await manageAccount.authenticate(email, password);
        const userId = userCredential.user.uid;
        const superUserData = await getSuperUser(userId);

        if (superUserData) {
            // Redirect the super user to the admin dashboard
            window.location.href = 'adminPages/dashboard.html';
        } else {
            // Redirect regular users to the user dashboard or show an error message
            window.location.href = 'userPages/index.html';
        }
    } catch (error) {
        // Display an error message to the user
        document.getElementById('errorMessage').textContent = 'Error logging in: ' + error.message;
    }
});