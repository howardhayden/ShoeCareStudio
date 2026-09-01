"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import { ShoeCareStudio } from "./components/care/ShoeCareStudio";
import {
  createInitialCareState,
  type CareEvent,
} from "./domain/footwear-care";
import {
  careStoreReducer,
  createCareStore,
} from "./domain/footwear-care-store";

export default function Home() {
  const [motionReductionRequired, setMotionReductionRequired] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [careStore, dispatchCareStore] = useReducer(
    careStoreReducer,
    undefined,
    () => createCareStore(createInitialCareState("shoe-care:0")),
  );

  const dispatchCareEvent = useCallback(
    (event: CareEvent) => dispatchCareStore({ kind: "event", event }),
    [],
  );
  const dispatchRendererContactLoss = useCallback(
    () => dispatchCareStore({ kind: "contact-loss-at-release" }),
    [],
  );
  const dispatchCancelAtReleasedBoundary = useCallback(
    () => dispatchCareStore({ kind: "cancel-at-release" }),
    [],
  );

  useEffect(() => {
    const updateVisibility = () => {
      const hidden = document.visibilityState !== "visible";
      setPageHidden(hidden);
      if (hidden) dispatchCareStore({ kind: "pause-at-release" });
    };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setMotionReductionRequired(media.matches);
      if (media.matches) dispatchCareStore({ kind: "reduce-at-release" });
    };
    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);
    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  const transitionTrace = careStore.transitionTrace.length
    ? careStore.transitionTrace
        .map(
          (entry) =>
            `${entry.revision}:${entry.contact}:${entry.status}:${entry.presentedMotion}`,
        )
        .join(">")
    : "none";

  return (
    <div
      className="cadence-app"
      data-care-view="true"
      data-care-transition-trace={transitionTrace}
      data-low-vision="false"
      data-page-hidden={pageHidden}
      data-reduced-motion={motionReductionRequired}
      data-solid-surfaces="true"
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <main id="main-content" className="app-main" tabIndex={-1}>
        <ShoeCareStudio
          state={careStore.state}
          rejection={careStore.rejection}
          onEvent={dispatchCareEvent}
          onRendererContactLoss={dispatchRendererContactLoss}
          onCancelAtReleasedBoundary={dispatchCancelAtReleasedBoundary}
          motionReductionRequired={motionReductionRequired}
        />
      </main>
    </div>
  );
}
