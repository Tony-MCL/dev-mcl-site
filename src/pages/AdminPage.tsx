import React, { useState } from "react";

type View =
  | "info"
  | "stats"
  | "settings"
  | "create"
  | "pages"
  | "pageEditor";

const AdminPage: React.FC = () => {
  const [view, setView] = useState<View>("info");
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const pages = [
    "Forside",
    "Om",
    "Tjenester",
    "Kontakt",
    "Kjøpsvilkår",
    "Brukervilkår",
    "Personvern",
    "Refusjon",
    "husk'et",
    "Kvitteringsapp",
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: 260,
          background: "#111",
          color: "#fff",
          padding: "1.5rem",
        }}
      >
        <h2 style={{ marginBottom: "2rem" }}>Admin</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <button onClick={() => setView("info")}>Informasjon</button>
          <button onClick={() => setView("stats")}>Statistikk</button>
          <button onClick={() => setView("settings")}>
            Globale innstillinger
          </button>
          <button onClick={() => setView("create")}>Opprett ny side</button>

          <div style={{ marginTop: "2rem" }}>
            <strong>Sider</strong>
            <div style={{ marginTop: "0.5rem" }}>
              {pages.map((p) => (
                <div
                  key={p}
                  style={{
                    cursor: "pointer",
                    padding: "0.3rem 0",
                    opacity: 0.8,
                  }}
                  onClick={() => {
                    setSelectedPage(p);
                    setView("pageEditor");
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "2rem" }}>
        {view === "info" && (
          <>
            <h1>Adminpanel</h1>
            <p>
              Dette er kontrollpanelet for Morning Coffee Labs. Her kan du
              administrere innhold, produkter og struktur på siden.
            </p>

            <ul>
              <li>Redigere eksisterende sider</li>
              <li>Opprette nye produkter</li>
              <li>Endre tekst og innhold</li>
              <li>Se status og oversikt</li>
            </ul>

            <p>
              Endringer lagres lokalt foreløpig. Firebase og synkronisering kommer
              senere.
            </p>
          </>
        )}

        {view === "stats" && (
          <>
            <h1>Statistikk</h1>
            <p>(Kommer senere)</p>
            <ul>
              <li>Antall sider: {pages.length}</li>
              <li>Antall produkter: 2</li>
              <li>Egendefinerte produkter: 0</li>
            </ul>
          </>
        )}

        {view === "settings" && (
          <>
            <h1>Globale innstillinger</h1>
            <p>(Kommer senere)</p>
          </>
        )}

        {view === "create" && (
          <>
            <h1>Opprett ny side</h1>
            <p>Her skal vi senere lage nye produkter og sider.</p>
          </>
        )}

        {view === "pages" && (
          <>
            <h1>Sider</h1>
            <p>Velg en side fra menyen til venstre.</p>
          </>
        )}

        {view === "pageEditor" && selectedPage && (
          <>
            <h1>Rediger: {selectedPage}</h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 600 }}>
              <input placeholder="Tittel" />
              <textarea placeholder="Innhold" rows={6} />
              <button>Lagre</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
