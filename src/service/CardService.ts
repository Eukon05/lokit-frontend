import { makePost, makeDelete, makeGet, SERVER_URL } from "./RequestHelper";
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

export async function deleteCard(cardId: string, accessToken: string): Promise<void> {
    await makeDelete(CARD_ENDPOINT + '/' + cardId, accessToken);
}

export async function enableCard(cardId: string, accessToken: string): Promise<void> {
    await makePost<null, void>(CARD_ENDPOINT + '/' + cardId + "/enable", null, accessToken);
}

export async function disableCard(cardId: string, accessToken: string): Promise<void> {
    await makePost<null, void>(CARD_ENDPOINT + '/' + cardId + "/disable", null, accessToken);
}