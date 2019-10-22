export function createSet(payload) {
    return {
        type: 'set',
        payload
    }
}


// export const addToDo = (payload) => dispatch(createAdd(payload))
export const createAdd = (payload) => (
    {
        type: 'add',
        payload
    }
)
export const createRemove = (payload) => (
    {
        type: 'remove',
        payload
    }
)
export const createToggle = (payload) => (
    {
        type: 'toggle',
        payload
    }
)
