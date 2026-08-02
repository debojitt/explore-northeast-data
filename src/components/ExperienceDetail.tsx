import { Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Contact, Experience } from "@/lib/experiences";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[190px_1fr] sm:gap-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  if (!items || items.length === 0) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <Badge key={i} variant="secondary">
          {i}
        </Badge>
      ))}
    </div>
  );
}

function Lines({ text }: { text: string | null }) {
  if (!text?.trim()) return <span className="text-muted-foreground">—</span>;
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length === 1) return <p className="whitespace-pre-wrap">{lines[0]}</p>;
  return (
    <ul className="list-disc space-y-1 pl-4">
      {lines.map((line, i) => (
        <li key={i}>{line.replace(/^[-•*]\s*/, "")}</li>
      ))}
    </ul>
  );
}

function Contacts({ title, items }: { title: string; items: Contact[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      {!items || items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Not provided</p>
      ) : (
        <ul className="space-y-2">
          {items.map((c, i) => (
            <li key={i} className="rounded-lg border border-border bg-surface/60 p-3 text-sm">
              <p className="font-medium">{c.name || "Unnamed"}</p>
              {c.phone && (
                <a
                  href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}
                  className="mt-0.5 inline-flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Phone className="size-3.5" />
                  {c.phone}
                </a>
              )}
              {c.note && <p className="mt-1 text-xs text-muted-foreground">{c.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-1 text-base font-semibold text-primary">{title}</h3>
      <Separator className="mb-1" />
      <div className="divide-y divide-border">{children}</div>
    </section>
  );
}

export function ExperienceDetail({ exp }: { exp: Experience }) {
  return (
    <div className="space-y-8">
      <Section title="Identity">
        <Row label="Name of the experience">
          <span className="font-medium">{exp.name}</span>
        </Row>
        <Row label="State">{exp.state}</Row>
        <Row label="District / Location">
          {exp.district || <span className="text-muted-foreground">—</span>}
        </Row>
        <Row label="Type of experience">
          <Chips items={exp.experience_type} />
        </Row>
        <Row label="Tags">
          <Chips items={exp.tags} />
        </Row>
      </Section>

      <Section title="Effort & timing">
        <Row label="Time taken">{exp.duration || <span className="text-muted-foreground">—</span>}</Row>
        <Row label="Difficulty level">
          {exp.difficulty || <span className="text-muted-foreground">—</span>}
        </Row>
        <Row label="Suitable age group">
          <Chips items={exp.age_group} />
        </Row>
        <Row label="Ideal season">
          <Chips items={exp.ideal_season} />
        </Row>
        <Row label="Challenges">
          <Chips items={exp.challenges} />
        </Row>
        <Row label="Challenge notes">
          <Lines text={exp.challenges_note} />
        </Row>
      </Section>

      <Section title="Logistics">
        <Row label="Transport option">
          <Chips items={exp.transport_option} />
        </Row>
        <Row label="Stay option">
          <Chips items={exp.stay_option} />
        </Row>
        <Row label="Food option">
          <Chips items={exp.food_option} />
        </Row>
      </Section>

      <section>
        <h3 className="mb-1 text-base font-semibold text-primary">Communication details</h3>
        <Separator className="mb-4" />
        <div className="grid gap-4 md:grid-cols-3">
          <Contacts title="Hotels" items={exp.hotel_contacts} />
          <Contacts title="Homestays" items={exp.homestay_contacts} />
          <Contacts title="Cabs / transport" items={exp.cab_contacts} />
        </div>
      </section>

      <Section title="Selling & operating">
        <Row label="Experience is ideal for">
          <Chips items={exp.ideal_for} />
        </Row>
        <Row label="Sales pointers">
          <Lines text={exp.sales_pointers} />
        </Row>
        <Row label="Operation pointers">
          <Lines text={exp.operation_pointers} />
        </Row>
        <Row label="Additional experiences nearby">
          <Lines text={exp.nearby_experiences} />
        </Row>
        <Row label="Internal notes">
          <Lines text={exp.notes} />
        </Row>
      </Section>

      <p className="text-xs text-muted-foreground">
        Record ID {exp.id} · added {new Date(exp.created_at).toLocaleString()} · last updated{" "}
        {new Date(exp.updated_at).toLocaleString()}
      </p>
    </div>
  );
}
