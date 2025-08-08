import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField } from './types';

interface BuilderState {
  fields: FormField[];
}

const initialState: BuilderState = {
  fields: [],
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    addField(state, action: PayloadAction<FormField>) {
      state.fields.push(action.payload);
    },
    updateField(
      state,
      action: PayloadAction<{ id: string; changes: Partial<FormField> }>
    ) {
      const idx = state.fields.findIndex((f) => f.id === action.payload.id);
      if (idx !== -1) state.fields[idx] = { ...state.fields[idx], ...action.payload.changes };
    },
    deleteField(state, action: PayloadAction<string>) {
      state.fields = state.fields.filter((f) => f.id !== action.payload);
    },
    moveFieldUp(state, action: PayloadAction<string>) {
      const idx = state.fields.findIndex((f) => f.id === action.payload);
      if (idx > 0) {
        const tmp = state.fields[idx - 1];
        state.fields[idx - 1] = state.fields[idx];
        state.fields[idx] = tmp;
      }
    },
    moveFieldDown(state, action: PayloadAction<string>) {
      const idx = state.fields.findIndex((f) => f.id === action.payload);
      if (idx !== -1 && idx < state.fields.length - 1) {
        const tmp = state.fields[idx + 1];
        state.fields[idx + 1] = state.fields[idx];
        state.fields[idx] = tmp;
      }
    },
    setFields(state, action: PayloadAction<FormField[]>) {
      state.fields = action.payload;
    },
    reset(state) {
      state.fields = [];
    },
  },
});

export const {
  addField,
  updateField,
  deleteField,
  moveFieldUp,
  moveFieldDown,
  setFields,
  reset,
} = builderSlice.actions;

export default builderSlice.reducer;
