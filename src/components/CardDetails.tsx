import { useState, useEffect } from "react";
import { getCard } from "../service/CardService";
import { getUser } from "../service/UserService";
import type { CardDetailsProps } from "../types/props/CardDetailsProps";
import useAuthSession from "../hooks/useAuthSession";
import type { CardResponse } from "../types/responses/card/CardResponse";
import type { UserResponse } from "../types/responses/user/UserResponse";
import { NavLink } from "react-router";

function CardDetails({ cardId }: CardDetailsProps) {
    const auth = useAuthSession();
    const [cardDetails, setCardDetails] = useState<CardResponse>();
    const [userDetails, setUserDetails] = useState<UserResponse>();

    useEffect(() => {
        let isActive = true;

        async function loadCard() {
            try {
                const card = await getCard(cardId, auth.connectedUser.accessToken);
                const user = await getUser(card.userId, auth.connectedUser.accessToken);

                if (isActive) {
                    setCardDetails(card);
                    setUserDetails(user);
                }
            } catch (error) {
                console.error("Failed to load card " + cardId, error);
            }
        }

        void loadCard();

        return () => {
            isActive = false;
        };
    }, [cardId])

    const tagStyle = "tag" + (cardDetails?.active ? " is-success" : " is-danger");

    const render = cardDetails ? (
        <div className="card">
            <div className="card-content">
                <div className="media-content">
                    <div className="is-flex is-flex-wrap-wrap is-flex-direction-row is-justify-content-space-between">
                        <div>
                            <span className="mr-3 title is-4">{cardDetails?.name}</span>
                            <span className={tagStyle}>{cardDetails.active ? "Active" : "Disabled"}</span>
                        </div>
                        <div style={{ float: "right" }}>
                            <button className="button is-warning mr-1">Disable</button>
                            <button className="button is-danger">Delete</button>
                        </div>
                    </div>
                    <div>
                        <p>Belongs to: <NavLink to={"/users/" + userDetails?.id}>{userDetails?.firstName + " " + userDetails?.lastName}</NavLink></p>
                        <p>Card ID: {cardDetails.id}</p>
                        <br />
                        <p>Created at: {new Date(cardDetails.createdAt).toUTCString()}</p>
                        <p>Updated at: {new Date(cardDetails.updatedAt).toUTCString()}</p>
                    </div>

                </div>
            </div>
        </div>
    ) :
        (
            <div>
                <p className="title has-text-centered">Card not found</p>
            </div>
        )

    return render;
}

export default CardDetails;