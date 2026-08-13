import type { ReactNode } from "react";

export type SearchableListProps = {
	title: string;
	query: string;
	onQueryChange: (query: string) => void;
	children: ReactNode;
	emptyText: string;
};