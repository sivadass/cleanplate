import React from "react";
import { Container, Typography, Button } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

// Spacing suffix options for Controls (getSpacingClass builds e.g. p-4 from prefix "p" + "4")
const SPACING_SUFFIX_OPTIONS = SPACING_OPTIONS.slice(0, 10); // "0" through "9"
const GAP_OPTIONS = SPACING_OPTIONS.slice(0, 10);

const meta = {
  title: "atoms/Container/Playground",
  component: Container,
  parameters: {
    layout: "centered",
  },
};

// Sample content components
const SampleContent = ({ title, description }) => (
  <div>
    <Typography variant="h3" margin="m-0 m-b-2">
      {title}
    </Typography>
    <Typography variant="p" margin="m-0">
      {description}
    </Typography>
  </div>
);

const CardContent = ({ title, description, buttonText }) => (
  <div>
    <Typography variant="h4" margin="m-0 m-b-2">
      {title}
    </Typography>
    <Typography variant="p" margin="m-0 m-b-3">
      {description}
    </Typography>
    <Button variant="outline" size="small">
      {buttonText}
    </Button>
  </div>
);

export const Default = {
  name: "Default Container",
  argTypes: {
    display: {
      options: ["inline-block", "block", "flex"],
      control: { type: "select" },
      description: "Display type of the container",
    },
    width: {
      options: [
        "small",
        "medium", 
        "large",
        "extra-large",
        "quarter",
        "half",
        "three-quarters",
        "full",
      ],
      control: { type: "select" },
      description: "Width of the container",
    },
    justify: {
      options: [
        "space-between",
        "center", 
        "space-around",
        "space-evenly",
        "flex-end",
        "flex-start",
      ],
      control: { type: "select" },
      description: "Justify content for flex containers",
    },
    align: {
      options: ["start", "center", "end"],
      control: { type: "select" },
      description: "Align items for flex containers",
    },
    padding: {
      options: SPACING_SUFFIX_OPTIONS,
      control: { type: "select" },
      description: "Padding spacing (suffix: e.g. '4' applies p-4)",
    },
    margin: {
      options: SPACING_SUFFIX_OPTIONS,
      control: { type: "select" },
      description: "Margin spacing (suffix: e.g. '0' applies m-0)",
    },
    gap: {
      options: GAP_OPTIONS,
      control: { type: "select" },
      description: "Gap between flex items (suffix: e.g. '2' applies g-2)",
    },
    showBorder: {
      control: { type: "boolean" },
      description: "Show border around container",
    },
  },
  args: {
    display: "block",
    width: "medium",
    padding: "4",
    margin: "0",
    showBorder: true,
  },
  render: (args) => (
    <div style={{ minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Container {...args}>
        <SampleContent 
          title="Container Example"
          description="This is a sample container with customizable properties. You can adjust the display, width, padding, margin, and other properties using the controls below."
        />
      </Container>
    </div>
  ),
};

export const DisplayVariants = {
  name: "Display Variants",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", padding: "var(--space-4)" }}>
      <div>
        <Typography variant="h4" margin="m-0 m-b-2">Block Display</Typography>
        <Container display="block" showBorder padding="3" margin="b-2">
          <SampleContent 
            title="Block Container"
            description="This container uses block display, taking full width and stacking vertically."
          />
        </Container>
      </div>
      
      <div>
        <Typography variant="h4" margin="m-0 m-b-2">Flex Display</Typography>
        <Container display="flex" justify="space-between" align="center" showBorder padding="3" gap="2">
          <SampleContent 
            title="Flex Item 1"
            description="First flex item"
          />
          <SampleContent 
            title="Flex Item 2"
            description="Second flex item"
          />
        </Container>
      </div>
      
      <div>
        <Typography variant="h4" margin="m-0 m-b-2">Inline Block Display</Typography>
        <Container display="inline-block" showBorder padding="3" margin="r-2">
          <SampleContent 
            title="Inline Block 1"
            description="First inline block"
          />
        </Container>
        <Container display="inline-block" showBorder padding="3">
          <SampleContent 
            title="Inline Block 2"
            description="Second inline block"
          />
        </Container>
      </div>
    </div>
  ),
};

export const WidthVariants = {
  name: "Width Variants",
  render: () => (
    <div style={{ padding: "var(--space-4)" }}>
      <Typography variant="h4" margin="m-0 m-b-4">Container Width Options</Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Container width="small" showBorder padding="3">
          <Typography variant="p" margin="m-0">Small Width Container</Typography>
        </Container>
        <Container width="medium" showBorder padding="3">
          <Typography variant="p" margin="m-0">Medium Width Container</Typography>
        </Container>
        <Container width="large" showBorder padding="3">
          <Typography variant="p" margin="m-0">Large Width Container</Typography>
        </Container>
        <Container width="extra-large" showBorder padding="3">
          <Typography variant="p" margin="m-0">Extra Large Width Container</Typography>
        </Container>
        <Container width="quarter" showBorder padding="3">
          <Typography variant="p" margin="m-0">Quarter Width Container</Typography>
        </Container>
        <Container width="half" showBorder padding="3">
          <Typography variant="p" margin="m-0">Half Width Container</Typography>
        </Container>
        <Container width="three-quarters" showBorder padding="3">
          <Typography variant="p" margin="m-0">Three Quarters Width Container</Typography>
        </Container>
        <Container width="full" showBorder padding="3">
          <Typography variant="p" margin="m-0">Full Width Container</Typography>
        </Container>
      </div>
    </div>
  ),
};

export const FlexLayouts = {
  name: "Flex Layouts",
  render: () => (
    <div style={{ padding: "var(--space-4)" }}>
      <Typography variant="h4" margin="m-0 m-b-4">Flex Layout Examples</Typography>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div>
          <Typography variant="h5" margin="m-0 m-b-2">Space Between</Typography>
          <Container display="flex" justify="space-between" showBorder padding="3" gap="2">
            <CardContent title="Card 1" description="First card content" buttonText="Action 1" />
            <CardContent title="Card 2" description="Second card content" buttonText="Action 2" />
            <CardContent title="Card 3" description="Third card content" buttonText="Action 3" />
          </Container>
        </div>
        
        <div>
          <Typography variant="h5" margin="m-0 m-b-2">Center</Typography>
          <Container display="flex" justify="center" align="center" showBorder padding="3" gap="2">
            <CardContent title="Centered Card" description="This card is centered" buttonText="Center Action" />
          </Container>
        </div>
        
        <div>
          <Typography variant="h5" margin="m-0 m-b-2">Space Around</Typography>
          <Container display="flex" justify="space-around" showBorder padding="3" gap="2">
            <CardContent title="Card A" description="First card" buttonText="Action A" />
            <CardContent title="Card B" description="Second card" buttonText="Action B" />
          </Container>
        </div>
        
        <div>
          <Typography variant="h5" margin="m-0 m-b-2">Flex End</Typography>
          <Container display="flex" justify="flex-end" showBorder padding="3" gap="2">
            <CardContent title="Right Aligned" description="This content is right-aligned" buttonText="Right Action" />
          </Container>
        </div>
      </div>
    </div>
  ),
};

export const GridLayouts = {
  name: "Grid Layouts",
  render: () => (
    <div style={{ padding: "var(--space-4)" }}>
      <Typography variant="h4" margin="m-0 m-b-4">Grid Layout Examples</Typography>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div>
          <Typography variant="h5" margin="m-0 m-b-2">Quarter Grid (4 columns)</Typography>
          <Container display="flex" showBorder padding="2" gap="2">
            <Container width="quarter" showBorder padding="3">
              <CardContent title="Quarter 1" description="First quarter" buttonText="Q1" />
            </Container>
            <Container width="quarter" showBorder padding="3">
              <CardContent title="Quarter 2" description="Second quarter" buttonText="Q2" />
            </Container>
            <Container width="quarter" showBorder padding="3">
              <CardContent title="Quarter 3" description="Third quarter" buttonText="Q3" />
            </Container>
            <Container width="quarter" showBorder padding="3">
              <CardContent title="Quarter 4" description="Fourth quarter" buttonText="Q4" />
            </Container>
          </Container>
        </div>
        
        <div>
          <Typography variant="h5" margin="m-0 m-b-2">Half Grid (2 columns)</Typography>
          <Container display="flex" showBorder padding="2" gap="2">
            <Container width="half" showBorder padding="3">
              <CardContent title="Left Half" description="Left side content" buttonText="Left" />
            </Container>
            <Container width="half" showBorder padding="3">
              <CardContent title="Right Half" description="Right side content" buttonText="Right" />
            </Container>
          </Container>
        </div>
        
        <div>
          <Typography variant="h5" margin="m-0 m-b-2">Three Quarters + Quarter</Typography>
          <Container display="flex" showBorder padding="2" gap="2">
            <Container width="three-quarters" showBorder padding="3">
              <CardContent title="Main Content" description="This is the main content area taking up three quarters of the space" buttonText="Main Action" />
            </Container>
            <Container width="quarter" showBorder padding="3">
              <CardContent title="Sidebar" description="Sidebar content" buttonText="Side" />
            </Container>
          </Container>
        </div>
      </div>
    </div>
  ),
};

export const SpacingExamples = {
  name: "Spacing Examples",
  render: () => (
    <div style={{ padding: "var(--space-4)" }}>
      <Typography variant="h4" margin="m-0 m-b-4">Spacing Examples</Typography>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div>
          <Typography variant="h5" margin="m-0 m-b-2">Different Padding Values</Typography>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Container showBorder padding="1">
              <Typography variant="small" margin="m-0">p-1</Typography>
            </Container>
            <Container showBorder padding="2">
              <Typography variant="small" margin="m-0">p-2</Typography>
            </Container>
            <Container showBorder padding="3">
              <Typography variant="small" margin="m-0">p-3</Typography>
            </Container>
            <Container showBorder padding="4">
              <Typography variant="small" margin="m-0">p-4</Typography>
            </Container>
            <Container showBorder padding="5">
              <Typography variant="small" margin="m-0">p-5</Typography>
            </Container>
          </div>
        </div>
        
        <div>
          <Typography variant="h5" margin="m-0 m-b-2">Different Margin Values</Typography>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Container showBorder padding="2" margin="1">
              <Typography variant="small" margin="0">m-1</Typography>
            </Container>
            <Container showBorder padding="2" margin="2">
              <Typography variant="small" margin="m-0">m-2</Typography>
            </Container>
            <Container showBorder padding="2" margin="3">
              <Typography variant="small" margin="m-0">m-3</Typography>
            </Container>
            <Container showBorder padding="2" margin="4">
              <Typography variant="small" margin="m-0">m-4</Typography>
            </Container>
            <Container showBorder padding="2" margin="5">
              <Typography variant="small" margin="m-0">m-5</Typography>
            </Container>
          </div>
        </div>
        
        <div>
          <Typography variant="h5" margin="m-0 m-b-2">Gap Between Flex Items</Typography>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <Container display="flex" showBorder padding="2" gap="1">
              <Container showBorder padding="2">
                <Typography variant="small" margin="0">1</Typography>
              </Container>
              <Container showBorder padding="2">
                <Typography variant="small" margin="0">1</Typography>
              </Container>
            </Container>
            <Container display="flex" showBorder padding="2" gap="2">
              <Container showBorder padding="2">
                <Typography variant="small" margin="0">2</Typography>
              </Container>
              <Container showBorder padding="2">
                <Typography variant="small" margin="0">2</Typography>
              </Container>
            </Container>
            <Container display="flex" showBorder padding="2" gap="3">
              <Container showBorder padding="2">
                <Typography variant="small" margin="0">3</Typography>
              </Container>
              <Container showBorder padding="2">
                <Typography variant="small" margin="0">3</Typography>
              </Container>
            </Container>
            <Container display="flex" showBorder padding="2" gap="4">
              <Container showBorder padding="2">
                <Typography variant="small" margin="0">4</Typography>
              </Container>
              <Container showBorder padding="2">
                <Typography variant="small" margin="0">4</Typography>
              </Container>
            </Container>
            <Container display="flex" showBorder padding="2" gap="5">
              <Container showBorder padding="2">
                <Typography variant="small" margin="0">5</Typography>
              </Container>
              <Container showBorder padding="2">
                <Typography variant="small" margin="0">5</Typography>
              </Container>
            </Container>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const InteractiveExample = {
  name: "Interactive Example",
  render: () => {
    const [clickCount, setClickCount] = React.useState(0);
    
    return (
      <div style={{ padding: "var(--space-4)" }}>
        <Typography variant="h4" margin="m-0 m-b-4">Interactive Container</Typography>
        
        <Container 
          display="flex" 
          justify="center" 
          align="center" 
          showBorder 
          padding="4" 
          style={{ 
            cursor: "pointer",
            transition: "all 0.2s ease",
            backgroundColor: "var(--gray-lightest)"
          }}
          onClick={() => setClickCount(prev => prev + 1)}
        >
          <div style={{ textAlign: "center" }}>
            <Typography variant="h5" margin="m-0 m-b-2">
              Click Me!
            </Typography>
            <Typography variant="p" margin="m-0 m-b-2">
              This container has an onClick handler
            </Typography>
            <Typography variant="small" margin="m-0" color="var(--primary-brand)">
              Clicked {clickCount} times
            </Typography>
          </div>
        </Container>
      </div>
    );
  },
};

export default meta;