import axios from "axios"
import constants from "./constants"

export const apiGetNotes = async () => {
    try {
        const response = await axios.get(`${constants.BASE_URL}${constants.getNotes}`);
        return response;
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export const apiGetFolders = async () => {
    try {
        const response = await axios.get(`${constants.BASE_URL}${constants.getFolders}`);
        return response;
    } catch (error) {
        console.error(error);
        return undefined;
    }
};