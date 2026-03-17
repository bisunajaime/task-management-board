export const Actions = {
  // Ticket actions
  ADD_COMMENT:             'ADD_COMMENT',
  SELECT_TICKET:           'SELECT_TICKET',
  UNSELECT_TICKET:         'UNSELECT_TICKET',
  ADD_TICKET:              'ADD_TICKET',
  UPDATE_TICKET:           'UPDATE_TICKET',
  SHOW_SAVE_TICKET:        'SHOW_SAVE_TICKET',
  HIDE_SAVE_TICKET:        'HIDE_SAVE_TICKET',
  MOVE_TICKET:             'MOVE_TICKET',
  REORDER_TICKET:          'REORDER_TICKET',
  UPDATE_TICKET_PRIORITY:  'UPDATE_TICKET_PRIORITY',

  // Lane actions
  ADD_LANE:                'ADD_LANE',
  RENAME_LANE:             'RENAME_LANE',
  DELETE_LANE:             'DELETE_LANE',
  REORDER_LANES:           'REORDER_LANES',

  // Filter actions
  SET_FILTER:              'SET_FILTER',
  CLEAR_FILTER:            'CLEAR_FILTER',

  // Project actions
  ADD_PROJECT:             'ADD_PROJECT',
  UPDATE_PROJECT:          'UPDATE_PROJECT',
  DELETE_PROJECT:          'DELETE_PROJECT',
  SET_ACTIVE_PROJECT:      'SET_ACTIVE_PROJECT',

  // UI actions
  SET_THEME:               'SET_THEME',
} as const;

export type ActionType = typeof Actions[keyof typeof Actions];
