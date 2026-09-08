import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Compass,
  Download,
  FileJson,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Sheet as SheetIcon,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ExperienceDetail } from "@/components/ExperienceDetail";
import { ExperienceForm } from "@/components/ExperienceForm";
import { ItineraryBuilder } from "@/components/ItineraryBuilder";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteExperience,
  downloadFile,
  listExperiences,
  toCsv,
  type Experience,
} from "@/lib/experiences";
import { DIFFICULTIES, EXPERIENCE_TYPES, SEASONS, STATES } from "@/lib/ne-options";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Northeast India Experience Database | Travel Data Inserter" },
      {
        name: "description",
        content:
          "Add, organise and export structured travel experience records for all eight Northeast India states — logistics, contacts, sales and operation pointers in one dashboard.",
      },
      { property: "og:title", content: "Northeast India Experience Database | Travel Data Inserter" },
      {
        property: "og:description",
        content:
          "Add, organise and export structured travel experience records for all eight Northeast India states — logistics, contacts, sales and operation pointers in one dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const ALL = "__all__";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="panel px-4 py-3">
      <p className="text-2xl font-semibold text-primary">{value}</p>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function Dashboard() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["experiences"],
    queryFn: listExperiences,
  });

  const [search, setSearch] = useState("");
  const [state, setState] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [season, setSeason] = useState(ALL);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | undefined>();
  const [pendingDelete, setPendingDelete] = useState<Experience | undefined>();
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);

  const removal = useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Experience deleted");
      setPendingDelete(undefined);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = data ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (state !== ALL && r.state !== state) return false;
      if (type !== ALL && !(r.experience_type ?? []).includes(type)) return false;
      if (difficulty !== ALL && r.difficulty !== difficulty) return false;
      if (season !== ALL && !(r.ideal_season ?? []).includes(season)) return false;
      if (!q) return true;
      return JSON.stringify(r).toLowerCase().includes(q);
    });
  }, [rows, search, state, type, difficulty, season]);

  const stateCount = new Set(rows.map((r) => r.state)).size;
  const contactCount = rows.reduce(
    (sum, r) =>
      sum +
      (r.hotel_contacts?.length ?? 0) +
      (r.homestay_contacts?.length ?? 0) +
      (r.cab_contacts?.length ?? 0),
    0,
  );

  const stamp = new Date().toISOString().slice(0, 10);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-highlight">
            <Compass className="size-4" /> Northeast India
          </p>
          <h1 className="mt-2 text-4xl font-bold">Experience Database</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            One structured record per experience — identity, effort, logistics, contacts and
            selling points. Everything is saved to the cloud and exportable for your website.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="lg" variant="outline" onClick={() => setBuilderOpen(true)}>
            <CalendarDays className="size-4" /> Build itinerary
          </Button>
          <Button
            size="lg"
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" /> Add experience
          </Button>
        </div>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Experiences" value={rows.length} />
        <Stat label="States covered" value={`${stateCount}/8`} />
        <Stat label="Contacts stored" value={contactCount} />
        <Stat label="Showing" value={filtered.length} />
      </div>

      <div className="panel mb-6 space-y-3 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search across every field — name, contact, pointer, tag..."
            value={search}
            maxLength={120}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Select value={state} onValueChange={setState}>
            <SelectTrigger>
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All states</SelectItem>
              {STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All types</SelectItem>
              {EXPERIENCE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All difficulty</SelectItem>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger>
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All seasons</SelectItem>
              {SEASONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                downloadFile(
                  `northeast-experiences-${stamp}.json`,
                  JSON.stringify(filtered, null, 2),
                  "application/json",
                )
              }
            >
              <FileJson className="size-4" /> JSON
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                downloadFile(
                  `northeast-experiences-${stamp}.csv`,
                  toCsv(filtered),
                  "text/csv;charset=utf-8",
                )
              }
            >
              <SheetIcon className="size-4" /> CSV
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 p-8 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading database...
        </div>
      )}

      {error && (
        <p className="panel p-6 text-sm text-destructive">
          Could not load the database: {(error as Error).message}
        </p>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="panel p-10 text-center">
          <Download className="mx-auto size-8 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold">No experiences yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first Northeast India experience to start building the database.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((exp) => (
          <Collapsible
            key={exp.id}
            open={openRow === exp.id}
            onOpenChange={(o) => setOpenRow(o ? exp.id : null)}
            className="panel overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <CollapsibleTrigger className="flex-1 text-left">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {exp.state}
                  {exp.district ? ` · ${exp.district}` : ""}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{exp.name}</h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(exp.experience_type ?? []).slice(0, 4).map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                  {exp.duration && <Badge variant="outline">{exp.duration}</Badge>}
                  {exp.difficulty && <Badge variant="outline">{exp.difficulty}</Badge>}
                </div>
              </CollapsibleTrigger>
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm">
                    {openRow === exp.id ? "Hide details" : "View details"}
                  </Button>
                </CollapsibleTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit experience"
                  onClick={() => {
                    setEditing(exp);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete experience"
                  onClick={() => setPendingDelete(exp)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
            <CollapsibleContent>
              <div className="border-t border-border bg-surface/50 p-6">
                <ExperienceDetail exp={exp} />
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit experience" : "Add a new experience"}</DialogTitle>
          </DialogHeader>
          <ExperienceForm
            key={editing?.id ?? "new"}
            existing={editing}
            onDone={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(o) => !o && setPendingDelete(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this experience?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{pendingDelete?.name}&rdquo; will be permanently removed from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && removal.mutate(pendingDelete.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
