import { getToken } from "./authService";

const API_URL = "http://localhost:8080/api/events";

const getAuthHeaders = () => {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
};

const handleResponse = async (response) => {
    const text = await response.text();

    let data;

    try {
        data = JSON.parse(text);
    } catch {
        data = text;
    }

    if (!response.ok) {
        throw new Error(
            typeof data === "string"
                ? data
                : data.message || "Something went wrong."
        );
    }

    return data;
};

export const getAllEvents = async () => {
    const response = await fetch(API_URL);

    return handleResponse(response);
};

export const getEventById = async (id) => {
    const response = await fetch(
        `${API_URL}/${id}`
    );

    return handleResponse(response);
};

export const createEvent = async (eventData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData)
    });

    return handleResponse(response);
};

export const updateEvent = async (id, eventData) => {
    const response = await fetch(
        `${API_URL}/${id}`,
        {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(eventData)
        }
    );

    return handleResponse(response);
};

export const deleteEvent = async (id) => {
    const response = await fetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE",
            headers: getAuthHeaders()
        }
    );

    return handleResponse(response);
};

export const getMyEvents = async () => {
    const response = await fetch(
        `${API_URL}/organiser/my-events`,
        {
            method: "GET",
            headers: getAuthHeaders()
        }
    );

    return handleResponse(response);
};