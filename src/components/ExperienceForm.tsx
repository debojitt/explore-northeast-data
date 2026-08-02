import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ContactListEditor } from "@/components/ContactListEditor";
import { MultiSelect } from "@/components/MultiSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createExperience,
  emptyExperience,
  updateExperience,
  type Experience,
  type ExperienceInput,
} from "@/lib/experiences";
import {
  AGE_GROUPS,
  CHALLENGE_OPTIONS,
  DIFFICULTIES,
  DURATIONS,
  EXPERIENCE_TYPES,
  FOOD_OPTIONS,
  IDEAL_FOR,
  SEASONS,
  STATES,
  STAY_OPTIONS,
  TRANSPORT_OPTIONS,
} from "@/lib/ne-options";

const toInput = (exp: Experience): ExperienceInput => ({
  name: exp.name,
  state: exp.state,
  district: exp.district ?? "",
  experience_type: exp.experience_type ?? [],
  duration: exp.duration ?? "",
  difficulty: exp.difficulty ?? "",
  age_group: exp.age_group ?? [],
  ideal_season: exp.ideal_season ?? [],
  challenges: exp.challenges ?? [],
  challenges_note: exp.challenges_note ?? "",
  transport_option: exp.transport_option ?? [],
  stay_option: exp.stay_option ?? [],
  food_option: exp.food_option ?? [],
  ideal_for: exp.ideal_for ?? [],
  sales_pointers: exp.sales_pointers ?? "",
  operation_pointers: exp.operation_pointers ?? "",
  nearby_experiences: exp.nearby_experiences ?? "",
  notes: exp.notes ?? "",
  tags: exp.tags ?? [],
  hotel_contacts: exp.hotel_contacts ?? [],
  homestay_contacts: exp.homestay_contacts ?? [],
  cab_contacts: exp.cab_contacts ?? [],
});

function Branch({
  index,
  title,
  subtitle,
  children,
}: {
  index: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative pl-8">
      <span className="absolute left-[13px] top-9 bottom-0 w-px bg-border" aria-hidden />
      <span className="absolute left-0 top-1 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {index}
      </span>
      <header className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </header>
      <div className="mb-8 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
        {optional && <span className="ml-1 normal-case tracking-normal">(optional)</span>}
      </Label>
      {children}
    </div>
  );
}

export function ExperienceForm({
  existing,
  onDone,
}: {
  existing?: Experience;
  onDone: () => void;
}) {
  const [form, setForm] = useState<ExperienceInput>(
    existing ? toInput(existing) : emptyExperience(),
  );
  const queryClient = useQueryClient();

  const set = <K extends keyof ExperienceInput>(key: K, value: ExperienceInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const mutation = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error("Please enter the name of the experience.");
      if (!form.state) throw new Error("Please select a state.");
      if (existing) return updateExperience(existing.id, form);
      return createExperience(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success(existing ? "Experience updated" : "Experience saved to the database");
      onDone();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <form
      className="pt-2"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <Branch index={1} title="Identity" subtitle="What and where the experience is">
        <Field label="Name of the experience">
          <Input
            value={form.name}
            maxLength={160}
            placeholder="e.g. Double Decker Living Root Bridge Trek"
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="State">
            <Select value={form.state} onValueChange={(v) => set("state", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="District / Location" optional>
            <Input
              value={form.district ?? ""}
              maxLength={120}
              placeholder="e.g. East Khasi Hills, Tyrna"
              onChange={(e) => set("district", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Type of experience">
          <MultiSelect
            options={EXPERIENCE_TYPES}
            value={form.experience_type}
            onChange={(v) => set("experience_type", v)}
            placeholder="Select one or more types"
            allowCustom
          />
        </Field>
      </Branch>

      <Branch index={2} title="Effort & timing" subtitle="How long, how hard, and when">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Time taken for the experience">
            <Select value={form.duration ?? ""} onValueChange={(v) => set("duration", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Difficulty level">
            <Select value={form.difficulty ?? ""} onValueChange={(v) => set("difficulty", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Suitable for the age group">
          <MultiSelect
            options={AGE_GROUPS}
            value={form.age_group}
            onChange={(v) => set("age_group", v)}
            placeholder="Select age groups"
          />
        </Field>
        <Field label="Ideal season">
          <MultiSelect
            options={SEASONS}
            value={form.ideal_season}
            onChange={(v) => set("ideal_season", v)}
            placeholder="Select seasons"
          />
        </Field>
        <Field label="Challenges">
          <MultiSelect
            options={CHALLENGE_OPTIONS}
            value={form.challenges}
            onChange={(v) => set("challenges", v)}
            placeholder="Select known challenges"
            allowCustom
          />
        </Field>
        <Field label="Challenge notes" optional>
          <Textarea
            rows={2}
            maxLength={1000}
            value={form.challenges_note ?? ""}
            placeholder="Anything the operations team must warn guests about"
            onChange={(e) => set("challenges_note", e.target.value)}
          />
        </Field>
      </Branch>

      <Branch index={3} title="Logistics" subtitle="Transport, stay and food on the ground">
        <Field label="Transport option">
          <MultiSelect
            options={TRANSPORT_OPTIONS}
            value={form.transport_option}
            onChange={(v) => set("transport_option", v)}
            placeholder="Select transport options"
            allowCustom
          />
        </Field>
        <Field label="Stay option">
          <MultiSelect
            options={STAY_OPTIONS}
            value={form.stay_option}
            onChange={(v) => set("stay_option", v)}
            placeholder="Select stay options"
            allowCustom
          />
        </Field>
        <Field label="Food option">
          <MultiSelect
            options={FOOD_OPTIONS}
            value={form.food_option}
            onChange={(v) => set("food_option", v)}
            placeholder="Select food options"
            allowCustom
          />
        </Field>
      </Branch>

      <Branch index={4} title="Contacts" subtitle="All optional — add whatever you have">
        <ContactListEditor
          label="Hotel contacts"
          hint="Hotel name and reception / manager number."
          value={form.hotel_contacts}
          onChange={(v) => set("hotel_contacts", v)}
        />
        <ContactListEditor
          label="Homestay contacts"
          hint="Host name and phone number."
          value={form.homestay_contacts}
          onChange={(v) => set("homestay_contacts", v)}
        />
        <ContactListEditor
          label="Cab / transport contacts"
          hint="Driver or operator name, vehicle type and number."
          value={form.cab_contacts}
          onChange={(v) => set("cab_contacts", v)}
        />
      </Branch>

      <Branch index={5} title="Selling & operating" subtitle="Everything the team needs to know">
        <Field label="Experience is ideal for">
          <MultiSelect
            options={IDEAL_FOR}
            value={form.ideal_for}
            onChange={(v) => set("ideal_for", v)}
            placeholder="Select traveller profiles"
            allowCustom
          />
        </Field>
        <Field label="Sales pointers">
          <Textarea
            rows={4}
            maxLength={3000}
            value={form.sales_pointers ?? ""}
            placeholder="One pointer per line — what makes this experience sell"
            onChange={(e) => set("sales_pointers", e.target.value)}
          />
        </Field>
        <Field label="Operation pointers">
          <Textarea
            rows={4}
            maxLength={3000}
            value={form.operation_pointers ?? ""}
            placeholder="One pointer per line — permits, timings, guide briefing, logistics"
            onChange={(e) => set("operation_pointers", e.target.value)}
          />
        </Field>
        <Field label="Additional experiences nearby">
          <Textarea
            rows={3}
            maxLength={2000}
            value={form.nearby_experiences ?? ""}
            placeholder="One per line — clubbable experiences within reach"
            onChange={(e) => set("nearby_experiences", e.target.value)}
          />
        </Field>
        <Field label="Internal notes" optional>
          <Textarea
            rows={2}
            maxLength={2000}
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
          />
        </Field>
        <Field label="Tags" optional>
          <MultiSelect
            options={[]}
            value={form.tags}
            onChange={(v) => set("tags", v)}
            placeholder="Add your own keywords"
            allowCustom
          />
        </Field>
      </Branch>

      <div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-card/95 py-4 backdrop-blur">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {existing ? "Save changes" : "Save experience"}
        </Button>
      </div>
    </form>
  );
}
