import { makePost, makeDelete, makeGet, SERVER_URL } from "./RequestHelper";
import type { CardPageResponse } from "../types/responses/card/CardPageResponse";
import type { CardResponse } from "../types/responses/card/CardResponse";
import type { LookupCardsRequest } from "../types/requests/card/LookupCardsRequest";
import type { UserCardsResponse } from "../types/responses/user/UserCardsResponse";
import type { CreateCardRequest } from "../types/requests/card/CreateCardRequest";

const ALL_CARDS_ENDPOINT = SERVER_URL + "/api/v1/card";
const CARD_ENDPOINT = SERVER_URL + "/api/v1/card/";
const CARD_LOOKUP_ENDPOINT = SERVER_URL + "/api/v1/card/lookup";
const USER_ENDPOINT = SERVER_URL + "/api/v1/user/";

export async function getAllCards(accessToken: string): Promise<CardResponse[]> {
    return (await makeGet<CardPageResponse>(ALL_CARDS_ENDPOINT, accessToken)).content;
}

export async function getCard(cardId: string, accessToken: string): Promise<CardResponse> {
    return (await makeGet<CardResponse>(CARD_ENDPOINT + cardId, accessToken));
}

export async function deleteCard(cardId: string, accessToken: string): Promise<void> {
    await makeDelete(CARD_ENDPOINT + cardId, accessToken);
}

export async function enableCard(cardId: string, accessToken: string): Promise<void> {
    await makePost<null>(CARD_ENDPOINT + cardId + "/enable", null, accessToken);
}

export async function disableCard(cardId: string, accessToken: string): Promise<void> {
    await makePost<null>(CARD_ENDPOINT + cardId + "/disable", null, accessToken);
}

export async function lookupCards(dto: LookupCardsRequest, accessToken: string): Promise<CardResponse[]> {
    return JSON.parse(await makePost<LookupCardsRequest>(CARD_LOOKUP_ENDPOINT, dto, accessToken)) as Promise<CardResponse[]>;
}

export async function getUserCards(userId: string, accessToken: string): Promise<UserCardsResponse>{
     return (await makeGet<UserCardsResponse>(USER_ENDPOINT + userId + "/cards", accessToken));
}

export async function createCard(body: CreateCardRequest, accessToken: string): Promise<string> {
    return (await makePost<CreateCardRequest>(ALL_CARDS_ENDPOINT, body, accessToken));
}