import { supabase } from "@/integrations/supabase/client";

export type Contact = {
  name: string;
  phone: string;
  note: string;
};

export type Experience = {
  id: string;
  name: string;
  state: string;
  district: string | null;
  experience_type: string[];
  duration: string | null;
  difficulty: string | null;
  age_group: string[];
  ideal_season: string[];
  challenges: string[];
  challenges_note: string | null;
  transport_option: string[];
  stay_option: string[];
  food_option: string[];
  ideal_for: string[];
  sales_pointers: string | null;
  operation_pointers: string | null;
  nearby_experiences: string | null;
  notes: string | null;
  tags: string[];
  hotel_contacts: Contact[];
  homestay_contacts: Contact[];
  cab_contacts: Contact[];
  created_at: string;
  updated_at: string;
};

export type ExperienceInput = Omit<Experience, "id" | "created_at" | "updated_at">;

export const emptyExperience = (): ExperienceInput => ({
  name: "",
  state: "",
  district: "",
  experience_type: [],
  duration: "",
  difficulty: "",
  age_group: [],
  ideal_season: [],
  challenges: [],
  challenges_note: "",
  transport_option: [],
  stay_option: [],
  food_option: [],
  ideal_for: [],
  sales_pointers: "",
  operation_pointers: "",
  nearby_experiences: "",
  notes: "",
  tags: [],
  hotel_contacts: [],
  homestay_contacts: [],
  cab_contacts: [],
});

const table = () => supabase.from("experiences" as never);

export async function listExperiences(): Promise<Experience[]> {
  const { data, error } = await table().select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Experience[];
}

const cleanContacts = (contacts: Contact[]) =>
  contacts.filter((c) => c.name.trim() || c.phone.trim() || c.note.trim());

const serialize = (input: ExperienceInput) => ({
  ...input,
  name: input.name.trim(),
  district: input.district?.trim() || null,
  hotel_contacts: cleanContacts(input.hotel_contacts),
  homestay_contacts: cleanContacts(input.homestay_contacts),
  cab_contacts: cleanContacts(input.cab_contacts),
});

export async function createExperience(input: ExperienceInput) {
  const { error } = await table().insert(serialize(input) as never);
  if (error) throw new Error(error.message);
}

export async function updateExperience(id: string, input: ExperienceInput) {
  const { error } = await table()
    .update(serialize(input) as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteExperience(id: string) {
  const { error } = await table().delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ---------- Export helpers ---------- */

const EXPORT_COLUMNS: (keyof Experience)[] = [
  "id",
  "name",
  "state",
  "district",
  "experience_type",
  "duration",
  "difficulty",
  "age_group",
  "ideal_season",
  "challenges",
  "challenges_note",
  "transport_option",
  "stay_option",
  "food_option",
  "ideal_for",
  "sales_pointers",
  "operation_pointers",
  "nearby_experiences",
  "notes",
  "tags",
  "hotel_contacts",
  "homestay_contacts",
  "cab_contacts",
  "created_at",
  "updated_at",
];

const csvCell = (value: unknown): string => {
  let out: string;
  if (value == null) out = "";
  else if (Array.isArray(value))
    out = value
      .map((v) =>
        typeof v === "object" && v !== null
          ? [
              (v as Contact).name,
              (v as Contact).phone,
              (v as Contact).note,
            ]
              .filter(Boolean)
              .join(" - ")
          : String(v),
      )
      .join(" | ");
  else out = String(value);
  return `"${out.replace(/"/g, '""')}"`;
};

export function toCsv(rows: Experience[]): string {
  const header = EXPORT_COLUMNS.join(",");
  const body = rows.map((row) => EXPORT_COLUMNS.map((c) => csvCell(row[c])).join(","));
  return [header, ...body].join("\n");
}

export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
