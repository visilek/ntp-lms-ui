# NtpCard Family

Card components for content containers following Material Design 3.

## Components

| Component | Purpose |
|---|---|
| `NtpCard` | Bare container: border radius, elevation/background per variant. No internal padding. |
| `NtpCardHeader` | Avatar + title + subtitle block. Optional overlay treatment for use over media. |

## Layout

Cards do **not** apply internal padding. Use spacing utility classes to arrange content:

| Class | Applies To |
|---|---|
| `ntp-pa-{n}` | Padding all sides |
| `ntp-px-{n}` | Padding left + right |
| `ntp-py-{n}` | Padding top + bottom |
| `ntp-pt-{n}` / `ntp-pb-{n}` | Padding top / bottom |
| `ntp-pl-{n}` / `ntp-pr-{n}` | Padding left / right |

Spacing scale (4dp base): `1` = 4dp, `2` = 8dp, `3` = 12dp, `4` = 16dp, `5` = 20dp, `6` = 24dp, `8` = 32dp, `10` = 40dp, `12` = 48dp.

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
  <NtpMedia src="cover.jpg" alt="Cover" aspect-ratio="21 / 9" />
  <div class="ntp-pa-4">
    <NtpCardHeader title="Physics 101" />
    <p>Body...</p>
  </div>
</NtpCard>
```

### Header Over Media

```html
<NtpCard>
  <div class="media-container">
    <NtpMedia src="cover.jpg" alt="Cover" />
    <NtpCardHeader title="Physics 101" subtitle="Mechanics" overlay="scrim" />
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
    <div class="ntp-d-flex ntp-justify-between ntp-align-start">
      <NtpCardHeader title="Physics 101" subtitle="Mechanics" />
      <NtpActionMenu :items="actions" @select="handleAction" />
    </div>
    <p>Body...</p>
  </div>
</NtpCard>
```

### Footer Actions

```html
<NtpCard>
  <div class="ntp-pa-4">
    <p>Body...</p>
  </div>
  <div class="ntp-px-4 ntp-pb-3 ntp-d-flex ntp-justify-end">
    <NtpButton variant="text" size="small">Reply</NtpButton>
  </div>
</NtpCard>