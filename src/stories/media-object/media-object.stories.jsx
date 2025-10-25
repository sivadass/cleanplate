import React from "react";
import { MediaObject, Typography, Container } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const meta = {
  title: "atoms/MediaObject/Playground",
  component: MediaObject,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  name: "With Name",
  argTypes: {
    mediaIcon: {
      control: { type: "text" },
      description: "Icon name for the media element",
    },
    mediaImage: {
      control: { type: "text" },
      description: "Image URL for the media element",
    },
    title: {
      control: { type: "text" },
      description: "Title text",
    },
    description: {
      control: { type: "text" },
      description: "Description text",
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
      description: "Margin spacing",
    },
    padding: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
      description: "Padding spacing",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS class",
    },
  },
  args: {
    mediaAvatar: "John Doe",
    title: "John Doe",
    description: "Senior Developer at Tech Corp",
    margin: "m-0",
  },
  render: (args) => (
    <div style={{ minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <MediaObject {...args} />
    </div>
  ),
};

export const WithIcon = {
  name: "With Icon",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", padding: "var(--space-4)" }}>
      <Typography variant="h4" margin="m-0 m-b-2" align="center">Icon Variants</Typography>
      
      <Container display="block">
        <MediaObject
          mediaIcon="person"
          title="User Profile"
          description="User account information and settings"
        />
            
        <MediaObject
          mediaIcon="settings"
          title="Settings"
          description="Application configuration and preferences"
        />
        
        <MediaObject
          mediaIcon="notifications"
          title="Notifications"
          description="System alerts and important updates"
        />
        
        <MediaObject
          mediaIcon="help"
          title="Help & Support"
          description="Documentation and customer support resources"
        />
      </Container>
    </div>
  ),
};

export const WithImage = {
  name: "With Image",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", padding: "var(--space-4)" }}>
      <Typography variant="h4" margin="m-0 m-b-2" align="center">Image Variants</Typography>
      
      <Container display="block" justify="center">
        <MediaObject
          mediaImage="https://avatar-list.netlify.app/assets/avatar-7.jpg"
          title="John Doe"
          description="Senior Developer with 5+ years of experience"
        />
        
        <MediaObject
          mediaImage="https://avatar-list.netlify.app/assets/avatar-8.jpg"
          title="Jane Smith"
          description="Product Manager leading innovative projects"
        />
        
        <MediaObject
          mediaImage="https://avatar-list.netlify.app/assets/avatar-9.jpg"
          title="Mike Johnson"
          description="UI/UX Designer creating beautiful interfaces"
        />
      </Container>
    </div>
  ),
};

export default meta;
