import { TextareaHTMLAttributes } from "react";

interface EditorProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onMarkdownChange: (value: string) => void;
}

export default function Editor({
  value,
  onMarkdownChange,
  ...props
}: EditorProps) {
  return (
    <textarea
      className="w-full h-full p-4 text-sm font-mono bg-white dark:bg-gray-900 text-black dark:text-white resize-none border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => onMarkdownChange(e.target.value)}
      {...props}
    />
  );
}
