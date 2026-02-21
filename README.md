FleetOps – Smart Fleet Management System

A modern, graphical Fleet Management Web Application built with Next.js + TypeScript + TailwindCSS.
Designed for digital fleet lifecycle optimization, driver safety monitoring, and financial performance tracking.

📌 Project Overview

FleetOps replaces traditional manual logbooks with a centralized digital hub that:

Optimizes fleet utilization

Automates trip lifecycle management

Tracks fuel & maintenance expenses

Monitors driver compliance

Provides operational analytics

Built for scalable, real-world logistics management.

🛠 Tech Stack

Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS

UI Components: Custom UI + Modular Component System

State Management: Context API (fleet-context.tsx)

Architecture: Modular Component-Based Design

📂 Project Structure
app/
 ├── page.tsx (Dashboard)
 ├── vehicles/
 ├── trips/
 ├── drivers/
 ├── maintenance/
 ├── fuel/
 ├── analytics/

components/
 ├── dashboard/
 ├── vehicles/
 ├── trips/
 ├── drivers/
 ├── maintenance/
 ├── fuel/
 ├── analytics/
 ├── ui/

lib/
 ├── data.ts
 ├── fleet-context.tsx
 ├── utils.ts
🚀 Core Functional Modules
1️⃣ Dashboard (Command Center)

Provides high-level operational overview:

Active Fleet Count

Vehicles In Shop

Utilization Rate

Fuel & Expense Overview

KPI Cards

Graphical Charts

Recent Activity Feed

Purpose: Real-time fleet visibility.

2️⃣ Vehicle Registry

Manage fleet assets with:

Add Vehicle

Edit Vehicle

Delete Vehicle

Track Capacity

Track Odometer

Status Management (Available / On Trip / In Shop)

Ensures centralized asset lifecycle tracking.

3️⃣ Trip Management

Complete trip workflow system:

Features:

Create Trip

Assign Vehicle

Assign Driver

Enter Cargo Weight

Trip Status Tracking

Validation Logic:

Prevent trip creation if:

Cargo Weight > Vehicle Max Capacity
Lifecycle:

Draft → Dispatched → Completed → Cancelled

Auto Status Updates:

On Dispatch → Vehicle & Driver set to "On Trip"

On Completion → Vehicle & Driver revert to "Available"

4️⃣ Driver Management

Driver safety and compliance tracking:

Add / Edit Drivers

License Category Tracking

License Expiry Monitoring

Status Control:

On Duty

Off Duty

Suspended

Business Logic:

Prevent assignment if license expired

Prevent assignment if suspended

Track driver performance metrics

5️⃣ Maintenance Module

Preventative and reactive service tracking:

Add Service Logs

Record Maintenance Cost

Maintenance Type Tracking

Service Date Logging

Auto Logic:

Adding a service log automatically changes vehicle status to "In Shop"

Vehicle becomes unavailable for dispatch

After completion → status resets

6️⃣ Fuel & Expense Module

Operational cost tracking per vehicle:

Log Fuel (Liters, Cost, Date)

Track Maintenance Expenses

Calculate Total Operational Cost

Automated Calculations:
Total Operational Cost = Fuel Cost + Maintenance Cost

Used for ROI and performance analysis.

7️⃣ Analytics & Reports

Data-driven insights:

Fuel Efficiency (km/L)

Vehicle ROI

Cost per KM

Fleet Utilization Metrics

Graphical Charts

Monthly Analysis Overview

Provides business-level decision support.

🔄 System Workflow Summary

Add Vehicle → Status: Available

Add Driver → License validation check

Create Trip → Capacity validation

Dispatch → Auto status update

Complete Trip → Odometer update

Add Maintenance → Vehicle auto moves to In Shop

Fuel Entry → Analytics auto update

🎨 UI Highlights

Modern Dashboard Layout

Sidebar Navigation

Status Badges

Responsive Design

Modular Components

Scalable UI Architecture

⚙ Installation & Setup
1️⃣ Clone Repository
git clone <repository-url>
cd fleetops
2️⃣ Install Dependencies
npm install

or

pnpm install
3️⃣ Run Development Server
npm run dev
4️⃣ Open in Browser
http://localhost:3000
🧠 Business Value

FleetOps provides:

Reduced manual errors

Real-time fleet monitoring

Automated compliance enforcement

Financial visibility

Improved operational efficiency

Designed for logistics companies, delivery services, and enterprise fleet operations.

📈 Future Enhancements

Backend API integration

Database persistence (PostgreSQL)

Role-Based Access Control

JWT Authentication
