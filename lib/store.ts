import { configureStore } from "@reduxjs/toolkit";

import postDraftReducer from "@/lib/features/postDraft/postDraftSlice";
import composerUiReducer from "@/lib/features/composerUi/composerUiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      postDraft: postDraftReducer,
      composerUi: composerUiReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];