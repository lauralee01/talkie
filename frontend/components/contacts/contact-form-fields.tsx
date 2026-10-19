type FieldProps = {
  id: string;
  label: string;
  type: "text" | "tel";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
};

export function ContactFormFields({
  name,
  phoneNumber,
  onNameChange,
  onPhoneNumberChange,
  idPrefix = "contact",
}: {
  name: string;
  phoneNumber: string;
  onNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  idPrefix?: string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field
        id={`${idPrefix}-name`}
        label="Name"
        type="text"
        value={name}
        onChange={onNameChange}
        placeholder="Mom"
        required
      />

      <Field
        id={`${idPrefix}-phone`}
        label="Phone number"
        type="tel"
        value={phoneNumber}
        onChange={onPhoneNumberChange}
        placeholder="(205) 555-1234"
        required
      />
    </div>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none transition placeholder:text-subtle focus:border-ring"
      />
    </div>
  );
}
