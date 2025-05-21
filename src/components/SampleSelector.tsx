"use client";

import { useState } from "react";

interface SampleSelectorProps {
  onSelect: (content: string) => void;
}

const samples = {
  intro: { label: "Intro", path: "intro.md" },
  features: { label: "Features", path: "features.md" },
  usage: { label: "Usage", path: "usage.md" },
};

export default function SampleSelector({ onSelect }: SampleSelectorProps) {
  const [selected, setSelected] = useState<string>("");

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const key = e.target.value;
    setSelected(key);

    const mod = await import(`@samples/${samples[key as keyof typeof samples].path}`);
    const content = mod.default;
    onSelect(content);
  }

  return (
    <select
      value={selected}
      onChange={handleChange}
      className="p-2 border rounded-md dark:bg-gray-800 dark:text-white"
    >
      <option value="">Select a sample...</option>
      {Object.entries(samples).map(([key, { label }]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  );
}
