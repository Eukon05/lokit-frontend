import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router";
import { getAllRoles } from "../service/RoleService";
import useAuthSession from "../hooks/useAuthSession";
import SearchableList from "../components/common/SearchableList";
import type { RoleResponse } from "../types/responses/role/RoleResponse";
import RoleDetails from "../components/role/RoleDetails";
import CreateRoleForm from "../components/role/CreateRoleForm";
import type { PageProps } from "../types/props/PageProps";
import type { RolePageResponse } from "../types/responses/role/RolePageResponse";

function Roles() {
    const auth = useAuthSession();
    const location = useLocation();
    const navigate = useNavigate();
    const { roleId } = useParams();
    const [page, setPage] = useState<PageProps>();
    const [pageNumber, setPageNumber] = useState(0);
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [query, setQuery] = useState<string>("");
    const isCreateRolePath = location.pathname === "/roles/new";

    useEffect(() => {
        let isActive = true;

        async function loadRoles() {
            try {
                const allRoles: RolePageResponse = await getAllRoles(auth.connectedUser.accessToken, pageNumber);

                if (isActive) {
                    if (allRoles.page.totalPages > 0 && pageNumber >= allRoles.page.totalPages)
                        setPageNumber(allRoles.page.totalPages - 1);
                    else {
                        setPage({ number: allRoles.page.number, totalPages: allRoles.page.totalPages, setPage: setPageNumber })
                        setRoles(allRoles.content);
                    }
                }
            } catch (error) {
                console.error("Failed to load roles", error);
            }
        }

        void loadRoles();

        return () => {
            isActive = false;
        };
    }, [auth.connectedUser.accessToken, location.state?.refreshRoles, pageNumber])

    const roleBlocks = roles.filter(role => role.name.toLowerCase().includes(query.toLowerCase()) || role.description.toLowerCase().includes(query.toLowerCase()))
        .map(role => (
            <div className="panel-block" key={role.id}>
                <NavLink to={"/roles/" + role.id}>{role.name}</NavLink>
            </div>
        ));

    const roleView = isCreateRolePath ? <CreateRoleForm /> : roleId ? <RoleDetails roleId={roleId} /> : (
        <div className="block">
            <p className="title has-text-centered">Select a role to view details</p>
        </div>
    )

    return (
        <div className="columns">
            <div className="column is-4">
                <SearchableList
                    title="Role list"
                    query={query}
                    onQueryChange={setQuery}
                    emptyText="No matching roles found"
                    button={
                        {
                            text: "Create new",
                            bulmaStyle: "is-warning",
                            onClick: () => { navigate("/roles/new") }
                        }
                    }
                    page={page}
                >
                    {roleBlocks}
                </SearchableList>
            </div>
            <div className="column">
                {roleView}
            </div>
        </div>
    )
}

export default Roles;