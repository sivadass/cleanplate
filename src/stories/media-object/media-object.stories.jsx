import React from "react";
import {
  Icon,
  MediaObject,
  Typography,
  Container,
} from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const STAR_ACTION_BUTTON_STYLES = {
  margin: 0,
  padding: 0,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const StarActionButton = () => (
  <button type="button" aria-label="Star conversation" style={STAR_ACTION_BUTTON_STYLES}>
    <Icon name="star_border" size="medium" />
  </button>
);

const mailListChrome = {
  maxWidth: 420,
  border: `1px solid var(--gray-200)`,
  borderRadius: "var(--radius-medium)",
};

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
    subtitle: {
      control: { type: "text" },
      description: "Optional middle line (e.g. subject)",
    },
    title: {
      control: { type: "text" },
      description: "Title text",
    },
    description: {
      control: { type: "text" },
      description: "Muted preview line(s); line clamp via descriptionLineClamp",
    },
    descriptionLineClamp: {
      control: { type: "number", min: 1, max: 8, step: 1 },
      description: "Max lines shown for description before ellipsis",
    },
    meta: {
      control: { type: "text" },
      description:
        'Trailing rail, top slot (accent text for primitives). Story control is string only; JSX works in code.',
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
    showAction: {
      control: "boolean",
      description: "(Story only) Renders outline star icon in action slot",
    },
  },
  args: {
    mediaAvatar: "John Doe",
    title: "John Doe",
    subtitle: "",
    description: "Senior Developer at Tech Corp",
    descriptionLineClamp: 2,
    meta: "",
    margin: "m-0",
    showAction: false,
  },
  render: (args) => {
    const {
      subtitle,
      description,
      meta: metaRaw,
      showAction,
      ...forward
    } = args;

    const metaVal =
      typeof metaRaw === "string" && metaRaw.trim() !== "" ? metaRaw : undefined;
    const subtitleVal =
      typeof subtitle === "string" && subtitle.trim() !== ""
        ? subtitle
        : undefined;
    const descVal =
      typeof description === "string" && description.trim() !== ""
        ? description
        : undefined;

    return (
      <div
        style={{
          minHeight: "240px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "var(--space-4)",
        }}
      >
        <MediaObject
          {...forward}
          subtitle={subtitleVal}
          description={descVal}
          meta={metaVal}
          action={showAction ? <StarActionButton /> : undefined}
        />
      </div>
    );
  },
};

export const WithIcon = {
  name: "With Icon",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        padding: "var(--space-4)",
      }}
    >
      <Typography variant="h4" margin="m-0 m-b-2" align="center">
        Icon variants
      </Typography>

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        padding: "var(--space-4)",
      }}
    >
      <Typography variant="h4" margin="m-0 m-b-2" align="center">
        Image variants
      </Typography>

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

export const GmailMobileStyleList = {
  name: "Gmail-style list (dense cards)",
  render: () => (
    <div style={{ padding: "var(--space-4)", width: "100%", display: "flex", justifyContent: "center" }}>
      <Container display="block" style={mailListChrome}>
        <MediaObject
          mediaAvatar="ABC - Aditya Birla Sun L."
          title="ABC - Aditya Birla Sun L."
          subtitle="» Monthly Portfolio Disclosure - April 2026"
          description={
            "Dear Valued Unitholder, Thank you for choosing Aditya Birla Sun Life for your mutual fund investments. Here's your monthly disclosure statement with key portfolio holdings and NAV updates consolidated for clarity."
          }
          meta="Saturday"
          action={<StarActionButton />}
          descriptionLineClamp={1}
          padding="p-x-3 p-y-2"
          margin="m-0"
        />
        <MediaObject
          mediaAvatar="ExpenseBot"
          title="ExpenseBot"
          subtitle="Expense report FY26-Q1 exported"
          description="Your exported spreadsheet is attached. Rows marked in yellow need receipts before approval."
          meta="Fri"
          action={<StarActionButton />}
          descriptionLineClamp={2}
          padding="p-x-3 p-y-2"
          margin="m-0"
        />
        <MediaObject
          mediaAvatar="Design Sync"
          title="Design team"
          subtitle="Slides for Monday review — v3"
          description="Dropped the condensed deck in Drive; typography refresh is scoped to onboarding only."
          meta="Thu"
          action={<StarActionButton />}
          padding="p-x-3 p-y-2"
          margin="m-0"
        />
      </Container>
    </div>
  ),
};

export const ConfigurationsGallery = {
  name: "All configurations",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        padding: "var(--space-5)",
      }}
    >
      <Typography variant="h4" margin="m-0">
        MediaObject layouts
      </Typography>

      <section>
        <Typography variant="h6" margin="m-b-2">
          Legacy two-line (title + description)
        </Typography>
        <Container display="block" style={{ maxWidth: 420 }}>
          <MediaObject mediaIcon="inbox" title="Inbox" description="Unread messages awaiting triage." />
        </Container>
      </section>

      <section>
        <Typography variant="h6" margin="m-b-2">
          Title only
        </Typography>
        <Container display="block" style={{ maxWidth: 420 }}>
          <MediaObject mediaIcon="folder" title="Drafts folder" />
        </Container>
      </section>

      <section>
        <Typography variant="h6" margin="m-b-2">
          Three lines, no trailing rail
        </Typography>
        <Container display="block" style={{ maxWidth: 420 }}>
          <MediaObject
            mediaAvatar="Newsletter Weekly"
            title="Weekly digest"
            subtitle="Product · Ships this month"
            description="Highlighted launches, deprecation notices, and the FAQ refresh you asked about."
          />
        </Container>
      </section>

      <section>
        <Typography variant="h6" margin="m-b-2">
          Rail: meta string only (accent typography)
        </Typography>
        <Container display="block" style={{ maxWidth: 420 }}>
          <MediaObject mediaIcon="bolt" title="Fast lane" meta="Yesterday" subtitle="Throughput improved" />
        </Container>
      </section>

      <section>
        <Typography variant="h6" margin="m-b-2">
          Rail: custom meta node + action icon
        </Typography>
        <Container display="block" style={{ maxWidth: 420 }}>
          <MediaObject
            mediaIcon="payments"
            title="Invoice #4021"
            description="Reminder: payable on receipt."
            meta={
              <Typography variant="small" margin="m-0" isBold align="right">
                Unpaid · $120
              </Typography>
            }
            action={<StarActionButton />}
          />
        </Container>
      </section>

      <section>
        <Typography variant="h6" margin="m-b-2">
          Rail: action only (pins to snippet row when description present)
        </Typography>
        <Container display="block" style={{ maxWidth: 420 }}>
          <MediaObject
            mediaIcon="shopping_bag"
            title="Reorder suggestions"
            description="Weekly staples based on your last three baskets."
            action={<StarActionButton />}
          />
        </Container>
      </section>

      <section>
        <Typography variant="h6" margin="m-b-2">
          Description line clamp (multi-line truncation)
        </Typography>
        <Container display="block" style={{ maxWidth: 420 }}>
          <MediaObject
            mediaIcon="schedule"
            title="Long preview"
            subtitle="clamp = 4 lines"
            description={
              [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
                "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                "This last sentence should rarely appear.",
              ].join(" ")
            }
            descriptionLineClamp={4}
          />
        </Container>
      </section>
    </div>
  ),
};

export default meta;
