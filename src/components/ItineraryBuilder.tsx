import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Download,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Experience } from "@/lib/experiences";
import { newDay, type ItineraryData, type ItineraryDay } from "@/lib/itinerary";

type Props = {
  experiences: Experience[];
  onClose: () => void;
};

export function ItineraryBuilder({ experiences, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [travelDates, setTravelDates] = useState("");
  const [companyName, setCompanyName] = useState("JorhatStays");
  const [days, setDays] = useState<ItineraryDay[]>([newDay(0)]);
  const [activeDay, setActiveDay] = useState(0);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return experiences;
    return experiences.filter((e) =>
      [e.name, e.state, e.district ?? "", (e.experience_type ?? []).join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [experiences, search]);

  const totalItems = days.reduce((n, d) => n + d.items.length, 0);

  const addToDay = (exp: Experience) => {
    setDays((prev) =>
      prev.map((d, i) => (i === activeDay ? { ...d, items: [...d.items, exp] } : d)),
    );
    toast.success(`Added to Day ${activeDay + 1}`);
  };

  const move = (dayIndex: number, itemIndex: number, dir: -1 | 1) => {
    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== dayIndex) return d;
        const items = [...d.items];
        const target = itemIndex + dir;
        if (target < 0 || target >= items.length) return d;
        const a = items[itemIndex]!;
        items[itemIndex] = items[target]!;
        items[target] = a;
        return { ...d, items };
      }),
    );
  };

  const removeItem = (dayIndex: number, itemIndex: number) =>
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIndex ? { ...d, items: d.items.filter((_, j) => j !== itemIndex) } : d,
      ),
    );

  const removeDay = (dayIndex: number) => {
    setDays((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== dayIndex)));
    setActiveDay((a) => Math.max(0, Math.min(a, days.length - 2)));
  };

  const download = async () => {
    if (totalItems === 0) {
      toast.error("Add at least one experience to a day first.");
      return;
    }
    setBusy(true);
    try {
      const [{ pdf }, { ItineraryPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/ItineraryPDF"),
      ]);
      const data: ItineraryData = { title, clientName, travelDates, companyName, days };
      const blob = await pdf(<ItineraryPDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(title.trim() || "itinerary").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Itinerary PDF downloaded");
    } catch (e) {
      toast.error((e as Error).message || "Could not build the PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold leading-tight">Build custom itinerary</h2>
            <p className="text-xs text-muted-foreground">
              {days.length} {days.length === 1 ? "day" : "days"} · {totalItems} experiences
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={download} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            Download itinerary PDF
          </Button>
          <Button variant="ghost" size="icon" aria-label="Close builder" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[380px_1fr]">
        {/* Experience bank */}
        <aside className="flex min-h-0 flex-col border-b border-border bg-surface/50 lg:border-b-0 lg:border-r">
          <div className="space-y-2 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Experience bank
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search experiences..."
                value={search}
                maxLength={100}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Adding to <span className="font-medium text-foreground">Day {activeDay + 1}</span>
            </p>
          </div>
          <ScrollArea className="min-h-0 flex-1 px-4 pb-4">
            <div className="space-y-2">
              {filtered.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-start justify-between gap-2 rounded-lg border border-border bg-card p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{exp.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {[exp.district, exp.state].filter(Boolean).join(", ")}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {(exp.experience_type ?? []).slice(0, 2).map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label={`Add ${exp.name} to day ${activeDay + 1}`}
                    onClick={() => addToDay(exp)}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  No experiences match that search.
                </p>
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* Builder canvas */}
        <ScrollArea className="min-h-0">
          <div className="mx-auto max-w-3xl space-y-5 p-5">
            <div className="panel grid gap-3 p-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="it-title">Itinerary title</Label>
                <Input
                  id="it-title"
                  placeholder="7 Days in Meghalaya"
                  value={title}
                  maxLength={90}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="it-client">Client name</Label>
                <Input
                  id="it-client"
                  placeholder="Mr. & Mrs. Sharma"
                  value={clientName}
                  maxLength={80}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="it-dates">Travel dates</Label>
                <Input
                  id="it-dates"
                  placeholder="12 – 18 November 2026"
                  value={travelDates}
                  maxLength={60}
                  onChange={(e) => setTravelDates(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="it-company">Brand name on the PDF</Label>
                <Input
                  id="it-company"
                  value={companyName}
                  maxLength={40}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>

            {days.map((day, dayIndex) => (
              <div
                key={day.id}
                className={`panel p-4 ${activeDay === dayIndex ? "ring-2 ring-primary" : ""}`}
                onClick={() => setActiveDay(dayIndex)}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge>Day {dayIndex + 1}</Badge>
                  <Input
                    className="h-9 flex-1 min-w-40"
                    placeholder="Day title — e.g. Arrival & local exploration"
                    value={day.title}
                    maxLength={80}
                    onChange={(e) =>
                      setDays((prev) =>
                        prev.map((d, i) => (i === dayIndex ? { ...d, title: e.target.value } : d)),
                      )
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove day ${dayIndex + 1}`}
                    disabled={days.length === 1}
                    onClick={() => removeDay(dayIndex)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>

                {day.items.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                    Select this day, then tap “+” on an experience to add it here.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {day.items.map((exp, itemIndex) => (
                      <div
                        key={`${exp.id}-${itemIndex}`}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{exp.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {[exp.district, exp.state].filter(Boolean).join(", ")}
                            {exp.duration ? ` · ${exp.duration}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Move up"
                            onClick={() => move(dayIndex, itemIndex, -1)}
                          >
                            <ArrowUp className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Move down"
                            onClick={() => move(dayIndex, itemIndex, 1)}
                          >
                            <ArrowDown className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Remove from day"
                            onClick={() => removeItem(dayIndex, itemIndex)}
                          >
                            <X className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setDays((prev) => [...prev, newDay(prev.length)]);
                setActiveDay(days.length);
              }}
            >
              <Plus className="size-4" /> Add day {days.length + 1}
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
