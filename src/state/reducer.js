import { Actions } from "./actions"
import { v4 as uuidv4 } from 'uuid';


// const [state, setState] = useState({
//     id: uuidv4(),
//     tags: [],
//     title: null,
//     description: null,
//     priority: null,
//     members: [],
//     photo: null
// })
const createInitialState = () => {
    const state = {
        selectedTicket: null,
        project: null,
        projectLanes: [],
        addTicket: {
            show: false,
            laneId: null,
        },
    };
    state.projectLanes.push({
        id: uuidv4(),
        title: 'To Do',
        tickets: [{
            id: uuidv4(),
            tags: ['Design', 'Bug'],
            title: 'Wrong text color',
            description: 'Hello World!',
            priority: 'High',
            members: [1, 2, 3],
            photo: null
        }],
    })
    state.projectLanes.push({
        id: uuidv4(),
        title: 'In Progress',
        tickets: [{
            id: uuidv4(),
            tags: ['Design', 'Bug'],
            title: 'Wrong text color',
            description: 'Hello World!',
            priority: 'Medium',
            members: [1, 2, 3],
            photo: null
        }, {
            id: uuidv4(),
            tags: ['Design'],
            title: '🍻 Pepsie Regular',
            description: 'Hello World!',
            priority: 'High',
            members: [1, 2, 3],
            photo: null
        }],
    })
    state.projectLanes.push({
        id: uuidv4(),
        title: 'Review',
        tickets: [{
            id: uuidv4(),
            tags: ['Design', 'Bug'],
            title: 'Wrong text color',
            description: 'Hello World!',
            priority: 'High',
            members: [1, 2, 3],
            photo: null
        }],
    })
    state.projectLanes.push({
        id: uuidv4(),
        title: 'Ready For Production',
        tickets: [{
            id: uuidv4(),
            tags: ['Design', 'Bug'],
            title: 'Font Size Issue',
            description: 'Hello World!',
            priority: 'Low',
            members: [1, 2, 3, 4,],
            photo: null
        }],
    })

    return state;
}

export const initialState = createInitialState()

export default (state, action) => {
    const { payload } = action;
    console.log(action);
    switch (action.type) {
        case Actions.SELECT_TICKET:
            return {
                ...state,
                addTicket: false,
                selectedTicket: payload == null ? null : {
                    ...payload?.details,
                    lane: payload?.lane,
                },
            }
        case Actions.ADD_LANE:
            return { ...state };
        case Actions.ADD_TICKET:
            const { ticket, laneId } = payload;
            const ids = state.projectLanes.map(e => e.id);
            const index = ids.indexOf(laneId);
            if (index == -1) return { ...state };
            const lane = state.projectLanes[index];
            const { tickets } = lane;
            const newTickets = [...tickets, ticket];
            const stateCopy = { ...state };
            stateCopy.projectLanes[index].tickets = newTickets
            return {
                ...state,
                ...stateCopy,
            }

        case Actions.SHOW_ADD_TICKET:
            return {
                ...state, addTicket: {
                    show: true,
                    laneId: payload,
                }
            };
        case Actions.HIDE_ADD_TICKET:
            return {
                ...state, addTicket: {
                    show: false,
                    laneId: null,
                }
            };
        case Actions.UNSELECT_TICKET:
            return {
                ...state,
                selectedTicket: null,
            }
        case Actions.MOVE_TICKET:
        case Actions.HIDE_ADD_TICKET:
            return {
                ...state,
                addTicket: {
                    show: false,
                    laneId: null,
                }
            }
    }
}