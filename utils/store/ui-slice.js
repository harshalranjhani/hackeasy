import { createSlice } from "@reduxjs/toolkit";
import ReactGA from "react-ga4";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isModalOpen: false,
    isSidebarOpen: false,
    isTextProcessing: false,
    isStreamProcessing: false,
    isSignUp: false,
    isFPModalOpen: false,
    isUpgradePlanModalOpen: false,
    isUserExperienceModalOpen: false,
    isCancellationModalOpen: false,
    isCancellationConfirmationModalOpen: false,
    isWelcomeScreenModalOpen: false,
    isAddTokensModalOpen: false,
    isNotificationPermissionModalOpen: false,
    isLoading: false,
    isTooltipOpen: false,
    isArrangementViewOpen: true,
    isPasteWarningErrorModalOpen: false,
    isArrangementViewFullScreen: false,
    selectedEmptyState: -1,
    currentlyPlayingAudio: null,
    isDeleteProjectModalOpen: false,
    toolTipPrompt: null,
    recordingCountDown: null,
    isRecordingUploading: false,
    downloadingColumn: null,
    currentlyActiveAudioThread: null,
    isArViewStemProcessing: false,
    isChatInputFileUploading: false,
    isArrangementViewBeingExported: false,
    currentlyEditingSidebarProject: null,
    currentlyProcessingOutputButtonAudioId: null,
    exportArrangerLoaderText: null,
    isNewCollectionModalOpen: false,
    audioIdToBeAddedToCollection: null,
    shareCollectionModalData: null,
    isEditCollectionModalOpen: false,
    isDeleteCollectionModalOpen: false,
    isSavedAudioModalOpen: false,
    shareAudioModalData: null,
    isSharedProjectBeingViewed: false,
    shareProjectModalData: null,
    isAddToArrangementModalOpen: null,
    deleteArViewCellData: null,
    deleteArViewSectionData: null,
    tempoChangeModalData: null,
    landingPageSelectedTab: 0,
    isExtendedChatUIOpen: false,
  },
  reducers: {
    setIsDeleteProjectModalOpen(state, action) {
      const newState = {
        ...state,
        isDeleteProjectModalOpen: action.payload.value,
      };
      return newState;
    },
    setDownloadingColumn(state, action) {
      const newState = {
        ...state,
        downloadingColumn: action.payload.data,
      };
      return newState;
    },
    setIsRecordingUploading(state, action) {
      const newState = {
        ...state,
        isRecordingUploading: action.payload.value,
      };
      return newState;
    },
    setToolTipPrompt(state, action) {
      const newState = {
        ...state,
        toolTipPrompt: action.payload.prompt,
      };
      return newState;
    },
    toggleTooltip(state, action) {
      if (action.payload.value) {
        state.isTooltipOpen = action.payload.value;
        return state;
      }
      const newState = {
        ...state,
        isTooltipOpen: !state.isTooltipOpen,
      };
      return newState;
    },
    setRecordingCountDown(state, action) {
      const newState = {
        ...state,
        recordingCountDown: action.payload.value,
      };
      return newState;
    },
    toggleLoading(state, _action) {
      // console.log("setting loading");
      const newState = {
        ...state,
        isLoading: !state.isLoading,
      };
      return newState;
    },
    setSignUp(state, _action) {
      // console.log("setting sign up");
      const newState = {
        ...state,
        isSignUp: !state.isSignUp,
      };
      return newState;
    },
    closeModal(state, _action) {
      // console.log("closing modal");
      const newState = {
        ...state,
        isModalOpen: false,
      };
      return newState;
    },
    openModal(state, _action) {
      // console.log("opening modal");
      const newState = {
        ...state,
        isModalOpen: true,
      };
      return newState;
    },
    toggleSidebar(state, action) {
      // console.log("toggling sidebar");
      const newState = {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };
      return newState;
    },
    setTextProcessing(state, action) {
      // console.log("setting text processing");
      const newState = {
        ...state,
        isTextProcessing: action.payload.value,
      };
      // console.log(state.isTextProcessing);
      return newState;
    },
    setStreamProcessing(state, action) {
      // console.log(action.payload.value);
      const newState = {
        ...state,
        isStreamProcessing: action.payload.value,
      };
      return newState;
    },
    setFPModalState(state, action) {
      // console.log("setting fp modal state");
      const newState = {
        ...state,
        isFPModalOpen: action.payload.value,
      };
      // console.log(state.isFPModalOpen);
      return newState;
    },
    toggleUpgradePlanModal(state, action) {
      const newState = {
        ...state,
        isUpgradePlanModalOpen: action.payload.value,
      };
      return newState;
    },
    toggleUserExperienceModal(state, action) {
      const newState = {
        ...state,
        isUserExperienceModalOpen: action.payload.value,
      };
      return newState;
    },
    toggleCancellationModal(state, action) {
      const newState = {
        ...state,
        isCancellationModalOpen: action.payload.value,
      };
      return newState;
    },
    toggleCancellationConfirmationModal(state, action) {
      const newState = {
        ...state,
        isCancellationConfirmationModalOpen: action.payload.value,
      };
      return newState;
    },
    toggleWelcomeScreenModal(state, action) {
      const newState = {
        ...state,
        isWelcomeScreenModalOpen: action.payload.value,
      };
      return newState;
    },
    toggleAddTokensModal(state, action) {
      const newState = {
        ...state,
        isAddTokensModalOpen: action.payload.value,
      };
      return newState;
    },
    toggleNotificationPermissionModal(state, action) {
      const newState = {
        ...state,
        isNotificationPermissionModalOpen: action.payload.value,
      };
      return newState;
    },
    setPasteWarningErrorModal(state, action) {
      const newState = {
        ...state,
        isPasteWarningErrorModalOpen: action.payload.value,
      };
      return newState;
    },
    setArrangementView(state, action) {
      const newState = {
        ...state,
        isArrangementViewOpen: action.payload.value,
      };
      return newState;
    },
    setArrangementViewFullScreen(state, action) {
      const newState = {
        ...state,
        isArrangementViewFullScreen: action.payload.value,
      };
      return newState;
    },
    setSelectedEmptyState(state, action) {
      const newState = {
        ...state,
        selectedEmptyState: action.payload.columnIndex,
      };
      return newState;
    },
    setCurrentlyPlayingAudio(state, action) {
      const newState = {
        ...state,
        currentlyPlayingAudio: action.payload.ref,
      };
      return newState;
    },
    setCurrentlyActiveAudioThread(state, action) {
      const newState = {
        ...state,
        currentlyActiveAudioThread: action.payload.parentId,
      };
      return newState;
    },
    setIsArViewStemProcessing(state, action) {
      const newState = {
        ...state,
        isArViewStemProcessing: action.payload.data,
      };
      return newState;
    },
    setChatInputFileUploading(state, action) {
      const newState = {
        ...state,
        isChatInputFileUploading: action.payload.value,
      };
      return newState;
    },
    setIsArrangementViewBeingExported(state, action) {
      const newState = {
        ...state,
        isArrangementViewBeingExported: action.payload.value,
      };
      return newState;
    },
    setCurrentlyEditingSidebarProject(state, action) {
      const newState = {
        ...state,
        currentlyEditingSidebarProject: action.payload.value,
      };
      return newState;
    },
    setCurrentlyProcessingOutputButtonAudioId(state, action) {
      const newState = {
        ...state,
        currentlyProcessingOutputButtonAudioId: action.payload.value,
      };
      return newState;
    },
    setExportArrangerLoaderText(state, action) {
      const newState = {
        ...state,
        exportArrangerLoaderText: action.payload.value,
      };
      return newState;
    },
    setIsNewCollectionModalOpen(state, action) {
      const newState = {
        ...state,
        isNewCollectionModalOpen: action.payload.value,
      };
      return newState;
    },
    setAudioIdToBeAddedToCollection(state, action) {
      const newState = {
        ...state,
        audioIdToBeAddedToCollection: action.payload.value,
      };
      return newState;
    },
    setShareCollectionModalData(state, action) {
      const newState = {
        ...state,
        shareCollectionModalData: action.payload.data,
      };
      return newState;
    },
    setIsEditCollectionModalOpen(state, action) {
      console.log(
        `setting is edit collection modal to ${action.payload.value}`
      );
      const newState = {
        ...state,
        isEditCollectionModalOpen: action.payload.value,
      };
      return newState;
    },
    setIsDeleteCollectionModalOpen(state, action) {
      const newState = {
        ...state,
        isDeleteCollectionModalOpen: action.payload.value,
      };
      return newState;
    },
    setIsSavedAudioModalOpen(state, action) {
      const newState = {
        ...state,
        isSavedAudioModalOpen: action.payload.value,
      };
      return newState;
    },
    setShareAudioModalData(state, action) {
      const newState = {
        ...state,
        shareAudioModalData: action.payload.data,
      };
      return newState;
    },
    setIsSharedProjectBeingViewed(state, action) {
      const newState = {
        ...state,
        isSharedProjectBeingViewed: action.payload.value,
      };
      return newState;
    },
    setShareProjectModalData(state, action) {
      const newState = {
        ...state,
        shareProjectModalData: action.payload.data,
      };
      return newState;
    },
    setIsAddToArrangementModalOpen(state, action) {
      const newState = {
        ...state,
        isAddToArrangementModalOpen: action.payload.data,
      };
      return newState;
    },
    setDeleteArViewCellData(state, action) {
      const newState = {
        ...state,
        deleteArViewCellData: action.payload.data,
      };
      return newState;
    },
    setDeleteArViewSectionData(state, action) {
      const newState = {
        ...state,
        deleteArViewSectionData: action.payload.data,
      };
      return newState;
    },
    setTempoChangeModalData(state, action) {
      const newState = {
        ...state,
        tempoChangeModalData: action.payload.data,
      };
      return newState;
    },
    setLandingPageSelectedTab(state, action) {
      const newState = {
        ...state,
        landingPageSelectedTab: action.payload.value,
      };
      return newState;
    },
    toggleExtendedChatUI(state, action) {
      let newState = {};
      if (action.payload) {
        newState = {
          ...state,
          isExtendedChatUIOpen: action.payload.value,
        };
      } else {
        newState = {
          ...state,
          isExtendedChatUIOpen: !state.isExtendedChatUIOpen,
        };
      }
      // GA events
      if (newState.isExtendedChatUIOpen) {
        ReactGA.event({
          category: "Chat Input",
          action: "Opened Suggestions",
          label: "Studio",
        });
      } else {
        ReactGA.event({
          category: "Chat Input",
          action: "Closed Suggestions",
          label: "Studio",
        });
      }
      return newState;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
