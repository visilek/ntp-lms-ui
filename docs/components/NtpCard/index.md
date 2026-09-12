# NtpCard Family

Card components following Material Design 3. Composition-based.

## Components

| Component | Purpose |
|---|---|
| `NtpCard` | Bare container: variant (elevated/filled/outlined), color, clickable |
| `NtpCardHeader` | Avatar + title + subtitle, optional action slot |
| `NtpMedia` | Image primitive (separate top-level component) |

## Layout

Cards have **no internal padding**. Consumers apply spacing utilities.

## Composition Patterns

### Basic Card

```html
<NtpCard>
  <div class="ntp-pa-4">
    <NtpCardHeader title="Physics 101" subtitle="Mechanics" />
    <p>Body text...</p>
  </div>
</NtpCard>
```

### Media Top, Content Below

```html
<NtpCard>
  <NtpMedia :media="{ src: 'cover.jpg', alt: 'Cover' }" aspect-ratio="21 / 9" />
  <div class="ntp-pa-4">
    <NtpCardHeader title="Physics 101" />
    <p>Body...</p>
  </div>
</NtpCard>
```

### Header Over Media

```html
<NtpCard>
  <div style="position: relative;">
    <NtpMedia :media="{ src: 'cover.jpg', alt: 'Cover' }" />
    <div style="position: absolute; bottom: 0; left: 0; right: 0;">
      <NtpCardHeader title="Physics 101" subtitle="Mechanics" overlay="scrim" />
    </div>
  </div>
  <div class="ntp-pa-4">
    <p>Body...</p>
  </div>
</NtpCard>
```

### With Action Menu

```html
<NtpCard>
  <div class="ntp-pa-4">
    <div class="ntp-flex ntp-justify-between ntp-items-start">
      <NtpCardHeader title="Physics 101" subtitle="Mechanics" />
      <NtpActionMenu :items="actions" @select="handleAction" />
    </div>
    <p>Body...</p>
  </div>
</NtpCard>
```

### With Footer Actions

```html
<NtpCard>
  <div class="ntp-pa-4">
    <p>Body...</p>
  </div>
  <div class="ntp-px-4 ntp-pb-3 ntp-flex ntp-justify-end ntp-gap-2">
    <NtpButton variant="text" size="small">Reply</NtpButton>
  </div>
</NtpCard>
```

### Colored Card

```html
<NtpCard color="primary">
  <div class="ntp-pa-4">
    <NtpCardHeader title="Physics 101" subtitle="Mechanics" />
    <p>Body...</p>
  </div>
</NtpCard>
```