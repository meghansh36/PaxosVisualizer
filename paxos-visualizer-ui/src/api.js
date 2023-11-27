import { API_ROUTE, NUM_NODES, USER_ID_SESSION_KEY } from './constants';

const addUserIdToBody = (reqBody) => {
    const userId = window.sessionStorage.getItem(USER_ID_SESSION_KEY);
    return { ...reqBody, user_id: userId ? userId : undefined }
}

const addUserIdToSession = (userId) => {
    if(window.sessionStorage.getItem(USER_ID_SESSION_KEY)) return
    window.sessionStorage.setItem(USER_ID_SESSION_KEY, userId)
}

const resetSystemState = async () => {
    try {
        const res = await fetch(`${API_ROUTE}/init`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(addUserIdToBody({ num_nodes: NUM_NODES }))
        })
        const { state: systemState, user_id }  = await res.json()
        
        addUserIdToSession(user_id)
      
        return { systemState: Object.values(systemState.nodes), error: null }
    } catch (error) {
        console.log("Could not fetch initial System State, error: ", error)
        return { error }
    }
}

const prepareRequestAPICall = async (data) => {
    try {
        const res = await fetch(`${API_ROUTE}/prepare`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(addUserIdToBody(data))
        })
        const systemState = await res.json()
        return { systemState: Object.values(systemState), error: null }

    } catch (error) {
        console.log("Could not send Prepare Request, error: ", error)
        return { error }
    }
}

const actionRequestAPICall = async (data) => {
    try {
        const res = await fetch(`${API_ROUTE}/action`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(addUserIdToBody(data))
        })
        const systemState = await res.json()
        return { systemState: Object.values(systemState), error: null }
    } catch (error) {
        console.log("Could not send Action Request, error: ", error)
        return { error }
    }
}

export {
    resetSystemState,
    prepareRequestAPICall,
    actionRequestAPICall
}