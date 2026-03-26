Improve the navigation flow and prototype connections of an existing multi-screen SaaS web application for a Golf Charity Subscription Platform.

⚡ GOAL:
Ensure all screens are logically connected with correct user journeys, conditions, and navigation behavior. Focus on flow, not UI redesign.

---

🧠 PRIMARY USER FLOW:

Connect screens in this exact sequence:

Landing Page
→ Subscription Page
→ Signup / Login
→ Charity Selection (only for new users)
→ Dashboard

---

🔁 CONDITIONAL FLOW:

* After login:

  * If user is new → go to Charity Selection
  * If user already exists → go directly to Dashboard

---

🏠 DASHBOARD AS CENTRAL HUB:

All main features must be accessible from Dashboard via sidebar or navigation.

Ensure these connections:

Dashboard → Score Entry Page
Dashboard → Draw / Rewards Page
Dashboard → Charity Page
Dashboard → Subscription Management
Dashboard → Profile / Settings

All these pages must have a clear way to return to Dashboard.

---

📊 SCORE FLOW:

Dashboard → Add Score
→ Score Entry Page
→ Save Scores
→ Return to Dashboard

Add feedback state: “Scores updated successfully”

---

🎲 DRAW FLOW:

Dashboard → Draw Page
→ View Results
→ View Participation Status
→ Return to Dashboard

---

❤️ CHARITY FLOW:

Dashboard → Charity Page
→ Change Charity / Contribution %
→ Save
→ Return to Dashboard

---

💳 SUBSCRIPTION FLOW:

Dashboard → Subscription Page
→ Upgrade / Cancel / Renew
→ Confirmation
→ Return to Dashboard

---

👤 PROFILE FLOW:

Dashboard → Profile Page
→ Edit Details
→ Save
→ Return to Dashboard

---

🛠️ ADMIN FLOW:

Admin Login
→ Admin Dashboard

Inside Admin Dashboard:

* Users → Edit → Save
* Draw System → Configure → Run → Publish
* Charities → Add/Edit/Delete
* Winners → Verify → Approve/Reject → Mark Paid
* Analytics → View only

---

🔄 END-TO-END FLOW:

User enters scores
→ participates in draw
→ wins
→ uploads proof
→ admin verifies
→ payment marked as completed

---

🎯 PROTOTYPE RULES:

* Every button must lead to a valid next screen
* No dead ends
* Always provide a “Back” or “Return to Dashboard” option
* Use consistent navigation patterns (sidebar or top nav)
* Add smooth transitions between screens

---

🚀 OUTPUT:
A fully connected, logical prototype flow that reflects a real production-ready SaaS product with clear user journeys and no broken navigation.
