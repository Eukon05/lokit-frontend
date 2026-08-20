import type { ReactNode } from "react";
import type { ButtonProps } from "./ButtonProps";

export type SearchableListProps = {
	title: string;
	query: string;
	onQueryChange: (query: string) => void;
	children: ReactNode;
	emptyText: string;
	button?: ButtonProps
};