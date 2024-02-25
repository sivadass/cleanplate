# cleanplate

CleanPlate - Headless React UI Framework

### Installation

```
npm install cleanplate
```

Check all versions at [NPM](https://www.npmjs.com/package/cleanplate).

### Usage

All components can be consumed by `import` using their respective names from `cleanplate` package.

#### Initial Setup

Import the CSS Reset and minimal cleanplate styles at top most level or root level.

```
import "cleanplate/dist/index.css";
```

#### Button

```
import { Button } from "cleanplate";

<Button variant="primary" onClick={() => {}}>Save</Button>
<Button variant="secondary" onClick={() => {}}>Save</Button>
<Button variant="nude" onClick={() => {}}>Save</Button>
<Button variant="special" onClick={() => {}}>Save</Button>
```

#### Typography

```
import { Typography } from "cleanplate";

<Typography variant="h1">Hello World!</Typography>
<Typography variant="h2">Hello World!</Typography>
<Typography variant="h3">Hello World!</Typography>
<Typography variant="h4">Hello World!</Typography>
<Typography variant="h5">Hello World!</Typography>
<Typography variant="h6">Hello World!</Typography>
<Typography variant="p">Hello World!</Typography>
<Typography variant="small">Hello World!</Typography>

```

#### Badge

```
import { Badge } from "cleanplate";

<Badge label="New" />
```

#### AppShell

```
import { AppShell } from "cleanplate";

<AppShell />
```

#### Form Controls

```
import { FormControl } from "cleanplate";

<FormControl.Input
    name="email"
    onChange={(e) => handleChange(e)}
    value={values.email}
/>

<FormControl.TextArea
    name="bio"
    onChange={(e) => handleChange(e)}
    value={values.bio}
/>
```

#### Icon

```
import { Icon } from "cleanplate";

<Icon name="settings" size="small" color="balck">
```

View all the available icon names from [Google Material Icons](https://fonts.google.com/icons).

#### Modal

```
import { Modal } from "cleanplate";
```

### Documentation & Demo

Storybook playground is available for all components at [https://cleanplate.sivadass.in](https://cleanplate.sivadass.in).
