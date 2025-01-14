![wesf](https://github.com/user-attachments/assets/de233ac7-5189-433a-972c-33f5f2f6ac53)
# Chore Wars

### make cleaning fun
*Chore Wars* is a web application make chores fun and easier to manage. To split chore with ease on your household and to track the chores of your family members. This also features a leaderboard to create friendly competitions and to make chores fun and enjoyable!

### Demo Video
https://youtu.be/MICIUd7YuJE

### 🔧 Built Using

*Chore Wars* is built using these technologies:

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="30" alt="javascript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="30" alt="html5 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="30" alt="css3 logo"  />
  <img width="12" />
  <img src="https://www.svgrepo.com/show/374118/tailwind.svg" height="30" alt="tailwind logo"  />
  <img width="12" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/590px-Node.js_logo.svg.png" height="30" alt="nodejs logo"  />
  <img width="12" />
  <img src="https://cdn.prod.website-files.com/6320125ace536b6ad148eca3/66502d746f57d299fe0e0c31_Image%201-Express.js.webp" height="30" alt="express logo"  />
  <img width="12" />
  <img src="https://1000logos.net/wp-content/uploads/2020/08/MongoDB-Emblem.jpg" height="30" alt="mongodb logo"  />
  <img width="12" />
  <img src="https://yt3.googleusercontent.com/AC0Ia-7Akfvhnkwy9s4kx2Qt3XFXFYe95SfmEba4pK46t22K0tAnS40R8AAa7_YPkSeu6t5TxA=s900-c-k-c0x00ffffff-no-rj" height="30" alt="cloudinary logo"  />
</div>

## 🤍 Icons
All icons used on Chore Wars are from Flaticon (UIcons) and Heroicons

## ⚙️ Installation

1. Clone the repository

```
git clone https://github.com/Ayessaaa/ChoreWars
```

2. Go to the directory

```
cd ChoreWars
```

3. Install dependecies

```
npm install
```

5. Create your own cluster on MongoDB Atlas

```
ChoreWars Project -> ChoreWars
```

6. Create a database on that cluster

```
ChoreWars Project -> ChoreWarsCluster -> ChoreWarsDB
```

7. Create your .env file and paste you DBURI, secret, and cloudinary credentials

```
DB_URI=
secret=
CLOUD_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
```

8. Start the Nodemon

```
nodemon app
```

## ❕ Features
### Responsive Design
Chore Wars is built to be compatible on both mobile and desktop devices.

### 👤 Sign Up and Log In
![qwd](https://github.com/user-attachments/assets/80d55434-222f-4dac-be77-f4cd91e65db2)

This enables users to create and open their own accounts.

*Session* - This makes the user stay logged in for a while.

*Password hashing* - This makes the password get hashed when going to the database and when comparing it. Makes the authentication process more secure

When signing up, the application assumes that the user is an admin and makes the user the head of a household

## Admin Account

### 👪 Create Household (Admin)
![dwaes](https://github.com/user-attachments/assets/49c3ace0-2fe1-480c-bc24-e3d47261db95)

This enables admin to create their own household that they will manage and create users for the household

### 🏠 Home (Admin)
![fger](https://github.com/user-attachments/assets/de8d5bde-322b-4b64-b213-5a5e5aa5f446)

*Navbar* - This shows menu and pages to explore from.

*Family Members* - This shows the lists of family members that are in this household. Each member has a link that they can use to edit their profile and get verified. You can add more members by clicking the add member button. 

*Chores* - This shows the lists of chores that the household has. You can add more chores by clicking the add chores button. 

### Add Chore
![qwasd](https://github.com/user-attachments/assets/23e9a97f-a008-426a-b13c-6246c97a0a11)

This allows the admin to add chores and the chore details

### 🧹 Chores (Admin)
![wedrf](https://github.com/user-attachments/assets/c0f2676e-1bf9-4943-8530-f5db66f133ba)

This lists all the chores of the household and its details. You can add more chores by clicking the add chores button. 

- You can edit the chores details
- You can delete the chore

### Edit Chore
![qdwe](https://github.com/user-attachments/assets/8ddc3415-a211-4d51-a78c-d04e22d163ce)

This allows the admin to edit the chores details such as the chore name, frequency, points, and chore doers. 

### 🖼️ Chore Feed
![dqwae](https://github.com/user-attachments/assets/fa8ce86a-44bd-420d-9024-7fb2744f83c2)

The Chore feed shows the recent chores your family members did. Every chores to be marker as done needs an image or proof that they did their chore to avoid chore fraud 😍. And to also motivate other fam members while also tracking the chores and creating memories. 

### 🥇 Leaderboard
![dwaq](https://github.com/user-attachments/assets/e6ecdcec-dde9-4090-ae65-8b26fbf8d814)

The Leaderboard shows the ranking of yiur family members based on their chore points. Each point is earned by completing a chore and the point that is earned is according to the point of that chore that is given by the household admin

## 👪✍🏻 Manage Family Members (Admin)
![dwqa](https://github.com/user-attachments/assets/2df309e7-2d18-4fe3-bb7d-69d2b03d63c5)

*🔗 Join Link** - Share this link to the family member to set up their profile and to get their account verified*🗑️ Delete** - This deletes the selected user

#### Family Member Account

### 🔗 Join Link
![grte](https://github.com/user-attachments/assets/673e0845-7378-4f3c-b429-790881c9f5aa)

This allows the user to set up their profiles and to be verified. After setting up their profile, they can now sign in using those credentials. 

### 🏠 Home
![erfgd](https://github.com/user-attachments/assets/6f0ae43c-0980-4f97-87af-e68619d9ffd4)

*To-Do Chores* - This lists all the chores that you have to accomplish today and also the chores that you failed to do before. This shows both to-do and over due chores. 

*Leaderboard* - This shows the ranking of the family members based on points. 

*Chore Feed* - This shows the recent chore pictures that the family members did. 

### 🧺 Chores 
![fwed](https://github.com/user-attachments/assets/6ca143a1-9c48-479e-ac50-b11f2dd825eb)

This shows all the chores they need to accomplish. The chores db updates when the user logs in. Additionally, this also shows the overdue chores that the user failed to accomplish. 

### 🖼️ Chore Feed
![dqwae](https://github.com/user-attachments/assets/36f562ce-2bc5-494d-aa75-a3a2dcceacb4)

The Chore feed shows the recent chores your family members did. Every chores to be marker as done needs an image or proof that they did their chore to avoid chore fraud 😍. And to also motivate other fam members while also tracking the chores and creating memories. 

### 🥇 Leaderboard
![dwqa](https://github.com/user-attachments/assets/885047b3-d60b-4ae2-b05b-b98e52e20d12)

The Leaderboard shows the ranking of yiur family members based on their chore points. Each point is earned by completing a chore and the point that is earned is according to the point of that chore that is given by the household admin

### ✍🏻 Edit Profile
![aqwsd](https://github.com/user-attachments/assets/9e32c894-92ee-48fc-8b3a-ad4544fe31ae)

This allows the user to change their profile picture and full name. 


## 📚 Resources
I have used ChatGPT to help me from some code, debugging, and ideas for some parts of the project. Additionally, here are some resources that helped me create Chore Wars:

- [Gradient Divs](https://www.creative-tim.com/twcomponents/component/gradient-border)
- [Checkbox](https://flowbite.com/docs/forms/checkbox/)
- [Tooltips](https://flowbite.com/docs/components/tooltips/)
- [Log In, Sign Up](https://blog.logrocket.com/building-simple-login-form-node-js/)
- [Hashing Passwords](https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/)
- [Session Managment](https://dev.to/saint_vandora/how-to-implement-session-management-in-nodejs-applications-5emm)
- [Cloudinary Image Upload](https://dev.to/evansitworld/upload-images-with-nodejs-and-express-to-the-cloud-using-cloudinary-26e4)
- [Image Preview](https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded)

Icons that were used in this website are:
- Flaticon
- Heroicons

Images that are used on the snapshots of the website are from [pinterest](https://www.pinterest.com/nikcs00/chore-wars/)

## ⚙️ Future Updates 
- Better username/ sign up for family members to lessen bugs
- Better today/ overdue chores algorithm (For now, when the user logs in thats only when the algorithm runs)
- Rotation and individual chore type

## 📝 Contributing

This repo is open for contributions! Just fork the repository, create a new branch and open a pull request.

## ⚖️ License

This project is licensed under the MIT License.
