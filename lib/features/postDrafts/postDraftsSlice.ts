import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Platform =
  | "INSTAGRAM"
  | "FACEBOOK"
  | "LINKEDIN";

export interface PostDraftState {
  imageUrl: string;
  caption: string;
  platforms: Platform[];
}

const initialState: PostDraftState = {
  imageUrl: "",
  caption: "",
  platforms: [],
};

const postDraftSlice = createSlice({
  name: "postDraft",

  initialState,

  reducers: {
    setImageUrl(
      state,
      action: PayloadAction<string>
    ) {
      state.imageUrl = action.payload;
    },

    setCaption(
      state,
      action: PayloadAction<string>
    ) {
      state.caption = action.payload;
    },

    togglePlatform(
      state,
      action: PayloadAction<Platform>
    ) {
      const platform = action.payload;

      if (state.platforms.includes(platform)) {
        state.platforms = state.platforms.filter(
          (item) => item !== platform
        );
      } else {
        state.platforms.push(platform);
      }
    },

    setPlatforms(
      state,
      action: PayloadAction<Platform[]>
    ) {
      state.platforms = action.payload;
    },

    hydrateDraft(
      state,
      action: PayloadAction<PostDraftState>
    ) {
      state.imageUrl = action.payload.imageUrl;
      state.caption = action.payload.caption;
      state.platforms = action.payload.platforms;
    },

    clearDraft(state) {
      state.imageUrl = "";
      state.caption = "";
      state.platforms = [];
    },
  },
});

export const {
  setImageUrl,
  setCaption,
  togglePlatform,
  setPlatforms,
  hydrateDraft,
  clearDraft,
} = postDraftSlice.actions;

export default postDraftSlice.reducer;