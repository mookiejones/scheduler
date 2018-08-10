import {
    ADD_USER
} from '../shared/Constants'
export const addUser = user => ({
    type: ADD_USER,
    payload: user
});