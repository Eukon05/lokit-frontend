import { Children } from "react";
import type { SearchableListProps } from "../types/props/SearchableListProps";


function SearchableList({ title, query, onQueryChange, children, emptyText }: SearchableListProps) {
    const emptyState = <div className="panel-block"><span>{emptyText}</span></div>
	const hasChildren = Children.count(children) > 0;

	return (
		<div className="panel is-primary">
			<p className="panel-heading">{title}</p>
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