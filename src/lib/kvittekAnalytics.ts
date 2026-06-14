import {
  doc,
  increment,
  serverTimestamp,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase";

export type KvittekAnalyticsData = {
  landingViews: number;
  googlePlayClicks: number;
  appStoreClicks: number;
  lastLandingViewAt?: unknown;
  lastGooglePlayClickAt?: unknown;
  lastAppStoreClickAt?: unknown;
};

const analyticsRef = doc(db, "analytics", "kvittekLanding");

export async function trackKvittekLandingView() {
  try {
    await setDoc(
      analyticsRef,
      {
        landingViews: increment(1),
        lastLandingViewAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("Could not track Kvittek landing view:", error);
  }
}

export async function trackKvittekGooglePlayClick() {
  try {
    await setDoc(
      analyticsRef,
      {
        googlePlayClicks: increment(1),
        lastGooglePlayClickAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("Could not track Google Play click:", error);
  }
}

export async function trackKvittekAppStoreClick() {
  try {
    await setDoc(
      analyticsRef,
      {
        appStoreClicks: increment(1),
        lastAppStoreClickAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("Could not track App Store click:", error);
  }
}

export function listenToKvittekAnalytics(
  callback: (data: KvittekAnalyticsData) => void
): Unsubscribe {
  return onSnapshot(analyticsRef, (snapshot) => {
    const data = snapshot.data() ?? {};

    callback({
      landingViews: Number(data.landingViews ?? 0),
      googlePlayClicks: Number(data.googlePlayClicks ?? 0),
      appStoreClicks: Number(data.appStoreClicks ?? 0),
      lastLandingViewAt: data.lastLandingViewAt,
      lastGooglePlayClickAt: data.lastGooglePlayClickAt,
      lastAppStoreClickAt: data.lastAppStoreClickAt,
    });
  });
}