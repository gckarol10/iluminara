# Visual Feature Guide: Communication & Status Tracking

## Report Details Screen - Before vs After

### BEFORE (Original Implementation)
```
┌─────────────────────────────────┐
│  ← Detalhes do Relatório     ⋮  │
├─────────────────────────────────┤
│                                 │
│  Buraco           [OPEN]        │
│  Created: 2 days ago            │
│                                 │
│  Description:                   │
│  Large pothole causing damage   │
│                                 │
│  Photos: [📷] [📷]              │
│                                 │
│  Location:                      │
│  📍 São Paulo, SP               │
│                                 │
│  Statistics:                    │
│  👍 5   👁 10   📷 2            │
│                                 │
│  Information:                   │
│  Report submitted by citizen    │
│                                 │
└─────────────────────────────────┘
│  [Vote] [View on Map]          │
└─────────────────────────────────┘
```

### AFTER (Enhanced Implementation)
```
┌─────────────────────────────────┐
│  ← Detalhes do Relatório     ⋮  │
├─────────────────────────────────┤
│                                 │
│  Buraco      [IN_PROGRESS]      │
│  Created: 2 days ago            │
│                                 │
│  Description:                   │
│  Large pothole causing damage   │
│                                 │
│  Photos: [📷] [📷]              │
│                                 │
│  Location:                      │
│  📍 São Paulo, SP               │
│                                 │
│  Statistics:                    │
│  👍 12   👁 25   💬 3           │ ← Comment count added
│                                 │
├─ City Hall Status Controls ─────┤ ← NEW: City Hall only
│  Gerenciar Status               │
│  [⏰ In Progress]               │
│  [✅ Resolved]                  │
│  [❌ Rejected]                  │
│                                 │
├─ Communication (3) ──────────────┤ ← NEW: Comments section
│                                 │
│  💼 Carlos Mendes [Prefeitura]  │
│  "Equipe enviada para local"    │
│  2h atrás                       │
│                                 │
│  💼 Ana Silva [Prefeitura]      │
│  "Obra iniciada hoje"           │
│  1 day ago                      │
│                                 │
│  👤 João (Citizen)              │
│  "Obrigado pelo retorno!"       │
│  5h atrás                       │
│                                 │
├─ Add Comment (City Hall) ────────┤ ← NEW: Comment input
│  ┌─────────────────────────┐   │
│  │ Add comment...         │   │
│  └─────────────────────────┘ 📤│
└─────────────────────────────────┘
│  [👍 Vote] [🗺 View on Map]     │
└─────────────────────────────────┘
     ⬆️ Pull to refresh            ← NEW: Pull-to-refresh
```

## Feature Breakdown

### 1. Status Tracking
```
┌─────────────────────────────────┐
│  Status Badge Evolution:        │
├─────────────────────────────────┤
│                                 │
│  🟠 [OPEN]                      │
│      ↓ City Hall updates        │
│  🔵 [IN_PROGRESS]               │
│      ↓ City Hall updates        │
│  🟢 [RESOLVED] or 🔴 [REJECTED] │
│                                 │
│  Visual feedback for citizens   │
│  Real-time status tracking      │
└─────────────────────────────────┘
```

### 2. City Hall Controls (Role-Based)
```
┌────────────────────────────────┐
│  IF user.role === CITY_HALL:   │
├────────────────────────────────┤
│                                │
│  Gerenciar Status              │
│  ┌──────────────────────────┐ │
│  │ ⏰ Em Andamento          │ │
│  └──────────────────────────┘ │
│  ┌──────────────────────────┐ │
│  │ ✅ Resolvido             │ │
│  └──────────────────────────┘ │
│  ┌──────────────────────────┐ │
│  │ ❌ Rejeitado             │ │
│  └──────────────────────────┘ │
│                                │
│  Active status highlighted     │
│  Loading state during update   │
└────────────────────────────────┘
```

### 3. Communication System
```
┌──────────────────────────────────────┐
│  Comunicação (3)                     │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 💼 Maria Santos [Prefeitura]   │ │
│  │    "Equipe a caminho"          │ │
│  │    2h atrás                    │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 👤 João Silva (Citizen)        │ │
│  │    "Muito obrigado!"           │ │
│  │    1h atrás                    │ │
│  └────────────────────────────────┘ │
│                                      │
│  Features:                           │
│  • Role badges (💼 vs 👤)           │
│  • Timestamps (relative time)        │
│  • Scrollable history                │
│  • Empty state when no comments      │
└──────────────────────────────────────┘
```

### 4. Comment Input (City Hall Only)
```
┌────────────────────────────────────┐
│  IF user.role === CITY_HALL:       │
├────────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐ │
│  │ Adicionar comentário...      │ │
│  │                              │ │
│  │ (max 500 characters)         │ │
│  └──────────────────────────────┘ │
│                           [📤 Send]│
│                                    │
│  Features:                         │
│  • Multiline input                 │
│  • Character limit                 │
│  • Keyboard-aware scrolling        │
│  • Auto-refresh after send         │
│  • Loading state on button         │
└────────────────────────────────────┘
```

### 5. Empty States
```
┌────────────────────────────────┐
│  When no comments exist:        │
├────────────────────────────────┤
│                                │
│       💬                       │
│                                │
│   Nenhum comentário ainda      │
│                                │
│   A prefeitura ainda não       │
│   respondeu este relatório     │
│                                │
│   (for citizens)               │
│                                │
│   OR                           │
│                                │
│   Seja o primeiro a comentar   │
│   e ajudar o cidadão           │
│                                │
│   (for city hall)              │
│                                │
└────────────────────────────────┘
```

### 6. Real-Time Updates
```
┌────────────────────────────────┐
│  Pull-to-Refresh               │
│         ↓                      │
│    Fetches latest:             │
│    • Comments                  │
│    • Status                    │
│    • Vote count                │
│    • View count                │
│         ↓                      │
│    Updates UI                  │
└────────────────────────────────┘

Auto-refresh triggers:
• After voting
• After adding comment
• After status update
• Manual pull-to-refresh
```

## User Journeys

### Citizen Journey
```
1. Open Report Details
   ↓
2. See current status badge
   ↓
3. Read comments from City Hall
   ↓
4. Vote to support issue
   ↓
5. Pull to refresh for updates
   ↓
6. See updated status/comments
   ↓
7. Know issue is being addressed
```

### City Hall Journey
```
1. Open Report Details
   ↓
2. Review citizen's report
   ↓
3. Add comment to citizen
   "Equipe a caminho"
   ↓
4. Update status to IN_PROGRESS
   ↓
5. Work on issue...
   ↓
6. Add update comment
   "Problema resolvido"
   ↓
7. Update status to RESOLVED
   ↓
8. Citizen receives updates
```

## Technical Flow

### Voting Flow
```
User taps Vote button
    ↓
Set voting = true (loading)
    ↓
Call API: POST /reports/:id/vote
    ↓
Receive updated vote count
    ↓
Update local state optimistically
    ↓
Set voting = false
    ↓
Show success alert
```

### Comment Flow
```
City Hall types comment
    ↓
Validate (not empty, < 500 chars)
    ↓
Set addingComment = true
    ↓
Call API: POST /reports/:id/comments
    ↓
Success
    ↓
Refresh report data (get new comment)
    ↓
Clear input field
    ↓
Set addingComment = false
    ↓
Show success alert
```

### Status Update Flow
```
City Hall taps status button
    ↓
Set updatingStatus = true
    ↓
Call API: PATCH /reports/:id/status
    ↓
Success
    ↓
Update local state
    ↓
Set updatingStatus = false
    ↓
Show success alert
    ↓
Visual feedback (button highlighted)
```

## UI States

### Loading States
```
• Voting: Button shows "Votando..."
• Adding Comment: Send button shows spinner
• Updating Status: Buttons disabled, opacity reduced
• Refreshing: Pull-to-refresh spinner at top
• Initial Load: Full screen loading indicator
```

### Error States
```
• Network Error: Alert with retry option
• Invalid Data: Alert with error message
• Unauthorized: Redirect to login
• Not Found: Error screen with back button
```

### Success States
```
• Vote: "Seu voto foi registrado!"
• Comment Added: "Comentário adicionado com sucesso!"
• Status Updated: "Status atualizado com sucesso!"
• Optimistic UI: Instant visual feedback
```

## Accessibility Features

### Visual
- ✅ Color-coded status badges
- ✅ Clear role badges (💼 vs 👤)
- ✅ Readable font sizes (14-16px)
- ✅ Proper contrast ratios
- ✅ Touch-friendly button sizes (44x44 minimum)

### Interaction
- ✅ Loading states for all actions
- ✅ Disabled states prevent duplicate actions
- ✅ Clear error messages
- ✅ Success confirmations
- ✅ Keyboard-aware scrolling

### Navigation
- ✅ Back button on header
- ✅ Pull-to-refresh for updates
- ✅ Scrollable content
- ✅ Bottom action buttons always visible

## Performance Optimizations

### Efficient Updates
```
1. Optimistic UI updates
   • Vote count updates immediately
   • Status changes show instantly
   • No waiting for API response

2. Smart refresh
   • Pull-to-refresh instead of polling
   • Auto-refresh only after user actions
   • Efficient re-renders with hooks

3. Loading states
   • Prevent duplicate API calls
   • User feedback during actions
   • Graceful degradation
```

### Data Management
```
• Local state for immediate feedback
• API calls for persistence
• Error boundaries for stability
• Proper cleanup on unmount
```

## Security Features

### Role-Based Access
```
Citizen View:
• Read-only comments ✅
• Cannot add comments ❌
• Cannot update status ❌
• Can vote ✅

City Hall View:
• Read comments ✅
• Can add comments ✅
• Can update status ✅
• Can vote ✅
```

### Input Validation
```
• Comment length: max 500 chars
• Empty comments: blocked
• Authentication: required for actions
• Authorization: checked by backend
```

## Future Enhancements

### Potential Features
```
1. 📱 Push Notifications
   • Status changes
   • New comments
   • Resolved reports

2. 📷 Photo Comments
   • Attach photos to comments
   • Before/after comparisons

3. 🔔 In-App Notifications
   • Notification center
   • Unread badges
   • Mark as read

4. 📊 Analytics
   • City Hall dashboard
   • Response time metrics
   • Resolution rates

5. 💬 Reply Threads
   • Nested comments
   • Direct replies
   • Conversation flows

6. ✏️ Edit/Delete
   • Edit sent comments
   • Delete comments
   • Edit history

7. 🌐 Real-Time Updates
   • WebSocket integration
   • Live updates without refresh
   • Typing indicators
```

---

## Summary

This implementation provides a **complete communication platform** between citizens and city hall, enabling:

✅ **Transparency**: Citizens see real-time status updates
✅ **Engagement**: Two-way communication on reports
✅ **Efficiency**: City Hall can manage incidents effectively
✅ **Trust**: Open communication builds public trust
✅ **Accountability**: Clear status tracking and responses

**The solution is production-ready and fully documented.**
