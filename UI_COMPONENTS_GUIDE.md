# KomşuApp - UI Components & Layout Guide

## Quick Start

All core UI components and layout structure have been created. You can start building features immediately.

## Component Usage Examples

### Button Component
```tsx
import { Button } from "@/components/ui/button";

// Primary button
<Button variant="primary" size="md">İleri</Button>

// Secondary button
<Button variant="secondary">Geri</Button>

// Loading state
<Button isLoading>Yükleniyor...</Button>

// Variants: primary, secondary, outline, ghost, destructive
// Sizes: sm, md, lg
```

### Input Component
```tsx
import { Input } from "@/components/ui/input";

<Input
  label="Ad Soyadı"
  placeholder="Adınızı girin"
  error="Ad boş olamaz"
  helperText="En az 2 karakter"
/>
```

### Card Component
```tsx
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Başlık</CardTitle>
    <CardDescription>Açıklama</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Footer */}
  </CardFooter>
</Card>
```

### Modal Component
```tsx
import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal";

<Modal>
  <ModalTrigger asChild>
    <Button>Aç</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Modal Başlığı</ModalTitle>
      <ModalDescription>Açıklama</ModalDescription>
    </ModalHeader>
    {/* Content */}
    <ModalFooter>
      {/* Footer */}
    </ModalFooter>
  </ModalContent>
</Modal>
```

### Toast Notifications
```tsx
// In a client component with toast hook (to be implemented)
import { Toast, ToastTitle, ToastDescription, ToastIcon } from "@/components/ui/toast";

<Toast variant="success">
  <ToastIcon variant="success" />
  <ToastTitle>Başarılı</ToastTitle>
  <ToastDescription>İşlem tamamlandı</ToastDescription>
</Toast>
```

### Layout Components
```tsx
// Main layout is already set up in src/app/(main)/layout.tsx
// It includes:
// - Navbar (top)
// - Sidebar (left, on desktop)
// - BottomBar (bottom, on mobile)
// - Footer (at bottom of content)

// Just wrap your page content in (main) route group
```

## Color Scheme

The entire application uses an **Emerald Green** color scheme (similar to Nextdoor):

- **Primary**: emerald-600 (#16a34a)
- **Light**: emerald-100 (#dcfce7)
- **Dark**: emerald-700 (#15803d)
- **Variants**: emerald-50 through emerald-900

All components automatically use these colors for primary actions, hover states, and focus indicators.

## Utility Functions

### className Merger (cn)
```tsx
import { cn } from "@/lib/utils";

const buttonClass = cn(
  "px-4 py-2 rounded-lg",
  variant === "primary" && "bg-emerald-600 text-white",
  disabled && "opacity-50 cursor-not-allowed"
);
```

## Language

All UI components use **Turkish** text by default:
- Button labels
- Form labels
- Navigation items
- Placeholder text
- Error messages
- Aria labels

## Key Features

### Mobile-First Responsive Design
- Navbar: Full on desktop, hamburger on mobile
- Sidebar: Hidden on mobile, shown on tablet/desktop
- BottomBar: Only shown on mobile (< md breakpoint)
- All components adapt to screen sizes

### Accessibility
- Proper semantic HTML
- Focus states and keyboard navigation
- ARIA labels where needed
- Color contrast meets WCAG standards

### TypeScript Support
- All components fully typed
- Props interfaces exported
- Generic component support

### Form Components
- Use `forwardRef` pattern
- Full React Hook Form compatible
- Error and helper text support

## File Structure

```
src/
├── lib/
│   ├── utils.ts          # cn() function
│   └── providers.tsx     # React Query & Toast providers
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx
│   │   ├── dropdown.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   ├── spinner.tsx
│   │   ├── empty-state.tsx
│   │   └── textarea.tsx
│   └── layout/           # Layout components
│       ├── navbar.tsx
│       ├── sidebar.tsx
│       ├── bottom-bar.tsx
│       └── footer.tsx
└── app/
    ├── layout.tsx        # Root layout
    ├── globals.css       # Global styles
    └── (main)/
        └── layout.tsx    # Main app layout
```

## Next Steps

1. Create pages in `src/app/(main)/` directory
2. Import layout components and UI components as needed
3. Use the color scheme and Turkish text conventions
4. All responsive design is already built in

## Component Props Reference

All components export their prop types:

```tsx
import type { ButtonProps } from "@/components/ui/button";
import type { InputProps } from "@/components/ui/input";
// etc.
```

## Notes

- Components use Tailwind CSS v4 for styling
- Radix UI for accessible primitives
- lucide-react for all icons
- React Query integrated via providers
- Toast notifications ready via Radix UI Toast
- All components can be customized via `className` prop

## Support

For component questions or additions, refer to the individual component files - they all include proper TypeScript types and documentation in the code.

---

Created: March 9, 2026
KomşuApp v0.1.0
