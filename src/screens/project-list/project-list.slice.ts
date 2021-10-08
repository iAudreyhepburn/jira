import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";

interface State {
  projectModalOpen: boolean;
}

const initialState: State = {
  projectModalOpen: false
}

export const projectListSlice = createSlice({
  name: 'projectListSlice',
  initialState,
  reducers: {
    openProjectModal(state) {
      state.projectModalOpen = true;
    },
    closeProjectModal(state) {
      state.projectModalOpen = false;
    }
  }
})
//现在的action的类型已经变成了一个一个的方法
export const projectListActions = projectListSlice.actions

export const selectProjectModalOpen = (state: RootState) => state.projectList.projectModalOpen