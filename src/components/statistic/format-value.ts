export type FormatStatisticValueOptions = {
  precision?: number;
  groupSeparator?: string;
  decimalSeparator?: string;
};

const NON_FINITE_DISPLAY = "—";

function groupIntegerDigits(digits: string, groupSeparator: string): string {
  if (digits.length <= 3) {
    return digits;
  }

  const groups: string[] = [];
  let index = digits.length;

  while (index > 0) {
    const start = Math.max(0, index - 3);
    groups.unshift(digits.slice(start, index));
    index = start;
  }

  return groups.join(groupSeparator);
}

export function formatStatisticValue(
  value: string | number,
  options: FormatStatisticValueOptions = {},
): string {
  if (typeof value === "string") {
    return value;
  }

  if (!Number.isFinite(value)) {
    return NON_FINITE_DISPLAY;
  }

  const {
    precision,
    groupSeparator = ",",
    decimalSeparator = ".",
  } = options;

  const raw =
    precision !== undefined ? value.toFixed(precision) : String(value);

  const [integerPart, fractionalPart] = raw.split(".");
  const isNegative = integerPart.startsWith("-");
  const unsignedInteger = isNegative ? integerPart.slice(1) : integerPart;
  const grouped = groupIntegerDigits(unsignedInteger, groupSeparator);
  const sign = isNegative ? "-" : "";

  if (fractionalPart !== undefined) {
    return `${sign}${grouped}${decimalSeparator}${fractionalPart}`;
  }

  return `${sign}${grouped}`;
}
