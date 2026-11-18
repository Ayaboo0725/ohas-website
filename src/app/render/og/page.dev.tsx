/**
 * DEV-ONLY asset tool: the 1200×630 social share card, captured to
 * public/og.png by `npm run render:assets`.
 */
export default function RenderOg() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: 1200,
        height: 630,
        overflow: "hidden",
        background:
          "radial-gradient(60% 70% at 50% 55%, rgba(255,222,160,.65), transparent 70%), radial-gradient(80% 60% at 15% 0%, #fff4df, transparent 60%), #fbf7f0",
      }}
    >
      <style>{`body::after{display:none!important}`}</style>
      <div
        className="font-display"
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 360,
          lineHeight: 0.78,
          letterSpacing: "-0.045em",
          color: "#2a1a12",
        }}
      >
        OHAS
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/croissant-still.webp"
        alt=""
        style={{ position: "absolute", left: "50%", top: 330, width: 1500, transform: "translate(-50%, -50%)" }}
      />
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          color: "#2a1a12",
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "#8f511c" }}>
            Beach Road &amp; Orchid Street · Garapan, Saipan
          </div>
          <div className="font-display" style={{ fontSize: 46, marginTop: 8 }}>
            Boulangerie &amp; Café
          </div>
        </div>
        <div className="font-display" style={{ fontSize: 40, fontStyle: "italic", color: "#8f511c" }}>
          French, Fresh, Fit.
        </div>
      </div>
    </div>
  );
}
