import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { ItineraryData } from "@/lib/itinerary";

const FOREST = "#1f4d3a";
const AMBER = "#c87a2c";
const INK = "#22312a";
const MUTED = "#6b7c73";
const LINE = "#dfe5e0";
const SHADE = "#f4f2ea";

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontSize: 10,
    color: INK,
    fontFamily: "Helvetica",
  },
  coverPage: { padding: 0, color: INK, fontFamily: "Helvetica" },
  hero: {
    height: 300,
    backgroundColor: FOREST,
    paddingHorizontal: 48,
    paddingTop: 54,
    justifyContent: "space-between",
  },
  logoBox: {
    borderWidth: 1,
    borderColor: "#ffffff",
    borderStyle: "solid",
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  logoText: {
    color: "#ffffff",
    fontSize: 12,
    letterSpacing: 3,
    fontFamily: "Helvetica-Bold",
  },
  heroRule: { height: 4, width: 90, backgroundColor: AMBER, marginBottom: 28 },
  heroKicker: {
    color: "#e6d9bf",
    fontSize: 9,
    letterSpacing: 4,
    marginBottom: 10,
  },
  coverBody: { paddingHorizontal: 48, paddingTop: 40 },
  coverTitle: {
    fontSize: 34,
    fontFamily: "Times-Roman",
    color: FOREST,
    lineHeight: 1.15,
    marginBottom: 18,
  },
  metaRow: { flexDirection: "row", marginTop: 20 },
  metaCell: { width: "33%" },
  metaLabel: { fontSize: 8, letterSpacing: 2, color: MUTED, marginBottom: 4 },
  metaValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: INK },
  coverFooter: {
    position: "absolute",
    bottom: 44,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: LINE,
    borderTopStyle: "solid",
    paddingTop: 12,
    fontSize: 8,
    color: MUTED,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    borderBottomStyle: "solid",
    paddingBottom: 8,
    marginBottom: 20,
  },
  headerText: { fontSize: 8, letterSpacing: 2, color: MUTED },

  dayCard: {
    borderWidth: 1,
    borderColor: LINE,
    borderStyle: "solid",
    borderRadius: 6,
    marginBottom: 16,
  },
  dayHeader: {
    backgroundColor: FOREST,
    paddingVertical: 9,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  dayNumber: {
    color: AMBER,
    fontSize: 9,
    letterSpacing: 2,
    fontFamily: "Helvetica-Bold",
    marginRight: 10,
  },
  dayTitle: { color: "#ffffff", fontSize: 12, fontFamily: "Helvetica-Bold" },
  dayBody: { padding: 14 },

  expBlock: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    borderBottomStyle: "solid",
  },
  expBlockLast: { marginBottom: 0, paddingBottom: 0 },
  expName: { fontSize: 12, fontFamily: "Helvetica-Bold", color: FOREST },
  expPlace: { fontSize: 9, color: MUTED, marginTop: 2 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 7 },
  pill: {
    backgroundColor: SHADE,
    color: INK,
    fontSize: 7.5,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 8,
    marginRight: 5,
    marginBottom: 4,
  },
  pillAccent: {
    backgroundColor: "#f6e6cf",
    color: "#7a4a12",
    fontSize: 7.5,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 8,
    marginRight: 5,
    marginBottom: 4,
  },
  logistics: {
    backgroundColor: SHADE,
    borderRadius: 5,
    padding: 9,
    marginTop: 8,
    flexDirection: "row",
  },
  logCell: { width: "33.33%", paddingRight: 8 },
  logLabel: { fontSize: 7, letterSpacing: 1.5, color: MUTED, marginBottom: 3 },
  logValue: { fontSize: 8.5, color: INK },
  note: { fontSize: 9, color: MUTED, marginTop: 7, lineHeight: 1.4 },
  emptyDay: { fontSize: 9, color: MUTED, fontStyle: "italic" },

  footer: {
    position: "absolute",
    bottom: 26,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: MUTED,
  },
});

const clip = (value: string | null | undefined, max: number) => {
  const text = (value ?? "").trim();
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};

const list = (values: string[] | null | undefined, max = 3) =>
  (values ?? []).slice(0, max).join(", ");

export function ItineraryPDF({ data }: { data: ItineraryData }) {
  const title = data.title.trim() || "Custom Journey";
  const company = data.companyName.trim() || "JorhatStays";
  const dayCount = data.days.length;
  const experienceCount = data.days.reduce((n, d) => n + d.items.length, 0);

  return (
    <Document title={title} author={company}>
      {/* Cover */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.hero}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>{company.toUpperCase()}</Text>
          </View>
          <View style={{ paddingBottom: 42 }}>
            <Text style={styles.heroKicker}>NORTHEAST INDIA · CURATED TRAVEL</Text>
            <View style={styles.heroRule} />
            <Text style={{ color: "#ffffff", fontSize: 13, fontFamily: "Times-Roman" }}>
              A journey designed around places, people and pace.
            </Text>
          </View>
        </View>

        <View style={styles.coverBody}>
          <Text style={styles.coverTitle}>{title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>PREPARED FOR</Text>
              <Text style={styles.metaValue}>{data.clientName.trim() || "Valued Guest"}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>TRAVEL DATES</Text>
              <Text style={styles.metaValue}>{data.travelDates.trim() || "To be confirmed"}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>DURATION</Text>
              <Text style={styles.metaValue}>
                {dayCount} {dayCount === 1 ? "Day" : "Days"} · {experienceCount}{" "}
                {experienceCount === 1 ? "experience" : "experiences"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.coverFooter} fixed>
          {company} · Itinerary proposal · Prepared {new Date().toLocaleDateString("en-GB")}
        </Text>
      </Page>

      {/* Day by day */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.headerText}>{company.toUpperCase()}</Text>
          <Text style={styles.headerText}>{clip(title, 60).toUpperCase()}</Text>
        </View>

        {data.days.map((day, dayIndex) => (
          <View key={day.id} style={styles.dayCard} wrap={false}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayNumber}>DAY {dayIndex + 1}</Text>
              <Text style={styles.dayTitle}>
                {day.title.trim() ||
                  (day.items[0] ? day.items[0].name : "Day at leisure")}
              </Text>
            </View>
            <View style={styles.dayBody}>
              {day.items.length === 0 && (
                <Text style={styles.emptyDay}>Free day — no scheduled experiences.</Text>
              )}
              {day.items.map((exp, i) => (
                <View
                  key={`${day.id}-${exp.id}-${i}`}
                  style={
                    i === day.items.length - 1
                      ? [styles.expBlock, styles.expBlockLast]
                      : styles.expBlock
                  }
                >
                  <Text style={styles.expName}>{exp.name}</Text>
                  <Text style={styles.expPlace}>
                    {[exp.district, exp.state].filter(Boolean).join(", ")}
                  </Text>

                  <View style={styles.pillRow}>
                    {(exp.experience_type ?? []).slice(0, 5).map((t) => (
                      <Text key={t} style={styles.pill}>
                        {t}
                      </Text>
                    ))}
                    {exp.difficulty ? (
                      <Text style={styles.pillAccent}>{exp.difficulty}</Text>
                    ) : null}
                  </View>

                  <View style={styles.logistics}>
                    <View style={styles.logCell}>
                      <Text style={styles.logLabel}>TIME NEEDED</Text>
                      <Text style={styles.logValue}>{exp.duration || "Flexible"}</Text>
                    </View>
                    <View style={styles.logCell}>
                      <Text style={styles.logLabel}>TRAVEL</Text>
                      <Text style={styles.logValue}>
                        {list(exp.transport_option) || "As per plan"}
                      </Text>
                    </View>
                    <View style={styles.logCell}>
                      <Text style={styles.logLabel}>STAY</Text>
                      <Text style={styles.logValue}>
                        {list(exp.stay_option) || "As per plan"}
                      </Text>
                    </View>
                  </View>

                  {clip(exp.notes, 320) ? (
                    <Text style={styles.note}>{clip(exp.notes, 320)}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text>{company} · Northeast India</Text>
          <Text
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}

export default ItineraryPDF;
