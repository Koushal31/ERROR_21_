🚀 CrowdFund: Enhanced Crowdfunding Platform
CrowdFund is a full-stack crowdfunding web application built with Node.js/Express and vanilla JavaScript. It features secure authentication, persistent storage, dynamic campaign creation, real-time donations, social sharing, reward tiers, confetti celebrations, and a polished user dashboard—perfect for hackathons and ready to evolve into a startup.

🌟 Features
🔒 Secure Authentication

bcrypt-hashed passwords

HTTP-only session cookies

💾 Persistent Storage

JSON file persistence across restarts

Automatic periodic saving

🔍 Search & Filters

Keyword search (title/description)

Category filter (Technology, Healthcare, Education, etc.)

📸 Campaign Images

Custom image URL support

Fallback placeholder

⏳ Countdown Timer

Days remaining highlight

Urgency styling when ≤5 days

🎁 Reward Tiers

Dynamic tier creation (amount + description)

Sorted by amount

💸 Real-Time Donations

Input validation & inline error/success messages

Confetti celebration animation on success

🔗 Social Sharing

Twitter, Facebook, Copy Link buttons

📊 User Dashboard

Stats cards: campaigns created, total raised, projects backed, total donated

Grid of created campaigns with progress bars and status

📝 Campaign Updates

Creators can post updates for backers

📱 Responsive & Accessible

Mobile-first design

Focus outlines and high-contrast support

Reduced-motion preference handling

👥 Demo Accounts & Sample Data
On first run, the app auto-loads demo data:

Users:
– demo1 / demo1pass
– demo2 / demo2pass

Sample Campaigns:

Smart Water Purifier (Healthcare)

AI Education Platform (Education)

Solar Community Center (Environment)

🛠 Tech Stack
Backend: Node.js, Express.js

Frontend: HTML5, CSS3, JavaScript

Persistence: JSON files

Styling: Custom CSS animations

Auth: bcrypt, cookie-parser

📁 Project Structure
text
crowdfunding-platform/

├── backend/

│   ├── server.js

│   ├── users.json

│   ├── projects.json

│   └── package.json

└── frontend/
    ├── index.html
    
    ├── project.html
    
    ├── submit-project.html
    
    ├── profile.html
    
    ├── login.html
    
    ├── signup.html
    
    ├── main.css
    
    ├── auth.css
    
    └── styles.css
    
🚦 Getting Started
Clone the repo

Install dependencies

bash
cd backend
npm install
Run the server

bash
npm start
Open http://localhost:3000 in your browser

🔗 API Endpoints
Authentication
POST /api/signup — Create account

POST /api/login — Login

POST /api/logout — Logout

GET /api/user/current — Current user

GET /api/user/profile — Dashboard stats

Campaigns
GET /api/projects — List campaigns (?category=&search=)

GET /api/projects/:id — Campaign details

POST /api/projects — Create campaign (auth)

POST /api/projects/:id/donate — Donate (auth)

POST /api/projects/:id/update — Post update (auth)

📌 Usage Guide
Home (index.html):
– Search 🔎 and filter by category
– Click a project to view details

Create Campaign (submit-project.html):
– Fill title, description, goal, category, end date, image URL
– Add reward tiers 🎁
– Submit to launch

Project Page (project.html):
– View image, stats, countdown ⏳
– Donate and celebrate 🎉
– Share on social media 🔗
– Read updates and backer list

Dashboard (profile.html):
– See your campaigns and stats 📊
– View contributions and details

Auth (login.html & signup.html):
– Sign up and log in securely 🔒

🚀 Future Roadmap
Integrate Razorpay/Stripe

Email notifications

AI-powered recommendations

Move to MongoDB/Firestore

Mobile app

Blockchain transparency

Advanced analytics
