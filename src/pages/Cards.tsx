import { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router";
import { getAllCards } from "../service/CardService";
import useAuthSession from "../hooks/useAuthSession";
import SearchableList from "../components/SearchableList";
import type { CardResponse } from "../types/responses/card/CardResponse";
import CardDetails from "../components/CardDetails";

function Cards() {
    const auth = useAuthSession();
    const location = useLocation();
    const { cardId } = useParams();
    const [cards, setCards] = useState<CardResponse[]>([]);
    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        let isActive = true;

        async function loadCards() {
            try {
                const allCards = await getAllCards(auth.connectedUser.accessToken);

                if (isActive) {
                    setCards(allCards);
                }
            } catch (error) {
                console.error("Failed to load cards", error);
            }
        }

        void loadCards();

        return () => {
            isActive = false;
        };
    }, [auth.connectedUser.accessToken, location.state?.refreshCards])

    const cardBlocks = cards.filter(card => card.id.toLowerCase().includes(query.toLowerCase()) || card.name.toLowerCase().includes(query.toLowerCase()) || card.userId.toLowerCase().includes(query.toLowerCase()))
        .sort((o, t) => o.name.localeCompare(t.name))
        .map(card => (
            <div className="panel-block" key={card.id}>
                <NavLink to={"/cards/" + card.id}>{card.name}</NavLink>
            </div>
        ));

    const cardView = cardId ? <CardDetails cardId={cardId} /> : (
        <div className="block">
            <p className="title has-text-centered">Select a card to view details</p>
        </div>
    )

    return (
        <div className="columns">
            <div className="column is-4">
                <SearchableList
                    title="Card list"
                    query={query}
                    onQueryChange={setQuery}
                    emptyText="No matching cards found"
                >
                    {cardBlocks}
                </SearchableList>
            </div>
            <div className="column">
                {cardView}
            </div>
        </div>
    )
}

export default Cards;