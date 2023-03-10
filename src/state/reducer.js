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
        searchResults: null,
    };


    const members = [
        {
            name: 'Monica',
            photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1661&q=80',
        },
        {
            name: 'Brad',
            photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
        },
        {
            name: 'Owen',
            photo: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3000&q=80',
        },
        {
            name: 'Jason',
            photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80',
        },
    ];

    members.sort(() => Math.random() - 0.5);
    var ticket1 = {
        id: uuidv4(),
        tags: ['Buttons', 'Alignment', 'Bug'],
        title: 'Misaligned buttons',
        description: 'Some buttons are appearing off-center on certain pages, causing confusion for users who are trying to interact with them.',
        priority: 'High',
        members: members,
        photo: "https://images.unsplash.com/photo-1513151233558-d860c5398176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MDkyNzR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzYxMTQ1MjQ&ixlib=rb-4.0.3&q=80&w=400"
    };
    state.projectLanes.push({
        id: uuidv4(),
        title: 'Backlog',
        ticketIds: [
            ticket1.id,
        ],
    })

    members.sort(() => Math.random() - 0.5);
    const ticket2 = {
        id: uuidv4(),
        tags: ['Text', 'Font'],
        title: 'Inconsistent font styles',
        description: 'Different pages are using different font styles, making the overall design look inconsistent and unprofessional.',
        priority: 'Low',
        members: members,
        photo: "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MDkyNzR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzYxMTQ1Mzg&ixlib=rb-4.0.3&q=80&w=400"
    }
    members.sort(() => Math.random() - 0.5);
    const todoTicket3 = {
        id: uuidv4(),
        tags: ['Design', 'Color', 'Contrast'],
        title: 'Poor color contrast',
        description: 'The color contrast between the text and the background is not high enough, making it difficult for users to read the content',
        priority: 'High',
        members: members,
        photo: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MDkyNzR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzYxNzUyMDY&ixlib=rb-4.0.3&q=80&w=400"
    }
    state.projectLanes.push({
        id: uuidv4(),
        title: 'To Do',
        ticketIds: [
            ticket2.id,
            todoTicket3.id,
        ],
    })


    members.sort(() => Math.random() - 0.5);
    const ticket3 = {
        id: uuidv4(),
        tags: ['Bug'],
        title: 'Broken links',
        description: 'There are some links within the design that are not working, leading users to dead-end pages and creating frustration.',
        priority: 'Medium',
        members: members,
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
    state.tickets[todoTicket3.id] = todoTicket3;

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
        case Actions.UPDATE_TICKET_PRIORITY: {
            const { ticketId, priority } = payload;
            const ticket = state.tickets[ticketId];
            if (ticket == null) return state;
            ticket.priority = priority
            return {
                ...state,
                tickets: {
                    ...state.tickets,
                    ticketId: ticket,
                }
            };
        }
        case Actions.SEARCH_TICKETS: {
            const { text } = payload;
            const results = {};
            if (text.length == 0) {
                return { ...state, searchResults: null }
            }
            for (const key in state.tickets) {
                const ticket = state.tickets[key];
                const containsName = ticket.title.toLowerCase().includes(text.toLowerCase());
                const containsDescription = ticket.description.toLowerCase().includes(text.toLowerCase());
                if (containsName || containsDescription) {
                    results[key] = state.tickets[key]
                }
            }
            // console.log(`Found: ${Object.keys(results).length} results`);
            return { ...state, searchResults: results };
        }
        case Actions.FILTER_PRIORITY:
            const { priority } = payload;
            const results = {};
            const source = state.tickets;
            if (priority == 'All') {
                return { ...state, searchResults: state.tickets }
            }
            for (const key in source) {
                const ticket = state.tickets[key];
                const match = ticket.priority === priority;
                if (match) {
                    results[key] = state.tickets[key]
                }
            }
            return {
                ...state,
                searchResults: results
            };
        case Actions.HIDE_EDIT_TICKET:
        case Actions.EDIT_TICKET:
            return state;
    }
}

const searchObjs = {
    "id-1": {
        "name": "John"
    },
    "id-2": {
        "name": "Doe"
    }
}