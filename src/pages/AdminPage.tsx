import React, { useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  listenToKvittekAnalytics,
  type KvittekAnalyticsData,
} from "../lib/kvittekAnalytics";

const ADMIN_EMAIL = "morningcoffeelabs@gmail.com";

const cardStyle: React.CSSProperties = {
  border: "1px solid var(--line, rgba(255,255,255,0.12))",
  borderRadius: 18,
  padding: "1rem",
  background: "var(--panel, rgba(255,255,255,0.04))",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.9rem",
  borderRadius: 10,
  border: "1px solid var(--line, rgba(255,255,255,0.12))",
  background: "var(--panel, rgba(255,255,255,0.04))",
  color: "inherit",
  font: "inherit",
};

function formatTimestamp(value: unknown): string {
  if (!value || typeof value !== "object") return "Ikke registrert ennå";

  const maybeTimestamp = value as { toDate?: () => Date };

  if (typeof maybeTimestamp.toDate !== "function") {
    return "Ikke registrert ennå";
  }

  const date = maybeTimestamp.toDate();

  return new Intl.DateTimeFormat("no-NO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function StatCard(props: {
  title: string;
  value: number | string;
  description?: string;
}) {
  return (
    <div style={cardStyle}>
      <p style={{ margin: "0 0 0.45rem", opacity: 0.72 }}>{props.title}</p>
      <strong style={{ display: "block", fontSize: "2rem", lineHeight: 1.1 }}>
        {props.value}
      </strong>
      {props.description ? (
        <p style={{ margin: "0.55rem 0 0", opacity: 0.72 }}>{props.description}</p>
      ) : null}
    </div>
  );
}

const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [analytics, setAnalytics] = useState<KvittekAnalyticsData>({
    landingViews: 0,
    googlePlayClicks: 0,
    appStoreClicks: 0,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;

    const unsubscribe = listenToKvittekAnalytics((data) => {
      setAnalytics(data);
    });

    return unsubscribe;
  }, [user]);

  const totalStoreClicks = analytics.googlePlayClicks + analytics.appStoreClicks;

  const storeClickRate = useMemo(() => {
    if (!analytics.landingViews) return "0 %";
    return `${Math.round((totalStoreClicks / analytics.landingViews) * 100)} %`;
  }, [analytics.landingViews, totalStoreClicks]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword("");
    } catch {
      setLoginError("Innlogging feilet. Sjekk e-post og passord.");
    }
  };

  if (!authChecked) {
    return (
      <main className="page">
        <section style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Admin</h1>
          <p>Laster innlogging...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page" style={{ maxWidth: 560 }}>
        <section style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Admin</h1>
          <p style={{ opacity: 0.76 }}>
            Logg inn for å se Kvittek-statistikk fra landingssiden.
          </p>

          <form onSubmit={handleLogin} style={{ display: "grid", gap: "0.9rem" }}>
            <label>
              <span style={{ display: "block", marginBottom: "0.35rem" }}>E-post</span>
              <input
                style={inputStyle}
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label>
              <span style={{ display: "block", marginBottom: "0.35rem" }}>Passord</span>
              <input
                style={inputStyle}
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {loginError ? (
              <p style={{ margin: 0, color: "#ff9f9f" }}>{loginError}</p>
            ) : null}

            <button type="submit" className="status-button">
              Logg inn
            </button>
          </form>
        </section>
      </main>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <main className="page">
        <section style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Ingen tilgang</h1>
          <p>Denne brukeren har ikke tilgang til adminpanelet.</p>
          <button type="button" className="status-button" onClick={() => signOut(auth)}>
            Logg ut
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page" style={{ maxWidth: 1100 }}>
      <section style={{ ...cardStyle, marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>Kvittek Analytics</h1>
            <p style={{ margin: "0.4rem 0 0", opacity: 0.72 }}>
              Enkel telling av QR-/landingsside og butikk-klikk.
            </p>
          </div>

          <button type="button" className="status-button" onClick={() => signOut(auth)}>
            Logg ut
          </button>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <StatCard
          title="Landingsside åpnet"
          value={analytics.landingViews}
          description="Antall registrerte åpninger av /receipts."
        />
        <StatCard
          title="Google Play-klikk"
          value={analytics.googlePlayClicks}
          description="Antall klikk på Google Play-knappen."
        />
        <StatCard
          title="App Store-klikk"
          value={analytics.appStoreClicks}
          description="Antall klikk på App Store-knappen."
        />
        <StatCard
          title="Videre til butikk"
          value={storeClickRate}
          description={`${totalStoreClicks} butikk-klikk totalt.`}
        />
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Siste registreringer</h2>

        <div style={{ display: "grid", gap: "0.65rem" }}>
          <p style={{ margin: 0 }}>
            <strong>Siste landingsside-visning:</strong>{" "}
            {formatTimestamp(analytics.lastLandingViewAt)}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Siste Google Play-klikk:</strong>{" "}
            {formatTimestamp(analytics.lastGooglePlayClickAt)}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Siste App Store-klikk:</strong>{" "}
            {formatTimestamp(analytics.lastAppStoreClickAt)}
          </p>
        </div>
      </section>
    </main>
  );
};

export default AdminPage;