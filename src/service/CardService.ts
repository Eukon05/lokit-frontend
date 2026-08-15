import { makeGet, SERVER_URL } from "./RequestHelper";
import type { CardPageResponse } from "../types/responses/card/CardPageResponse";
import type { CardResponse } from "../types/responses/card/CardResponse";

const ALL_CARDS_ENDPOINT = "/api/v1/card"
const CARD_ENDPOINT = "/api/v1/card/"

export async function getAllCards(accessToken: string): Promise<CardResponse[]> {
    return (await makeGet<CardPageResponse>(SERVER_URL + ALL_CARDS_ENDPOINT, accessToken)).content;
}

export async function getCard(cardId: string, accessToken: string): Promise<CardResponse> {
    return (await makeGet<CardResponse>(SERVER_URL + CARD_ENDPOINT + '/' + cardId, accessToken));
}