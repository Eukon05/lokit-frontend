import { Children } from "react";
import type { SearchableListProps } from "../types/props/SearchableListProps";


function SearchableList({ title, query, onQueryChange, children, emptyText, button }: SearchableListProps) {
    const emptyState = <div className="panel-block"><span>{emptyText}</span></div>
	const hasChildren = Children.count(children) > 0;

	return (
		<div className="panel is-primary">
			<div className="panel-heading is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center">
				<p>{title}</p>
				{button && <button className={"button " + button.bulmaStyle + (button.loading ? " is-loading" : "")} onClick={button.onClick} disabled={button.disabled}>{button.text}</button>}
			</div>
			<div className="panel-block">
				<input
					className="input"
					type="text"
					value={query}
					onChange={e => onQueryChange(e.target.value)}
					placeholder="Search..."
				/>
			</div>
			<div>
				{hasChildren ? children : emptyState}
			</div>
		</div>
	);
}

export default SearchableList;