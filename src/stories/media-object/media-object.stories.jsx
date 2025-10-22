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

// Sample data for different use cases
const sampleUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    role: "Senior Developer"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    role: "Product Manager"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    role: "Designer"
  }
];

const sampleProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop",
    price: "$199.99"
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Advanced smartwatch with health monitoring features",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop",
    price: "$299.99"
  },
  {
    id: 3,
    name: "Laptop Stand",
    description: "Adjustable laptop stand for better ergonomics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150&h=150&fit=crop",
    price: "$49.99"
  }
];

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
