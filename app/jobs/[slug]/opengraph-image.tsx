import { ImageResponse } from "next/og";
import { readAdamJobBySlug } from "../../../lib/adam-db";
import rubikDataUrl from "../../assets/rubik-bold.ttf?inline";

export const alt = "משרה פתוחה ב־Extreme Group";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function decodeFont(dataUrl: string) {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0)).buffer;
}

const rubik = decodeFont(rubikDataUrl);

function titleSize(title: string) {
  if (title.length > 62) return 50;
  if (title.length > 42) return 58;
  return 68;
}

function titleLines(title: string) {
  const words = title.trim().split(/\s+/);
  const maxLength = title.length > 62 ? 30 : title.length > 42 ? 26 : 32;
  const lines: string[][] = [];
  let line: string[] = [];

  for (const word of words) {
    const nextLength = [...line, word].join(" ").length;
    if (line.length > 0 && nextLength > maxLength) {
      lines.push(line);
      line = [word];
    } else {
      line.push(word);
    }
  }
  if (line.length) lines.push(line);
  return lines.slice(0, 3);
}

function titleRuns(words: string[]) {
  const runs: Array<{ direction: "ltr" | "rtl"; text: string }> = [];
  for (const word of words) {
    const direction = /[A-Za-z0-9]/.test(word) && !/[\u0590-\u05ff]/.test(word) ? "ltr" : "rtl";
    const previous = runs.at(-1);
    if (direction === "ltr" && previous?.direction === "ltr") previous.text += ` ${word}`;
    else runs.push({ direction, text: word });
  }
  return runs;
}

export default async function JobOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await readAdamJobBySlug(slug);

  const title = job?.title || "הזדמנות חדשה ב־Extreme";
  const hasHebrewTitle = /[\u0590-\u05ff]/.test(title);
  const previewTitleLines = hasHebrewTitle ? titleLines(title) : [];
  const location = job?.location || job?.areas.join(" · ") || "ישראל";
  const profession = job?.profession || "משרה פתוחה";
  const scope = job?.jobScope || "הזדמנות מקצועית";
  const jobNumber = job ? `#${job.id}` : "EXTREME CAREERS";

  const image = new ImageResponse(
    <div
      dir="rtl"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f4f2ec",
        color: "#111c2d",
        fontFamily: "Rubik",
        padding: "58px 64px 52px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: "0 0 auto auto", width: 18, height: 630, background: "#d6ff42", display: "flex" }} />
      <div style={{ position: "absolute", left: -110, bottom: -165, width: 410, height: 410, border: "52px solid #ef623f", borderRadius: 999, display: "flex", opacity: 0.96 }} />
      <div style={{ position: "absolute", left: 64, top: 108, width: 350, height: 1, background: "#c9c6bd", display: "flex" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", direction: "ltr" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, background: "#111c2d", color: "#d6ff42", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800 }}>X</div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -1 }}>EXTREME</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 4.5, marginTop: 7 }}>GROUP</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 700, letterSpacing: 1.5 }}>
          <span style={{ width: 9, height: 9, borderRadius: 99, background: "#ef623f", display: "flex" }} />
          OPEN POSITION
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", alignSelf: "flex-end", width: 1000, marginRight: 6, marginTop: 18 }}>
        <div style={{ display: "flex", color: "#ef623f", fontSize: 18, fontWeight: 750, marginBottom: 18 }}>{profession}</div>
        {hasHebrewTitle ? <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", width: "100%", gap: 2 }}>
          {previewTitleLines.map((line, lineIndex) => <div key={`${line.join("-")}-${lineIndex}`} style={{ display: "flex", flexDirection: "row-reverse", justifyContent: "flex-start", alignItems: "baseline", width: "100%", gap: 14, direction: "ltr", fontSize: titleSize(title), lineHeight: 1.04, letterSpacing: -1.8, fontWeight: 800 }}>
            {titleRuns(line).map((run, runIndex) => <span key={`${run.text}-${runIndex}`} dir={run.direction} style={{ display: "flex", direction: run.direction, whiteSpace: "nowrap" }}>{run.text}</span>)}
          </div>)}
        </div> : <div
            style={{
              display: "flex",
              width: "100%",
              fontSize: titleSize(title),
              lineHeight: 1.08,
              letterSpacing: -2.2,
              fontWeight: 800,
              textAlign: "right",
              direction: "rtl",
            }}
          >
            {title}
          </div>}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", direction: "ltr" }}>
        <div style={{ width: 310, minHeight: 82, padding: "14px 20px", background: "#111c2d", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", color: "#f4f2ec" }}>
          <div style={{ display: "flex", fontSize: 14, fontWeight: 700, letterSpacing: 1.2 }}>JOB {jobNumber}</div>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 800, marginTop: 7 }}>extreme.co.il</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", direction: "rtl" }}>
          {[location, scope].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", minHeight: 46, padding: "0 18px", border: "1px solid #b9b7b0", background: "rgba(244,242,236,.9)", fontSize: 18, fontWeight: 650 }}>{item}</div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Rubik", data: rubik, style: "normal", weight: 800 },
      ],
    },
  );

  const body = await image.arrayBuffer();
  return new Response(body, { headers: image.headers });
}
