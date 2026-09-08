# Talkie ☎️

**A private line for your favorite people.**

Talkie is a programmable voice platform for staying connected with family and close friends through simple phone calls.

Users can call a dedicated Talkie number, interact with a keypad-driven voice menu, leave private voice messages and eventually connect directly with people in their circle. Talkie preserves those conversations in a web-based voice inbox where recordings can be played back, organized and revisited over time.

The goal is to combine the simplicity and personality of a traditional phone call with a modern, programmable communication platform.

---

## 💡 The Idea

Talkie is built around a simple interaction:

```text
Call Talkie
    ↓
Hear a greeting
    ↓
Choose an option
    ↓
Leave a voice message
    ↓
Recording is processed
    ↓
Open Talkie
    ↓
Listen anytime
```

No dedicated mobile app is required to make a call. Any regular phone can interact with the Talkie phone number.

In the future, Talkie can also work with physical or retro telephones through VoIP, bringing the experience back to a simple idea:

**Pick up the phone and talk to your people.**

---

## ✨ Planned Features

### Voice Calling
- Dedicated Talkie phone number
- Interactive voice menus
- Keypad (DTMF) input
- Call routing between configured contacts
- Custom greetings

### Private Voice Messages
- Leave messages for specific people
- Record and securely store audio
- Listen to received messages
- Track recording duration and timestamps
- Maintain call and message history

### Family & Friends Network
- Create a private circle of contacts
- Assign phone menu options to contacts
- Route calls to family and friends
- Individual voice inboxes

### Web Dashboard
- Voice inbox
- Audio playback
- Call history
- Contact management
- Recording organization

### Voice Memories
Future versions of Talkie will explore:

- Automatic speech-to-text transcription
- Searchable voice recordings
- Semantic search across conversations
- Tags and collections
- Voice-memory timelines
- Family conversation archives

---

## 🏗️ Architecture

Talkie will consist of two primary applications:

```text
talkie/
├── frontend/    # Web application
├── backend/     # API and telephony services
└── README.md
```

The planned system flow is:

```text
Phone
  ↓
Telephony Provider
  ↓
Talkie Backend
  ├── Call Routing
  ├── Voice Menus
  ├── Recording Processing
  └── Message Management
          ↓
       Database
          ↓
    Talkie Frontend
          ↓
      Voice Inbox
```

---

## 🛠️ Planned Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- NestJS
- TypeScript
- REST APIs
- Webhooks

### Data & Storage
- PostgreSQL
- Object storage for voice recordings

### Telephony
- Twilio Programmable Voice
- TwiML
- DTMF input
- Voice recording webhooks

Additional technologies will be introduced as the project evolves.

---

## 🚧 Current Status

Talkie is currently in its initial development stage.

The first milestone is **Talkie v0.1 — First Call**:

1. Call a Talkie phone number
2. Hear a Talkie greeting
3. Press `1` to leave a message
4. Record a voice message
5. Process the recording through the backend
6. Display the recording in the web dashboard
7. Play the recording in the browser

This milestone will establish the complete path from a real telephone call to a playable recording inside the Talkie application.

---

## 🗺️ Roadmap

### v0.1 — First Call
Incoming calls, voice greeting, keypad input, recording, and browser playback.

### v0.2 — Voice Inbox
A polished dashboard for recordings, call history, and audio playback.

### v0.3 — Private Network
Contacts, individual inboxes, custom menus, and call routing.

### v0.4 — Voice Intelligence
Transcription, search, summaries, and semantic retrieval.

### v0.5 — Memories
Timelines, collections, favorites, and long-term voice archives.

### v1.0 — Physical Talkie
VoIP/SIP integration allowing Talkie to work with a physical telephone.

---

## 🎯 Project Goal

Talkie explores how modern web technologies can interact with real-world telephone infrastructure to create a simple, private, and personal communication experience.

Rather than replacing human conversations with AI, Talkie focuses on preserving them.

**Call. Talk. Keep it. ☎️**