"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";

import {
  AppStore,
  makeStore,
} from "@/lib/store";

import {
  hydrateDraft,
} from "@/lib/features/postDraft/postDraftSlice";

const DRAFT_STORAGE_KEY =
  "social-manager-post-draft";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const store = storeRef.current!;

    // Restore draft
    const savedDraft =
      localStorage.getItem(
        DRAFT_STORAGE_KEY
      );

    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(
          savedDraft
        );

        store.dispatch(
          hydrateDraft(parsedDraft)
        );
      } catch (error) {
        console.error(
          "Failed to restore post draft:",
          error
        );

        localStorage.removeItem(
          DRAFT_STORAGE_KEY
        );
      }
    }

    // Persist future changes
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();

      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify(state.postDraft)
      );
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
}
