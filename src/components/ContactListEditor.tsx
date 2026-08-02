import { Phone, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Contact } from "@/lib/experiences";

type Props = {
  label: string;
  hint: string;
  value: Contact[];
  onChange: (value: Contact[]) => void;
};

export function ContactListEditor({ label, hint, value, onChange }: Props) {
  const update = (index: number, patch: Partial<Contact>) => {
    onChange(value.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  return (
    <div className="rounded-lg border border-dashed border-border bg-surface/60 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium">
            <Phone className="size-4 text-primary" />
            {label}
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-normal text-muted-foreground">
              optional
            </span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onChange([...value, { name: "", phone: "", note: "" }])}
        >
          <Plus className="size-4" /> Add
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-muted-foreground">No contacts added yet.</p>
      ) : (
        <div className="space-y-2">
          {value.map((contact, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1.2fr_1fr_1.2fr_auto]">
              <Input
                placeholder="Name"
                value={contact.name}
                onChange={(e) => update(index, { name: e.target.value })}
              />
              <Input
                placeholder="Phone number"
                inputMode="tel"
                maxLength={30}
                value={contact.phone}
                onChange={(e) => update(index, { phone: e.target.value })}
              />
              <Input
                placeholder="Note (rooms, rate, location)"
                maxLength={200}
                value={contact.note}
                onChange={(e) => update(index, { note: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove contact"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
