import { Actions } from "./actions"
import { v4 as uuidv4 } from 'uuid';


// const initialState = {
//     selectedTicket: null,
//     project: null,
//     projectLanes: [],
//     tickets: {}, // {'id': {...values}}
//     saveTicket: {
//         show: false,
//         laneId: null,
//     },
// };

const createInitialState = () => {
    const state = {
        selectedTicket: null,
        project: null,
        projectLanes: [],
        tickets: {}, // {'id': {...values}}
        saveTicket: {
            show: false,
            laneId: null,
            ticket: null,
        },
    };

    state.projectLanes.push({
        id: uuidv4(),
        title: 'Backlog',
        ticketIds: [
        ],
    })

    var ticket1 = {
        id: uuidv4(),
        tags: ['Design', 'Bug'],
        title: '1 Wrong text color',
        description: 'Hello World!',
        priority: 'High',
        members: [1, 2, 3],
        photo: "https://images.unsplash.com/photo-1513151233558-d860c5398176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MDkyNzR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzYxMTQ1MjQ&ixlib=rb-4.0.3&q=80&w=400"
    };
    const ticket2 = {
        id: uuidv4(),
        tags: ['Design'],
        title: '2 Wrong text color',
        description: 'Hello World!',
        priority: 'Low',
        members: [1, 2, 3],
        photo: "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MDkyNzR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzYxMTQ1Mzg&ixlib=rb-4.0.3&q=80&w=400"
    }
    state.projectLanes.push({
        id: uuidv4(),
        title: 'To Do',
        ticketIds: [
            ticket1.id,
            ticket2.id,
        ],
    })


    const ticket3 = {
        id: uuidv4(),
        tags: ['Bugs Bunny'],
        title: '3 Wrong text color',
        description: 'Hello World!',
        priority: 'Medium',
        members: [1, 2, 3],
        photo: "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MDkyNzR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzYxMTQ1NDc&ixlib=rb-4.0.3&q=80&w=400"
    }
    state.projectLanes.push({
        id: uuidv4(),
        title: 'In Progress',
        ticketIds: [
            ticket3.id,
        ],
    })
    state.projectLanes.push({
        id: uuidv4(),
        title: 'Completed',
        ticketIds: [
        ],
    })
    state.projectLanes.push({
        id: uuidv4(),
        title: 'Live',
        ticketIds: [
        ],
    })

    state.tickets[ticket1.id] = ticket1;
    state.tickets[ticket2.id] = ticket2;
    state.tickets[ticket3.id] = ticket3;

    return state;
}

export const initialState = createInitialState()

export default (state, action) => {
    const { payload } = action;
    console.log(state);
    console.log(action);
    switch (action.type) {
        case Actions.SELECT_TICKET:
            return {
                ...state,
                saveTicket: false,
                selectedTicket: payload == null ? null : {
                    ...payload?.details,
                    lane: payload?.lane,
                },
            }
        case Actions.ADD_LANE:
            const newLane = {
                id: uuidv4(),
                title: payload,
                ticketIds: [],
            };

            return {
                ...state, projectLanes: [
                    ...state.projectLanes,
                    newLane,
                ]
            };
        case Actions.ADD_TICKET: {
            const { ticket, laneId } = payload;
            const ids = state.projectLanes.map(e => e.id);
            const index = ids.indexOf(laneId);
            if (index == -1) return state;
            const lane = state.projectLanes[index];
            const stateCopy = { ...state }
            stateCopy.tickets[ticket.id] = ticket;
            if (lane.ticketIds.includes(ticket.id)) {
                return {
                    ...state,
                    ...stateCopy,
                    selectedTicket: ticket,
                    saveTicket: {
                        show: false,
                        laneId: null,
                        ticket: null,
                    }
                }
            }
            const ticketIds = [...lane.ticketIds, ticket.id];
            stateCopy.projectLanes[index].ticketIds = ticketIds;

            return {
                ...state,
                ...stateCopy,
                saveTicket: {
                    show: false,
                    laneId: null,
                    ticket: null,
                }
            }
        }

        case Actions.SHOW_SAVE_TICKET: {
            return {
                ...state,
                selectedTicket: null,
                saveTicket: {
                    show: true,
                    laneId: payload.laneId,
                    ticket: payload?.ticket,
                }
            };
        }
        case Actions.HIDE_SAVE_TICKET: {
            return {
                ...state,
                selectedTicket: state.saveTicket?.ticket,
                saveTicket: {
                    show: false,
                    laneId: null,
                    ticket: null,
                }
            };
        }
        case Actions.UNSELECT_TICKET: {
            return {
                ...state,
                selectedTicket: null,
            }
        }
        case Actions.MOVE_TICKET:
            {
                const { prevLane, newLane, ticketId } = payload;
                if (prevLane == newLane) return state;
                const copy = [...state.projectLanes]
                const ids = state.projectLanes.map(e => e.id);
                const index = ids.indexOf(prevLane);
                var tickets = copy[index].ticketIds;
                tickets = tickets.filter(t => t != ticketId)
                copy[index].ticketIds = tickets;
                const nIndex = ids.indexOf(newLane);
                var nTickets = copy[nIndex].ticketIds;
                nTickets.push(ticketId);
                return {
                    ...state, selectedTicket: {
                        ...state.selectedTicket,
                        lane: newLane,
                    }
                }
            }
        case Actions.HIDE_EDIT_TICKET:
        case Actions.EDIT_TICKET:
            return state;
    }
}