import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export function registerUser(userEmail: string, password: string): Promise<any> {
    return axios.post(`${BASE_URL}/user/register`, { userEmail, password });
}

export function loginUser(userEmail: string, password: string): Promise<any> {
    return axios.post(`${BASE_URL}/user/login`, {userEmail, password});
}

export function translateWord(word: string, sessionId: string): Promise<any> {
    return axios.get(`${BASE_URL}/translation?korean=${word}`, {
        headers: {
            'sessionid' : sessionId
        }
    });
}

export function logoutUser(sessionId: string): Promise<void> {
    return axios.post(`${BASE_URL}/user/logout`, {sessionId});
}

export interface ResponseSessionDto {
    sessionId: string;
}