Refactor an existing SaaS UI for a platform called **GolfGive** by separating the experience into three distinct user roles and navigation systems.

⚡ GOAL:
Fix messy navigation by clearly separating:

1. Public Visitor experience
2. Registered User dashboard
3. Administrator panel

Ensure each has its own layout, navigation, and flow.

---

# 🌐 1. PUBLIC WEBSITE (NO LOGIN REQUIRED)

Purpose:

* Explain the product
* Build trust
* Drive subscription

Navbar should ONLY include:

* Home
* Impact
* Pricing
* Rewards
* Log In
* Get Started

REMOVE:

* Dashboard
* Admin

---

Pages to include:

1. Landing Page

* Hero
* How it works
* Charity impact
* CTA

2. Impact Page

* Charity listings
* Stories
* Stats

3. Pricing Page

* Monthly / Yearly plans

4. Rewards Page

* Draw explanation
* Prize tiers

---

CTA FLOW:
"Get Started" → Signup/Login

---

# 🔐 2. AUTHENTICATION FLOW

Create separate screens:

* Login Page
* Signup Page

After login:

* New user → Charity Selection
* Existing user → Dashboard

---

# 🧑‍💻 3. USER DASHBOARD (REGISTERED SUBSCRIBER ONLY)

This must be a completely separate layout.

Layout:

* Sidebar navigation
* Top bar (profile, logout)

Sidebar items:

* Overview
* Scores
* Draws
* Charity
* Subscription
* Profile

---

Dashboard must include:

Overview:

* Subscription status
* Draw participation
* Winnings summary

Scores:

* Enter/edit last 5 scores
* Auto-replace oldest

Draws:

* Current draw
* Past results
* Match tiers

Charity:

* Selected charity
* Contribution %

Subscription:

* Plan details
* Upgrade/cancel

Profile:

* User settings

Winner Flow:

* Upload proof
* Track payment status

---

# 🛠️ 4. ADMIN PANEL (COMPLETELY SEPARATE)

Admin must NOT share UI with users.

Create separate admin login.

Admin layout:

* Sidebar + data tables

Sidebar items:

* Users
* Draw Management
* Charities
* Winners
* Analytics

---

Admin Features:

Users:

* View/edit users
* Manage subscriptions

Draw:

* Configure logic
* Run simulation
* Publish results

Charities:

* Add/edit/delete

Winners:

* Approve/reject proof
* Mark payments

Analytics:

* Total users
* Prize pool
* Contributions

---

# 🔄 NAVIGATION RULES:

* Public users NEVER see dashboard or admin
* Dashboard accessible ONLY after login
* Admin panel accessible ONLY via admin login
* Always provide logout option

---

🎨 DESIGN CONSISTENCY:

* Same brand (GolfGive)
* Same colors & typography
* BUT different layouts:

  * Marketing (public)
  * App (dashboard)
  * Data (admin)

---

🚀 OUTPUT:
A clean, structured SaaS product with clearly separated user roles, proper navigation, and no mixed interfaces.
