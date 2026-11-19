import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router";
import { getAllCards } from "../service/CardService";
import useAuthSession from "../hooks/useAuthSession";
import SearchableList from "../components/common/SearchableList";
import type { CardResponse } from "../types/responses/card/CardResponse";
import CardDetails from "../components/card/CardDetails";
import CreateCardForm from "../components/card/CreateCardForm";
import type { PageProps } from "../types/props/PageProps";
import type { CardPageResponse } from "../types/responses/card/CardPageResponse";

function Cards() {
    const auth = useAuthSession();
    const location = useLocation();
    const navigate = useNavigate();
    const { cardId } = useParams();
    const [page, setPage] = useState<PageProps>();
    const [pageNumber, setPageNumber] = useState(0);
    const [cards, setCards] = useState<CardResponse[]>([]);
    const [query, setQuery] = useState<string>("");
    const isCreateCardPath = location.pathname === "/cards/new";

    useEffect(() => {
        let isActive = true;

        async function loadCards() {
            try {
                const allCards: CardPageResponse = await getAllCards(auth.connectedUser.accessToken, pageNumber);

                if (isActive) {
                    if (allCards.page.totalPages > 0 && pageNumber >= allCards.page.totalPages)
                        setPageNumber(allCards.page.totalPages - 1);
                    else {
                        setPage({number: allCards.page.number, totalPages: allCards.page.totalPages, setPage: setPageNumber})
                        setCards(allCards.content);
                    }
                }
            } catch (error) {
                console.error("Failed to load cards", error);
            }
        }

        void loadCards();

        return () => {
            isActive = false;
        };
    }, [auth.connectedUser.accessToken, location.state?.refreshCards, pageNumber])

    const cardBlocks = cards.filter(card => card.id.toLowerCase().includes(query.toLowerCase()) || card.name.toLowerCase().includes(query.toLowerCase()) || card.userId.toLowerCase().includes(query.toLowerCase()))
        .map(card => (
            <div className="panel-block" key={card.id}>
                <NavLink to={"/cards/" + card.id}>{card.name}</NavLink>
            </div>
        ));

    const cardView = isCreateCardPath ? <CreateCardForm /> : cardId ? <CardDetails cardId={cardId} /> : (
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
                    button={{
                        text: "Create new",
                        bulmaStyle: "is-warning",
                        onClick: () => {navigate("/cards/new")}
                    }}
                    page={page}
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