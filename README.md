# PlanIt 

## About This Project
PlanIt was created as a part of a personal learning effort to deepen my understanding of frontend development, user authentication, and cloud-based storage. 

## Elements
### Tasks
- Tasks can be added with the button add task, which is explained in the buttons section. The added task will be at the end of the "incomplete" section, unchecked. Each task has a checkbox, a label, a edit button, and an remove button. When checked, the task goes into the "completed" section and can be unchecked to go back into the "incomplete" section.
### Buttons
#### Add Task
- Once clicked, the button changes to an input text field where the user can type in their new task. Once the user has typed their task, they will press enter to add their task to the incomplete category. 
#### Edit
- When the edit button is clicked, the user can click on the label to change the task label. The user then will press enter to save the changed task into local storage and make the task uneditable. 
#### Remove
- When the remove button is clicked, the task will be removed from storage and interface.
#### Sign In/Sign Up
- When the button is clicked, a login popup will appear, allowing the user to sign in or sign up. 
- The user will input their email and password. If they want to create a new account, they will input a new email and the password that they want to use and press "sign up". If this is a returning user, they will input their email and correct password and press sign in. 
#### Log out
- When the button is clicked, the user will be logged out of their account. 

## Storage
### Local
- Tasks are stored locally with localStorage. When the page loads, tasks will be put into the correct spot and will be checked or unchecked based on how they were left. This applies when the user is logged in or out of their account. 
### Supabase
- When the user is logged into their account, their tasks are stored in a PostgreSQL database managed by Supabase. Rows are created, updated, and deleted using the Supabase API.

## Authentication
- Authentication is handled via Supabase, allowing users to securely sign up and log in with their email and password. Users stay signed in for up to 7 days until they are logged out automatically. 
- Tasks are secured using a user id, which is linked to Supabase's authentication. This ensures that the user's tasks are isolated and only accessible after the user logs into their account. 

## Tools Used
- Supabase for user authentication and database management. 

## Future Considerations
This project was built as a way to practice and strengthen my development skills. If developed further, there are a few features I would like to add.
### Tasks
#### Task Deadlines and Reminders
- Users would be able to create deadlines and receive reminders for their tasks through their phone. 
- Reminders could be sent via SMS using an API like Twilio.
#### Categories for tasks
- Users would be able to categorize tasks, assigning colors to each category.
- This would include UI elements for category creation, assignment, and filtering. Task storage would include a new category for task category.
#### Task Sorting
- Users would be able to sort by date, alphabetical order, or custom.
- This would involve adding a function and UI elements for the user to change the order of their tasks. 
### Authentication
#### Reset Password
- If the user wants to reset their password to their account, they can use this button to reset it.
- Supabase provides a method for users to reset their password, so this would involve adding some UI elements. 
#### OAuth Support
- Authentication would support using Google, GitHub, or other providers to make account access easier.
- Supabase has built-in OAuth integration, so this would involve minimal modification.
#### Sign Up page
- Create a seperate button for sign in and sign up, where users have to confirm their password to sign up. This would make the sign up experience easier to understand.
- This would involve adding UI elements and a password checker to compare both passwords. 
### Animations
Some animations would make the website more enjoyable to use. These animations could include:
- A rewarding animation when a task is completed.
- A slide-in animation when a new task is created.
- A slide-out animation when a task is deleted.
### Error Handling
- Currently, users can submit empty tasks or incomplete input.
- The solution to this would include empty task prevention and visual feedback.
