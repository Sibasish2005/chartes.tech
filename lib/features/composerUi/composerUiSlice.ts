import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

export type PreviewTab =
  | "EDIT"
  | "PREVIEW";

export type UploadStatus =
  | "IDLE"
  | "UPLOADING"
  | "SUCCESS"
  | "ERROR";

export interface ComposerUiState {
  previewTab: PreviewTab;
  uploadStatus: UploadStatus;
  uploadProgress: number;
  errorMessage: string;
}

const initialState: ComposerUiState = {
  previewTab: "EDIT",
  uploadStatus: "IDLE",
  uploadProgress: 0,
  errorMessage: "",
};

const composerUiSlice = createSlice({
  name: "composerUi",

  initialState,

  reducers: {
    setPreviewTab(
      state,
      action: PayloadAction<PreviewTab>
    ) {
      state.previewTab = action.payload;
    },

    setUploadStatus(
      state,
      action: PayloadAction<UploadStatus>
    ) {
      state.uploadStatus = action.payload;
    },

    setUploadProgress(
      state,
      action: PayloadAction<number>
    ) {
      state.uploadProgress = action.payload;
    },

    setErrorMessage(
      state,
      action: PayloadAction<string>
    ) {
      state.errorMessage = action.payload;
    },

    resetUploadState(state) {
      state.uploadStatus = "IDLE";
      state.uploadProgress = 0;
      state.errorMessage = "";
    },

    resetComposerUi(state) {
      state.previewTab = "EDIT";
      state.uploadStatus = "IDLE";
      state.uploadProgress = 0;
      state.errorMessage = "";
    },
  },
});

export const {
  setPreviewTab,
  setUploadStatus,
  setUploadProgress,
  setErrorMessage,
  resetUploadState,
  resetComposerUi,
} = composerUiSlice.actions;

export default composerUiSlice.reducer;