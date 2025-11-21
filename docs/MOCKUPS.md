## UI / UX Mockup Notes

### Landing Page

1. **Hero Section**
   - Full-screen gradient (`from-dark-900 via-dark-800 to-dark-700`) with floating neon particles.
   - Centered tagline: “Connect Instantly with Anyone on Your WiFi — No Numbers, No Contacts, Just Presence.”
   - CTA buttons (`Start Connecting`, `Login`) with glow pulse.
   - Glassmorphic grid preview representing connected avatars.

2. **Features Grid**
   - Three-column cards on desktop, stacked on mobile.
   - Each card: icon (FiWifi, FiMessageCircle, etc.), neon border, hover lift/scale.

3. **How It Works Timeline**
   - Four steps (“Sign Up”, “Connect to WiFi”, “Discover Users”, “Start Chatting”) with sequential animations.

4. **Security & CTA Blocks**
   - Gradient block summarizing privacy/encryption, plus CTA “Get Started Free”.
   - Footer with basic nav + © 2025 text.

5. **Navigation**
   - Sticky translucent navbar, brand icon + orbitron type, smooth-scroll anchors, hamburger on mobile.

### Auth Flow

- Multi-step register wizard:
  1. Username
  2. Email
  3. Password + confirmation
  4. Date of birth
  5. Short bio
  6. Avatar upload w/ preview
- Animated card transitions (slide/fade), progress bar, inline validation.
- Login screen mirrors the styling, includes Google OAuth button (`GoogleLogin`) plus neon inputs.

### Dashboard

- **Sidebar**
  - Mini brand tile, user mini-profile, nav items (Chats, WiFi Users, Friends, Discover, Settings), logout button.
  - Active route uses gradient background + motion dot indicator.

- **Chats View**
  - Left pane: searchable friend list, presence status, unread badge.
  - Right pane: `ChatWindow` with header (avatar, status, quick actions), message list (date dividers, neon bubbles), typing indicator, attachment-aware composer.

- **WiFi Users**
  - KPI card showing network name + online count.
  - User cards (avatar, bio, device icon, message / add friend actions).
  - Embedded WiFi group chat panel leveraging `ChatWindow` in “wifi mode”.

- **Friends**
  - Two sections: “Friend Requests” (cards w/ accept/decline buttons) and “Your Friends” (grid with quick message buttons).

- **Profile**
  - View + edit modes (avatar upload, status, bio, privacy toggles, network history list).

- **Settings**
  - Placeholder cards for Privacy, Notifications, Network (extendable).

### Animation & Micro-interactions

- Buttons: scale/shadow on hover, neon glows.
- Cards: `whileHover` lift, border color transitions.
- Theme toggle: crossfade background and text colors with CSS transitions.
- Socket-driven states (online badges, typing dots) animate using Tailwind + custom keyframes.

Use these notes to align future visual iterations with the intended futuristic/glassmorphic aesthetic.***

