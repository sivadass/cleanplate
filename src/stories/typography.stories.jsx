import { Typography } from "../index";

const meta = {
  component: Typography,
};

export const Variants = {
  name: "Variants",
  render: () => {
    return (
      <div>
        <Typography variant="h1" marginBottom="extra-large">
          The quick brown fox jumps over the lazy dog
        </Typography>
        <Typography variant="h2" marginBottom="extra-large">
          The quick brown fox jumps over the lazy dog
        </Typography>
        <Typography variant="h3" marginBottom="extra-large">
          The quick brown fox jumps over the lazy dog
        </Typography>
        <Typography variant="h4" marginBottom="extra-large">
          The quick brown fox jumps over the lazy dog
        </Typography>
        <Typography variant="h5" marginBottom="extra-large">
          The quick brown fox jumps over the lazy dog
        </Typography>
        <Typography variant="h6" marginBottom="extra-large">
          The quick brown fox jumps over the lazy dog
        </Typography>
        <Typography variant="p" marginBottom="extra-large">
          The quick brown fox jumps over the lazy dog
        </Typography>
      </div>
    );
  },
};

export default meta;
