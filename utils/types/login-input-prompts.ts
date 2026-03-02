export interface LoginInputProps {
  label: string;
  type: "email" | "password" | "text";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}