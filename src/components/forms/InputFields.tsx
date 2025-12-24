import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectFormValues } from "@/types/projects";
import { MemberFormValues } from "@/types/team";
import {
  ControllerRenderProps,
  FieldPath,
  UseFormReturn,
} from "react-hook-form";

interface SelectOption {
  label: string;
  value: string;
}

type FormValues = MemberFormValues | ProjectFormValues;

interface TextFieldProps<T extends FormValues> {
  form: UseFormReturn<T>;
  label: string;
  name: FieldPath<T>;
  placeholder?: string;
  type?: string;
}

interface SelectFieldProps<T extends FormValues> {
  form: UseFormReturn<T>;
  label: string;
  name: FieldPath<T>;
  placeholder?: string;
  options: SelectOption[];
}

export const FormTextField = <T extends FormValues>({
  form,
  label,
  name,
  placeholder,
  type = "text",
}: TextFieldProps<T>) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            value={String(field.value)}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const FormSelectField = <T extends FormValues>({
  form,
  label,
  name,
  placeholder,
  options,
}: SelectFieldProps<T>) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select
          onValueChange={field.onChange}
          defaultValue={String(field.value)}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);
