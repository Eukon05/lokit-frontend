import { Children } from "react";
import type { SearchableListProps } from "../../types/props/SearchableListProps";


function SearchableList({ title, query, onQueryChange, children, emptyText, button, page }: SearchableListProps) {
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
			{page && <div className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center p-3">
				<button className="button" disabled={page.number == 0}>Back</button>
				<span>Page {page.number + 1} of {page.totalPages}</span>
				<button className="button" disabled={page.number == page.totalPages - 1}>Next</button>
			</div>}
		</div>
	);
}

export default SearchableList;